import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Shield, Lock, ChevronRight, Tag, CheckCircle, MapPin } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useNotificationStore } from '@/store/notificationStore';
import { orderService } from '@/services/orderService';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { formatPrice } from '@/utils/formatters';
import { api, unwrap } from '@/services/api';
import { normalizeCoupon } from '@/utils/normalizers';
import type { Coupon } from '@/types';
import type { Address, PaymentMethod } from '@/types';

/* ── Country / state data ─────────────────────────────────────────── */

const COUNTRIES = [
  'United States', 'United Kingdom', 'Canada', 'Australia',
  'Austria', 'Belgium', 'Bulgaria', 'Croatia', 'Cyprus', 'Czech Republic',
  'Denmark', 'Estonia', 'Finland', 'France', 'Germany', 'Greece',
  'Hungary', 'Ireland', 'Italy', 'Latvia', 'Lithuania', 'Luxembourg',
  'Malta', 'Netherlands', 'Poland', 'Portugal', 'Romania', 'Slovakia',
  'Slovenia', 'Spain', 'Sweden',
  'Iceland', 'Liechtenstein', 'Norway', 'Switzerland',
  'Albania', 'Bosnia and Herzegovina', 'Kosovo', 'Montenegro',
  'North Macedonia', 'Serbia',
  'New Zealand', 'Singapore', 'Japan', 'South Korea', 'Hong Kong',
  'Taiwan', 'Israel', 'UAE', 'Saudi Arabia',
  'Brazil', 'Mexico', 'Argentina', 'Chile', 'Colombia', 'Peru',
  'South Africa', 'Nigeria', 'Kenya',
  'India', 'Thailand', 'Malaysia', 'Philippines', 'Indonesia', 'Vietnam',
  'Turkey', 'Georgia', 'Ukraine',
  'Other',
];

const US_STATES = [
  'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut',
  'Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa',
  'Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan',
  'Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada',
  'New Hampshire','New Jersey','New Mexico','New York','North Carolina',
  'North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island',
  'South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont',
  'Virginia','Washington','West Virginia','Wisconsin','Wyoming',
  'District of Columbia',
];

const CA_PROVINCES = [
  'Alberta','British Columbia','Manitoba','New Brunswick',
  'Newfoundland and Labrador','Northwest Territories','Nova Scotia',
  'Nunavut','Ontario','Prince Edward Island','Quebec','Saskatchewan','Yukon',
];

const AU_STATES = ['ACT','NSW','NT','QLD','SA','TAS','VIC','WA'];

/* ── Schema ──────────────────────────────────────────────────────── */

const checkoutSchema = z.object({
  firstName:     z.string().min(2, 'Required'),
  lastName:      z.string().min(2, 'Required'),
  email:         z.string().email('Valid email required'),
  phone:         z.string().min(7, 'Valid phone required'),
  street:        z.string().min(5, 'Required'),
  apt:           z.string().optional(),
  city:          z.string().min(2, 'Required'),
  state:         z.string().min(1, 'Required'),
  zip:           z.string().min(2, 'Valid postal code required'),
  country:       z.string().min(2, 'Required'),
  paymentMethod: z.enum(['bitcoin', 'ethereum', 'card', 'paypal']),
  couponCode:    z.string().optional(),
  agreeTerms:    z.boolean().refine((v) => v === true, { message: 'You must agree to the terms' }),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

/* ── Payment methods ─────────────────────────────────────────────── */

const SHIPPING_REGIONS = [
  { id: 'india', label: 'India (Standard)', fee: 0 },
  { id: 'eu', label: 'Europe (EU)', fee: 30 },
  { id: 'us', label: 'United States / Canada', fee: 45 },
  { id: 'other', label: 'Rest of World', fee: 35 },
] as const;

type ShippingRegion = typeof SHIPPING_REGIONS[number]['id'];

const PAYMENT_METHODS = [
  { id: 'bitcoin'  as const, label: 'Bitcoin (BTC)',  icon: '₿', desc: 'Get 15% discount', discount: 0.15, highlight: true  },
  { id: 'ethereum' as const, label: 'Ethereum (ETH)', icon: 'Ξ', desc: 'Get 15% discount', discount: 0.15, highlight: true  },
  { id: 'card'     as const, label: 'Card Payment',   icon: '💳', desc: 'Standard pricing',  discount: 0,    highlight: false },
  { id: 'paypal'   as const, label: 'PayPal',          icon: 'P', desc: 'Standard pricing',  discount: 0,    highlight: false },
];

/* ── Component ───────────────────────────────────────────────────── */

export function CheckoutPage() {
  const { items, getSubtotal, clearCart } = useCartStore();
  const { user, updateUser } = useAuthStore();
  const notify = useNotificationStore();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shippingRegion, setShippingRegion] = useState<ShippingRegion>('us');
  const orderPlaced = useRef(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState('');
  const [couponInput, setCouponInput] = useState('');

  const savedAddr = user?.savedAddress;

  const subtotal = getSubtotal();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      country:       savedAddr?.country       ?? 'United States',
      paymentMethod: 'bitcoin' as const,
      firstName:     savedAddr?.firstName     ?? user?.firstName ?? '',
      lastName:      savedAddr?.lastName      ?? user?.lastName  ?? '',
      email:         savedAddr?.email         ?? user?.email     ?? '',
      phone:         savedAddr?.phone         ?? '',
      street:        savedAddr?.street        ?? '',
      apt:           savedAddr?.apt           ?? '',
      city:          savedAddr?.city          ?? '',
      state:         savedAddr?.state         ?? '',
      zip:           savedAddr?.zip           ?? '',
    },
  });

  const selectedPayment = watch('paymentMethod');
  const selectedCountry = watch('country');

  const paymentMethod  = PAYMENT_METHODS.find((p) => p.id === selectedPayment);
  const cryptoDiscountRate = paymentMethod?.discount ?? 0;
  // Coupon and crypto discount cannot be combined — coupon takes priority
  const cryptoDiscount = couponDiscount > 0 ? 0 : subtotal * cryptoDiscountRate;
  const shipping = 0; // Always free
  const dispatchFee = SHIPPING_REGIONS.find(r => r.id === shippingRegion)?.fee ?? 0;
  const totalDiscount  = cryptoDiscount + couponDiscount;
  const total          = subtotal - totalDiscount + dispatchFee;

  // State/province field config based on country
  const getStateConfig = () => {
    if (selectedCountry === 'United States') {
      return { type: 'select' as const, label: 'State', options: US_STATES };
    }
    if (selectedCountry === 'Canada') {
      return { type: 'select' as const, label: 'Province', options: CA_PROVINCES };
    }
    if (selectedCountry === 'Australia') {
      return { type: 'select' as const, label: 'State / Territory', options: AU_STATES };
    }
    return { type: 'text' as const, label: 'State / Region / Province', options: [] };
  };
  const stateConfig = getStateConfig();

  const handleUseSavedAddress = () => {
    if (!savedAddr) return;
    setValue('firstName', savedAddr.firstName);
    setValue('lastName',  savedAddr.lastName);
    setValue('email',     savedAddr.email);
    setValue('phone',     savedAddr.phone);
    setValue('street',    savedAddr.street);
    setValue('apt',       savedAddr.apt ?? '');
    setValue('city',      savedAddr.city);
    setValue('state',     savedAddr.state);
    setValue('zip',       savedAddr.zip);
    setValue('country',   savedAddr.country);
    notify.success('Address loaded', 'Your saved shipping address has been applied.');
  };

  const handleApplyCoupon = async () => {
    try {
      const res = await api.post('/coupons/validate', { code: couponInput.toUpperCase(), subtotal });
      const coupon = normalizeCoupon(unwrap<Coupon>(res));
      if (new Date(coupon.expiresAt) < new Date()) {
        notify.error('This coupon has expired');
        return;
      }
      if (subtotal < coupon.minOrder) {
        notify.error(`Minimum order of ${formatPrice(coupon.minOrder)} required`);
        return;
      }
      const discount = coupon.type === 'percent'
        ? subtotal * (coupon.discount / 100)
        : coupon.discount;
      setCouponDiscount(discount);
      setCouponApplied(couponInput.toUpperCase());
      notify.success(`Coupon applied! You save ${formatPrice(discount)}`);
    } catch {
      notify.error('Invalid coupon code');
    }
  };

  const onSubmit = async (data: CheckoutForm) => {
    if (items.length === 0) return;
    setIsSubmitting(true);

    try {
      const address: Address = {
        firstName: data.firstName,
        lastName:  data.lastName,
        email:     data.email,
        phone:     data.phone,
        street:    data.street,
        apt:       data.apt,
        city:      data.city,
        state:     data.state,
        zip:       data.zip,
        country:   data.country,
      };

      if (user) {
        updateUser({ savedAddress: address });
      }

      const order = await orderService.create({
        items,
        address,
        paymentMethod: data.paymentMethod.toUpperCase() as PaymentMethod,
        subtotal,
        discount: totalDiscount,
        shipping: dispatchFee,
        shippingCenter: shippingRegion,
      });

      orderPlaced.current = true;
      clearCart();
      navigate(`/order-confirmation/${order.id}`);
    } catch {
      notify.error('Order failed', 'Please try again or contact support.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0 && !orderPlaced.current) {
    navigate('/shop');
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <span>Cart</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-900 font-medium">Checkout</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Secure Checkout</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address */}
              <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-bold text-slate-900 text-lg">Shipping Address</h2>
                  {user && savedAddr && (
                    <button
                      type="button"
                      onClick={handleUseSavedAddress}
                      className="inline-flex items-center gap-1.5 text-sm text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      Use saved address
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="First Name" error={errors.firstName?.message} {...register('firstName')} />
                  <Input label="Last Name"  error={errors.lastName?.message}  {...register('lastName')} />
                  <div className="col-span-2">
                    <Input label="Email Address" type="email" error={errors.email?.message} {...register('email')} />
                  </div>
                  <div className="col-span-2">
                    <Input label="Phone Number" type="tel" error={errors.phone?.message} {...register('phone')} />
                  </div>
                  <div className="col-span-2">
                    <Input label="Street Address" error={errors.street?.message} {...register('street')} />
                  </div>
                  <Input label="Apt / Suite (optional)" {...register('apt')} />
                  <Input label="City" error={errors.city?.message} {...register('city')} />

                  {/* Dynamic state field based on country */}
                  {stateConfig.type === 'select' ? (
                    <Select
                      label={stateConfig.label}
                      error={errors.state?.message}
                      options={[
                        { value: '', label: `Select ${stateConfig.label}` },
                        ...stateConfig.options.map(s => ({ value: s, label: s })),
                      ]}
                      {...register('state')}
                    />
                  ) : (
                    <Input
                      label={stateConfig.label}
                      error={errors.state?.message}
                      placeholder="e.g. Bavaria"
                      {...register('state')}
                    />
                  )}

                  <Input
                    label="Postal Code"
                    error={errors.zip?.message}
                    placeholder={selectedCountry === 'United States' ? '10001' : 'Postal code'}
                    {...register('zip')}
                  />
                  <Select
                    label="Country"
                    error={errors.country?.message}
                    options={COUNTRIES.map(c => ({ value: c, label: c }))}
                    {...register('country')}
                  />
                </div>

                {/* Auto-save notice */}
                {user && (
                  <p className="text-xs text-slate-400 mt-4 flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                    Your shipping address will be saved to your account for faster checkout next time.
                  </p>
                )}
              </div>

              {/* Dispatch Center Fee */}
              <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <h2 className="font-bold text-slate-900 text-lg mb-1">Dispatch Center</h2>
                <p className="text-sm text-slate-500 mb-4">Select your region. A dispatch center fee is added based on destination.</p>
                <div className="grid grid-cols-2 gap-3">
                  {SHIPPING_REGIONS.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setShippingRegion(r.id)}
                      className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left ${
                        shippingRegion === r.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-slate-200 hover:border-blue-200'
                      }`}
                    >
                      <span className="text-sm font-semibold text-slate-900">{r.label}</span>
                      <span className={`text-sm font-bold ${r.fee === 0 ? 'text-emerald-600' : 'text-slate-700'}`}>
                        {r.fee === 0 ? 'No fee' : `+$${r.fee}`}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <h2 className="font-bold text-slate-900 text-lg mb-2">Payment Method</h2>
                <p className="text-sm text-blue-600 font-medium mb-5">💡 Pay with crypto and get 15% off automatically!</p>
                <div className="grid grid-cols-2 gap-3">
                  {PAYMENT_METHODS.map((pm) => (
                    <label
                      key={pm.id}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedPayment === pm.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-slate-200 hover:border-blue-200'
                      }`}
                    >
                      <input type="radio" value={pm.id} {...register('paymentMethod')} className="sr-only" />
                      <span className="w-8 h-8 rounded-lg bg-slate-900 text-white text-sm font-bold flex items-center justify-center shrink-0">
                        {pm.icon}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{pm.label}</p>
                        <p className={`text-xs ${pm.highlight ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>
                          {pm.desc}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>

                {(selectedPayment === 'bitcoin' || selectedPayment === 'ethereum') && (
                  <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-200 text-sm text-amber-800">
                    <strong>Payment instructions</strong> will be sent to your email after order confirmation, along with the wallet address and exact amount.
                  </div>
                )}
                {selectedPayment === 'card' && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200 text-sm text-blue-800">
                    Card payment instructions will be sent to your email after placing the order.
                  </div>
                )}
                {selectedPayment === 'paypal' && (
                  <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-600">
                    PayPal payment instructions will be sent to your email after placing the order.
                  </div>
                )}
              </div>

              {/* Terms */}
              <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" {...register('agreeTerms')} className="mt-1 w-4 h-4 text-blue-600 rounded border-slate-300" />
                  <span className="text-sm text-slate-600">
                    I confirm that I am 18+ years old, I have read and agree to the{' '}
                    <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a> and{' '}
                    <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>, and I understand that modafinil/armodafinil is for personal use only and subject to local laws and regulations.
                  </span>
                </label>
                {errors.agreeTerms && (
                  <p className="text-xs text-red-600 mt-2">{errors.agreeTerms.message}</p>
                )}
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-slate-100 p-6 sticky top-24">
                <h2 className="font-bold text-slate-900 text-lg mb-5">Order Summary</h2>

                {/* Items */}
                <div className="flex flex-col gap-3 mb-5">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-slate-50">
                        <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">{item.product.name}</p>
                        <p className="text-xs text-slate-500">{item.variant.quantity} pills × {item.quantity}</p>
                      </div>
                      <span className="text-sm font-bold text-slate-900">{formatPrice(item.variant.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                {/* Coupon */}
                {!couponApplied ? (
                  <div className="flex gap-2 mb-5">
                    <input
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleApplyCoupon())}
                      placeholder="Coupon code"
                      className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Button size="sm" variant="outline" onClick={handleApplyCoupon} type="button">
                      <Tag className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-2 rounded-xl mb-5 text-sm font-semibold">
                    <CheckCircle className="w-4 h-4" />
                    Coupon {couponApplied} applied
                  </div>
                )}

                {/* Totals */}
                <div className="flex flex-col gap-2 pt-4 border-t border-slate-100">
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  {cryptoDiscount > 0 && (
                    <div className="flex justify-between text-sm text-emerald-600 font-medium">
                      <span>Crypto discount ({Math.round(cryptoDiscountRate * 100)}%) — BTC/ETH only</span>
                      <span>−{formatPrice(cryptoDiscount)}</span>
                    </div>
                  )}
                  {couponDiscount > 0 && cryptoDiscountRate > 0 && (
                    <p className="text-xs text-amber-600">⚠️ Crypto discount not applied — cannot combine with coupon</p>
                  )}
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-sm text-emerald-600 font-medium">
                      <span>Coupon discount</span>
                      <span>−{formatPrice(couponDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Shipping</span>
                    <span className="text-emerald-600 font-semibold">FREE</span>
                  </div>
                  {dispatchFee > 0 && (
                    <div className="flex justify-between text-sm text-slate-600">
                      <span>Dispatch Center Fee</span>
                      <span className="font-semibold text-slate-800">+${dispatchFee}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-slate-900 text-base pt-2 border-t border-slate-100">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                <Button fullWidth size="lg" type="submit" loading={isSubmitting} className="mt-5">
                  <Lock className="w-4 h-4" />
                  Place Order
                </Button>

                <div className="flex items-center justify-center gap-2 mt-4 text-xs text-slate-400">
                  <Shield className="w-3.5 h-3.5" />
                  <span>256-bit SSL encrypted checkout</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

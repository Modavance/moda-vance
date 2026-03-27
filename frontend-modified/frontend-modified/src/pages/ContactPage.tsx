import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { Mail, MessageCircle, Clock, CheckCircle, Phone } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { db } from '@/db/database';

const contactSchema = z.object({
  name:    z.string().min(2, 'Required'),
  email:   z.string().email('Valid email required'),
  subject: z.string().min(3, 'Required'),
  message: z.string().min(20, 'Please provide more detail (min 20 characters)'),
});

type ContactForm = z.infer<typeof contactSchema>;

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  const { data: settings = [] } = useQuery({
    queryKey: ['settings'],
    queryFn: () => db.settings.toArray(),
  });

  const settingsMap = Object.fromEntries(settings.map(s => [s.key, s.value]));
  const supportEmail   = settingsMap['contact.email']         ?? 'support@modavance.com';
  const responseTime   = settingsMap['contact.response_time'] ?? 'Within 2 hours, 7 days a week';
  const supportPhone   = settingsMap['contact.phone']         ?? '';

  const contactCards = [
    { icon: Mail,           title: 'Email Support', detail: supportEmail,  sub: 'Fastest response',  href: `mailto:${supportEmail}` },
    ...(supportPhone ? [{ icon: Phone, title: 'Phone', detail: supportPhone, sub: 'Business hours', href: `tel:${supportPhone}` }] : []),
    { icon: MessageCircle, title: 'Live Chat',      detail: 'Available on site', sub: 'Business hours', href: undefined },
    { icon: Clock,         title: 'Response Time',  detail: responseTime, sub: '',                   href: undefined },
  ];

  const onSubmit = async (data: ContactForm) => {
    setSubmitting(true);
    try {
      await db.contactSubmissions.add({
        id: `cs-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        name:    data.name,
        email:   data.email,
        subject: data.subject,
        message: data.message,
        read:    false,
        createdAt: new Date(),
      });
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-slate-900 text-white py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-slate-400 text-lg">We respond to every message within 2 hours, 7 days a week.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Contact info */}
          <div className="md:col-span-1 flex flex-col gap-4">
            {contactCards.map((item) => (
              <div key={item.title} className="bg-white rounded-2xl border border-slate-100 p-5 flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{item.title}</p>
                  {item.href ? (
                    <a href={item.href} className="text-blue-600 text-sm font-medium hover:underline">{item.detail}</a>
                  ) : (
                    <p className="text-blue-600 text-sm font-medium">{item.detail}</p>
                  )}
                  {item.sub && <p className="text-slate-400 text-xs">{item.sub}</p>}
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="md:col-span-2 bg-white rounded-2xl border border-slate-100 p-8">
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-emerald-500" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">Message Sent!</h2>
                <p className="text-slate-500">We'll get back to you soon at your email address.</p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 text-sm text-blue-600 hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold text-slate-900 mb-6">Send us a message</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Your Name"      error={errors.name?.message}    {...register('name')} />
                    <Input label="Email Address"  type="email" error={errors.email?.message} {...register('email')} />
                  </div>
                  <Input
                    label="Subject"
                    placeholder="e.g. Order status, product question..."
                    error={errors.subject?.message}
                    {...register('subject')}
                  />
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-700">Message</label>
                    <textarea
                      rows={5}
                      placeholder="Tell us how we can help..."
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      {...register('message')}
                    />
                    {errors.message && <p className="text-xs text-red-600">{errors.message.message}</p>}
                  </div>
                  <Button type="submit" size="lg" loading={submitting}>
                    <Mail className="w-4 h-4" />
                    Send Message
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

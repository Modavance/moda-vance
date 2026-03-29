import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Package, LogOut, ChevronRight, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { orderService } from '@/services/orderService';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { PageLoader } from '@/components/ui/Spinner';
import { formatPrice, formatDate } from '@/utils/formatters';
import type { OrderStatus } from '@/types';

const STATUS_CONFIG: Record<OrderStatus, { label: string; variant: 'info' | 'warning' | 'success' | 'danger' | 'default'; icon: React.ReactNode }> = {
  pending: { label: 'Pending', variant: 'warning', icon: <Clock className="w-3.5 h-3.5" /> },
  confirmed: { label: 'Confirmed', variant: 'info', icon: <CheckCircle className="w-3.5 h-3.5" /> },
  processing: { label: 'Processing', variant: 'info', icon: <Clock className="w-3.5 h-3.5" /> },
  shipped: { label: 'Shipped', variant: 'success', icon: <Truck className="w-3.5 h-3.5" /> },
  delivered: { label: 'Delivered', variant: 'success', icon: <CheckCircle className="w-3.5 h-3.5" /> },
  cancelled: { label: 'Cancelled', variant: 'danger', icon: <XCircle className="w-3.5 h-3.5" /> },
};

export function AccountPage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders', user?.id],
    queryFn: () => orderService.getByUser(user!.id),
    enabled: !!user,
  });

  if (!user) {
    navigate('/login', { state: { from: '/account' } });
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">My Account</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold">
                  {user.firstName[0]}{user.lastName[0]}
                </div>
                <div>
                  <p className="font-bold text-slate-900">{user.firstName} {user.lastName}</p>
                  <p className="text-sm text-slate-500">{user.email}</p>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-4 mb-6">
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">Loyalty Points</p>
                <p className="text-2xl font-bold text-blue-900">{user.loyaltyPoints}</p>
                <p className="text-xs text-blue-600">points available</p>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-blue-50 text-blue-700">
                  <Package className="w-4 h-4" />
                  <span className="text-sm font-semibold">My Orders</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-medium">Sign Out</span>
                </button>
              </div>
            </div>
          </div>

          {/* Orders */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <h2 className="font-bold text-slate-900 text-lg mb-6">Order History</h2>

              {isLoading ? (
                <PageLoader />
              ) : !orders || orders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                  <p className="font-semibold text-slate-700 mb-1">No orders yet</p>
                  <p className="text-sm text-slate-500 mb-6">Your orders will appear here after checkout</p>
                  <Button onClick={() => navigate('/shop')}>Browse Products</Button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {orders.map((order) => {
                    const statusConfig = STATUS_CONFIG[order.status];
                    return (
                      <div key={order.id} className="border border-slate-100 rounded-2xl p-5 hover:border-blue-100 transition-colors">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{order.id}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{formatDate(order.createdAt)}</p>
                          </div>
                          <Badge variant={statusConfig.variant} size="md">
                            <span className="flex items-center gap-1.5">
                              {statusConfig.icon}
                              {statusConfig.label}
                            </span>
                          </Badge>
                        </div>

                        <div className="flex gap-2 mb-4">
                          {order.items.slice(0, 3).map((item) => (
                            <div key={item.productId} className="w-12 h-12 rounded-lg overflow-hidden bg-slate-50">
                              <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
                            </div>
                          ))}
                          {order.items.length > 3 && (
                            <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-sm font-medium text-slate-500">
                              +{order.items.length - 3}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <p className="text-sm text-slate-500">
                            {order.items.length} item{order.items.length !== 1 ? 's' : ''} · {formatPrice(order.total)}
                          </p>
                          <Link
                            to={`/orders/${order.id}`}
                            className="flex items-center gap-1 text-sm text-blue-600 font-semibold hover:underline"
                          >
                            View Details <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

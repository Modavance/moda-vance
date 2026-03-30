import { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard, ShoppingBag, Package, Users, Tag,
  LogOut, Menu, ChevronRight, Bell,
  TrendingUp, ExternalLink, BookOpen, HelpCircle, MessageSquare, Settings,
  Mail, CheckCheck, User,
} from 'lucide-react';
import { useAdminStore } from '@/store/adminStore';
import { adminApi, unwrap } from '@/services/api';
import { cn } from '@/utils/cn';
import type { ContactSubmission, Order } from '@/types';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/customers', label: 'Customers', icon: Users },
  { to: '/admin/coupons', label: 'Coupons', icon: Tag },
  { to: '/admin/analytics', label: 'Analytics', icon: TrendingUp },
  { to: '/admin/blog', label: 'Blog', icon: BookOpen },
  { to: '/admin/faq', label: 'FAQ', icon: HelpCircle },
  { to: '/admin/contact', label: 'Contact', icon: MessageSquare },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

const LS_KEY = 'modavance-orders-seen-at';

function useClickOutside(ref: React.RefObject<HTMLElement | null>, handler: () => void) {
  useEffect(() => {
    const listener = (e: MouseEvent) => {
      if (!ref.current || ref.current.contains(e.target as Node)) return;
      handler();
    };
    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, [ref, handler]);
}

type NotifItem =
  | { kind: 'message'; data: ContactSubmission }
  | { kind: 'order'; data: Order; isNew: boolean };

function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotifItem[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useClickOutside(ref, () => setOpen(false));

  const load = async () => {
    const seenAt = Number(localStorage.getItem(LS_KEY) ?? 0);
    try {
      const [submissionsRes, ordersRes] = await Promise.all([
        adminApi.get('/contact?limit=15'),
        adminApi.get('/orders?limit=15'),
      ]);
      const submissions = unwrap<ContactSubmission[]>(submissionsRes);
      const orders = unwrap<Order[]>(ordersRes);

      const notifs: NotifItem[] = [
        ...submissions.map(s => ({ kind: 'message' as const, data: s })),
        ...orders.map(o => ({ kind: 'order' as const, data: o, isNew: new Date(o.createdAt).getTime() > seenAt })),
      ];
      notifs.sort((a, b) => new Date(b.data.createdAt).getTime() - new Date(a.data.createdAt).getTime());
      setItems(notifs.slice(0, 10));
    } catch {
      // ignore errors silently
    }
  };

  useEffect(() => { load(); }, [open]);

  const unreadMessages = items.filter(i => i.kind === 'message' && !i.data.read).length;
  const newOrders = items.filter(i => i.kind === 'order' && i.isNew).length;
  const totalUnread = unreadMessages + newOrders;

  const markAllRead = async () => {
    const unread = items.filter(i => i.kind === 'message' && !(i.data as ContactSubmission).read);
    await Promise.all(unread.map(i => adminApi.patch(`/contact/${i.data.id}/read`)));
    localStorage.setItem(LS_KEY, Date.now().toString());
    load();
  };

  const handleClickItem = async (item: NotifItem) => {
    if (item.kind === 'message') {
      if (!(item.data as ContactSubmission).read) await adminApi.patch(`/contact/${item.data.id}/read`);
      setOpen(false); navigate('/admin/contact');
    } else {
      localStorage.setItem(LS_KEY, Date.now().toString());
      setOpen(false); navigate('/admin/orders');
    }
  };

  const fmt = (d: Date | string) => new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(v => !v)} className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
        <Bell className="w-5 h-5" />
        {totalUnread > 0 && (
          <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 leading-none">
            {totalUnread > 99 ? '99+' : totalUnread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <span className="font-semibold text-slate-900 text-sm">
              Notifications
              {totalUnread > 0 && <span className="ml-2 px-1.5 py-0.5 bg-red-100 text-red-600 text-xs rounded-full font-medium">{totalUnread} new</span>}
            </span>
            {totalUnread > 0 && (
              <button onClick={markAllRead} className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium">
                <CheckCheck className="w-3.5 h-3.5" /> Mark all read
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-slate-400"><Bell className="w-8 h-8 mb-2 opacity-40" /><p className="text-sm">No notifications yet</p></div>
            ) : items.map((item, idx) => {
              const isUnread = item.kind === 'message' ? !(item.data as ContactSubmission).read : item.isNew;
              return (
                <button key={idx} onClick={() => handleClickItem(item)} className={cn('w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors', isUnread && 'bg-blue-50/60 hover:bg-blue-50')}>
                  <div className="flex items-start gap-2.5">
                    <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5', item.kind === 'message' ? 'bg-violet-100' : 'bg-emerald-100')}>
                      {item.kind === 'message' ? <Mail className="w-3.5 h-3.5 text-violet-600" /> : <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {item.kind === 'message' ? (item.data as ContactSubmission).name : `New order ${item.data.id.slice(0, 14)}…`}
                        </p>
                        <p className="text-[11px] text-slate-400 shrink-0">{fmt(item.data.createdAt)}</p>
                      </div>
                      <p className="text-xs text-slate-500 truncate">
                        {item.kind === 'message' ? (item.data as ContactSubmission).subject : `$${(item.data as Order).total.toFixed(2)} · ${(item.data as Order).status}`}
                      </p>
                    </div>
                    {isUnread && <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1.5" />}
                  </div>
                </button>
              );
            })}
          </div>
          <div className="px-4 py-3 border-t border-slate-100 flex gap-3">
            <Link to="/admin/contact" onClick={() => setOpen(false)} className="flex-1 text-center text-sm text-violet-600 hover:text-violet-700 font-medium">Messages →</Link>
            <div className="w-px bg-slate-100" />
            <Link to="/admin/orders" onClick={() => setOpen(false)} className="flex-1 text-center text-sm text-emerald-600 hover:text-emerald-700 font-medium">Orders →</Link>
          </div>
        </div>
      )}
    </div>
  );
}

function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { email, logout } = useAdminStore();
  const navigate = useNavigate();

  useClickOutside(ref, () => setOpen(false));

  const handleLogout = () => { setOpen(false); logout(); navigate('/admin/login'); };

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(v => !v)} className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold hover:bg-blue-700 transition-colors ring-2 ring-transparent hover:ring-blue-200">A</button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold shrink-0">A</div>
              <div className="min-w-0"><p className="text-sm font-semibold text-slate-900">Admin</p><p className="text-xs text-slate-400 truncate">{email}</p></div>
            </div>
          </div>
          <div className="py-1.5">
            <Link to="/admin/profile" onClick={() => setOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"><User className="w-4 h-4 text-slate-400" />My Profile</Link>
            <Link to="/admin/settings" onClick={() => setOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"><Settings className="w-4 h-4 text-slate-400" />Settings</Link>
            <a href="/" target="_blank" onClick={() => setOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"><ExternalLink className="w-4 h-4 text-slate-400" />View Store</a>
          </div>
          <div className="border-t border-slate-100 py-1.5">
            <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"><LogOut className="w-4 h-4" />Sign Out</button>
          </div>
        </div>
      )}
    </div>
  );
}

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useAdminStore();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={cn('flex flex-col h-full bg-slate-900', mobile ? '' : '')}>
      <div className="px-6 py-5 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
            <path d="M20 2L36.5 11V29L20 38L3.5 29V11L20 2Z" fill="url(#ag)"/>
            <path d="M11 27V14L16 21L20 15L24 21L29 14V27" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <defs><linearGradient id="ag" x1="3.5" y1="2" x2="36.5" y2="38" gradientUnits="userSpaceOnUse"><stop stopColor="#3b82f6"/><stop offset="1" stopColor="#2563eb"/></linearGradient></defs>
          </svg>
          <div><p className="text-white font-bold text-sm">ModaVance</p><p className="text-slate-500 text-xs uppercase tracking-wider">Admin</p></div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(item => (
          <NavLink key={item.to} to={item.to} end={item.end} onClick={() => setSidebarOpen(false)}
            className={({ isActive }) => cn('flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group', isActive ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800')}>
            {({ isActive }) => (
              <>{<item.icon className={cn('w-4 h-4', isActive ? 'text-white' : 'text-slate-400 group-hover:text-white')} />}{item.label}{!isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-50 transition-opacity" />}</>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="px-3 py-4 border-t border-slate-800 space-y-1">
        <a href="/" target="_blank" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-all"><ExternalLink className="w-4 h-4" />View Store</a>
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all"><LogOut className="w-4 h-4" />Sign Out</button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <aside className="hidden lg:flex w-60 shrink-0 flex-col"><Sidebar /></aside>
      {sidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
          <aside className="fixed left-0 top-0 h-full w-60 z-50 lg:hidden"><Sidebar mobile /></aside>
        </>
      )}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg"><Menu className="w-5 h-5" /></button>
          <div className="hidden lg:block"><p className="text-sm text-slate-400">Good morning, Admin</p></div>
          <div className="flex items-center gap-3 ml-auto"><NotificationBell /><ProfileMenu /></div>
        </header>
        <main className="flex-1 overflow-y-auto p-6"><Outlet /></main>
      </div>
    </div>
  );
}

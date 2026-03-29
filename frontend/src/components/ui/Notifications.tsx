import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useNotificationStore } from '@/store/notificationStore';
import { cn } from '@/utils/cn';

export function Notifications() {
  const { notifications, remove } = useNotificationStore();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 sm:left-auto sm:right-4 sm:translate-x-0 z-50 flex flex-col gap-3 w-[calc(100%-2rem)] max-w-sm pointer-events-none">
      {notifications.map((n) => {
        const icons = {
          success: <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />,
          error: <XCircle className="w-5 h-5 text-red-500 shrink-0" />,
          info: <Info className="w-5 h-5 text-blue-500 shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
        };

        const borders = {
          success: 'border-emerald-200',
          error: 'border-red-200',
          info: 'border-blue-200',
          warning: 'border-amber-200',
        };

        return (
          <div
            key={n.id}
            className={cn(
              'pointer-events-auto flex items-start gap-3 bg-white rounded-2xl border shadow-xl p-4',
              borders[n.type]
            )}
          >
            {icons[n.type]}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900">{n.title}</p>
              {n.message && <p className="text-sm text-slate-500 mt-0.5">{n.message}</p>}
            </div>
            <button
              onClick={() => remove(n.id)}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

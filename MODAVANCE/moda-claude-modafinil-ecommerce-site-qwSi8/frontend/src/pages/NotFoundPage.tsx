import { Link } from 'react-router-dom';
import { Logo } from '@/components/ui/Logo';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <Logo className="justify-center mb-8" />
        <p className="text-8xl font-bold text-blue-600 mb-4">404</p>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Page Not Found</h1>
        <p className="text-slate-500 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" className="inline-flex items-center justify-center bg-blue-600 text-white px-6 py-3 text-base font-semibold rounded-xl hover:bg-blue-700 transition-all">Go Home</Link>
          <Link to="/shop" className="inline-flex items-center justify-center bg-slate-100 text-slate-800 px-6 py-3 text-base font-semibold rounded-xl hover:bg-slate-200 transition-all">Browse Products</Link>
        </div>
      </div>
    </div>
  );
}

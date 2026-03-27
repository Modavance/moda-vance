import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { router } from './router';
import { seedDatabase } from './db/seed';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 1,
    },
  },
});

function AppContent() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    seedDatabase()
      .catch(console.error)
      .finally(() => setReady(true));
  }, []);

  if (!ready) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <svg width="48" height="48" viewBox="0 0 40 40" fill="none">
            <path d="M20 2L36.5 11V29L20 38L3.5 29V11L20 2Z" fill="url(#boot)"/>
            <path d="M11 27V14L16 21L20 15L24 21L29 14V27" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <defs>
              <linearGradient id="boot" x1="3.5" y1="2" x2="36.5" y2="38" gradientUnits="userSpaceOnUse">
                <stop stopColor="#3b82f6"/><stop offset="1" stopColor="#2563eb"/>
              </linearGradient>
            </defs>
          </svg>
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return <RouterProvider router={router} />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}


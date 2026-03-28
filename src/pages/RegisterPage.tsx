import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UserPlus, Eye, EyeOff } from 'lucide-react';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/authStore';
import { useNotificationStore } from '@/store/notificationStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Logo } from '@/components/ui/Logo';

const registerSchema = z.object({
  firstName: z.string().min(2, 'Required'),
  lastName: z.string().min(2, 'Required'),
  email: z.string().email('Valid email required'),
  password: z.string().min(8, 'At least 8 characters'),
  confirmPassword: z.string(),
  agreeTerms: z.boolean().refine((v) => v === true, { message: 'You must agree to the terms' }),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type RegisterForm = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  const notify = useNotificationStore();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      const user = await authService.register({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      });
      login(user);
      notify.success('Account created!', `Welcome to ModaVance, ${user.firstName}!`);
      navigate('/account');
    } catch (err) {
      notify.error('Registration failed', (err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/">
            <Logo size="lg" className="justify-center mb-6" />
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
          <p className="text-slate-500 mt-2">Join thousands of high performers</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-4">
              <Input label="First Name" error={errors.firstName?.message} {...register('firstName')} />
              <Input label="Last Name" error={errors.lastName?.message} {...register('lastName')} />
            </div>
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="At least 8 characters"
              error={errors.password?.message}
              suffix={
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="p-0.5">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              {...register('password')}
            />
            <Input
              label="Confirm Password"
              type="password"
              placeholder="Re-enter password"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" {...register('agreeTerms')} className="mt-1 w-4 h-4 text-blue-600 rounded border-slate-300" />
              <span className="text-sm text-slate-600">
                I am 18+ and agree to the{' '}
                <Link to="/terms" className="text-blue-600 hover:underline">Terms</Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
              </span>
            </label>
            {errors.agreeTerms && <p className="text-xs text-red-600">{errors.agreeTerms.message}</p>}

            <Button type="submit" fullWidth size="lg" loading={isLoading}>
              <UserPlus className="w-4 h-4" />
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-semibold hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

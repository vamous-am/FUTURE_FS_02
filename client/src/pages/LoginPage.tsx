import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { loginSchema, type LoginPayload } from '@crm/shared';
import { useAuth } from '../context/AuthContext.js';
import axios from 'axios';

/**
 * Login page for the admin user.
 * Validates credentials client-side using the shared loginSchema,
 * then delegates to AuthContext.login() for the API call.
 */
export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginPayload>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginPayload) => {
    setServerError(null);
    try {
      await login(data.username, data.password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const msg = (
          err.response?.data as { error?: { message?: string } } | undefined
        )?.error?.message;
        setServerError(msg ?? 'Login failed');
      } else {
        setServerError('An unexpected error occurred');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-xl shadow-slate-100 border border-slate-100">

        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Enter your administrator credentials below
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-4">

            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="e.g. admin"
                autoComplete="username"
                aria-invalid={!!errors.username}
                aria-describedby={errors.username ? 'username-error' : undefined}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-150"
                {...register('username')}
              />
              {errors.username && (
                <p id="username-error" role="alert" className="mt-1 text-xs text-red-500 font-medium">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? 'password-error' : undefined}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-150"
                {...register('password')}
              />
              {errors.password && (
                <p id="password-error" role="alert" className="mt-1 text-xs text-red-500 font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          {/* Server error alert */}
          {serverError && (
            <div className="flex items-center gap-2.5 p-3.5 bg-red-50 border border-red-100 rounded-lg text-xs text-red-600 font-semibold leading-relaxed" role="alert">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{serverError}</span>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white text-sm font-semibold rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-slate-900/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}

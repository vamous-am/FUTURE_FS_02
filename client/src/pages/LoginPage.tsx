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
    <main className="login-page">
      <h1>Sign in</h1>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            autoComplete="username"
            aria-invalid={!!errors.username}
            aria-describedby={errors.username ? 'username-error' : undefined}
            {...register('username')}
          />
          {errors.username && (
            <span id="username-error" role="alert">
              {errors.username.message}
            </span>
          )}
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'password-error' : undefined}
            {...register('password')}
          />
          {errors.password && (
            <span id="password-error" role="alert">
              {errors.password.message}
            </span>
          )}
        </div>

        {serverError && (
          <p role="alert" className="server-error">
            {serverError}
          </p>
        )}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </main>
  );
}

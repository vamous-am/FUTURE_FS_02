import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * Renders children when authenticated.
 * Shows a neutral loading state during the initial /me rehydration check.
 * Redirects to /login if unauthenticated once the check resolves.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen" aria-live="polite" aria-label="Loading">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

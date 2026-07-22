import { useAuth } from '../context/AuthContext.js';

/**
 * Dashboard placeholder — full implementation in Phase 5.
 * Displays the authenticated username and a logout control.
 */
export function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <main>
      <h1>Dashboard</h1>
      <p>Signed in as {user?.username}</p>
      <button type="button" onClick={() => void logout()}>
        Sign out
      </button>
    </main>
  );
}

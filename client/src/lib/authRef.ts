/**
 * Module-level ref for the logout function.
 * Populated by AuthProvider on mount so the Axios interceptor can call it
 * without importing from the React context module.
 */
export const authRef: { logout: () => void } = {
  logout: () => {},
};

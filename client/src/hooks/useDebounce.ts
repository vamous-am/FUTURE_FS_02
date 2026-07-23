import { useState, useEffect } from 'react';

/**
 * Returns a debounced copy of value, updated after the given delay in ms.
 * @param value - The value to debounce.
 * @param delay - Debounce delay in milliseconds.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

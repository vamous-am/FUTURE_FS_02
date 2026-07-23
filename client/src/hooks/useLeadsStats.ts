import { useQuery } from '@tanstack/react-query';
import api from '../lib/api.js';

interface LeadsStats {
  total: number;
  new: number;
  contacted: number;
  converted: number;
}

/**
 * Fetches global lead counts from GET /api/leads/stats.
 * Refreshes every 30 seconds. Independent of table filters.
 */
export function useLeadsStats() {
  return useQuery<LeadsStats>({
    queryKey: ['leads-stats'],
    queryFn: async () => {
      const res = await api.get<{ success: boolean; data: LeadsStats }>('/api/leads/stats');
      return res.data.data;
    },
    refetchInterval: 30000,
  });
}

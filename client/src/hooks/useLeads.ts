import { useQuery } from '@tanstack/react-query';
import api from '../lib/api.js';

export interface LeadDoc {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  source: string;
  status: 'new' | 'contacted' | 'converted';
  notes: { type: string; content: string; author: string; timestamp: string }[];
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface LeadsResponse {
  leads: LeadDoc[];
  pagination: Pagination;
}

export interface LeadsParams {
  page: number;
  limit: number;
  search: string;
  status: string;
  source: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

/**
 * Fetches a paginated, filtered, sorted lead list from GET /api/leads.
 * Query key includes all params so React Query refetches on any change.
 * Refreshes every 30 seconds in the background.
 */
export function useLeads(params: LeadsParams) {
  return useQuery<LeadsResponse>({
    queryKey: ['leads', params],
    queryFn: async () => {
      const res = await api.get<{ success: boolean; data: LeadsResponse }>('/api/leads', {
        params: {
          page: params.page,
          limit: params.limit,
          ...(params.search && { search: params.search }),
          ...(params.status && { status: params.status }),
          ...(params.source && { source: params.source }),
          sortBy: params.sortBy,
          sortOrder: params.sortOrder,
        },
      });
      return res.data.data;
    },
    refetchInterval: 30000,
  });
}

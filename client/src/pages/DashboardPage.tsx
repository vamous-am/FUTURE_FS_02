import { useState, useCallback } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import { useAuth } from '../context/AuthContext.js';
import { useLeads, type LeadDoc, type LeadsParams } from '../hooks/useLeads.js';
import { useLeadsStats } from '../hooks/useLeadsStats.js';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.js';
import { Badge } from '../components/ui/badge.js';
import { Button } from '../components/ui/button.js';
import { Input } from '../components/ui/input.js';
import { Select } from '../components/ui/select.js';
import { Skeleton } from '../components/ui/skeleton.js';
import { useDebounce } from '../hooks/useDebounce.js';

const STATUS_OPTIONS = ['', 'new', 'contacted', 'converted'] as const;
const SOURCE_OPTIONS = ['', 'Website', 'Referral', 'Ad Campaign', 'LinkedIn', 'Other'] as const;
const SORT_FIELDS = ['name', 'email', 'status', 'source', 'createdAt'] as const;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

const col = createColumnHelper<LeadDoc>();

const columns = [
  col.accessor('name', { header: 'Name' }),
  col.accessor('email', { header: 'Email' }),
  col.accessor('source', { header: 'Source' }),
  col.accessor('status', {
    header: 'Status',
    cell: (info) => (
      <Badge variant={info.getValue() as 'new' | 'contacted' | 'converted'}>
        {info.getValue()}
      </Badge>
    ),
  }),
  col.accessor('createdAt', {
    header: 'Created',
    cell: (info) => formatDate(info.getValue()),
  }),
  col.display({
    id: 'actions',
    header: 'Actions',
    cell: (info) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => console.log('Lead ID:', info.row.original._id)}
      >
        View
      </Button>
    ),
  }),
];

/**
 * Main dashboard page. Displays KPI cards and a filterable, sortable lead table.
 * Row click and View button log the lead ID — drawer implemented in Phase 6.
 */
export function DashboardPage() {
  const { user, logout } = useAuth();

  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 300);

  const [params, setParams] = useState<LeadsParams>({
    page: 1,
    limit: 20,
    search: '',
    status: '',
    source: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  // Sync debounced search into params and reset page
  const currentSearch = debouncedSearch;
  const effectiveParams: LeadsParams = { ...params, search: currentSearch };

  const { data: stats, isLoading: statsLoading } = useLeadsStats();
  const { data: leadsData, isLoading: leadsLoading, isError, refetch } = useLeads(effectiveParams);

  const table = useReactTable({
    data: leadsData?.leads ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    pageCount: leadsData?.pagination.totalPages ?? 0,
  });

  const setFilter = useCallback(
    (key: 'status' | 'source', value: string) => {
      setParams((p) => ({ ...p, [key]: value, page: 1 }));
    },
    [],
  );

  const setSort = useCallback((field: string) => {
    setParams((p) => ({
      ...p,
      sortBy: field,
      sortOrder: p.sortBy === field && p.sortOrder === 'asc' ? 'desc' : 'asc',
      page: 1,
    }));
  }, []);

  const filtersActive =
    params.status !== '' || params.source !== '' || currentSearch !== '';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold">Mini CRM</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">{user?.username}</span>
          <Button variant="outline" size="sm" onClick={() => void logout()}>
            Sign out
          </Button>
        </div>
      </header>

      <main className="px-6 py-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {(['total', 'new', 'contacted', 'converted'] as const).map((key) => (
            <Card key={key}>
              <CardHeader>
                <CardTitle className="capitalize">{key}</CardTitle>
              </CardHeader>
              <CardContent>
                {statsLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-2xl font-bold">{stats?.[key] ?? '—'}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <Input
            placeholder="Search name or email…"
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              setParams((p) => ({ ...p, page: 1 }));
            }}
            className="w-56"
            aria-label="Search leads"
          />
          <Select
            value={params.status}
            onChange={(e) => setFilter('status', e.target.value)}
            aria-label="Filter by status"
            className="w-40"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s === '' ? 'All statuses' : s}
              </option>
            ))}
          </Select>
          <Select
            value={params.source}
            onChange={(e) => setFilter('source', e.target.value)}
            aria-label="Filter by source"
            className="w-44"
          >
            {SOURCE_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s === '' ? 'All sources' : s}
              </option>
            ))}
          </Select>
        </div>

        {/* Table */}
        {leadsLoading ? (
          <div className="space-y-2" aria-label="Loading leads">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : isError ? (
          <div className="py-12 text-center space-y-3">
            <p className="text-sm text-destructive">Failed to load leads.</p>
            <Button variant="outline" onClick={() => void refetch()}>
              Retry
            </Button>
          </div>
        ) : (
          <>
            <div className="rounded-md border overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  {table.getHeaderGroups().map((hg) => (
                    <tr key={hg.id}>
                      {hg.headers.map((header) => {
                        const isSortable = SORT_FIELDS.includes(
                          header.id as (typeof SORT_FIELDS)[number],
                        );
                        return (
                          <th
                            key={header.id}
                            className="px-4 py-3 text-left font-medium text-muted-foreground"
                          >
                            {isSortable ? (
                              <button
                                className="flex items-center gap-1 hover:text-foreground"
                                onClick={() => setSort(header.id)}
                                aria-label={`Sort by ${header.id}`}
                              >
                                {flexRender(header.column.columnDef.header, header.getContext())}
                                {params.sortBy === header.id && (
                                  <span aria-hidden>{params.sortOrder === 'asc' ? '↑' : '↓'}</span>
                                )}
                              </button>
                            ) : (
                              flexRender(header.column.columnDef.header, header.getContext())
                            )}
                          </th>
                        );
                      })}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={columns.length}
                        className="px-4 py-12 text-center text-muted-foreground"
                      >
                        No leads found.
                        {filtersActive && ' Try clearing your filters.'}
                      </td>
                    </tr>
                  ) : (
                    table.getRowModel().rows.map((row) => (
                      <tr
                        key={row.id}
                        className="border-t hover:bg-muted/30 cursor-pointer"
                        onClick={() => console.log('Lead ID:', row.original._id)}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className="px-4 py-3">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                Page {effectiveParams.page} of{' '}
                {leadsData?.pagination.totalPages ?? 1} (
                {leadsData?.pagination.total ?? 0} total)
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={effectiveParams.page <= 1}
                  onClick={() => setParams((p) => ({ ...p, page: p.page - 1 }))}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={
                    effectiveParams.page >= (leadsData?.pagination.totalPages ?? 1)
                  }
                  onClick={() => setParams((p) => ({ ...p, page: p.page + 1 }))}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useReducer, useState } from 'react';
import type { AggregationArtefactBase } from '../preload/data/aggregation-artefact-model.ts';
import { AggregationTasks } from './AggregationTasks.tsx';

function AggregationMonitorPage() {
  const queryClient = useQueryClient();
  const [, forceUpdate] = useReducer((x: number) => x + 1, 0);
  const [queryFilter, setQueryFilter] = useState('preload');

  useEffect(() => {
    return queryClient.getQueryCache().subscribe(() => forceUpdate());
  }, [queryClient]);

  const allCacheQueries = queryClient.getQueryCache().getAll();

  const aggregationQueries = allCacheQueries.filter(
    (q) =>
      Array.isArray(q.queryKey) &&
      typeof q.queryKey[0] === 'string' &&
      (q.queryKey[0] as string).toLowerCase().startsWith('aggregation')
  );

  let filterRegex: RegExp | null = null;
  let filterRegexInvalid = false;
  try {
    filterRegex = new RegExp(queryFilter, 'i');
  } catch {
    filterRegexInvalid = true;
  }

  const availableDescriptors = Array.from(
    new Set(
      aggregationQueries
        .map((q) => (q.state.data as AggregationArtefactBase | undefined)?.processLog?.descriptor)
        .filter((d): d is string => d !== undefined)
    )
  );

  const selectedQueryCount =
    filterRegex === null
      ? 0
      : aggregationQueries.filter((q) => {
          const descriptor = (q.state.data as AggregationArtefactBase | undefined)?.processLog?.descriptor;
          return descriptor !== undefined && filterRegex!.test(descriptor);
        }).length;

  return (
    <div
      style={{
        padding: '28px 32px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        background: '#f5f6f8',
        minHeight: '100vh',
      }}
    >
      <div
        style={{
          marginBottom: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
        }}
      >
        <div style={{ fontSize: 13, color: '#6b7280' }}>
          {selectedQueryCount} {selectedQueryCount === 1 ? 'Query' : 'Queries'} selektiert
        </div>
        <div style={{ position: 'relative' }}>
          <input
            list="monitor-query-filter-options"
            value={queryFilter}
            onChange={(e) => setQueryFilter(e.target.value)}
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: filterRegexInvalid ? '#dc2626' : '#374151',
              background: filterRegexInvalid ? '#fef2f2' : '#fff',
              border: `1px solid ${filterRegexInvalid ? '#fca5a5' : '#e5e7eb'}`,
              borderRadius: 6,
              padding: '5px 12px',
              width: 220,
              outline: 'none',
            }}
            placeholder="Query-Filter…"
          />
          <datalist id="monitor-query-filter-options">
            {availableDescriptors.map((d) => (
              <option key={d} value={d} />
            ))}
          </datalist>
        </div>
      </div>

      <AggregationTasks queryFilter={queryFilter} />
    </div>
  );
}

export default AggregationMonitorPage;
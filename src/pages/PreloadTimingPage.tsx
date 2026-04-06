import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useReducer } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import { AGGREGATION_PRELOAD_QUERY_KEY } from '../preload/data/use-preload-aggregation-query.ts';
import type { AggregationPreload } from '../preload/data/aggregation-preload-model.ts';
import type { AggregationFetchTask } from '../preload/data/aggregation-log-model.ts';

interface GanttEntry {
  label: string;
  start: number;
  duration: number;
  resource: string;
  key: string;
}

interface ContributorGroup {
  contributorId: string;
  entries: GanttEntry[];
}

const COLORS: Record<string, string> = {
  aggregation: '#1976d2',
  boil: '#388e3c',
  nils: '#f57c00',
  eliah: '#7b1fa2',
  kowin: '#c62828',
  penaxa: '#00838f',
  tpc: '#5d4037',
  azk: '#e64a19',
  mortgage: '#0288d1',
  ebvg: '#558b2f',
  p40: '#6a1b9a',
  premiumdepot: '#2e7d32',
};

const BAR_HEIGHT = 24;
const BAR_GAP = 6;

function GanttChart({ entries, globalMin }: { entries: GanttEntry[]; globalMin: number }) {
  const data = entries.map((e) => ({
    label: `${e.resource} / ${e.key.slice(0, 40)}`,
    start: e.start - globalMin,
    duration: e.duration,
    resource: e.resource,
    fullKey: e.key,
  }));

  const chartHeight = data.length * (BAR_HEIGHT + BAR_GAP) + 40;

  return (
    <ResponsiveContainer width="100%" height={chartHeight}>
      <BarChart
        layout="vertical"
        data={data}
        margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
        barSize={BAR_HEIGHT}
        barGap={BAR_GAP}
      >
        <XAxis type="number" unit="ms" tick={{ fontSize: 11 }} />
        <YAxis
          type="category"
          dataKey="label"
          width={220}
          tick={{ fontSize: 11 }}
        />
        <Tooltip
          formatter={(value, name) => {
            if (name === 'start') return [`${value} ms`, 'Start (offset)'];
            if (name === 'duration') return [`${value} ms`, 'Dauer'];
            return [value, name];
          }}
          labelFormatter={(label) => label}
        />
        <Bar dataKey="start" stackId="gantt" fill="transparent" isAnimationActive={false} />
        <Bar dataKey="duration" stackId="gantt" isAnimationActive={false}>
          {data.map((_, i) => (
            <Cell key={i} fill="#1976d2" />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function PreloadTimingPage() {
  const queryClient = useQueryClient();
  const [, forceUpdate] = useReducer((x: number) => x + 1, 0);

  useEffect(() => {
    return queryClient.getQueryCache().subscribe(() => forceUpdate());
  }, [queryClient]);

  const allCacheQueries = queryClient.getQueryCache().getAll();
  const preloadQueries = allCacheQueries.filter(
    (q) => Array.isArray(q.queryKey) && q.queryKey[0] === AGGREGATION_PRELOAD_QUERY_KEY
  );

  console.debug('[PreloadTimingPage] cache total:', allCacheQueries.length);
  console.debug('[PreloadTimingPage] preload queries found:', preloadQueries.length, preloadQueries.map(q => ({ key: q.queryKey, state: q.state.status, hasData: q.state.data !== undefined })));

  const allTasks: (AggregationFetchTask & { referenceInstant: number })[] = preloadQueries.flatMap(
    (q) => {
      const data = q.state.data as AggregationPreload | undefined;
      if (!data) return [];
      const ref = data.processLog.referenceInstant;
      return data.processLog.fetchTasks.map((t) => ({ ...t, referenceInstant: ref }));
    }
  );

  if (allTasks.length === 0) {
    return (
      <div style={{ padding: 32, fontFamily: 'sans-serif', color: '#666' }}>
        <div>Keine Daten verfügbar. Bitte zuerst Preload-Queries ausführen.</div>
        <pre style={{ marginTop: 16, fontSize: 11, color: '#999' }}>
          {`Cache-Einträge gesamt: ${allCacheQueries.length}\nPreload-Queries: ${preloadQueries.length}\n`}
          {preloadQueries.map(q => `Key: ${JSON.stringify(q.queryKey)} | Status: ${q.state.status}`).join('\n')}
        </pre>
      </div>
    );
  }

  const globalMin = Math.min(
    ...allTasks.map((t) => t.referenceInstant + t.startInstant)
  );

  const byContributor = new Map<string, GanttEntry[]>();
  for (const task of allTasks) {
    const absStart = task.referenceInstant + task.startInstant;
    const entry: GanttEntry = {
      label: `${task.resource} / ${task.key}`,
      start: absStart,
      duration: task.duration,
      resource: task.resource,
      key: task.key,
    };
    const existing = byContributor.get(task.contributor) ?? [];
    existing.push(entry);
    byContributor.set(task.contributor, existing);
  }

  const groups: ContributorGroup[] = Array.from(byContributor.entries()).map(
    ([contributorId, entries]) => ({
      contributorId,
      entries: [...entries].sort((a, b) => a.key.localeCompare(b.key)),
    })
  );

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h2 style={{ marginBottom: 24 }}>Preload Timing</h2>
      {groups.map(({ contributorId, entries }) => (
        <div key={contributorId} style={{ marginBottom: 40 }}>
          <h3
            style={{
              marginBottom: 8,
              padding: '4px 12px',
              background: COLORS[contributorId] ?? '#555',
              color: '#fff',
              borderRadius: 4,
              display: 'inline-block',
              fontSize: 14,
            }}
          >
            {contributorId}
          </h3>
          <GanttChart entries={entries} globalMin={globalMin} />
        </div>
      ))}
    </div>
  );
}

export default PreloadTimingPage;

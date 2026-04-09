import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useReducer, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, CartesianGrid, ResponsiveContainer } from 'recharts';
import { AGGREGATION_PRELOAD_QUERY_KEY } from '../preload/data/use-preload-aggregation-query.ts';
import type { AggregationPreload } from '../preload/data/aggregation-preload-model.ts';
import type { AggregationFetchTask } from '../preload/data/aggregation-log-model.ts';
import type {ContributorId} from "../preload/data/aggregation-contributor-model.ts";

interface GanttEntry {
  label: string;
  start: number;
  duration: number;
  resource: string;
  identifier: string;
  key: string;
}

interface ContributorGroup {
  contributorId: string;
  entries: GanttEntry[];
}

const COLORS: Record<ContributorId, string> = {
  aggregation: '#3b82f6',
  boil: '#22c55e',
  nils: '#f97316',
  eliah: '#a855f7',
  kowin: '#ef4444',
  penaxa: '#06b6d4',
  tpc: '#78716c',
  azk: '#f43f5e',
  mortgage: '#0ea5e9',
  ebvg: '#84cc16',
  p40: '#8b5cf6',
  premiumdepot: '#10b981',
};

function hexWithAlpha(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

const BAR_HEIGHT = 22;
const BAR_GAP = 16;

function TwoLineTick({ x, y, payload }: { x?: number; y?: number; payload?: { value: string } }) {
  const raw = (payload?.value ?? '').replace(/::\d+$/, '');
  const tab = raw.indexOf('\t');
  const resource = tab >= 0 ? raw.slice(0, tab) : raw;
  const identifier = tab >= 0 ? raw.slice(tab + 1) : '';
  return (
    <g transform={`translate(${x},${y})`}>
      <text textAnchor="end" fontSize={11}>
        <tspan x={0} dy="-0.25em" fontWeight={500} fill="#374151">{resource}</tspan>
        <tspan x={0} dy="1.4em" fontSize={10} fill="#9ca3af">{identifier}</tspan>
      </text>
    </g>
  );
}

function GanttChart({ entries, globalMin, xMax, color }: {
  entries: GanttEntry[];
  globalMin: number;
  xMax: number;
  color: string;
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const data = entries.map((e, i) => ({
    label: `${e.resource}\t${e.identifier}::${i}`,
    start: e.start - globalMin,
    duration: e.duration,
    resource: e.resource,
    fullKey: e.key,
  }));

  const chartHeight = data.length * (BAR_HEIGHT + BAR_GAP) + 44;

  return (
    <ResponsiveContainer width="100%" height={chartHeight}>
      <BarChart
        layout="vertical"
        data={data}
        margin={{ top: 4, right: 20, left: 8, bottom: 4 }}
        barSize={BAR_HEIGHT}
        barGap={BAR_GAP}
      >
        <CartesianGrid strokeDasharray="4 4" horizontal={false} stroke="#f0f0f0" />
        <XAxis
          type="number"
          unit="ms"
          tick={{ fontSize: 11, fill: '#6b7280' }}
          axisLine={{ stroke: '#e5e7eb' }}
          tickLine={{ stroke: '#e5e7eb' }}
          domain={[0, xMax]}
        />
        <YAxis
          type="category"
          dataKey="label"
          width={210}
          tick={<TwoLineTick />}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          cursor={false}
          active={activeIndex !== null}
          contentStyle={{
            borderRadius: 8,
            border: '1px solid #e5e7eb',
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            fontSize: 12,
            padding: '8px 12px',
            color: '#374151',
          }}
          itemStyle={{ padding: '2px 0', color: '#6b7280' }}
          formatter={(value, name) => {
            if (name === 'start') return [`${value} ms`, 'Start (offset)'];
            if (name === 'duration') return [`${value} ms`, 'Dauer'];
            return [value, name];
          }}
          labelFormatter={(label: string) => {
            const raw = label.replace(/::\d+$/, '');
            const tab = raw.indexOf('\t');
            return tab >= 0
              ? <span style={{ fontWeight: 600, color: '#111827' }}>{`${raw.slice(0, tab)} / ${raw.slice(tab + 1)}`}</span>
              : raw;
          }}
        />
        <Bar dataKey="start" stackId="gantt" fill="transparent" isAnimationActive={false} />
        <Bar
          dataKey="duration"
          stackId="gantt"
          isAnimationActive={false}
          radius={[0, 3, 3, 0]}
          onMouseEnter={(_: unknown, index: number) => setActiveIndex(index)}
          onMouseLeave={() => setActiveIndex(null)}
        >
          {data.map((_, i) => (
            <Cell
              key={i}
              fill={i === activeIndex ? color : hexWithAlpha(color, 0.75)}
            />
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

  const allTasks: AggregationFetchTask[] = preloadQueries.flatMap(
    (q) => {
      const data = q.state.data as AggregationPreload | undefined;
      if (!data) return [];
      return data.processLog.fetchTasks;
    }
  );

  if (allTasks.length === 0) {
    return (
      <div style={{
        padding: '48px 32px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        color: '#6b7280',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 8, color: '#374151' }}>
          Keine Daten verfügbar
        </div>
        <div style={{ fontSize: 13, marginBottom: 24 }}>
          Bitte zuerst Preload-Queries ausführen.
        </div>
        <pre style={{
          display: 'inline-block',
          textAlign: 'left',
          fontSize: 11,
          color: '#9ca3af',
          background: '#f9fafb',
          border: '1px solid #e5e7eb',
          borderRadius: 8,
          padding: '12px 16px',
        }}>
          {`Cache-Einträge gesamt: ${allCacheQueries.length}\nPreload-Queries: ${preloadQueries.length}\n`}
          {preloadQueries.map(q => `Key: ${JSON.stringify(q.queryKey)} | Status: ${q.state.status}`).join('\n')}
        </pre>
      </div>
    );
  }

  const globalMin = Math.min(...allTasks.map((t) => t.startMillis));
  const globalMax = Math.max(...allTasks.map((t) => t.endMillis));
  const xMax = globalMax - globalMin;

  const byContributor = new Map<string, GanttEntry[]>();
  for (const task of allTasks) {
    const entry: GanttEntry = {
      label: `${task.identifier ?? ''} / ${task.resource}`,
      start: task.startMillis,
      duration: task.duration,
      resource: task.resource,
      identifier: task.identifier ?? '',
      key: task.key ?? '',
    };
    const existing = byContributor.get(task.contributor) ?? [];
    existing.push(entry);
    byContributor.set(task.contributor, existing);
  }

  const groups: ContributorGroup[] = Array.from(byContributor.entries()).map(
    ([contributorId, entries]) => ({
      contributorId,
      entries: [...entries].sort((a, b) => a.identifier.localeCompare(b.identifier) || a.resource.localeCompare(b.resource)),
    })
  );

  return (
    <div style={{
      padding: '28px 32px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      background: '#f5f6f8',
      minHeight: '100vh',
    }}>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: '#111827', letterSpacing: '-0.01em' }}>
          Preload Timing
        </h2>
        <div style={{ marginTop: 4, fontSize: 13, color: '#6b7280' }}>
          {allTasks.length} Tasks · {groups.length} Contributors · {xMax} ms gesamt
        </div>
      </div>

      {groups.map(({ contributorId, entries }) => {
        const color = COLORS[contributorId] ?? '#6b7280';
        return (
          <div
            key={contributorId}
            style={{
              marginBottom: 20,
              background: '#fff',
              borderRadius: 10,
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
              overflow: 'hidden',
            }}
          >
            <div style={{
              padding: '10px 20px',
              borderBottom: '1px solid #f3f4f6',
              borderLeft: `4px solid ${color}`,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              background: '#fafafa',
            }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#1f2937' }}>
                {contributorId}
              </span>
              <span style={{
                marginLeft: 'auto',
                fontSize: 11,
                color: '#9ca3af',
                background: '#f3f4f6',
                borderRadius: 12,
                padding: '2px 8px',
              }}>
                {entries.length} {entries.length === 1 ? 'Task' : 'Tasks'}
              </span>
            </div>
            <div style={{ padding: '12px 16px 8px' }}>
              <GanttChart entries={entries} globalMin={globalMin} xMax={xMax} color={color} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default PreloadTimingPage;
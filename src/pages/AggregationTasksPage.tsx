import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useReducer, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, CartesianGrid, ResponsiveContainer } from 'recharts';
import type {ContributorId} from "../preload/data/aggregation-contributor-model.ts";
import type {AggregationArtefactBase} from "../preload/data/aggregation-artefact-model.ts";
import type {AggregationTask} from "../preload/data/aggregation-log-model.ts";

interface GanttEntry {
  label: string;
  start: number;
  duration: number;
  resource: string;
  identifier: string;
  key: string;
  rowColor?: string;
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
  premiumdepot: '#10b981'
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
          <tspan x={0} dy="-0.25em" fontWeight={500} fill="#374151">
            {resource}
          </tspan>
          <tspan x={0} dy="1.4em" fontSize={10} fill="#9ca3af">
            {identifier}
          </tspan>
        </text>
      </g>
  );
}

function GanttChart({
                      entries,
                      globalMin,
                      xMax,
                      color
                    }: {
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
    rowColor: e.rowColor,
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
                color: '#374151'
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
                return tab >= 0 ? (
                    <span
                        style={{ fontWeight: 600, color: '#111827' }}
                    >{`${raw.slice(0, tab)} / ${raw.slice(tab + 1)}`}</span>
                ) : (
                    raw
                );
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
            {data.map((d, i) => {
              const base = d.rowColor ?? color;
              const fill = i === activeIndex ? base : hexWithAlpha(base, 0.75);
              return <Cell key={i} fill={fill} />;
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
  );
}

function AggregationTasksPage() {
  const queryClient = useQueryClient();
  const [, forceUpdate] = useReducer((x: number) => x + 1, 0);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [selectedKeyInput, setSelectedKeyInput] = useState('preload');
  const toggleCollapsed = (id: string) =>
      setCollapsed(prev => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        return next;
      });

  useEffect(() => {
    return queryClient.getQueryCache().subscribe(() => forceUpdate());
  }, [queryClient]);

  const allCacheQueries = queryClient.getQueryCache().getAll();

  const aggregationQueries = allCacheQueries.filter(
      q =>
          Array.isArray(q.queryKey) &&
          typeof q.queryKey[0] === 'string' &&
          (q.queryKey[0] as string).toLowerCase().startsWith('aggregation')
  );

  let filterRegex: RegExp | null = null;
  let filterRegexInvalid = false;
  try {
    filterRegex = new RegExp(selectedKeyInput, 'i');
  } catch {
    filterRegexInvalid = true;
  }

  const allDescriptors = Array.from(
      new Set(
          aggregationQueries
              .map(q => (q.state.data as AggregationArtefactBase | undefined)?.processLog?.descriptor)
              .filter((d): d is string => d !== undefined)
      )
  );

  const availableDescriptors = filterRegex === null
      ? allDescriptors
      : allDescriptors.filter(d => filterRegex!.test(d));

  const preloadQueries = filterRegex === null ? [] : aggregationQueries.filter(q => {
    const descriptor = (q.state.data as AggregationArtefactBase | undefined)?.processLog?.descriptor;
    return descriptor !== undefined && filterRegex!.test(descriptor);
  });

  console.debug('[AggregationTasksPage] cache total:', allCacheQueries.length);
  console.debug(
      '[AggregationTasksPage] preload queries found:',
      preloadQueries.length,
      preloadQueries.map(q => ({
        key: q.queryKey,
        state: q.state.status,
        hasData: q.state.data !== undefined
      }))
  );

  const allTasks: AggregationTask[] = preloadQueries.flatMap(q => {
    const data = q.state.data as AggregationArtefactBase | undefined;
    if (!data?.processLog) return [];
    return data.processLog.fetchTasks;
  });

  // processLog-Spans pro Contributor sammeln
  const processLogsByContributor = new Map<string, GanttEntry[]>();
  for (const q of preloadQueries) {
    const pl = (q.state.data as AggregationArtefactBase | undefined)?.processLog;
    if (!pl) continue;
    const contributors = new Set(pl.fetchTasks.map(t => t.contributor));
    for (const contributor of contributors) {
      const entry: GanttEntry = {
        label: pl.descriptor,
        start: pl.startMillis,
        duration: pl.endMillis - pl.startMillis,
        resource: pl.source,
        identifier: pl.descriptor,
        key: '',
        rowColor: '#94a3b8',
      };
      const existing = processLogsByContributor.get(contributor) ?? [];
      existing.push(entry);
      processLogsByContributor.set(contributor, existing);
    }
  }

  const allStarts = [
    ...allTasks.map(t => t.startMillis),
    ...Array.from(processLogsByContributor.values()).flat().map(e => e.start),
  ];
  const allEnds = [
    ...allTasks.map(t => t.endMillis),
    ...Array.from(processLogsByContributor.values()).flat().map(e => e.start + e.duration),
  ];
  const globalMin = allStarts.length > 0 ? Math.min(...allStarts) : 0;
  const globalMax = allEnds.length > 0 ? Math.max(...allEnds) : 0;
  const xMax = globalMax - globalMin;

  const byContributor = new Map<string, GanttEntry[]>();
  for (const task of allTasks) {
    const entry: GanttEntry = {
      label: `${task.identifier ?? ''} / ${task.resource}`,
      start: task.startMillis,
      duration: task.duration,
      resource: task.resource,
      identifier: task.identifier ?? '',
      key: task.key ?? ''
    };
    const existing = byContributor.get(task.contributor) ?? [];
    existing.push(entry);
    byContributor.set(task.contributor, existing);
  }

  const groups: ContributorGroup[] = Array.from(byContributor.entries()).map(
      ([contributorId, entries]) => ({
        contributorId,
        entries: [
          ...(processLogsByContributor.get(contributorId) ?? []),
          ...entries.sort((a, b) => a.identifier.localeCompare(b.identifier) || a.resource.localeCompare(b.resource)),
        ]
      })
  );

  return (
      <div
          style={{
            padding: '28px 32px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            minHeight: '100vh'
          }}
      >
        <div
            style={{
              marginBottom: 28,
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: 16
            }}
        >
          <div>
            <div style={{ marginTop: 4, fontSize: 13, color: '#6b7280' }}>
              {preloadQueries.length} {preloadQueries.length === 1 ? 'Query' : 'Queries'} ·{' '}
              {allTasks.length} Tasks · {groups.length} Contributors · {xMax} ms gesamt
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <input
                  list="query-key-options"
                  value={selectedKeyInput}
                  onChange={e => setSelectedKeyInput(e.target.value)}
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: filterRegexInvalid ? '#dc2626' : '#374151',
                    background: filterRegexInvalid ? '#fef2f2' : '#fff',
                    border: `1px solid ${filterRegexInvalid ? '#fca5a5' : '#e5e7eb'}`,
                    borderRadius: 6,
                    padding: '5px 12px',
                    width: 220,
                    outline: 'none'
                  }}
                  placeholder="Query-Filter…"
              />
              <datalist id="query-key-options">
                {availableDescriptors.map(d => (
                    <option key={d} value={d} />
                ))}
              </datalist>
            </div>
            <div style={{ width: 1, height: 20, background: '#e5e7eb' }} />
            {(['expand', 'collapse'] as const).map(action => (
                <button
                    key={action}
                    onClick={() =>
                        setCollapsed(
                            action === 'collapse' ? new Set(groups.map(g => g.contributorId)) : new Set()
                        )
                    }
                    style={{
                      fontSize: 12,
                      fontWeight: 500,
                      color: '#374151',
                      background: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: 6,
                      padding: '5px 12px',
                      cursor: 'pointer'
                    }}
                >
                  {action === 'expand' ? 'Alle aufklappen' : 'Alle einklappen'}
                </button>
            ))}
          </div>
        </div>

        {allTasks.length === 0 && (
            <div
                style={{
                  padding: '40px 24px',
                  textAlign: 'center',
                  color: '#6b7280',
                  background: '#fff',
                  borderRadius: 10,
                  border: '1px solid #e5e7eb'
                }}
            >
              <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 6, color: '#374151' }}>
                Keine Daten verfügbar
              </div>
              <div style={{ fontSize: 13 }}>Bitte zuerst Preload-Queries ausführen.</div>
            </div>
        )}

        {groups.map(({ contributorId, entries }) => {
          const color = (COLORS as Record<string, string>)[contributorId] ?? '#6b7280';
          const isCollapsed = collapsed.has(contributorId);
          return (
              <div
                  key={contributorId}
                  style={{
                    marginBottom: 20,
                    background: '#fff',
                    borderRadius: 10,
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                    overflow: 'hidden'
                  }}
              >
                <div
                    onClick={() => toggleCollapsed(contributorId)}
                    style={{
                      padding: '10px 20px',
                      borderBottom: isCollapsed ? 'none' : '1px solid #f3f4f6',
                      borderLeft: `4px solid ${color}`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      background: '#fafafa',
                      cursor: 'pointer',
                      userSelect: 'none'
                    }}
                >
              <span
                  style={{
                    fontSize: 11,
                    color: '#9ca3af',
                    lineHeight: 1,
                    transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
                    transition: 'transform 0.15s ease',
                    display: 'inline-block'
                  }}
              >
                ▾
              </span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#1f2937' }}>
                {contributorId}
              </span>
                  <span
                      style={{
                        marginLeft: 'auto',
                        fontSize: 11,
                        color: '#9ca3af',
                        background: '#f3f4f6',
                        borderRadius: 12,
                        padding: '2px 8px'
                      }}
                  >
                {entries.length} {entries.length === 1 ? 'Task' : 'Tasks'}
              </span>
                </div>
                {!isCollapsed && (
                    <div style={{ padding: '12px 16px 8px' }}>
                      <GanttChart entries={entries} globalMin={globalMin} xMax={xMax} color={color} />
                    </div>
                )}
              </div>
          );
        })}
      </div>
  );
}

export default AggregationTasksPage;

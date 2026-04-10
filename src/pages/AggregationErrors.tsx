export function AggregationErrors({ queryFilter }: { queryFilter: string }) {
  return (
    <div
      style={{
        padding: '40px 24px',
        textAlign: 'center',
        color: '#6b7280',
        background: '#fff',
        borderRadius: 10,
        border: '1px solid #e5e7eb',
        fontSize: 13,
      }}
    >
      Noch kein Inhalt. (Filter: {queryFilter})
    </div>
  );
}
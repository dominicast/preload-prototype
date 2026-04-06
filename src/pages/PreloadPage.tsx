import useAggregationPreloadQuery from "../preload/data/use-preload-aggregation-query.ts";

function PreloadPage() {
  const query = useAggregationPreloadQuery({
    includeContributors: ['kowin'],
    preloadLevel: 0
  }, true);

  return (
    <div>
      {JSON.stringify(query.data)}
    </div>
  );
}

export default PreloadPage

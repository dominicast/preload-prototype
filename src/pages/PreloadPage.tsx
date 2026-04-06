import useAggregationPreloadQuery from "../preload/data/use-preload-aggregation-query.ts";
import type {UseQueryResult} from "@tanstack/react-query";
import type {AggregationPreload} from "../preload/data/aggregation-preload-model.ts";

function PreloadPage() {
  const queryAggregation = useAggregationPreloadQuery({
    includeContributors: ['aggregation'],
    preloadLevel: 0
  }, true);
  const queryAzk = useAggregationPreloadQuery({
    includeContributors: ['azk'],
    preloadLevel: 0
  }, true);
  const queryBoil = useAggregationPreloadQuery({
    includeContributors: ['boil'],
    preloadLevel: 0
  }, true);
  const queryEbvg = useAggregationPreloadQuery({
    includeContributors: ['ebvg'],
    preloadLevel: 0
  }, true);
  const queryEliah = useAggregationPreloadQuery({
    includeContributors: ['eliah'],
    preloadLevel: 0
  }, true);
  const queryKowin = useAggregationPreloadQuery({
    includeContributors: ['kowin'],
    preloadLevel: 0
  }, true);
  const queryMortgage = useAggregationPreloadQuery({
    includeContributors: ['mortgage'],
    preloadLevel: 0
  }, true);
  const queryNils = useAggregationPreloadQuery({
    includeContributors: ['nils'],
    preloadLevel: 0
  }, true);
  const queryP40 = useAggregationPreloadQuery({
    includeContributors: ['p40'],
    preloadLevel: 0
  }, true);
  const queryPenaxa = useAggregationPreloadQuery({
    includeContributors: ['penaxa'],
    preloadLevel: 0
  }, true);
  const queryPremiumDepot = useAggregationPreloadQuery({
    includeContributors: ['premiumdepot'],
    preloadLevel: 0
  }, true);
  const queryTpc = useAggregationPreloadQuery({
    includeContributors: ['tpc'],
    preloadLevel: 0
  }, true);

  const renderPreloadQueryResult = (query: UseQueryResult<AggregationPreload>) => {
    return (
      <div>
        {JSON.stringify(query.status)}
      </div>
    );
  }

  return (
    <>
      {renderPreloadQueryResult(queryAggregation)}
      {renderPreloadQueryResult(queryAzk)}
      {renderPreloadQueryResult(queryBoil)}
      {renderPreloadQueryResult(queryEbvg)}
      {renderPreloadQueryResult(queryEliah)}
      {renderPreloadQueryResult(queryKowin)}
      {renderPreloadQueryResult(queryMortgage)}
      {renderPreloadQueryResult(queryNils)}
      {renderPreloadQueryResult(queryP40)}
      {renderPreloadQueryResult(queryPenaxa)}
      {renderPreloadQueryResult(queryPremiumDepot)}
      {renderPreloadQueryResult(queryTpc)}
    </>
  );
}

export default PreloadPage

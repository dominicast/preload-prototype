import {useQuery, type UseQueryResult} from '@tanstack/react-query';
import {
  type AggregationPreload,
  type AggregationPreloadFilter,
  aggregationPreloadSchema
} from "./aggregation-preload-model.ts";
import aggregation_data from './ressources/aggregation.json' assert { type: 'json' };
import azk_data from './ressources/azk.json' assert { type: 'json' };
import boil_data from './ressources/boil.json' assert { type: 'json' };
import ebvg_data from './ressources/ebvg.json' assert { type: 'json' };
import eliah_data from './ressources/eliah.json' assert { type: 'json' };
import kowin_data from './ressources/kowin.json' assert { type: 'json' };
import mortgage_data from './ressources/mortgage.json' assert { type: 'json' };
import nils_data from './ressources/nils.json' assert { type: 'json' };
import p40_data from './ressources/p40.json' assert { type: 'json' };
import penaxa_data from './ressources/penaxa.json' assert { type: 'json' };
import premiumdepot_data from './ressources/premiumdepot.json' assert { type: 'json' };
import tpc_data from './ressources/tpc.json' assert { type: 'json' };

export const AGGREGATION_PRELOAD_QUERY_KEY = 'AggregationPreloadFetch';

const preloadAggregationData = (
  filter: AggregationPreloadFilter
): AggregationPreload => {
  const data = (() => {
    if (filter.includeContributors.includes('aggregation')) {
      return aggregation_data;
    } else if (filter.includeContributors.includes('boil')) {
      return boil_data;
    } else if (filter.includeContributors.includes('nils')) {
      return nils_data;
    } else if (filter.includeContributors.includes('eliah')) {
      return eliah_data;
    } else if (filter.includeContributors.includes('kowin')) {
      return kowin_data;
    } else if (filter.includeContributors.includes('penaxa')) {
      return penaxa_data;
    } else if (filter.includeContributors.includes('tpc')) {
      return tpc_data;
    } else if (filter.includeContributors.includes('azk')) {
      return azk_data;
    } else if (filter.includeContributors.includes('mortgage')) {
      return mortgage_data;
    } else if (filter.includeContributors.includes('ebvg')) {
      return ebvg_data;
    } else if (filter.includeContributors.includes('p40')) {
      return p40_data;
    } else if (filter.includeContributors.includes('premiumdepot')) {
      return premiumdepot_data;
    } else {
      throw new Error('invalid filter');
    }
  })();
  return aggregationPreloadSchema.parse(data);
}

const useAggregationPreloadQuery = (
  filter: AggregationPreloadFilter,
  enabled: boolean
): UseQueryResult<AggregationPreload> => {
  return useQuery<AggregationPreload>({
    queryKey: [AGGREGATION_PRELOAD_QUERY_KEY, filter],
    queryFn: () => preloadAggregationData(filter),
    enabled: enabled,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    gcTime: Infinity
  });
};

export default useAggregationPreloadQuery;

import { z } from 'zod';
import {aggregationEntityAlias} from "./aggregation-entity-model.ts";
import {contributorIdAlias} from "./aggregation-contributor-model.ts";

/* aggregation preload */

export const aggregationPreloadSchema = z.object({
  preloadLevel: z.number(),
  fatalErrorMessage: z.string().nullish(),
  entities: z.array(aggregationEntityAlias)
});

export type AggregationPreload = z.infer<typeof aggregationPreloadSchema>;

/* aggregation preload filter */

const aggregationPreloadFilterSchema = z.object({
  includeContributors: z.array(contributorIdAlias),
  preloadLevel: z.number()
});

export type AggregationPreloadFilter = z.infer<typeof aggregationPreloadFilterSchema>;

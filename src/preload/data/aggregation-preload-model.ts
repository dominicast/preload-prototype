import { z } from 'zod';
import {contributorIdAlias} from "./aggregation-contributor-model.ts";
import {aggregationArtefactBaseSchema} from "./aggregation-artefact-model.ts";

/* aggregation preload */

export const aggregationPreloadSchema = aggregationArtefactBaseSchema.extend({
  preloadLevel: z.number(),
  fatalErrorMessage: z.string().nullish()
});

export type AggregationPreload = z.infer<typeof aggregationPreloadSchema>;

/* aggregation preload filter */

const aggregationPreloadFilterSchema = z.object({
  includeContributors: z.array(contributorIdAlias),
  preloadLevel: z.number()
});

export type AggregationPreloadFilter = z.infer<typeof aggregationPreloadFilterSchema>;

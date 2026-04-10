import { z } from 'zod';
import { aggregationEntityAlias } from './aggregation-entity-model';
import { aggregationContributorAlias } from './aggregation-contributor-model';
import { aggregationLogAlias } from './aggregation-log-model';

export const aggregationArtefactBaseSchema = z.object({
    entities: z.array(aggregationEntityAlias),
    contributors: z.array(aggregationContributorAlias),
    processLog: aggregationLogAlias.optional()
});

export type AggregationArtefactBase = z.infer<typeof aggregationArtefactBaseSchema>;

export const aggregationArtefactSchema = aggregationArtefactBaseSchema.extend({
    preloading: z.boolean()
});

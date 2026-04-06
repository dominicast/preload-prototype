import { z } from 'zod';

const ContributorIdSchema = z.union([
  z.literal('aggregation'),
  z.literal('boil'),
  z.literal('nils'),
  z.literal('eliah'),
  z.literal('kowin'),
  z.literal('penaxa'),
  z.literal('tpc'),
  z.literal('azk'),
  z.literal('mortgage'),
  z.literal('ebvg'),
  z.literal('p40'),
  z.literal('premiumdepot')
]);

export type ContributorId = z.infer<typeof ContributorIdSchema>;
export const contributorIdAlias: z.ZodType<ContributorId> = ContributorIdSchema;

export const safeParseContributorIds = (str: string | undefined): ContributorId[] => {
  if (!str) {
    return [];
  }
  return str
    .split(',')
    .map(id => id.trim())
    .map(id => {
      const parsed = ContributorIdSchema.safeParse(id);
      if (!parsed.success) {
        console.warn(`Invalid ContributorId: ${id}`);
      }
      return parsed;
    })
    .filter(parsedId => parsedId.success)
    .map(parsedId => parsedId.data!);
};

/* Aggregation contributor types */

// regular contributor

const RegularAggregationContributorSchema = z.object({
  recordType: z.literal('regular'),
  contributorKey: contributorIdAlias,
  considered: z.boolean()
});

const FailedAggregationContributorSchema = z.object({
  recordType: z.literal('failed'),
  contributorKey: contributorIdAlias,
  considered: z.string().optional(),
  reason: z.string().optional()
});

export const AggregationContributorSchema = z.union([
  RegularAggregationContributorSchema,
  FailedAggregationContributorSchema
]);

export type AggregationContributor = z.infer<typeof AggregationContributorSchema>;
export const aggregationContributorAlias: z.ZodType<AggregationContributor> =
  AggregationContributorSchema;

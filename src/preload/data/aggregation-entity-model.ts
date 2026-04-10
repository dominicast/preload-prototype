import { z } from 'zod';

export const EntityTypeEnum = z.enum([
  'NILS_3A',
  'NILS_3B',
  'EASY_INVEST',
  'PRIVATE_PENSION_BANK_ACCOUNT',
  'PRIVATE_PENSION_FIXED_INSURANCE',
  'PRIVATE_PENSION_FLEXIBLE_INSURANCE',
  'NILS_AZK',
  'NILS_PREMIUM_DEPOT',
  'HOUSEHOLD_LOCK',
  'DEPOSIT_ASSET',
  'OTHER_ASSET',
  'ACCOUNT_ASSET',
  'REAL_ESTATE_ASSET',
  'INCOME',
  'PERSON_DETAILS',
  'STATE_PENSION',
  'OCCUPATIONAL_PENSION',
  'KOWIN',
  'PENAXA',
  'P40',
  'NILS',
  'PERSON_FINANCIAL_SITUATION',
  'CONSULTANT',
  'MORTGAGE',
  'EBVG'
]);

const DisplayableAggregationEntitySchema = z.object({
  axaId: z.string(),
  label: z.string().optional(),
  type: EntityTypeEnum
});

export type DisplayableAggregationEntity = z.infer<typeof DisplayableAggregationEntitySchema>;

export const EntityReferenceSchema = DisplayableAggregationEntitySchema.extend({
  key: z.string()
});

export type EntityReference = z.infer<typeof EntityReferenceSchema>;

const RegularAggregationEntitySchema = EntityReferenceSchema.extend({
  owners: z.array(z.string().uuid()),
  considered: z.boolean()
});

/* Aggregation entity types */

// regular entity

const GeneralAggregationEntitySchema = EntityReferenceSchema.extend({
  recordType: z.literal('general')
});

// contract entity

const ContractAggregationEntityPersonValueSchema = z.object({
  personId: z.string(),
  value: z.number()
});

type ContractAggregationEntityPersonValue = z.infer<
    typeof ContractAggregationEntityPersonValueSchema
>;
const ContractAggregationEntityPersonValueAlias: z.ZodType<ContractAggregationEntityPersonValue> =
    ContractAggregationEntityPersonValueSchema;

export const ContractAggregationEntitySchema = RegularAggregationEntitySchema.extend({
  recordType: z.literal('contract'),
  lastKnownCapital: z.number().optional(),
  retirementCapital: z.number().optional(),
  retirementPension: z.number().optional(),
  disabilityCapital: z.number().optional(),
  disabilityCapitals: z.array(ContractAggregationEntityPersonValueAlias).optional(),
  disabilityPension: z.number().optional(),
  disabilityPensions: z.array(ContractAggregationEntityPersonValueAlias).optional(),
  deathCapital: z.number().optional(),
  deathCapitals: z.array(ContractAggregationEntityPersonValueAlias).optional(),
  deathPension: z.number().optional(),
  deathPensions: z.array(ContractAggregationEntityPersonValueAlias).optional(),
  capital: z.number().optional(),
  pension: z.number().optional(),
  disabled: z.boolean().optional()
});

export type ContractAggregationEntity = z.infer<typeof ContractAggregationEntitySchema>;

// failed entity

const FailedAggregationEntitySchema = EntityReferenceSchema.extend({
  recordType: z.literal('failed')
});

// entity error

const AggregationEntityErrorSchema = z.object({
  recordType: z.literal('error')
});

/* Aggregation entity */

export const AggregationEntitySchema = z.union([
  ContractAggregationEntitySchema,
  GeneralAggregationEntitySchema,
  FailedAggregationEntitySchema,
  AggregationEntityErrorSchema
]);

export type AggregationEntity = z.infer<typeof AggregationEntitySchema>;
export const aggregationEntityAlias: z.ZodType<AggregationEntity> = AggregationEntitySchema;

export type AggregationEntityType = z.infer<typeof EntityTypeEnum>;

/* Utils */

const isContractEntity = (aggregationEntity: AggregationEntity): boolean =>
    aggregationEntity.recordType === 'contract';

export const isContractEntityType = (
    aggregationEntity: AggregationEntity | undefined
): aggregationEntity is ContractAggregationEntity => {
  if (!aggregationEntity) {
    return false;
  }
  return isContractEntity(aggregationEntity);
};

export const isEntityReferenceType = (
    aggregationEntity: AggregationEntity | undefined
): aggregationEntity is AggregationEntity & EntityReference => {
  if (!aggregationEntity) {
    return false;
  }
  return ['contract', 'general', 'failed'].includes(aggregationEntity.recordType);
};

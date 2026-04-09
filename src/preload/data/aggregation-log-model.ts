import { z } from 'zod';

const aggregationFetchTaskSchema = z.object({
  contributor: z.string(),
  resource: z.string(),
  identifier: z.string().optional(),
  key: z.string().optional(),
  startMillis: z.number(),
  endMillis: z.number(),
  startInstant: z.number(),
  endInstant: z.number(),
  duration: z.number()
});

export type AggregationFetchTask = z.infer<typeof aggregationFetchTaskSchema>;
export const aggregationFetchTaskAlias: z.ZodType<AggregationFetchTask> = aggregationFetchTaskSchema;

const aggregationLogSchema = z.object({
  instantReferenceMillis: z.number(),
  fetchTasks: z.array(aggregationFetchTaskAlias)
});

export type AggregationLog = z.infer<typeof aggregationLogSchema>;
export const aggregationLogAlias: z.ZodType<AggregationLog> = aggregationLogSchema;

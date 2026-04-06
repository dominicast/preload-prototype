import { z } from 'zod';

const aggregationFetchTaskSchema = z.object({
  contributor: z.string(),
  duration: z.number(),
  endInstant: z.number(),
  key: z.string(),
  resource: z.string(),
  startInstant: z.number()
});

export type AggregationFetchTask = z.infer<typeof aggregationFetchTaskSchema>;
export const aggregationFetchTaskAlias: z.ZodType<AggregationFetchTask> = aggregationFetchTaskSchema;

const aggregationLogSchema = z.object({
  referenceInstant: z.number(),
  fetchTasks: z.array(aggregationFetchTaskAlias)
});

export type AggregationLog = z.infer<typeof aggregationLogSchema>;
export const aggregationLogAlias: z.ZodType<AggregationLog> = aggregationLogSchema;

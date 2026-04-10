import { z } from 'zod';

const aggregationTaskSchema = z.object({
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

export type AggregationTask = z.infer<typeof aggregationTaskSchema>;
export const aggregationTaskAlias: z.ZodType<AggregationTask> = aggregationTaskSchema;

const aggregationLogSchema = z.object({
  descriptor: z.string(),
  source: z.string(),
  personId: z.string(),
  pageId: z.string(),
  preloading: z.boolean(),
  startMillis: z.number(),
  endMillis: z.number(),
  instantReferenceMillis: z.number(),
  fetchTasks: z.array(aggregationTaskAlias)
});

export type AggregationLog = z.infer<typeof aggregationLogSchema>;
export const aggregationLogAlias: z.ZodType<AggregationLog> = aggregationLogSchema;

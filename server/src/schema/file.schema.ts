import { z } from 'zod';

export const fileIdSchema = z.object({
  params: z.object({
    fileId: z.string().uuid(),
  }),
});
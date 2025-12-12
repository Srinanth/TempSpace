import { z } from 'zod';

export const uploadUrlSchema = z.object({
  body: z.object({
    filename: z.string().min(1).max(255),
    sizeBytes: z.number().int().positive().max(50 * 1024 * 1024),
    mimeType: z.string().optional(),
  }),
});

export const confirmUploadSchema = z.object({
  body: z.object({
    filename: z.string().min(1),
    storagePath: z.string().min(1),
    sizeBytes: z.number().int().positive(),
    mimeType: z.string().optional(),
  }),
});

export const downloadSchema = z.object({
  params: z.object({
    fileId: z.string().uuid(),
  }),
});
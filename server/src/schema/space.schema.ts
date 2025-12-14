import { z } from 'zod';

export const updateSettingsSchema = z.object({
  body: z.object({
    public_upload: z.boolean().optional(),
    download_allowed: z.boolean().optional(),
    password_protected: z.boolean().optional(),
  }).strict(),
});

export const joinSpaceSchema = z.object({
  body: z.object({
    code: z.string().min(1).max(25),
  }),
});
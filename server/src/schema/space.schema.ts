import { z } from 'zod';

export const updateSettingsSchema = z.object({
  body: z.object({
    public_upload: z.boolean().optional(),
    download_allowed: z.boolean().optional(),
    password_protected: z.boolean().optional(),
  }).strict(),
});

export const shareLinkSchema = z.object({
  body: z.object({}), 
});
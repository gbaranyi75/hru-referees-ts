import { z } from 'zod';

export const profileUpdateSchema = z.object({
  userName: z.string()
    .min(2, 'A név legalább 2 karakter hosszú kell legyen')
    .max(100, 'A név maximum 100 karakter hosszú lehet'),
  fbUrl: z.string()
    .url('Érvényes Facebook URL-t adj meg')
    .or(z.literal(''))
    .optional(),
  instaUrl: z.string()
    .url('Érvényes Instagram URL-t adj meg')
    .or(z.literal(''))
    .optional(),
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;

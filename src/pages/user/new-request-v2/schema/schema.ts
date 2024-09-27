import z from 'zod';

export const newRequestV2Schema = z.object({
	email: z.string().email(),
});

export type NewRequestV2Schema = z.infer<typeof newRequestV2Schema>;

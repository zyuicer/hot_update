import { z } from "zod";

export const LoginOptionSchema = z.strictObject({
  username: z.string(),
  password: z.string(),
});

export type LoginSchemaType = z.infer<typeof LoginOptionSchema>;

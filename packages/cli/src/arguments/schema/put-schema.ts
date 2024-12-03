import { z } from "zod";

const PlatformType = z.literal("android").or(z.literal("ios"));
const UploadType = z.literal("dist").or(z.literal("update"));

export type PlatformType = z.infer<typeof PlatformType>;

export const PutOptionsSchema = z.strictObject({
  platform: PlatformType,
  upType: UploadType,
  name: z.string(),
});

export type PutOptionsType = z.infer<typeof PutOptionsSchema>;

import { writeFileSync } from "node:fs";
import { AndroidClient as RustAndroidClient } from "../binding";
import { CommandHandler } from ".";
import {
  PutOptionsSchema,
  PutOptionsType,
} from "../arguments/schema/put-schema";
import { AndroidClient, IosClient } from "../client";
import { resolve } from "node:path";
import { readUserInfo } from "../utils/misc";

export const putAppCommand: CommandHandler<PutOptionsType> = async argvs => {
  const parser = PutOptionsSchema.safeParse({
    platform: argvs.platform,
    upType: argvs.upType,
    name: argvs.name,
  });

  if (!parser.success) {
    process.exit(1);
  }

  const { platform, name, upType } = parser.data!;

  const client = (() => {
    switch (platform) {
      case "android":
        return new AndroidClient(name, upType);
      case "ios":
        return new IosClient(name, upType);
    }
  })();

  const result = await client.uploadDist();

  const jsonData = {
    android: {},
    ios: {},
  };

  if (client.platform === "android") {
    jsonData.android = result.data;
  } else if (client.platform === "ios") {
    jsonData.ios = result.data;
  }

  writeFileSync(
    resolve(process.cwd(), "update.json"),
    JSON.stringify(jsonData),
  );
};

export const putAppRustCommand: CommandHandler<
  PutOptionsType
> = async argvs => {
  const parser = PutOptionsSchema.safeParse({
    platform: argvs.platform,
    upType: argvs.upType,
    name: argvs.name,
  });

  const userInfo = readUserInfo();
  const client = new RustAndroidClient({
    baseUrl: process.env.UPDATE_BASE_URL!,
    name: "honn",
    isDist: true,
    userToken: userInfo.token,
  });
  await client.upload();
};
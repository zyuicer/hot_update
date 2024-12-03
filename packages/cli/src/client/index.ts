import { progressBar } from "../logger/progress-bar";
import { defineRequest, Request, RestFuiApi } from "../service";
import { PUT_APP_PATH_ENUM } from "../service/put-app/path";
import { readUserInfo, unreachable } from "../utils/misc";
import { resolve } from "node:path";
import { createReadStream, existsSync, readFileSync } from "node:fs";
import { PutOptionsType } from "../arguments/schema/put-schema";
import FormData from "form-data";
interface OssConfig {
  accessId: string;
  accessSecret: string;
  host: string;
  region: string;
}

type DistResponse = RestFuiApi<{ appKey: string; id: string }>;

abstract class Client {
  abstract request: Request;
  abstract name: string;
  abstract platform: "android" | "ios";
  abstract upType: PutOptionsType["upType"];
  abstract findDistFile(): Buffer<ArrayBufferLike>;
  async getOssConfig() {
    const result = await this.request.get<RestFuiApi<OssConfig>>({
      url: PUT_APP_PATH_ENUM.OSS_CONFIG,
    });
    return result.data;
  }

  abstract uploadDist(): Promise<DistResponse>;
  abstract uploadUpdate(): Promise<unknown>;
  getVersion(): string {
    const path = resolve(process.cwd(), "./package.json");
    if (existsSync(path)) {
      const file = readFileSync(path, { encoding: "utf-8" });
      const packageJson = JSON.parse(file) ?? {};
      return packageJson?.version ?? "0.0.0.0";
    } else {
      unreachable("Can't get version becase package.json file is not exists");
    }
  }

  createUpdateJson() {}
}

export class AndroidClient extends Client {
  request: Request;
  platform: "android";
  constructor(
    public name: string,
    public upType: PutOptionsType["upType"],
  ) {
    super();
    this.platform = "android";
    this.request = createClientRequest();
  }

  async uploadUpdate() {}

  async uploadDist() {
    //TODO: 接入阿里oss存储
    // const ossConfig = await this.getOssConfig();
    const path = resolve(
      process.cwd(),
      "./android/app/build/outputs/apk/release/app-release.apk",
    );
    const version = this.getVersion();
    const formatData = new FormData();

    formatData.append("file", createReadStream(path), {
      filename: "app-release.apk",
    });

    const result = await this.request.post<DistResponse>({
      url: `/app/${this.name}/android/${version}`,
      data: formatData,
      headers: {
        ...formatData.getHeaders(),
      },
    });

    return result;
  }

  findDistFile(): Buffer<ArrayBufferLike> {
    const path = resolve(
      process.cwd(),
      "./android/app/build/outputs/apk/release/app-release.apk",
    );
    if (existsSync(path)) {
      return readFileSync(path);
    } else {
      unreachable("Can't found release dist");
    }
  }
}

export class IosClient extends Client implements Client {
  request: Request;
  platform: "ios";
  constructor(
    public name: string,
    public upType: PutOptionsType["upType"],
  ) {
    super();
    this.platform = "ios";
    this.request = createClientRequest();
  }
  async uploadUpdate() {}
  uploadDist(): Promise<DistResponse> {
    console.error("Feature is not support");

    process.exit();
  }

  findDistFile(): Buffer<ArrayBufferLike> {
    const path = resolve(process.cwd()); // tpdo ios 的 打包文件
    if (existsSync(path)) {
      return readFileSync(path);
    } else {
      unreachable("Can't found release dist");
    }
  }
}
function createClientRequest() {
  const userInfo = readUserInfo();
  return defineRequest({
    baseURL: process.env.UPDATE_BASE_URL,
    headers: {
      Authorization: userInfo.token,
    },
    onUploadProgress: progressEvent => {
      if (progressEvent.lengthComputable) {
        const progress = (progressEvent.loaded / progressEvent.total!) * 100;
        progressBar.update(progress / 100); // 更新进度条
      }
    },
    onDownloadProgress: progressEvent => {
      if (progressEvent.lengthComputable) {
        const progress = (progressEvent.loaded / progressEvent.total!) * 100;
        progressBar.update(progress / 100); // 更新进度条
      }
    },
    interceptors: {
      requestInterceptor(req) {
        return req;
      },
      responseInterceptor(res) {
        return res.data;
      },
    },
  });
}

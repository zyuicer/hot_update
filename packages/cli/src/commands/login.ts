import { CommandHandler } from ".";
import {
  LoginOptionSchema,
  LoginSchemaType,
} from "../arguments/schema/login-schema";
import { defineRequest, RestFuiApi } from "../service";
import { LOGIN_PATH_ENUM } from "../service/login/path";
import { progressBar } from "../logger/progress-bar";
import { createUserInfo } from "../utils/misc";

function loginRequest() {
  const request = defineRequest({
    baseURL: process.env.UPDATE_BASE_URL,
    timeout: 5000,
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
      responseInterceptor(res) {
        return res.data;
      },
    },
  });

  return request;
}

export const loginCommand: CommandHandler<LoginSchemaType> = async argvs => {
  const parser = LoginOptionSchema.safeParse({
    username: argvs.username,
    password: argvs.password,
  });

  const data = parser.data;
  const request = loginRequest();

  if (!parser.success) {
    process.exit(1);
  }

  const result = await request.post<RestFuiApi<string>>({
    url: LOGIN_PATH_ENUM.LOGIN_PATH,
    data,
  });

  if (result.data) {
    createUserInfo({
      token: result.data,
    });
  }
};

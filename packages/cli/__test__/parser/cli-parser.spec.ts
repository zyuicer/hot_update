import {
  afterAll,
  beforeAll,
  describe,
  expect,
  it,
  vi,
  beforeEach,
  afterEach,
} from "vitest";
import { cliParser } from "../../src/arguments";
import { setupServer } from "msw/node";
import { http } from "msw";
import { LOGIN_PATH_ENUM } from "../../src/service/login/path";
import { defineRestFuiResponse } from "../mock/request";
import * as fs from "node:fs";
import * as misc from "../../src/utils/misc";
import { PUT_APP_PATH_ENUM } from "../../src/service/put-app/path";
import { AndroidClient } from "../../src/client/index";
const loginSuccessVi = vi.fn();
const { UPDATE_BASE_URL } = process.env;
const server = setupServer(
  http.post(
    UPDATE_BASE_URL + LOGIN_PATH_ENUM.LOGIN_PATH,
    async ({ request }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const body = (await request.json()) as any;
      if (body?.username && body?.password) {
        loginSuccessVi();
        return defineRestFuiResponse(200, "token");
      }

      return defineRestFuiResponse(403, undefined, "Can't login");
    },
  ),

  http.get(UPDATE_BASE_URL + PUT_APP_PATH_ENUM.OSS_CONFIG, () => {
    return defineRestFuiResponse(200, {
      accessId: "",
      accessSecret: "",
      host: "https://hot-update.oss-cn-hangzhou.aliyuncs.com",
      region: "oss-cn-hangzhou",
    });
  }),
);

vi.mock("fs", () => ({
  writeFileSync: vi.fn(),
}));

beforeAll(() => {
  server.listen({});
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
  vi.resetAllMocks();
});

describe("Parser cli options", () => {
  beforeEach(() => {
    loginSuccessVi.mockReset();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("Parser put command", () => {
    process.argv = ["", "", "put", "hooon", "-p", "android", "-u", "dist"];
    const readUserInfoMock = vi
      .spyOn(misc, "readUserInfo")
      .mockImplementation(async () => {
        return {
          token: "testToken",
        };
      });
    const upload = vi.fn();
    const androidClientMock = vi
      .spyOn(AndroidClient.prototype, "uploadDist")
      .mockImplementation(async () => {
        upload();
        return {
          code: 200,
          msg: "",
          data: {
            appKey: "",
            id: "",
          },
        };
      });
    cliParser();
    expect(upload).toHaveBeenCalled();
    readUserInfoMock.mockRestore();
    androidClientMock.mockRestore();
  });

  it("Parser login command", async () => {
    process.argv = ["", "", "login", "-u", "test", "-p", "test_password"];
    const writeFileSync = vi.mocked(fs.writeFileSync, true);
    cliParser();

    await vi.advanceTimersToNextTimerAsync();

    expect(loginSuccessVi).toHaveBeenCalled();
    expect(writeFileSync).toHaveBeenCalled();
  });
});

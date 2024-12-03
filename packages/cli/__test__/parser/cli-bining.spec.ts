import { describe, it } from "vitest";
import { AndroidClient } from "../../src/binding";
import { readUserInfo } from "../../src/utils/misc";

describe("Rust cli bining", () => {
  it("Android", async () => {
    const userInfo = await readUserInfo();

    const client = new AndroidClient({
      baseUrl: process.env.UPDATE_BASE_URL!,
      name: "honn",
      isDist: true,
      userToken: userInfo.token,
    });

    await client.upload();
  });
});

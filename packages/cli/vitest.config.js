import { defineConfig } from "vitest/config";
import replace from "@rollup/plugin-replace";
import dotEnv from "dotenv";

dotEnv.config();
export default defineConfig({
  test: {
    environment: "node",
    exclude: ["node_modules"],
  },
  root: __dirname,
  plugins: [
    replace({
      preventAssignment: true,
      values: {
        "process.env.UPDATE_BASE_URL": JSON.stringify(
          process.env.UPDATE_BASE_URL,
        ),
      },
    }),
  ],
});

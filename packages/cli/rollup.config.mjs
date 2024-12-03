import { defineConfig } from "rollup";
import url from "@rollup/plugin-url";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import nodeResolve from "@rollup/plugin-node-resolve";
import json from "@rollup/plugin-json";
import copy from "rollup-plugin-copy";
export default defineConfig({
  input: "./src/index.ts",
  output: [
    {
      dir: "./dist/esm",
      preserveModules: true,
      preserveModulesRoot: "src",
      format: "esm",
      extend: "mjs",
    },
  ],
  plugins: [
    nodeResolve({
      preferBuiltins: true,
    }),
    commonjs(),
    typescript(),
    json(),
    url({
      limit: 0,
      include: ["**/*.node"],
    }),
    copy({
      targets: [
        { src: "./src/binding.js", dest: "dist" }, // 将 binding.js 拷贝到 dist 目录
      ],
    }),
  ],
});

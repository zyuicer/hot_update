import { defineBuildConfig } from "unbuild";
import replace from "@rollup/plugin-replace";

export default defineBuildConfig({
  entries: [
    {
      builder: "mkdist",
      input: "./src",
      distDir: "./dist/esm",
      cleanDist: true,
      outDir: "./dist/esm",
      format: "esm",
    },
    {
      builder: "mkdist",
      input: "./src/index.ts",
      distDir: "./dist/cjs",
      outDir: "./dist/cjs",
      format: "cjs",
      ext: "cjs",
      cleanDist: true,
    },
  ],
  sourcemap: true,
  clean: true,
  declaration: true,
  failOnWarn: false,
  rollup: {
    emitCJS: true,
    cjsBridge: true,
    inlineDependencies: true,
    resolve: {
      exportConditions: ["node"],
    },
  },
  hooks: {
    "rollup:options": (ctx, options) => {
      const plugins =
        (options.plugins as { name: string }[]).filter(
          item => item.name !== "replace",
        ) || [];

      options.plugins = [
        replace({
          preventAssignment: true,
          values: {
            "process.env": JSON.stringify(process.env),
            "process.env.NODE_ENV": "develop",
          },
        }),
        ...plugins,
      ];
    },
  },
});

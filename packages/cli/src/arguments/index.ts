// import yargs from "yargs";
// import { hideBin } from "yargs/helpers";
import { putAppCommand, putAppRustCommand } from "../commands/put-app";
// import { loginCommand } from "../commands/login";

export function cliParser() {
  putAppRustCommand({});
  // const yarg = yargs(hideBin(process.argv));
  // yarg
  //   .command(
  //     "put [name]",
  //     "Put a app dist to server side ",
  //     yargs => {
  //       return yargs.positional("name", {
  //         describe: "Upload app name",
  //       });
  //     },
  //     putAppRustCommand,
  //   )
  //   .option("platform", {
  //     alias: "p",
  //     type: "string",
  //     description: "android | ios",
  //   })
  //   .option("upType", {
  //     alias: "u",
  //     type: "string",
  //     description: "dist | update",
  //   });

  // yarg
  //   .command("login", "User login service", () => {}, loginCommand)
  //   .option("username", {
  //     alias: "u",
  //     type: "string",
  //     description: "Place input username",
  //     requiresArg: true,
  //   })
  //   .option("password", {
  //     alias: "p",
  //     type: "string",
  //     description: "Place input password",
  //     requiresArg: true,
  //   });

  // yarg.parse();
}

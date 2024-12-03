import { cliParser } from "./arguments";
console.log(process.env.NODE_ENV);
function main() {
  cliParser();
}

main();
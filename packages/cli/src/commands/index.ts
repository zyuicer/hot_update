import { ArgumentsCamelCase } from "yargs";

export type CommandHandler<U = object> = (
  args: ArgumentsCamelCase<U>,
) => void | Promise<void>;

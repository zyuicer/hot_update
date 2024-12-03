import { writeFileSync, existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

interface UserInfo {
  token: string;
}
const path = resolve(__dirname, "../user_info.json");

export function createUserInfo(config: UserInfo) {
  writeFileSync(path, JSON.stringify(config));
}

export function readUserInfo(customerPath?: string): UserInfo {
  const baseUrl = customerPath || path;

  if (existsSync(baseUrl)) {
    const content = readFileSync(path, { encoding: "utf-8" });
    return JSON.parse(content);
  } else {
    unreachable();
  }
}

export function unreachable(info?: string): never {
  if (info) {
    throw new Error(`unreachable: ${info}`);
  }
  throw new Error("unreachable");
}

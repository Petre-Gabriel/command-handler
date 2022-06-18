import { User } from "../placeholders/user";

export type CommandCallback = (user: any, ...args: any[]) => any;
export type CommandFlag = string;

export interface Command {
  name: string;
  description?: string;

  callback: CommandCallback;
  flags: CommandFlag[];

  arguments: string;
}

const VALID_TYPES = ["%s", "%d", "%w", "%u"];

export function isValidType(typeName: string): boolean {
  return VALID_TYPES.includes(typeName) === true;
}

export function isTypeCompatible(text: string, type: string): boolean {
  if (!text) return false;

  switch (type) {
    case "%d":
      return !isNaN(parseInt(text));
    case "%u":
      return User.isUserOnline(text);
    case "%w":
      return text.split(" ").length === 1;
    case "%s":
      return text.length > 0;
    default:
      return false;
  }
}

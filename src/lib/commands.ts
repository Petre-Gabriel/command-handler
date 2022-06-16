export type CommandCallback = (user: any, ...args: any[]) => any;
export type CommandFlag = string;

export interface Command {
  name: string;
  description?: string;

  callback: CommandCallback;
  flags: CommandFlag[];
}

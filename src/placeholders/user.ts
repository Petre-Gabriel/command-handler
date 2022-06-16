import { CommandFlag } from "../lib/commands";

/*
 * This class is an example of how the flags property should be implemented into the Player class for any platform ( Rage:MP, Alt:V, etc. )
 */
export class User {
  name: string;
  flags: CommandFlag[];

  constructor() {
    this.name = "John Doe";
    this.flags = [];
  }

  addFlags(flagsToBeAdded: string | string[]) {
    if (typeof flagsToBeAdded === "string") this.flags.push(flagsToBeAdded);
    else this.flags.push(...flagsToBeAdded);
  }

  removeFlags(flagsToBeRemoved: string | string[]) {
    if (typeof flagsToBeRemoved === "string")
      this.flags = this.flags.filter(
        (flag: string) => flag !== flagsToBeRemoved
      );
    else
      this.flags = this.flags.filter(
        (flag: string) => !flagsToBeRemoved.includes(flag)
      );
  }
}

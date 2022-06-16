import { HandlerConfig } from "../config";
import { User } from "../placeholders/user";
import { Command, CommandCallback, CommandFlag } from "./commands";
import {
  ERROR_ALREADY_EXISTS,
  ERROR_INVALID_CONFIGURATION,
  ERROR_NOT_FOUND,
  ERROR_PERMISSION_DENIED,
  HandlerError,
} from "./error";

/*
  TODO: Add a way for developers to have custom arguments, based on the command name. ( Ex: CommandHandler.register('setadmin %u %d %s') )
  TODO: Incorporate syntax validation that goes something like this: %u<You must specify a valid user>, where the text between the <> is the error message returned by the handler.
*/
export class CommandHandler {
  commandsMap: Map<string, Command>;

  constructor() {
    // We check if the commandPrefix is set in the config file and has only one character.
    if (
      !HandlerConfig.commandPrefix ||
      HandlerConfig.commandPrefix.length !== 1
    )
      throw new HandlerError({
        message:
          "Invalid config. The 'commandPrefix' must be a single character.",
        type: ERROR_INVALID_CONFIGURATION,
      });

    //* We initiate the map of available commands.
    this.commandsMap = new Map<string, Command>();
  }

  /*
   * We get the command data and add it in the commands map only if it doesn't exist already.
   */
  register(
    commandName: string,
    callback: CommandCallback,
    requiredFlags: CommandFlag[] = []
  ) {
    if (this.commandsMap.has(commandName))
      throw new HandlerError({
        message: `Command ${commandName} already exists.`,
        type: ERROR_ALREADY_EXISTS,
      });

    //* We add the command data to the map
    this.commandsMap.set(commandName, {
      name: commandName,
      callback: callback,
      flags: requiredFlags,
    });
  }

  /*
   * This method is used to parse a message and check if it is a command.
   * If it is, it will pass it to the Handler to validate and execute the command.
   */
  parse(user: User, text: string) {
    if (!text.startsWith(HandlerConfig.commandPrefix)) return null;

    const commandName = text.split(" ")[0];
    const pureCommandName = commandName.substring(1); // We remove the prefix

    if (!this.commandsMap.has(pureCommandName))
      throw new HandlerError({
        message: `Command ${pureCommandName} not found.`,
        type: ERROR_NOT_FOUND,
      });

    this.handleCommand(user, pureCommandName, text);
  }

  /*
   * This method is used to handle the command after the parsing is done and it's a valid command.
   */
  handleCommand(user: User, pureCommandName: string, originalMessage: string) {
    const commandData = this.commandsMap.get(pureCommandName);

    if (!commandData)
      throw new HandlerError({
        message: `Command ${pureCommandName} not found.`,
        type: ERROR_NOT_FOUND,
      });

    // We check if the user has the required flags.
    if (commandData?.flags.length > 0) {
      const userFlags = user.flags || [];

      //! If a flag is missing, we throw an error.
      if (
        commandData.flags.some((flag: CommandFlag) => !userFlags.includes(flag))
      )
        throw new HandlerError({
          message: `You are not allowed to use this command.`,
          type: ERROR_PERMISSION_DENIED,
        });
    }

    //* We execute the command by getting the message args and calling the callback.
    const commandArgs = originalMessage.split(" ").slice(1); // We remove the command name, leaving only the arguments.
    commandData.callback(user, ...commandArgs);
  }
}

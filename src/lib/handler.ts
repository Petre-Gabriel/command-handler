import { HandlerConfig } from "../config";
import { User } from "../placeholders/user";
import {
  Command,
  CommandCallback,
  CommandFlag,
  isTypeCompatible,
  isValidType,
} from "./commands";
import {
  ERROR_ALREADY_EXISTS,
  ERROR_INVALID_CONFIGURATION,
  ERROR_INVALID_SYNTAX,
  ERROR_NOT_FOUND,
  ERROR_PERMISSION_DENIED,
  ERROR_UNEXPECTED,
  HandlerError,
} from "./error";
import { SyntaxParamsRegex } from "./params";

/*
  TODO: Add a way for developers to have custom arguments, based on the command name. ( Ex: CommandHandler.register('setadmin %u %d %s') )
  TODO: Incorporate syntax validation that goes something like this: %u<You must specify a valid user>, where the text between the <> is the error message returned by the handler.
*/
export class CommandHandler {
  private commandsMap: Map<string, Command>;

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
    commandData: string, // the full command with parameters
    callback: CommandCallback,
    requiredFlags: CommandFlag[] = []
  ) {
    const splitCommand = commandData.split(" ");

    const commandName = splitCommand[0];
    const commandArguments = splitCommand.slice(1).join(" ");

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
      arguments: commandArguments,
    });
  }

  /*
   * This method is used to parse a message and check if it is a command.
   * If it is, it will pass it to the Handler to validate and execute the command.
   */
  parse(user: User, text: string) {
    // We return out if the text doesn't start with the predefined command prefix.
    if (!text.startsWith(HandlerConfig.commandPrefix)) return null;

    const commandName = text.split(" ")[0];
    const pureCommandName = commandName.substring(1); // We remove the prefix

    if (!this.commandsMap.has(pureCommandName)) {
      if (HandlerConfig.showCommandNotFound)
        throw new HandlerError({
          message: `Command ${pureCommandName} not found.`,
          type: ERROR_NOT_FOUND,
        });
      else return null;
    }
    this.handleCommand(user, pureCommandName, text);
  }

  /*
   * This method is used to handle the command after the parsing is done and it's a valid command.
   */
  protected handleCommand(
    user: User,
    pureCommandName: string,
    originalMessage: string
  ) {
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

    /*
     * Here we validate the syntax of the command.
     */
    let commandArgs = originalMessage.split(" ").slice(1); // We remove the command name, leaving only the arguments. -> Sent by the player

    const MatchingGroups = commandData.arguments.matchAll(SyntaxParamsRegex);

    //* We validate each matched syntax group against the command arguments sent by the player.
    let currentArgId = 0;
    for (const match of MatchingGroups) {
      const MatchedType = match[1]; // Ex. %s %d
      const MatchedErrorMessage = match[2]; // Ex. <You are not allowed to do this!>

      // If the developer provides for example, %k, we throw an error because we don't support that. Check the README for the available syntax checkers.
      if (!isValidType(MatchedType))
        throw new HandlerError({
          message: `Invalid type check for ${MatchedType} @ ${commandData.name} Command.`,
          type: ERROR_UNEXPECTED,
        });

      // We check if it's a string so we can join the remaining arguments together.
      if (MatchedType === "%s") {
        const remainingArgs = commandArgs.slice(currentArgId);

        if (remainingArgs.length === 0)
          throw new HandlerError({
            message: MatchedErrorMessage,
            type: ERROR_INVALID_SYNTAX,
          });

        const joinedArgs = remainingArgs.join(" ");

        commandArgs = commandArgs.slice(0, currentArgId);
        commandArgs.push(joinedArgs);

        break;
      }

      const MatchedArgument = commandArgs[currentArgId];

      if (!isTypeCompatible(MatchedArgument, MatchedType))
        throw new HandlerError({
          message: MatchedErrorMessage,
          type: ERROR_INVALID_SYNTAX,
        });

      currentArgId += 1;
    }

    //* We execute the command by getting the message args and calling the callback.
    commandData.callback(user, ...commandArgs);
  }
}

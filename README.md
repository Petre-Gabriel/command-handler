# General Command Handler

A generic command handler for platforms like RAGE:MP / ALT:V. It contains a basic handler with support for flags validation ( for permissions ) and syntax validation with custom messages.

Everything you need to get started is located in the `src` folder. You can modify it's configuration in the `src/config.ts`.

## How to get started

If you want to incorporate the handler in your project, you will need to replace the user placeholder with the platform specific type. The user placeholder is used only in the `src/lib/handler.ts` file.

If you need further assistance with this, you can contact me on discord @ `Gabriel03#3616`.

### Command parameters

- %s - a full sentence that is not sensitive to white spaces. WARNING: this should be the last parameter in a command because it takes the remaining text as a single argument sent to the callback

- %w - only one word ( sensitive to white spaces )

- %d - a number

- %u - a user -> it checks if the user is online

### Example

```js
// We import the CommandHandler from the source
import { CommandHandler } from "./src";

// We initiate a new command handler.
const GameCommandHandler = new CommandHandler();

GameCommandHandler.register(
  "wishper",
  () => {
    //bla bla
  },
  ["LOGGED_IN"]
); /* The user can use the whisper command only if he has the LOGGED_IN flag. */

GameCommandHandler.register(
  "ping %d<You need to specify the admin level> %u<The user you provided is not online> %s<You must give a reason for the promotion> %d<Test>",
  (user, adminLevel, userName, reason) => {
    console.log(
      `${user.name} has promoted ${userName} to admin level ${adminLevel}, reason: ${reason}`
    );
  },
  ["LOGGED_IN", "ADMIN"]
);
// Before the validation, the user flags are checked against the flags provided. If they are missing flags, the command won't run.
```

### How to handle errors

My command handler uses a custom Error class called `HandlerError` that you can import from `src/lib/error.ts`. You have 2 properties that you will need to use when catching errors on the `parse` method of the `CommandHandler`: `type` and `message`. You can check the types in the `error.ts` file.

These are the following errors and their explanation:

- ERROR_INVALID_CONFIGURATION - This error is thrown when the config file or a config property is invalid.

- ERROR_PERMISSION_DENIED - This error is thrown when the user doesn't have the required permissions to execute the command. ( user doesn't have all the required flags )

- ERROR_ALREADY_EXISTS - This error is thrown when the command already exists.

- ERROR_INVALID_SYNTAX - This error is thrown when the syntax of the command is invalid.

- ERROR_UNEXPECTED - This error is thrown when an unexpected error occurs.

- ERROR_NOT_FOUND - This error is thrown when the command is not found.

All of these errors are exported from the `error.ts` file.

The second parameter, `message`, should be used by the developer to display the message. Based on the error, it can display your validation error or a predefined text.

Here is an example of how to parse and catch errors. \* Instead of the Platform variable you should use the specific variable that has an event listener method ( Ex. Rage:MP uses mp.events.add )

```js
import { CommandHandler } from "./src";
import { HandlerError, ERROR_UNEXPECTED } from "./src/lib/error";

const GameCommandHandler = new CommandHandler();

Platform.on(`playerChat`, (player, text) => {
  try {
    GameCommandHandler.parse(player, text);
  } catch (e) {
    if (e instanceof HandlerError) {
      if (e.type !== ERROR_UNEXPECTED) player.sendMessage(e.message);
    }
  }
});
```

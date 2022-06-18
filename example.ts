import { CommandHandler } from "./src";
import { HandlerError } from "./src/lib/error";
import { User } from "./src/placeholders/user";

/*
Here is an example of how to use the handler.
*/

const GameCommandHandler = new CommandHandler();

GameCommandHandler.register("wishper", () => {}, [
  "LOGGED_IN",
]); /* The user can use the whisper command only if he has the LOGGED_IN flag. */

GameCommandHandler.register(
  "ping %d<You need to specify the admin level> %u<The user you provided is not online> %s<You must give a reason for the promotion>",
  (user, adminLevel, userName, reason) => {
    console.log(
      `${user.name} has promoted ${userName} to admin level ${adminLevel}, reason: ${reason}`
    );
  },
  ["LOGGED_IN", "ADMIN"]
);

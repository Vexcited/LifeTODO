import type { APIEvent } from "@solidjs/start/server";
import { readUser } from "~/server/auth";
import { error, handleError } from "~/server/error";
import { User } from "~/database/User";

export async function GET ({ request }: APIEvent) {
  try {
    const user = await readUser(request);

    if (!user.writer) {
      return error("user is not a writer.", 403);
    }

    const users = await User.find();
    return users.map(user => ({
      id: user.id,
      writer: user.writer,
      username: user.username,
      displayName: user.displayName
    }))
  }
  catch (e) {
    return handleError(e);
  }
}

import type { APIEvent } from "@solidjs/start/server";
import { User } from "~/database/User";
import { readUserToken } from "~/server/auth";
import { connectDatabase } from "~/server/database";
import { handleError } from "~/server/error";

export async function DELETE ({ request }: APIEvent) {
  try {
    const payload = readUserToken(request);
    await connectDatabase();

    await User.findByIdAndDelete(payload.id);

    return { success: true };
  }
  catch (e) {
    handleError(e);
  }
}

import type { APIEvent } from "@solidjs/start/server";
import { User } from "~/database/User";
import { readUserToken } from "~/server/auth";
import { connectDatabase } from "~/server/database";
import { handleError } from "~/server/error";

export async function PUT ({ request }: APIEvent) {
  try {
    const payload = readUserToken(request);
    await connectDatabase();

    const json = await request.json() as { displayName: string }
    await User.findByIdAndUpdate(payload.id, { displayName: json.displayName });

    return { success: true };
  }
  catch (e) {
    handleError(e);
  }
}

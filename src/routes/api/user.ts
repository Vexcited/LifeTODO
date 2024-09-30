import type { APIEvent } from "@solidjs/start/server";
import { connectDatabase } from "~/server/database";
import { User } from "~/database/User";
import { readUserToken } from "~/server/auth";

export type UserResponse = {
  id: string
  username: string
  displayName: string
  writer: boolean
}

export async function GET ({ request }: APIEvent) {
  const payload = readUserToken(request);
  await connectDatabase();

  const user = await User.findById(payload.id);
  
  if (!user) {
    return new Response("user not found.", { status: 404 });
  }

  return {
    id: user.id,
    username: user.username,
    displayName: user.displayName || "",
    writer: user.writer
  };
}

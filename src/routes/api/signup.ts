import type { APIEvent } from "@solidjs/start/server";
import { connectDatabase } from "~/server/database";
import { User } from "~/database/User";
import { sign } from "~/server/jwt";
import { error } from "~/server/error";
import { checkSignupRights, readSignedUsername } from "~/server/auth";
import bcrypt from "bcryptjs";

export type SignupResponse = { token: string }

export async function POST ({ request }: APIEvent) {
  const { password, displayName } = await request.json() as {
    password: string,
    displayName: string
  }

  if (password.length < 8) {
    return error("your password length must be at least 8 characters.", 400);
  }
  
  const username = readSignedUsername(request);
  await connectDatabase();

  const { canSignup, willBeWriter } = await checkSignupRights();
  if (!canSignup) {
    return error("signup is not allowed.", 403);
  }

  const user = await User.create({
    username,
    password: await bcrypt.hash(password, 10),
    writer: willBeWriter,
    displayName: displayName.trim() || null,
  });

  return { token: sign({ username, id: user.id }) };
}

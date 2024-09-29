import type { APIEvent } from "@solidjs/start/server";
import { connectDatabase } from "~/server/database";
import { User } from "~/database/User";
import { sign } from "~/server/jwt";
import { error } from "~/server/error";
import bcrypt from "bcryptjs";
import { readSignedUsername } from "~/server/auth";

export type LoginResponse = { token: string }

export async function POST ({ request }: APIEvent) {
  const { password } = await request.json() as {
    password: string
  }
  
  const username = readSignedUsername(request);
  await connectDatabase();

  const user = await User.findOne({ username });
  const encryptedPassword = user!.password;

  const isPasswordMatching = await bcrypt.compare(password, encryptedPassword)
  if (!isPasswordMatching) {
    return error("password is incorrect.", 400);
  }

  return { token: sign({ username, id: user!.id }) };
}

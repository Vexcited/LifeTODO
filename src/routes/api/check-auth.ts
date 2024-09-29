import type { APIEvent } from "@solidjs/start/server";
import { connectDatabase } from "~/server/database";
import { User } from "~/database/User";
import { sign } from "~/server/jwt";
import { checkSignupRights } from "~/server/auth";

export type CheckAuthResponse = { signedUsername: string } & ({
  exists: true
} | {
  exists: false
  canSignup: boolean
  willBeWriter: boolean
})

export async function POST ({ request }: APIEvent) {
  let { username } = await request.json() as { username?: string }
  username = username?.trim();

  if (!username) {
    return new Response("username is not provided.", { status: 400 });
  }

  await connectDatabase();

  // check if user exists
  const user = await User.findOne({ username });
  const signedUsername = sign({ username });

  if (user) {
    // proceed to ask for password in frontend
    return { exists: true, signedUsername };
  }
  else {
    const { canSignup, willBeWriter } = await checkSignupRights();

    return {
      exists: false,
      canSignup, 
      willBeWriter,
      signedUsername
    };
  }
}

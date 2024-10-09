import type { APIEvent } from "@solidjs/start/server";
import { User } from "~/database/User";
import { readUser } from "~/server/auth";
import { error, handleError } from "~/server/error";
import bcrypt from "bcryptjs";

export async function POST ({ request }: APIEvent) {
  try {
    // 1. check if current password is correct.

    const user = await readUser(request, true);
    let encryptedPassword = user.password!;

    const json = await request.json() as { 
      currentPassword: string;
      newPassword: string;
    }

    const isPasswordMatching = await bcrypt.compare(json.currentPassword, encryptedPassword)
    if (!isPasswordMatching) {
      return error("password is incorrect.", 400);
    }

    // 2. generate a new password for user.

    if (json.newPassword.length < 8) {
      return error("your password length must be at least 8 characters.", 400);
    }

    encryptedPassword = await bcrypt.hash(json.newPassword, 10);

    // 3. update user's password.
    
    await User.findByIdAndUpdate(user.id, { password: encryptedPassword });
    return { success: true };
  }
  catch (e) {
    handleError(e);
  }
}

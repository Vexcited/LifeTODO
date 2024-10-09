import type { APIEvent } from "@solidjs/start/server";
import { readUser } from "~/server/auth";
import { handleError } from "~/server/error";

export type UserResponse = {
  id: string
  username: string
  displayName: string
  writer: boolean
}

export async function GET({ request }: APIEvent) {
  try {
    return readUser(request);
  }
  catch (e) {
    handleError(e);
  }
}

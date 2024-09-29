import { User } from "~/database/User";
import { readBearer } from "./bearer";
import { error } from "./error";
import { verify } from "./jwt";

export const checkSignupRights = async () => {
  const amountOfUsers = await User.countDocuments();

  let canSignup = true; // TODO : make this a property in DB
  const willBeWriter = amountOfUsers === 0;

  // allow signup only when there are no users
  // (so writer can be the first user)
  if (!canSignup && willBeWriter) {
    canSignup = true;
  }

  return { canSignup, willBeWriter };
};

export const readSignedUsername = (request: Request): string => {
  const signedUsername = readBearer(request);
  if (!signedUsername) {
    throw error("username token is not provided.", 400);
  }

  const payload = verify(signedUsername);
  if (!payload) {
    throw error("username token is invalid.", 400);
  }

  // we don't have to check if username already exists
  // in database since we already checked it in check-auth endpoint
  // and we're using the same token to read the checked username.
  return payload.username;
}
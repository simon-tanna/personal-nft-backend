import { Request, Response } from "express";
import { CreateAuthSessionInput } from "../schema/auth.schema";
import { signAccessToken, signRefreshToken } from "../service/auth.service";
import { findUserByEmail } from "../service/user.service";

// this exists solely to manage authentication protocols
export const createAuthSessionHandler = async (
  req: Request<{}, {}, CreateAuthSessionInput>,
  res: Response
) => {
  const message = "Invalid email or password";
  const { email, password } = req.body;
  const user = await findUserByEmail(email);
  if (!user) {
    return res.send(message);
  }

  if (!user.isVerified) {
    return res.send("Please verify your email address");
  }
  // validatePassord is the method to check that the password is correct.
  // it is part of the user model
  const isValid = await user.validatePassword(password);

  if (!isValid) {
    return res.send(message);
  }

  // use methods in auth.service to sign an access token
  const accessToken = signAccessToken(user);

  // use methods in auth.service to sign a refresh token

  const refreshToken = await signRefreshToken({ userId: user._id });

  // send the tokens
  return res.send({ accessToken, refreshToken });
};

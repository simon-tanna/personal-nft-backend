import { Request, Response } from "express";
import { CreateAuthSessionInput } from "../schema/auth.schema";
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

  const isValid = await user.validatePassword(password);
};
``
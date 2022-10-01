import { Request, Response } from "express";
import { nanoid } from "nanoid";
import {
  CreateUserInput,
  ForgottenPasswordInput,
  VerifyUserInput,
} from "../schema/user.schema";
import {
  createUser,
  findUserByEmail,
  findUserById,
} from "../service/user.service";
import log from "../utils/logger";
import sendEmail from "../utils/mailer";

export const createUserHandler = async (
  req: Request<{}, {}, CreateUserInput>,
  res: Response
) => {
  const body = req.body;
  try {
    const user = await createUser(body);
    // body is invoked as the input param from createUser
    await sendEmail({
      to: user.email,
      from: "test@example.com",
      subject: "Verify your email",
      text: `verification code: ${user.verificationCode}. Id: ${user._id}`,
    });

    return res.send("User successfully created");
  } catch (e: any) {
    // returns error if email is not unique
    if (e.code === 11000) {
      return res.status(409).send("Account already exists");
    }
    return res.status(500).send(e.message);
  }
};

// function that handles verification code returned to user
export const verifyUserHandler = async (
  req: Request<VerifyUserInput>,
  res: Response
) => {
  const id = req.params.id;
  const verificationCode = req.params.verificationCode;

  //find by id
  const user = await findUserById(id);

  if (!user) {
    return res.send("User not verified");
  }
  // check to see if user is already verified.
  if (user.isVerified) {
    return res.send("User is already verified");
  }
  // check to see if verification code matches
  if (user.verificationCode === verificationCode) {
    user.isVerified = true;
    await user.save();

    return res.send("User Verified!");
  }

  return res.send("User could not be verified");
};

export const forgottenPasswordHandler = async (
  req: Request<{}, {}, ForgottenPasswordInput>,
  res: Response
) => {
  const message: string =
    "If you have registered with that email address, you will receive a password reset email shortly";

  const { email } = req.body;

  // from user service
  const user = await findUserByEmail(email);

  if (!user) {
    log.debug(`User with email address ${email} does not exist`);
    return res.send(message);
  }

  if (!user.isVerified) {
    return res.send("User is not verified");
  }

  const passwordResetCode = nanoid();

  user.passwordResetCode = passwordResetCode;

  await user.save();

  // send an email to the user with their password reset code
  await sendEmail({
    to: user.email,
    from: "simon@test.com",
    subject: "Password Reset",
    text: `Password reset code: ${passwordResetCode}. Id: ${user._id}`,
  });

  log.debug(`Password reset sent to ${user.email}`);

  return res.send(message);
};

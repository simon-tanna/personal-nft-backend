import { Request, Response } from "express";
import { CreateUserInput, VerifyUserInput } from "../schema/user.schema";
import { createUser, findUserById } from "../service/user.service";
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

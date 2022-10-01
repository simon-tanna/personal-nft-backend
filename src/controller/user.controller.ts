import { Request, Response } from "express";
import { CreateUserInput } from "../schema/user.schema";
import { createUser } from "../service/user.service";
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

    // await sendEmail({
    //   to: user.email,
    //   from: "test@email.com",
    //   subject: "Please verify your account",
    //   text: `Verification Code: ${user.verificationCode}`,
    // });

    return res.send("User successfully created");
  } catch (e: any) {
    // returns error if email is not unique
    if (e.code === 11000) {
      return res.status(409).send("Account already exists");
    }
    return res.status(500).send(e.message);
  }
};

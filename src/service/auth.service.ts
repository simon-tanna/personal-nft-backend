import { DocumentType } from "@typegoose/typegoose";
import { omit } from "lodash";
import AuthSessionModel from "../model/authSession.model";
import { privateFields, User } from "../model/user.model";
import { signJwt } from "../utils/jwt";

export const createAuthSession = async ({ userId }: { userId: string }) => {
  return AuthSessionModel.create({ user: userId });
};

export const signRefreshToken = async ({ userId }: { userId: string }) => {
  const session = await createAuthSession({ userId });

  // sign refresh token that references this session
  const refreshToken = signJwt(
    { session: session._id },
    "refreshTokenPrivateKey",
    { expiresIn: "1y" }
  );

  return refreshToken;
};

export const signAccessToken = (user: DocumentType<User>) => {
  // convert user to plain json object
  const payload = omit(user.toJSON(), privateFields);

  const accessToken = signJwt(payload, "accessTokenPrivateKey", {
    expiresIn: "20m",
  });

  return accessToken;
};

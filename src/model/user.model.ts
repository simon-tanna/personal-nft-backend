import {
  getModelForClass,
  modelOptions,
  prop,
  Severity,
  pre,
  DocumentType,
} from "@typegoose/typegoose";
// argon is a nice alternative to bcrypt
import argon2 from "argon2";
// import { nanoid } from "nanoid";
import log from "../utils/logger";

// <User> class is set to get type validation in pre async function
@pre<User>("save", async () => {
  // checking if password has been modified
  if (!this.isModified("password")) {
    return;
  }
  // creates hashed password
  const hash = await argon2.hash(this.password);
  // resolves password to hash on login
  this.password = hash;

  return;
})
// Set model options
@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
  options: {
    // This is set due to the password reset code being nullable
    allowMixed: Severity.ALLOW,
  },
})
export class User {
  @prop({ lowercase: true, required: true, unique: true })
  email: string;

  @prop({ required: true })
  password: string;

  @prop({ required: true, default: () => nanoid() })
  verificationCode: string;

  @prop()
  passwordResetCode: string | null;

  @prop({ default: false })
  verifiedStatus: boolean;

  // candidatePassword is the password tested against the user password
  async validatePassword(this: DocumentType<User>, candidatePassword: string) {
    try {
      return await argon2.verify(this.password, candidatePassword);
    } catch (e) {
      log.error(e, "Password couldn't be validated");
      return false;
    }
  }
}

const UserModel = getModelForClass(User);

export default UserModel;

import {
  getModelForClass,
  modelOptions,
  prop,
  Ref,
} from "@typegoose/typegoose";
import { User } from "./user.model";

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class AuthSession {
  // the ref prop is a function that returns the User class
  @prop({ ref: () => User })
  // referencing the User class
  user: Ref<User>;

  @prop({ default: true })
  valid: boolean;
}

const AuthSessionModel = getModelForClass(AuthSession);

export default AuthSessionModel;

import UserModel, { User } from "../model/user.model";

// Partial<User> defines that input will be using some of the inputs from the User interface
export const createUser = (input: Partial<User>) => {
  return UserModel.create(input);
};

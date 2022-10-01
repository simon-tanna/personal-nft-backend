import UserModel, { User } from "../model/user.model";

// Partial<User> defines that input will be using some of the inputs from the User interface
export const createUser = (input: Partial<User>) => {
  return UserModel.create(input);
};

// This is invoked in the verifyUserHandler function in the controller
export const findUserById = (id: string) => {
  return UserModel.findById(id);
};

// This is invoked in the forgottenPasswordHandler function in the controller
export const findUserByEmail = (email: string) => {
  return UserModel.findOne({ email });
};

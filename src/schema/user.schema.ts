import { object, string, TypeOf } from "zod";

export const createUserSchema = object({
  body: object({
    email: string({
      required_error: "Email is required",
    }).email("Please enter a valid email"),
    password: string({
      required_error: "Email is required",
    }).min(8, "Password must be at least 8 characters"),
    passwordConfirmation: string({
      required_error: "Password Confirmation Required",
    }),
    // check that both password inputs match
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords must match",
    // defines path of information that is not matching
    path: ["passwordConfirmation"],
  }),
});

export type CreateUserInput = TypeOf<typeof createUserSchema>["body"];

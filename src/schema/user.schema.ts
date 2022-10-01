import { object, string, TypeOf } from "zod";

export const createUserSchema = object({
  body: object({
    email: string({
      required_error: "Email is required",
    }).email("Please enter a valid email"),
    password: string({
      required_error: "Password is required",
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

export const verifyUserSchema = object({
  params: object({
    id: string(),
    verificationCode: string(),
  }),
});

export const forgottenPasswordSchema = object({
  body: object({
    email: string({
      required_error: "Email is required",
    }).email("That is not a valid email address"),
  }),
});

export const resetPasswordSchema = object({
  params: object({
    id: string(),
    passwordResetCode: string(),
  }),
  body: object({
    password: string({
      required_error: "Password is required",
    }).min(8, "Password must be at least 8 characters"),
    passwordConfirmation: string({
      required_error: "Password Confirmation Required",
    }),
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords must match",
    // defines path of information that is not matching
    path: ["passwordConfirmation"],
  }),
});

export type CreateUserInput = TypeOf<typeof createUserSchema>["body"];

export type VerifyUserInput = TypeOf<typeof verifyUserSchema>["params"];

export type ForgottenPasswordInput = TypeOf<
  typeof forgottenPasswordSchema
>["body"];

// This schema has both body and params
export type ResetPasswordInput = TypeOf<typeof resetPasswordSchema>;

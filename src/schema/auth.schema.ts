import { object, string, TypeOf } from "zod";

export const createAuthSessionSchema = object({
  body: object({
    email: string({ required_error: "email is required" }).email(),
    password: string({ required_error: "password is required" }).min(
      8,
      "Invalid email or password"
    ),
  }),
});

export type CreateAuthSessionInput = TypeOf<
  typeof createAuthSessionSchema
>["body"];

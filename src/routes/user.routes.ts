import express from "express";
import {
  createUserHandler,
  forgottenPasswordHandler,
  verifyUserHandler,
} from "../controller/user.controller";
import validateResource from "../middleware/validateResource";
import {
  createUserSchema,
  forgottenPasswordSchema,
  verifyUserSchema,
} from "../schema/user.schema";

const router = express.Router();

// validateResource invokes the function that returns the parsing of the schema
// createUserHandler makes sure that the body of the request is to be exactly what it should be
router.post(
  "/api/users",
  validateResource(createUserSchema),
  createUserHandler
);

router.post(
  "/api/users/verify/:id/:verificationCode",
  validateResource(verifyUserSchema),
  verifyUserHandler
);

router.post(
  "/api/users/forgotPassword",
  validateResource(forgottenPasswordSchema),
  forgottenPasswordHandler
);

export default router;

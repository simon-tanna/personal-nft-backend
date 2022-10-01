import express from "express";
import {
  createUserHandler,
  verifyUserHandler,
} from "../controller/user.controller";
import validateResource from "../middleware/validateResource";
import { createUserSchema, verifyUserSchema } from "../schema/user.schema";

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

export default router;

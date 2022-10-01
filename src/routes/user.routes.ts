import express from "express";
import { createUserHandler } from "../controller/user.controller";
import validateResource from "../middleware/validateResource";
import { createUserSchema } from "../schema/user.schema";

const router = express.Router();

// validateResource invokes the function that returns the parsing of the schema
// createUserHandler makes sure that the body of the request is to be exactly what it should be
router.post(
  "/api/users",
  validateResource(createUserSchema),
  createUserHandler
);

export default router;

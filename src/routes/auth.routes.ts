import express from "express";
import { createAuthSessionHandler } from "../controller/auth.controller";
import validateResource from "../middleware/validateResource";
import { createAuthSessionSchema } from "../schema/auth.schema";

const router = express.Router();

router.post(
  "/api/sessions",
  validateResource(createAuthSessionSchema),
  createAuthSessionHandler
);

export default router;

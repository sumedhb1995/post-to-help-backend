import express, { NextFunction } from "express";

import * as controller from "./controller";

export const userRouter = express.Router();

/** GET /api/users */
userRouter.route("/getScores").post(controller.find);

import express from "express";

import { userRouter } from "./users";

export const services = express.Router();

services.use((req, res, next) => {
  console.log("Request Type:", req.method);
  console.log("Time:", Date.now());
  console.log("Path:", req.path);
  next();
});

services.use("/users", userRouter);

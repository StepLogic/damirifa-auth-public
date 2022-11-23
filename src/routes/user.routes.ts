import { responseBody } from "./../interfaces/index";
import { Router, Request, Response } from "express";
import statusCodes from "@lib/statusCodes";
import {
  confirmEmailVerification,
  confirmMobileVerification,
  loginUser,
  registerUser,
  sendEmailVerification,
  sendMobileVerification,
} from "src/controller/user.controller";
import path from "path";
const userRoutes = (router: Router, rootDir: string) => {
  router.get("/status", (req: Request, res: Response) => {
    const payload: responseBody = {
      statusCode: statusCodes.GET_SUCCESS,
      payload: { hello: "" },
    };
    res.status(statusCodes.GET_SUCCESS).send(payload);
  });
  router.post("/login", async (req: Request, res: Response) => {
    const reqBody = req.body;
    const response = await loginUser(reqBody);
    if (response) {
      res.status(response.statusCode).send({ ...response });
    }
  });
  router.post("/register", async (req: Request, res: Response) => {
    const reqBody = req.body;
    const response = await registerUser(reqBody);
    if (response) {
      res.status(response.statusCode).send({ ...response });
    }
  });
  router.post("/confirm-otp", async (req: Request, res: Response) => {
    const reqBody = req.body;
    const response = await confirmMobileVerification(reqBody);
    if (response) {
      res.status(response.statusCode).send({ ...response });
    }
  });
  router.post("/verify-phone", async (req: Request, res: Response) => {
    const reqBody = req.body;
    const response = await sendMobileVerification(reqBody);
    if (response) {
      res.status(response.statusCode).send({ ...response });
    }
  });
  router.post("/verify-email", async (req: Request, res: Response) => {
    const reqBody = req.body;
    const response = await sendEmailVerification(reqBody);
    if (response) {
      res.status(response.statusCode).send({ ...response });
    }
  });
  router.get("/confirm-email", async (req: Request, res: Response) => {
    const reqBody = req.params;
    const response = await confirmEmailVerification(reqBody);
    if (response.statusCode === statusCodes.POST_SUCCESS) {
      res.sendFile(path.join(__dirname, `${rootDir}/failed.html`));
    } else {
      res.sendFile(path.join(__dirname, `${rootDir}/success.html`));
    }
  });
};
export = userRoutes;

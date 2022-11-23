import express, { Express, Request, Response } from "express";

import dotenv from "dotenv";
import userRoutes from "@routes/user.routes";
import path from "path";
const bodyParser = require("body-parser");

// support parsing of application/json type post data
// import userRoutes from "@routes/user.routes";
dotenv.config();
// const router: Router = require("express").Router();
const app: Express = express();
const port = process.env.PORT;

app.use(bodyParser.json());
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));
userRoutes(app, path.join(__dirname, `html`));
app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});

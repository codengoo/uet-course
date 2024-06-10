import { Express } from "express";
import BaseRouter from "./base";

export default function route(app: Express) {
    app.use("/base", BaseRouter);
}
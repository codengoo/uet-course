import { Request, Response, Router } from "express";

const BaseRouter = Router();

BaseRouter.get("/", (req: Request, res: Response) => {
    const { statusCode, contentType } = req.query;

    switch (statusCode) {
        case "200":
            if (contentType === "text/plain") {
                res.status(200).send("OK: " + JSON.stringify({ statusCode, contentType }))
            } else {
                res.status(200).json({ statusCode, contentType })
            }
            break;
        default:
            res.status(Number(statusCode)).json({ statusCode, contentType })
            break;
    }
})

export default BaseRouter;
import express from "express";
import morgan from "morgan";
import route from "./routes";

const app = express();
const port = 9000;

app.disable('etag');
app.use(morgan("dev"))
route(app)

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
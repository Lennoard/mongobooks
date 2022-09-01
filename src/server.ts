import express from "express";
import { Response } from "express";
import { LogMiddleware } from "./core/middlewares/log-middleware";
import routes from "./routes";

const app = express();
const port = 3007;

app.use(express.json());
app.use(LogMiddleware);
app.use(routes);

app.get("/", (_, response: Response) => {
  response.status(200).send("<h1>Book reading</h1>");
});

app.listen(port, () => {
  console.log(`Starting at http://localhost:${port}`);
});

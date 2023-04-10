import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { gptService } from "./services/gptService";

export type Message = {
  role: string;
  content: string;
}

const app = express();
app.use(bodyParser.json());

let messages: Message[] = [];

app.post("/write", (req: Request, res: Response) => {
  const { style, message } = req.body;
  messages.push(
    { role: "system", content: style },
    { role: "user", content: message }
  );
  gptService(res, messages);
});

// app.post("/image", (req: Request, res: Response) => {
//   const { prompt } = req.body;
//   openai
//     .createImage({
//       prompt,
//       n: 1,
//       size: "1024x1024",
//     })
//     .then((data) => {
//       res.send(data.data.data[0].url);
//     })
//     .catch((err) => console.log(err));
// });

app.listen(9000, () => {
  console.log("Server Running at Port 9000 🚀");
});
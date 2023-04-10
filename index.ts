import { Configuration, OpenAIApi } from "openai";
import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();

const token = process.env.API_TOKEN!;
const config = new Configuration({ apiKey: token });
const openai = new OpenAIApi(config);

interface Message {
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
  gptService(res);
});

app.post("/image", (req: Request, res: Response) => {
  const { prompt } = req.body;
  openai
    .createImage({
      prompt,
      n: 1,
      size: "1024x1024",
    })
    .then((data) => {
      res.send(data.data.data[0].url);
    })
    .catch((err) => console.log(err));
});

const gptService = (res: Response) => {
  openai
    .createChatCompletion({
      model: "gpt-3.5-turbo",
      messages,
    })
    .then((data) => {
      messages.push({
        role: "assistant",
        content: data.data.choices[0].message!.content,
      });
      if (data.data.choices[0].finish_reason !== "stop") {
        messages.push({
          role: "user",
          content: "continue",
        });
        gptService(res);
      } else {
        res.send(
          messages
            .filter((message) => message.role === "assistant")
            .map((message) => message.content)
        );
      }
    })
    .catch((err) => console.log(err));
};

app.listen(9000, () => {
  console.log("Server Running at Port 9000 🚀");
});

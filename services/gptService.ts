import { Configuration, OpenAIApi } from "openai";
import dotenv from "dotenv";
import { Message } from "..";
dotenv.config();

const token = process.env.API_TOKEN!;
const config = new Configuration({ apiKey: token });
const openai = new OpenAIApi(config);

export const gptService = (res: Response, messages: Message[]) => {
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

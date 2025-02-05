import OpenAI from "openai";
import Logging from "../utils/Logging";
const openai = new OpenAI();

export class OpenAIService {

    public async generateVinylBackground(albumName: string, artist: string): Promise<any> {
        try {
            const gptResponse = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    { role: "developer", content: "You are a helpful assistant." },
                    {
                        role: "user",
                        content: "Write a paragraph of between 200 and 300 words on the album " + albumName + " by " + artist + " include any interesting facts you think might be relevant.",
                    },
                ],
                store: false,
            });
            console.log(gptResponse.choices[0].message.content);
            return gptResponse.choices[0].message.content
        } catch (error) {
            Logging.error(error);
        }
    }

}
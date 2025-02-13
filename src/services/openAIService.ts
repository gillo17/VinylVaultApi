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
            return gptResponse.choices[0].message.content
        } catch (error) {
            Logging.error(error);
        }
    }


    public async generateRecommendedAlbums(albums: string): Promise<any> {
        try {
            const gptResponse = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    { role: "developer", content: "You are a helpful assistant." },
                    {
                        role: "user",
                        content: "Can you return a list of recommended albums different to the ones provided to listen to based on the following albums: " + albums + "Without any other text and in Json format including both artist and album name",
                    },
                ],
                store: false,
            });
           
            return gptResponse.choices[0].message.content
            
        } catch (error) {
            Logging.error(error);
        }
    }

}
import { TwitterApi, TwitterApiReadWrite } from "twitter-api-v2";
import { HttpsProxyAgent } from "https-proxy-agent";

export function getTwitterClient(tokens:{appKey: string, appSecret: string,
    accessToken:string, accessSecret:string}, 
    httpAgent?:HttpsProxyAgent): TwitterApiReadWrite {
    try {
        return new TwitterApi(tokens, {httpAgent}).readWrite;
    } catch (error) {
        console.error("Erroneous token.");
        throw error;
    }
}

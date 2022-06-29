import { TTweetv2TweetField, TTweetv2UserField } from "twitter-api-v2/dist/types/v2/tweet.v2.types";
import { readFileSync } from "fs"

interface Config {
    tokens: {
        appKey: string;
        appSecret: string;
        accessToken: string;
        accessSecret: string;
    }
    mongoServer: string;
    hostUrl: string;
    numTweetsInitER: number;
    credentials: string;
    maximumExcessPer: number;
    maxChecksPost: number;
    port: number;
    proxyHost: string;
    proxyPort: number;
    proxyProtocol: string;
    userFields: TTweetv2UserField[];
    tweetFields: TTweetv2TweetField[];
}
export const config: Config = JSON.parse(readFileSync("./config.json", {encoding: "utf-8"}))
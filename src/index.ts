export const config:any = {
    mongoServer: "mongodb://localhost:27017/db",
    hostUrl: "",
    tokens: {
        appKey: "rEWBLH61CpHmark9YMypiba2L",
        appSecret: "QFUK0nR12HEbQCF5e440iun0WSndkVYwkbjkkBWkx1PrupuERG",
        accessToken: "874599052641538048-JY6BOGsUseX7gjHv7r68JuxMwFqAdkt",
        accessSecret: "MixVoEgp0nsvrt2eqm5MbszVC2yl2CE8lf4ajZPn2LIfT",
    },
    userFields: ["created_at","public_metrics", "description","entities","id","location","name","pinned_tweet_id","profile_image_url","protected","url","username","verified","withheld"],
    tweetFields: ["id","lang","public_metrics","text", "author_id", "created_at"],
    numTweetsInitER: 2,
    credentials: "",
    maximumExcessPer: "0.2",
    maxChecksPost: 48,
    port: "3000"
}

import { HttpsProxyAgent } from "https-proxy-agent";
import { Account } from "./models/Account";
import { getTwitterClient } from "./twitterClient"
import { connectDB } from "./db";
import { addCheckingPosts } from "./addCheckingPosts";
import { checkPostsER } from "./checkPostsER";
import { startServer } from "./server";
import { runTelegramServer } from "./telegram";

const credentials = Buffer.from(config.credentials).toString('base64')

const httpAgent = new HttpsProxyAgent({host: "138.59.205.17", port: "9613", protocol: "http:", headers: {
    "Proxy-Authorization": `Basic ${credentials}`
}});
export const client = getTwitterClient(config.tokens);

(
    async () => {
        try {
            runTelegramServer()
            await startServer()
            await connectDB()
            async function mainLoop() {
                const accountsFromDB = await Account.find()
                let accounts: any[] = [];
                for(const accountFromDB of accountsFromDB) {
                    accounts.push(await Account.findOne({id:accountFromDB.id}))
                }
                if(accounts.length == 0) {
                    console.log("No accounts")
                } else {
                    await addCheckingPosts(accounts)
                    await checkPostsER(accounts)
                }
                setTimeout(mainLoop, 20000)
            }
            mainLoop()
            
        } catch (error) {
            console.error(error)
        }
    }
)()
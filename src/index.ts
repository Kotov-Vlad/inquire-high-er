import { HttpsProxyAgent } from "https-proxy-agent";
import { Account } from "./models/Account";
import { getTwitterClient } from "./twitterClient"
import { connectDB } from "./db";
import { addCheckingPosts } from "./addCheckingPosts";
import { checkPostsER } from "./checkPostsER";
import { startServer } from "./server";
import { runTelegramServer } from "./telegram";
import { config } from "./config";

const credentials = Buffer.from(config.credentials).toString('base64')

const httpAgent = new HttpsProxyAgent({host: config.proxyHost, port: config.proxyHost, protocol: config.proxyProtocol, headers: {
    "Proxy-Authorization": `Basic ${credentials}`
}});

export const client = getTwitterClient(config.tokens, config.proxyHost == "" ? undefined : httpAgent);

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
                setTimeout(mainLoop, config.loop)
            }
            mainLoop()
            
        } catch (error) {
            console.error(error)
        }
    }
)()
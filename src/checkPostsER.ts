import { client } from ".";
import { config } from "./config"
import { collectIdsOneArrRequest } from "./collectIdsOneArrRequest";
import { compareER } from "./compareER";
import { Post } from "./models/Post";
import { reportExcess } from "./telegram";
import { updatePublicMetricsPosts } from "./updatePublicMetricsPostsER";

export async function checkPostsER(accounts: any[]): Promise<void> {
    try {
        console.log('check start')
        for(const account of accounts) {
            const ids = account.checkingPostIds
            for(let i = 0; i < ids.length; i++) {
                const id = ids[i]
                const post = await Post.findById(id)
                console.log(id.toString())
                console.log(post)
                if(compareER(account.currentAvergeER, post.ER) == true) {
                    await reportExcess(account, post)
                    await Post.findByIdAndDelete(id)
                    account.checkingPostIds.splice(ids.findIndex((i: number) => i == id), 1)
                    await account.save()
                } else if(post.maxChecksPosts > config.maxChecksPost) {
                    await Post.findByIdAndDelete(id)
                    account.checkingPostIds.splice(ids.findIndex((i: number) => i == id), 1)
                    await account.save()
                }
            }
        }
        const checkPostsList =await collectIdsOneArrRequest(accounts)
        if(checkPostsList.length > 0) {
            const tweets = (await client.v2.tweets(checkPostsList, {"tweet.fields": config.tweetFields})).data
            await updatePublicMetricsPosts(tweets)
        } else {
            console.log("no posts")
        }
    } catch (error) {
        console.log("CHECKPOSTSER ERROR")
        console.error(error)
    }
}
import { client, config } from ".";
import { collectIdsOneArrRequest } from "./collectIdsOneArrRequest";
import { compareER } from "./compareER";
import { Post } from "./models/Post";
import { reportExcess } from "./telegram";
import { updatePublicMetricsPosts } from "./updatePublicMetricsPostsER";

export async function checkPostsER(accounts: any[]): Promise<void> {
    try {
        for(const account of accounts) {
            const ids = account.checkingPostIds
            for(let i = 0; i < ids.length; i++) {
                const id = ids[i]
                const post = (await Post.findById(id))
                
                if(compareER(account.currentAvergeER, post.ER) == true) {
                    await reportExcess(account, post)
                    await Post.findByIdAndDelete(post.id)
                    account.checkingPostsIds = account.checkingPostsIds.filter((id: any) => id != post.id)
                }
                if(post.maxChecksPosts <= config.maxChecksPosts) {
                    await Post.findByIdAndDelete(post.id)
                    account.checkingPostsIds = account.checkingPostsIds.filter((id: any) => id != post.id)
                }
            }
        }
        const checkPostsList = await collectIdsOneArrRequest(accounts)
        const tweets = (await client.v2.tweets(checkPostsList, {"tweet.fields": config.tweetFields})).data
        await updatePublicMetricsPosts(tweets)
    } catch (error) {
        console.error(error)
    }
}
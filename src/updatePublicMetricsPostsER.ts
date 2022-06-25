import { TweetV2 } from "twitter-api-v2/dist/types/v2/tweet.definition.v2";
import { Post } from "./models/Post";

export async function updatePublicMetricsPosts(tweets:TweetV2[]) {
    try {
        for(let i = 0; i < tweets.length;i++) {
            const tweet = tweets[i];
            const post = await Post.findOne({"id": tweet.id})
            post.public_metrics = tweet.public_metrics
            await post.calculateER()
            await post.save()
        }
    } catch (error) {
        console.error(error)
    }
}
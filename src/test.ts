import { client, config } from ".";

(
    async () => {
        try {
            const userTimeLine = await client.v2.userTimeline("44196397", {"user.fields": config.userFields, "tweet.fields": config.tweetFields});
            let currentTweets = 0
            console.log(userTimeLine)
            for (const fetchedTweet of userTimeLine) {
                console.log(fetchedTweet)
                if(currentTweets >= config.numTweetsInitER) {
                    break
                }
            }
        } catch (error) {
            console.error(error)
        }
    }
)()
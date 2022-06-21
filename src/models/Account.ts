import mongoose, { Schema } from "mongoose";
import { TweetV2 } from "twitter-api-v2/dist/types/v2/tweet.definition.v2";
import { client, config } from "..";
import { calculateER } from "../calculateER";

const accountSchema = new Schema({
    id: String,
    checkingPostIds: {
        type: [],
        required: true
    },
    arrayER: {
        type: [],
        required: true
    },
    public_metrics: {
        type: {},
        required: true
    },
    lastCheckTimeLine: String,
    currentAvergeER: Number

})

accountSchema.methods.calculateAverageER = function() {
    try {
        let totalER = 0; 
        this.arrayER.map((value:number) => totalER += value)
        this.currentAvergeER = totalER / this.arrayER.length
        return this.currentAvergeER
    } catch (error) {
        console.error(error)
    }
}

accountSchema.methods.getNewPosts = async function() {
    const date = this.lastCheckTimeLine == undefined ? "2010-11-06T00:00:00Z" : this.lastCheckTimeLine
    let arrayNewPosts = []
    try {
        const userTimeLine = await client.v2.userTimeline(this.id, {"start_time": date, "user.fields": config.userFields, "tweet.fields": config.tweetFields});
        let currentTweets = 0
        for await (const fetchedTweet of userTimeLine) {
            if(currentTweets >= config.numTweetsInitER) {
                break
            }
            arrayNewPosts.push(fetchedTweet)
            console.log(fetchedTweet)
            currentTweets++
        }
        this.updateLastCheckTimeLine()
    } catch (error) {
        console.error(error)
    }
    return arrayNewPosts
}

accountSchema.methods.updateLastCheckTimeLine = function() {
    this.lastCheckTimeLine = new Date().toISOString()
}

accountSchema.methods.updatePublicMetrics = async function() {
    try {
        this.public_metrics = (await client.v2.user(this.id, {'user.fields': config.userFields })).data.public_metrics;
    } catch (error) {
        console.error(error)
    }
}

accountSchema.methods.initialization = async function() {
    try {
        const userTimeLine = await client.v2.userTimeline(this.id, {"user.fields": config.userFields, "tweet.fields": config.tweetFields});
        let currentTweets = 0
        for await (const fetchedTweet of userTimeLine) {
            console.log(fetchedTweet)
            if(currentTweets >= config.numTweetsInitER) {
                break
            }
            const metrics = fetchedTweet.public_metrics
            const ER = calculateER(Number(metrics?.like_count), Number(metrics?.retweet_count), Number(metrics?.reply_count), Number(101107442))
            if(ER) {
                this.arrayER.push(ER)
            }
            currentTweets++
        }
        await this.updatePublicMetrics()
        await this.calculateAverageER()
        await this.save()
    } catch (error) {
        console.error(error)
    }
}

export const Account = mongoose.model("Account", accountSchema, "accounts")
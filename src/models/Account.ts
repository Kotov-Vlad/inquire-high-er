import mongoose, { Schema } from "mongoose";
import { client, config } from "..";
import { calculateER } from "../calculateER";

const accountSchema = new Schema({
    id: String,
    login: String,
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
        this.login = await (await client.v2.users([this.id])).data[0].username
        let currentTweets = 0
        await this.updatePublicMetrics()
        for await (const fetchedTweet of userTimeLine) {
            console.log(fetchedTweet)
            if(currentTweets >= config.numTweetsInitER) {
                break
            }
            const tweetMetrics = fetchedTweet.public_metrics
            const ER = calculateER(Number(tweetMetrics?.like_count), Number(tweetMetrics?.retweet_count), Number(tweetMetrics?.reply_count), this.public_metrics.followers_count)
            if(ER) {
                this.arrayER.push(ER)
            }
            currentTweets++
        }
        await this.calculateAverageER()
        this.updateLastCheckTimeLine()
    } catch (error) {
        console.error(error)
    }
}

export const Account = mongoose.model("Account", accountSchema, "accounts")
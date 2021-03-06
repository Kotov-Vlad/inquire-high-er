import mongoose, { Schema } from "mongoose";
import { calculateER } from "../calculateER";
import { Account } from "./Account";
import { config } from "./../config"

const postSchema = new Schema({
    maxChecks: Number,
    currentChecks: Number,
    source: String,
    attachments: {
        type: {
            media_keys: []
        }
    },
    id: String,
    conversation_id: String,
    lang: String,
    entities: {
        type: {urls:[]}
    },
    created_at: String,
    public_metrics: {
        type: { retweet_count: Number, reply_count: Number, like_count: Number, quote_count: Number }
    },
    reply_settings: String,
    text: String,
    author_id: String,
    account_id: String,
    possibly_sensitive: Boolean,
    maxChecksPosts: Number,
    ER: Number
})

postSchema.methods.calculateER = async function() {
    try {
        const m = this.public_metrics
        const account:any = await Account.findById(this.account_id)
        this.ER = calculateER(m.like_count, m.retweet_count, m.reply_count, account.public_metrics.followers_count)
        account.arrayER.push(this.ER)
        return this.ER
    } catch (error) {
        console.error(error)
    }
}

postSchema.methods.setMaxChecksPosts = async function() {
    try {
        this.maxChecksPosts = config.maxChecksPost
        return this.maxChecksPosts
    } catch (error) {
        console.error(error)
    }
}
export const Post = mongoose.model("Post", postSchema, "posts")
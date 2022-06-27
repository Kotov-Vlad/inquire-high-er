import TelegramBot from "node-telegram-bot-api"
import express from "express"
import https from "https"
import fs from "fs"
import bodyParser from "body-parser"
import { config } from "."
import path from "path"

const options = {
    webHook: {
        port: 443
    }
};

const token = '5575669008:AAEWjPPLeuRDPfCUYjciM0ENXPesZf4Tv1k';
let subs: number[] = []
const bot = new TelegramBot(token, {polling: true});

export function runTelegramServer() {
    bot.on('message', (msg) => {
        const chatId = msg.chat.id;
        if(subs.includes(chatId)) {
            bot.sendMessage(chatId, 'you are already subscribed');
        } else {
            bot.sendMessage(chatId, 'you are now subscribed');
            subs.push(chatId)
        }
    });
}

export async function reportExcess(account: any, post: any):Promise<void> {
    console.log("Sending message Telegram...")
    for(const sub of subs) {
        bot.sendMessage(sub, `${account.login} posted

        1) currentAverageER - ${account.currentAverageER}
        2) tweet ER - ${post.ER}
        3) differnce - ${account.currentAverageER - post.ER}
        4) post it on https://twitter.com/${account.login}/status/${post.id}`);
    }
}
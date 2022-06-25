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
        bot.sendMessage(chatId, 'You subscribed');
        subs.push(chatId)
    });
}

export async function reportExcess(account: any, post: any):Promise<void> {
    console.log("Sending message Telegram...")
    for(const sub of subs) {
        bot.sendMessage(sub, `account: ${account.id}, tweet: ${post.id}`);
    }
}
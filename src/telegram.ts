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
const token = '5467858292:AAFvI0H7RgOzQQ7auCA24KtUbLwpRUGSLOE';
export const bot = new TelegramBot(token, options);

export async function telgramServerStart():Promise<void> {
    await bot.setWebHook(`${config.url}/bot${token}`);
    const app = express()
    const port = 5111
    const __dirname = path.resolve()

    const server = https.createServer({
        key: fs.readFileSync(path.resolve(__dirname, './key.pem'), 'utf-8'),
        cert: fs.readFileSync(path.resolve(__dirname, './server.crt'), 'utf-8')
    }, app);

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    app.post(`/bot${token}`, (req, res) => {
        bot.processUpdate(req.body)
        res.sendStatus(200);
    })

    server.listen(port, () => {
        console.log('Telegram server on port' + port);
    })
}

export async function reportExcess(account: any, post: any):Promise<void> {
    bot.sendMessage(config.telegramChatId, `АККАУНТ:${account} ПОСТ:${post}`)
    console.log("Sending message Telegram...")
}
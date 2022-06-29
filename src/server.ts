import express from "express"
import { config } from "./config"
import path from "path"
import bodyParser from "body-parser"
import { Account } from "./models/Account"

export async function startServer() {
    const app = express()
    const __dirname = path.resolve()

    app.set("view engine", "pug")
    app.set('views', path.resolve(__dirname, "./src/views"))
    app.use("/static", express.static(path.resolve(__dirname, './src/static')))
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    app.get("/", async (req, res) => {
        res.render("index", {title:"INQUIRE-HIGHT-ER", scriptUrl:"static/index.js", styleUrl: "static/index.css"})
    })

    app.get("/api/getAccounts", async(req, res) => {
        const accounts = await Account.find()
        res.send(accounts)
        res.statusCode = 200
    })

    app.post("/api/addAccount", async(req, res) => {
        res.statusCode = 200
        const accountId = req.body.id
        const account = new Account({id: accountId, public_metrics: []})
        await account.initialization()
        await account.save()
    })

    app.post("/api/removeAccount", async(req, res) => {
        res.statusCode = 200
        const accountId = req.body.id
        await Account.deleteOne({"id": accountId})
    })

    app.listen(config.port, () => {
        console.log(`Web server started on port ${config.port}`)
    })
}
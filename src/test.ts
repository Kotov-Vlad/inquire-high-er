import { client, config } from ".";
import { Account } from "./models/Account";
import fetch from "node-fetch"

(
    async () => {
        const users = await client.v2.users(['44196397']);
        console.log(users)
    }
)()
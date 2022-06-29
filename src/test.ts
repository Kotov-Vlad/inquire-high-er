import { client } from ".";

(
    async () => {
        const users = await client.v2.users(['44196397']);
        console.log(users)
    }
)()
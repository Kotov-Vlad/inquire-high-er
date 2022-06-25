import { Post } from "./models/Post"

export async function collectIdsOneArrRequest(accounts: any[]) {  // collect all ids in one array for request
    try {
        let checkPostsList:any = []
        for(let i = 0; i < accounts.length;i++) {
            const account = accounts[i]
            for(let i = 0; i < account.checkingPostIds.length;i++) {
                console.log(account.checkingPostIds[i].toString())
                const searchPost:any = await Post.findById(account.checkingPostIds[i])
                checkPostsList.push((await Post.findOne({"id":searchPost.id})).id)
            }
        }
        return checkPostsList
    } catch (error) {
        console.error(error)
    }
}
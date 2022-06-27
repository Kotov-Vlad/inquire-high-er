import { Post } from "./models/Post";

export async function addCheckingPosts(accounts: any[]): Promise<void> {
    console.log("added start")
    console.log(accounts)
    for (let i = 0; i < accounts.length; i++) {
        const account = accounts[i]
        const newPosts = await account.getNewPosts();
        for(let i = 0; i < newPosts.length; i++) {
            const newPost = newPosts[i]
            newPost.account_id = account._id
            const post = new Post(newPost) // create object post for db
            await post.calculateER()
            await post.setMaxChecksPosts()
            await post.save()
            console.log(post._id)
            account.checkingPostIds.push(post._id);  // Attaching new posts to your followers
            await account.save()
        }
    }
    console.log("added end")
}
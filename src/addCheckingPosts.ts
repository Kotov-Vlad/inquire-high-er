import { Post } from "./models/Post";

export async function addCheckingPosts(accounts: any[]) {
    try {
        for (const account of accounts) {
            const newPosts = await account.getNewPosts();
            for(const newPost of newPosts) {
                newPost.account_id = account._id
                const post = new Post(newPost) // create object post for db
                await post.calculateER()
                await post.setMaxChecksPosts()
                await post.save();  // save post to db
                console.log(post)
                account.checkingPostIds.push(String(post._id));  // Attaching new posts to your followers
                await account.save()
            }
        }
        console.log(accounts)
    } catch (error) {
        console.error(error)
    }
}

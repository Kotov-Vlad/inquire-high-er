export function calculateER(likeCount:number, retweetCount:number, replyCount:number, followersCount:number): number | undefined {
    try {
        return (likeCount+retweetCount+replyCount)/followersCount
    } catch (error) {
        console.error(error)
        
    }
}


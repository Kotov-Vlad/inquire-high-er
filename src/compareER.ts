import { config } from "./config"

export function compareER(currentAvergeER:number, ER:number) {
    try {
        const perCurrentAvergeER = currentAvergeER / 100
        const perExcessER = (ER / perCurrentAvergeER) - 100
        if(perExcessER > config.maximumExcessPer ){
            return true
        } else {
            return false
        }
    } catch (error) {
        console.error(error)
    }
}
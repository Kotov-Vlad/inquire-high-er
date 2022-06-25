import { client, config } from ".";
import { Account } from "./models/Account";
import fetch from "node-fetch"

(
    async () => {
        try {
            const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
            async function time1() {
                for(const arrElem of arr) {
                    await fetch("https://google.com/" + arrElem)
                    console.log("fetched time1")
                }
            }
            async function time2() {
                for(const arrElem of arr) {
                    await fetch("https://google.com/" + arrElem)
                    console.log("fetched time2")
                }
            }
            time1()
            time2()
        } catch (error) {
            console.error(error)
        }
    }
)()
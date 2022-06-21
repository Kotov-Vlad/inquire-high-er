(
    async () => {
        const infoBlock = document.querySelector(".info-block")
        const accounts = document.createElement("div")
        accounts.setAttribute("class", "accounts")
        infoBlock.appendChild(accounts)
        accounts.innerHTML = await ((await fetch("/api/getAccounts", {
            method: 'GET',
            mode: 'no-cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            }
        })).text())

        const inputAdd = document.createElement("input")
        inputAdd.setAttribute("type", "text")
        inputAdd.setAttribute("placeholder", "type twitter id")
        inputAdd.setAttribute("name", "input")
        infoBlockAdd.appendChild(input)


        const addAccount = async () => {
            const id = inputAdd.value
            inputAdd.value = ""
            await fetch("/api/addAccount", {
                headers: {'Content-Type': 'application/json'},
                method: "POST",
                body: JSON.stringify({
                    "id": id
                })
            });
        }
        const addAccountBtn = document.createElement("button")
        addAccountBtn.setAttribute("id", "addAccountBtn")
        infoBlock.appendChild(addAccountBtn)
        addAccountBtn.innerHTML = "Send"
        addAccountBtn.addEventListener("click", addAccount)

        const inputRemove = document.createElement("input")
        inputAdd.setAttribute("type", "text")
        inputAdd.setAttribute("placeholder", "type twitter id")
        inputAdd.setAttribute("name", "input")
        infoBlockAdd.appendChild(input)


        const removeAccount = async () => {
            const id = inputRemove.value
            inputAdd.value = ""
            await fetch("/api/removeAccount", {
                headers: {'Content-Type': 'application/json'},
                method: "POST",
                body: JSON.stringify({
                    "id": id
                })
            });
        }
        const removeAccountBtn = document.createElement("button")
        removeAccountBtn.setAttribute("id", "removeAccountBtn")
        infoBlock.appendChild(removeAccountBtn)
        removeAccountBtn.innerHTML = "remove"
        removeAccountBtn.addEventListener("click", addAccount)
    }
)()
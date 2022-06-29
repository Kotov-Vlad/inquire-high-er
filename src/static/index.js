(
    async () => {
        const accounts = document.querySelector(".accounts")
        const accountsDB = JSON.parse(
            await ((await fetch("/api/getAccounts", {
                method: 'GET',
                mode: 'no-cors',
                cache: 'no-cache',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                }
            })).text())
        )
        for(const accountDB of accountsDB) {
            const div = document.createElement('div')
            div.innerHTML = `@${accountDB.login} - id for delete: ${accountDB.id} - er: ${accountDB.currentAvergeER} - lastCheck: ${accountDB.lastCheckTimeLine}`
            accounts.appendChild(div)
        }

        const inputAdd = document.querySelector("#inputAdd")

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
        const addAccountBtn = document.querySelector("#addAccountBtn")
        addAccountBtn.addEventListener("click", addAccount)

        const inputRemove = document.querySelector("#inputRemove")

        const removeAccount = async () => {
            const id = inputRemove.value
            inputRemove.value = ""
            await fetch("/api/removeAccount", {
                headers: {'Content-Type': 'application/json'},
                method: "POST",
                body: JSON.stringify({
                    "id": id
                })
            });
        }
        const removeAccountBtn = document.querySelector("#removeAccountBtn")
        removeAccountBtn.addEventListener("click", removeAccount)
    }
)()
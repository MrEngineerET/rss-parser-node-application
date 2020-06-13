require("dotenv").config({
    path: "./config.env",
})
const bot = require("./bot")

const netflix = require("./RSSWebsites/netflix/netflix")


if (process.env.NODE_ENV == "production") {
    let oneHour = 1000 * 60 * 60

    function oneHourFunction() {
        netflix.fetchAndPost()
    }
    setInterval(oneHourFunction, oneHour)
}

if (process.env.NODE_ENV === "development") {
    let thirtySeconds = 1000 * 10 * 3

    function tenSecondFunction() {
        netflix.fetchAndPost()
    }
    setInterval(tenSecondFunction, thirtySeconds)
}

bot.launch()
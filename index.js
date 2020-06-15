require("dotenv").config({
    path: "./config.env",
})
const bot = require("./bot")

const netflix = require("./RSSWebsites/netflix/netflix")
const merkato2 = require("./RSSWebsites/businessEnglish/2merkato")


if (process.env.NODE_ENV == "production") {
    let oneHour = 1000 * 60 * 60

    function oneHourFunction() {
        netflix.fetchAndPost()
    }
    setInterval(oneHourFunction, oneHour)
}

if (process.env.NODE_ENV === "development") {
    const thirtySeconds = 1000 * 10 * 3
    const oneMinute = 1000 * 10 * 6

    function tenSecondFunction() {
        netflix.fetchAndPost()
    }
    setInterval(tenSecondFunction, thirtySeconds)

    function oneMinuteFunction() {
        merkato2.fetchAndPost();
    }
    setInterval(oneMinuteFunction, oneMinute)
}


bot.launch()
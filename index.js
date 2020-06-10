const {
    bot,
    testChannelID
} = require('./bot')

const netflix = require('./RSSWebsites/netflix/netflix')

let oneHour = 1000 * 60 * 60;

function oneHourFunction() {
    netflix.fetchAndPost();
}

setInterval(oneHourFunction, oneHour)
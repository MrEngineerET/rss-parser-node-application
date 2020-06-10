const fs = require("fs")
const Parser = require("rss-parser")
const path = require('path')

const {
    bot,
    testChannelID
} = require('./../../bot')

let parser = new Parser()
exports.fetchAndPost = async () => {
    try {
        let latestNetflixItem = JSON.parse(fs.readFileSync(path.join(__dirname, 'latestNetflixItem.json'), 'utf-8'));
        let latestNetflixItemTitle = latestNetflixItem.title;

        let newNewsFeed = [];
        let newLatestNetflixItem = latestNetflixItem

        let feed = await parser.parseURL("https://www.whats-on-netflix.com/feed/")
        let items = feed.items.splice(0, 5)

        for (let i = 0; i < items.length; i++) {
            if (items[i].title != latestNetflixItemTitle) {
                newNewsFeed.push(items[i]);
                newLatestNetflixItem = items[i]
            } else {
                break;
            }
        }
        console.log(newLatestNetflixItem.title + '---' + latestNetflixItem.title)
        if (newNewsFeed.length != 0 && newLatestNetflixItem != latestNetflixItem) {
            newNewsFeed.forEach(item => {
                bot.telegram.sendMessage(testChannelID, item.title)
            })
        }

        fs.writeFileSync(path.join(__dirname, 'latestNetflixItem.json'), JSON.stringify(newLatestNetflixItem), "utf-8")

    } catch (err) {
        console.log(err);
    }
}
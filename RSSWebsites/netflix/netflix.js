const fs = require("fs")
const Parser = require("rss-parser")
const path = require("path")

const bot = require("./../../bot")

let parser = new Parser()
exports.fetchAndPost = async () => {
    try {
        let latestNetflixItem = JSON.parse(
            fs.readFileSync(path.join(__dirname, "latestNetflixItem.json"), "utf-8")
        )
        let latestNetflixItemTitle = latestNetflixItem.title

        let newNewsFeed = []
        let newLatestNetflixItem = latestNetflixItem

        let feed = await parser.parseURL("https://www.whats-on-netflix.com/feed/")

        let items = feed.items.splice(0, 5)

        let latest = true
        for (let i = 0; i < items.length; i++) {
            if (items[i].title != latestNetflixItemTitle) {

                newNewsFeed.push(items[i])
                if (latest) {
                    newLatestNetflixItem = items[i]
                    latest = false
                }
            } else {
                break
            }
        }

        if (newNewsFeed.length != 0) {
            let preparedFeeds = prepareFeeds(newNewsFeed)
            preparedFeeds.forEach((item) => {
                if (item[1]) {
                    bot.telegram.sendPhoto(process.env.testGroupID, item[0], {
                        caption: `
                        ${item[1]}`,
                        parse_mode: "HTML",
                        reply_markup: {
                            inline_keyboard: [
                                [{
                                    text: "#Netflix_Addis",
                                    callback_data: "postNetflix",
                                }, {
                                    text: "remove",
                                    callback_data: "remove",
                                }]
                            ]
                        }
                    })
                }
            })
        }

        fs.writeFileSync(
            path.join(__dirname, "latestNetflixItem.json"),
            JSON.stringify(newLatestNetflixItem),
            "utf-8"
        )
    } catch (err) {
        console.log(err)
    }
}

let prepareFeeds = function (feeds) {
    return feeds.map(feed => {
        let desStartIndex = feed.content.indexOf('</p>') + 4;
        let description = feed.content.slice(desStartIndex);
        let imageSrc = null;
        let start = feed.content.indexOf('https:')
        let end = feed.content.indexOf(".jpg")
        if (end == -1) {
            end = feed.content.indexOf(".png")
        }
        end += 4;
        imageSrc = feed.content.slice(start, end)

        let message = `
        <u><b>${feed.title}</b></u>

        ${description}
        photoURL:${imageSrc}
        sourceURL:${feed.link}$$end
        `
        return [imageSrc, message]
    })
}
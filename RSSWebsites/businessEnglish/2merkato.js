const fs = require("fs")
const Parser = require("rss-parser")
const path = require("path")

const bot = require("./../../bot")

let parser = new Parser()
const rssURL = "http://fetchrss.com/rss/5ecc08fa8a93f878358b45675ecc085c8a93f86a2e8b4567.xml";


let prepareFeeds = function (feeds) {
    return feeds.map(feed => {
        let title = feed.title
        let description = feed.contentSnippet.replace("(Feed generated with FetchRSS)", "").trim()
        let date = feed.pubDate.slice(0, feed.pubDate.indexOf('2020')).trim();
        let sourceURL = feed.link;
        let imageSrc = null
        let start = feed.content.indexOf('src=\"https:') + 5
        let end = feed.content.indexOf(".jpg")
        if (end == -1) {
            end = feed.content.indexOf(".png")
        }
        if (start == -1 || end == -1) {
            imageSrc = path.join(__dirname, 'noPic.jpg')
        } else {
            end += 4;
            imageSrc = feed.content.slice(start, end)
        }

        let message = `
<u><b>${title}</b></u>

${description}
${date}
photoURL:${imageSrc}
sourceURL:${sourceURL}$$end`

        return [imageSrc, message]

    })
}

exports.fetchAndPost = async function () {
    try {
        let latest2MerkatoItem = JSON.parse(
            fs.readFileSync(path.join(__dirname, "latest2merkatoItem.json"), "utf-8")
        )

        let latest2merkatoItemTitle = latest2MerkatoItem.title

        let newNewsFeed = []
        let newLatest2merkatoItem = latest2MerkatoItem

        let feed = await parser.parseURL(rssURL)

        let items = feed.items.splice(0, 5)


        let latest = true
        for (let i = 0; i < items.length; i++) {
            if (items[i].title != latest2merkatoItemTitle) {
                newNewsFeed.push(items[i])
                if (latest) {
                    newLatest2merkatoItem = items[i]
                    latest = false
                }
            } else {
                break
            }
        }

        if (newNewsFeed.length != 0) {
            let preparedFeeds = prepareFeeds(newNewsFeed)
            preparedFeeds.forEach((item) => {
                if (!item[0].includes('noPic.jpg')) {
                    bot.telegram.sendPhoto(process.env.testGroupID, item[0], {
                        caption: `${item[1]}`,
                        // parse_mode: "HTML",
                        reply_markup: {
                            inline_keyboard: [
                                [{
                                    text: "#Ethiopian_Business_Daily",
                                    callback_data: "post2merkato",
                                }, {
                                    text: "remove",
                                    callback_data: "remove",
                                }]
                            ]
                        }
                    })
                } else {
                    bot.telegram.sendPhoto(process.env.testGroupID, {
                        source: item[0]
                    }, {
                        caption: `${item[1]}`,
                        // parse_mode: "HTML",
                        reply_markup: {
                            inline_keyboard: [
                                [{
                                    text: "#Ethiopian_Business_daily",
                                    callback_data: "noResponse"
                                }],
                                [{
                                    text: "#with_Pic1",
                                    callback_data: "post2merkato1"
                                }, {
                                    text: "#with_Pic2",
                                    callback_data: "post2merkato2"
                                }, {
                                    text: "#with_Pic3",
                                    callback_data: "post2merkato3"
                                }],
                                [{
                                    text: "#with_Pic4",
                                    callback_data: "post2merkato4"
                                }, {
                                    text: "#with_Pic5",
                                    callback_data: "post2merkato5"
                                }, {
                                    text: "#with_Pic6",
                                    callback_data: "post2merkato6"
                                }],
                                [{
                                    text: "Remove",
                                    callback_data: "remove"
                                }]
                            ]
                        }
                    })
                }
            })
        }


        fs.writeFileSync(
            path.join(__dirname, "latest2merkatoItem.json"),
            JSON.stringify(newLatest2merkatoItem),
            "utf-8"
        )


    } catch (err) {
        console.log(err)
    }
}
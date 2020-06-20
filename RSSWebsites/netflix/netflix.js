const fs = require("fs")
const Parser = require("rss-parser")
const path = require("path")

const bot = require("./../../bot")
const rssURL = "https://www.whats-on-netflix.com/feed/"

let parser = new Parser()

let btn = [
	[
		{
			text: "#Netflix_Addis",
			callback_data: "postNetflix",
		},
		{
			text: "remove",
			callback_data: "remove",
		},
	],
]

let prepareFeeds = function (feeds) {
	return feeds.map((feed) => {
		let imageLocation = ""
		let imageSource = ""
		let start = feed.content.indexOf('src="https:') + 5
		let end = feed.content.indexOf(".jpg")
		if (end == -1) {
			end = feed.content.indexOf(".png")
		}
		if (start == -1 || end == -1) {
			imageLocation = path.join(__dirname, "nopic.jpg")
			imageSource = "local"
		} else {
			end += 4
			imageLocation = feed.content.slice(start, end)
			imageSource = "remote"
		}

		let caption = {
			title: feed.title,
			description: feed.content.slice(feed.content.indexOf("</p>") + 4).trim(),
			sourceURL: feed.link,
			photoURL: imageLocation.includes("nopic") ? "nopic.jpg" : imageLocation,
			to: "toGroup",
		}

		let data = {
			caption,
			photo: {
				source: imageSource,
				location: imageLocation,
			},
			chatID: process.env.testGroupID,
			buttons: btn,
		}
		return data
	})
}

exports.fetchAndPost = async () => {
	try {
		let latestNetflixItem = JSON.parse(
			fs.readFileSync(path.join(__dirname, "latestNetflixItem.json"), "utf-8")
		)
		let latestNetflixItemTitle = latestNetflixItem.title

		let newNewsFeed = []
		let newLatestNetflixItem = latestNetflixItem

		let feed = await parser.parseURL(rssURL)

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
				bot.post(item).catch((err) => {
					console.log(err)
				})
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

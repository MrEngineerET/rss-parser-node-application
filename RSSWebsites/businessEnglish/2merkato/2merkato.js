const fs = require("fs")
const Parser = require("rss-parser")
const path = require("path")

const bot = require("../../../bot")

let parser = new Parser()
const rssURL = "http://fetchrss.com/rss/5ecc08fa8a93f878358b45675ecc085c8a93f86a2e8b4567.xml"

// button for posts with their own image
let btn = [
	[
		{
			text: "#Ethiopian_Business_Daily",
			callback_data: "post2merkato",
		},
		{
			text: "remove",
			callback_data: "remove",
		},
	],
]
// button for posts without their own image
let btn4noImg = [
	[
		{
			text: "#Ethiopian_Business_daily",
			callback_data: "noResponse",
		},
	],
	[
		{
			text: "#with_Pic1",
			callback_data: "post2merkato1",
		},
		{
			text: "#with_Pic2",
			callback_data: "post2merkato2",
		},
		{
			text: "#with_Pic3",
			callback_data: "post2merkato3",
		},
	],
	[
		{
			text: "#with_Pic4",
			callback_data: "post2merkato4",
		},
		{
			text: "#with_Pic5",
			callback_data: "post2merkato5",
		},
		{
			text: "#with_Pic6",
			callback_data: "post2merkato6",
		},
	],
	[
		{
			text: "Remove",
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
			imageLocation = path.join(__dirname, "..", "images", "nopic.jpg")
			imageSource = "local"
		} else {
			end += 4
			imageLocation = feed.content.slice(start, end)
			imageSource = "remote"
		}

		let caption = {
			title: feed.title,
			description: feed.contentSnippet.replace("(Feed generated with FetchRSS)", "").trim(),
			date: feed.pubDate.slice(0, feed.pubDate.indexOf("2020")).trim(),
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
			buttons: imageSource == "remote" ? btn : btn4noImg,
		}

		return data
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
				bot.post(item).catch((err) => {
					console.log(err)
				})
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

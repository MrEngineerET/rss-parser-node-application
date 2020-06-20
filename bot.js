const path = require("path")

const Telegraf = require("telegraf")

const bot = new Telegraf("1295703321:AAGfhPgd9sf7o8jW_XL8o1OO9aekYKjbS0o")

bot.action("postNetflix", netflixPostToChannel)
bot.action("post2merkato", merkatoChannelPostController)
bot.action("post2merkato1", merkatoChannelPostController)
bot.action("post2merkato2", merkatoChannelPostController)
bot.action("post2merkato3", merkatoChannelPostController)
bot.action("post2merkato4", merkatoChannelPostController)
bot.action("post2merkato5", merkatoChannelPostController)
bot.action("post2merkato6", merkatoChannelPostController)

bot.action("noResponse", (ctx) => {
	ctx.answerCbQuery()
})

bot.action("remove", (ctx) => {
	ctx.deleteMessage()
})

function netflixPostToChannel(ctx) {
	const SPLIT = "@#$"
	let dataArr = ctx.update.callback_query.message.caption.split(SPLIT)

	let title = dataArr[0].replace(/\n+/g, "").replace(/^\s+/g, "")
	let description = dataArr[1].replace(/\n+/g, "").replace(/^\s+/g, "")
	let sourceURL = ctx.update.callback_query.message.caption_entities[2].url
	let photoURL = ctx.update.callback_query.message.caption_entities[3].url
	let source = "remote"
	if (photoURL == "nopic.jpg") {
		photoURL = path.join(__dirname, "netflix.jpg")
		source = "local"
	}
	let caption = {
		title,
		description,
		photoURL,
		sourceURL,
		to: "toChannel",
	}
	let data = {
		photo: {
			source,
			location: photoURL,
		},
		chatID: -1001448681325,
		caption,
	}

	post(data).catch((err) => {
		console.log(err)
	})

	ctx.deleteMessage()
}

function merkatoChannelPostController(ctx) {
	let data = ctx.update.callback_query.data
	let num = 0
	switch (data) {
		case "post2merkato1": {
			num = 1
			break
		}
		case "post2merkato2": {
			num = 2
			break
		}
		case "post2merkato3": {
			num = 3
			break
		}
		case "post2merkato4": {
			num = 4
			break
		}
		case "post2merkato5": {
			num = 5
			break
		}
		case "post2merkato6": {
			num = 6
			break
		}
	}
	merkatoPostControllerInner(ctx, num)
}

function merkatoPostControllerInner(ctx, num) {
	ctx.answerCbQuery()
	const SPLIT = "@#$"
	let dataArr = ctx.update.callback_query.message.caption.split(SPLIT)

	let title = dataArr[0].replace(/\n+/g, "").replace(/^\s+/g, "")
	let description = dataArr[1].replace(/\n+/g, "").replace(/^\s+/g, "")
	let sourceURL = ctx.update.callback_query.message.caption_entities[2].url
	let photoURL = ctx.update.callback_query.message.caption_entities[3].url
	let source = "remote"

	if (photoURL.includes("nopic")) {
		source = "local"
		switch (num) {
			case 1: {
				photoURL = path.join(__dirname, "RSSWebsites", "businessEnglish", "images", "pic1.jpg")
				break
			}
			case 2: {
				photoURL = path.join(__dirname, "RSSWebsites", "businessEnglish", "images", "pic2.jpg")
				break
			}
			case 3: {
				photoURL = path.join(__dirname, "RSSWebsites", "businessEnglish", "images", "pic3.jpg")
				break
			}
			case 4: {
				photoURL = path.join(__dirname, "RSSWebsites", "businessEnglish", "images", "pic4.jpg")
				break
			}
			case 5: {
				photoURL = path.join(__dirname, "RSSWebsites", "businessEnglish", "images", "pic5.jpg")
				break
			}
			case 6: {
				photoURL = path.join(__dirname, "RSSWebsites", "businessEnglish", "images", "pic6.jpg")
				break
			}
		}
	}

	let caption = {
		title,
		description,
		photoURL,
		sourceURL,
		to: "toChannel",
	}
	let data = {
		photo: {
			source,
			location: photoURL,
		},
		chatID: -1001448681325,
		caption,
	}
	post(data).catch((err) => {
		console.log(err)
	})

	ctx.deleteMessage()
}
let post = async function ({ caption, photo, chatID, buttons }) {
	if (buttons) {
		if (photo.source == "local") {
			await bot.telegram.sendPhoto(
				chatID,
				{ source: photo.location },
				{
					caption: prepareCaption(caption),
					reply_markup: {
						inline_keyboard: buttons,
					},
					parse_mode: "HTML",
				}
			)
		} else {
			await bot.telegram.sendPhoto(chatID, photo.location, {
				caption: prepareCaption(caption),
				reply_markup: {
					inline_keyboard: buttons,
				},
				parse_mode: "HTML",
			})
		}
	} else {
		if (photo.source == "local") {
			await bot.telegram.sendPhoto(
				chatID,
				{
					source: photo.location,
				},
				{
					caption: prepareCaption(caption),
					parse_mode: "HTML",
				}
			)
		} else {
			await bot.telegram.sendPhoto(chatID, photo.location, {
				caption: prepareCaption(caption),
				parse_mode: "HTML",
			})
		}
	}
}

let prepareCaption = function (caption) {
	if (caption.to == "toGroup") {
		const SPLIT = "@#$"
		return `
    <u><b>${caption.title}${SPLIT}</b></u>
    
${caption.description}${SPLIT}

<a href="${caption.sourceURL}">sourceURL</a>
<a href="${caption.photoURL}">imageURL</a>
`
	} else if (caption.to == "toChannel") {
		return `
    <u><b>${caption.title}</b></u>
    
${caption.description}

For more -> <a href="${caption.sourceURL}">CLICK HERE</a>
    `
	}
}

module.exports = {
	bot,
	post,
}

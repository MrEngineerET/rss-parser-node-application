const Telegraf = require("telegraf")

const bot = new Telegraf("1295703321:AAGfhPgd9sf7o8jW_XL8o1OO9aekYKjbS0o")

bot.action("postNetflix", (ctx) => {
    ctx.answerCbQuery();
    let caption = ctx.update.callback_query.message.caption;
    let start = caption.indexOf('photoURL:') + 9
    let end = caption.indexOf(".jpg")
    if (end == -1) {
        end = caption.indexOf(".png")
    }
    end += 4;
    let photoURL = caption.slice(start, end)
    let sourceURL = caption.slice(caption.indexOf('sourceURL:') + 10, caption.indexOf('$$end'))
    let message = caption.slice(0, start - 9)
    message = `
    ${message}
    For More - <a href="${sourceURL}">CLICK HERE</a>`

    bot.telegram.sendPhoto(process.env.testChannelID, photoURL, {
        caption: message,
        parse_mode: "HTML"
    })
    ctx.deleteMessage();
})

bot.action('remove', ctx => {
    ctx.deleteMessage();
})

module.exports = bot
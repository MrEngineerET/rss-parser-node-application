const Telegraf = require("telegraf")
const path = require('path')
const bot = new Telegraf("1295703321:AAGfhPgd9sf7o8jW_XL8o1OO9aekYKjbS0o")

bot.action("postNetflix", netflixController)
bot.action('post2merkato', merkatoPostController)
bot.action('post2merkato1', merkatoPostController)
bot.action('post2merkato2', merkatoPostController)
bot.action('post2merkato3', merkatoPostController)
bot.action('post2merkato4', merkatoPostController)
bot.action('post2merkato5', merkatoPostController)
bot.action('post2merkato6', merkatoPostController)

bot.action('noResponse', ctx => {
    ctx.answerCbQuery();
})

bot.action('remove', ctx => {
    ctx.deleteMessage();
})

function netflixController(ctx) {
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
}


function merkatoPostController(ctx) {
    let data = ctx.update.callback_query.data;
    let num = 0
    switch (data) {
        case 'post2merkato1': {
            num = 1
            break;
        }
        case 'post2merkato2': {
            num = 2
            break;
        }
        case 'post2merkato3': {
            num = 3
            break;
        }
        case 'post2merkato4': {
            num = 4
            break;
        }
        case 'post2merkato5': {
            num = 5
            break;
        }
        case 'post2merkato6': {
            num = 6
            break;
        }
    }
    merkatoPostControllerInner(ctx, num)
}

function merkatoPostControllerInner(ctx, num) {
    ctx.answerCbQuery();
    let caption = ctx.update.callback_query.message.caption;

    let sourceURL = caption.slice(caption.indexOf('sourceURL:') + 10, caption.indexOf('$$end'))
    let message = caption.slice(0, caption.indexOf('photoURL:'))
    message = `
${message}
For More - <a href="${sourceURL}">CLICK HERE</a>`

    let start = caption.indexOf('photoURL:') + 9
    let end = caption.indexOf(".jpg")
    if (end == -1) {
        end = caption.indexOf(".png")
    }
    end += 4;
    let photoURL = caption.slice(start, end)
    if (caption.includes('noPic.jpg')) {

        let imgSrc = null;
        switch (num) {
            case 1: {
                imgSrc = path.join(__dirname, 'RSSWebsites', 'businessEnglish', 'images', 'pic1.jpg')
                break;
            }
            case 2: {
                imgSrc = path.join(__dirname, 'RSSWebsites', 'businessEnglish', 'images', 'pic2.jpg')
                break;
            }
            case 3: {
                imgSrc = path.join(__dirname, 'RSSWebsites', 'businessEnglish', 'images', 'pic3.jpg')
                break;
            }
            case 4: {
                imgSrc = path.join(__dirname, 'RSSWebsites', 'businessEnglish', 'images', 'pic4.jpg')
                break;
            }
            case 5: {
                imgSrc = path.join(__dirname, 'RSSWebsites', 'businessEnglish', 'images', 'pic5.jpg')
                break;
            }
            case 6: {
                imgSrc = path.join(__dirname, 'RSSWebsites', 'businessEnglish', 'images', 'pic6.jpg')
                break;
            }
        }
        bot.telegram.sendPhoto(process.env.testChannelID, {
            source: imgSrc
        }, {
            caption: message,
            parse_mode: "HTML"
        })

    } else {

        bot.telegram.sendPhoto(process.env.testChannelID, photoURL, {
            caption: message,
            parse_mode: "HTML"
        })
    }

    ctx.deleteMessage();
}


module.exports = bot
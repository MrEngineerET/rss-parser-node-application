const Parser = require("rss-parser")
const fs = require("fs")

let parser = new Parser()

;
(async () => {
    let feed = await parser.parseURL("https://newbusinessethiopia.com/topics/economy/feed/")

    fs.writeFileSync("./newBusinessEthiopia.json", JSON.stringify(feed), "utf-8")
})()
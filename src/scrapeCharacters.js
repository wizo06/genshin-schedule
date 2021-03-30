const request = require('request');
const cheerio = require('cheerio');

const scrapeAndStore = (param1) => {
  return new Promise ((resolve, reject) => {
    const options = {
      url: `https://genshin.honeyhunterworld.com/db/char/${param1}/`
    }

    const chars = [];
    request(options, (err, res, body) => {
      $ = cheerio.load(body)

      let arrOfChars = $('div.char_sea_cont')

      arrOfChars.each(function (i, elem) {
        charName = $(this).find('span.sea_charname').text()

        // Skip current character if it's the Traveler
        if (charName.includes('Traveler')) return
        
        charPortrait = $(this).find('img.char_portrait_card_sea').attr('src')
        talentBookIMG = $(this).find('div.sea_char_mat_cont').find('img').eq(0).attr('src')
        eleStoneIMG = $(this).find('div.sea_char_mat_cont').find('img').eq(1).attr('src')
        jewelIMG = $(this).find('div.sea_char_mat_cont').find('img').eq(2).attr('src')
        localMaterialIMG = $(this).find('div.sea_char_mat_cont').find('img').eq(3).attr('src')
        commonMaterialIMG = $(this).find('div.sea_char_mat_cont').find('img').eq(4).attr('src')
        talentWeeklyIMG = $(this).find('div.sea_char_mat_cont').find('img').eq(5).attr('src')

        chars.push({
          name: charName,
          portrait: charPortrait,
          talentBookIMG,
          eleStoneIMG,
          jewelIMG,
          localMaterialIMG,
          commonMaterialIMG,
          talentWeeklyIMG,
        });
      })

      resolve(chars);
    })
  })
}

const scrapeCharacters = () => {
  return new Promise(async (resolve, reject) => {
    console.log('  - Scraping RELEASED')
    const released = await scrapeAndStore('characters')
    console.log('  - Scraping UNRELEASED')
    const unreleased = await scrapeAndStore('unreleased-and-upcoming-characters')

    resolve([...released, ...unreleased]);
  })
}

module.exports = {
  scrapeCharacters
}
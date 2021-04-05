const fetch = require('node-fetch');
const cheerio = require('cheerio');

const scrapeTalentMaterial = () => {
  return new Promise(async (resolve, reject) => {
    const response = await fetch('https://genshin.honeyhunterworld.com/db/item/talent-level-up-material/');
    const body = await response.text();
    $ = cheerio.load(body);

    const rows = $('div.itemcont');

    const books = [];
    const weeklies = [];
    rows.each(function (i, elem) {
      const starCount = $(this).find('div.stars_wrap').length;
      const itemPic = $(this).find('img.itempic').attr('src').replace('_35', '');
      const itemName = $(this).find('span.itemname').text();
      const characters = $(this).find('div.sea_item_used_by_char').last().find('a');

      if (starCount != 4 && starCount != 5) return;
      if (characters.length == 0) return;

      const temp = [];
      characters.each(function (i, elem) {
        const URL = $(this).attr('href');
        const pic = $(this).find('img').attr('src').replace('_face_50', '');
        if (pic.includes('traveler')) return;
        temp.push({ URL, pic });
      });

      if (starCount == 4) {
        books.push({
          item: {
            name: itemName,
            pic: itemPic,
          },
          char: temp
        });
      }
      else if (starCount == 5) {
        weeklies.push({
          item: {
            name: itemName,
            pic: itemPic,
          },
          char: temp
        });
      }
    })

    resolve({ books, weeklies });
  });
}

module.exports = {
  scrapeTalentMaterial
}

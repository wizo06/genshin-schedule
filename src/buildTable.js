const fetch = require('node-fetch');
const cheerio = require('cheerio');

const retrieveCharacterName = (URL) => {
  return new Promise(async (resolve, reject) => {
    const response = await fetch(`https://genshin.honeyhunterworld.com${URL}`);
    const body = await response.text();
    $ = cheerio.load(body);
    const charName = $('h1.post-title.entry-title').text().trim();
    resolve(charName);
  })
};

const buildIconNameRows = (books, bookName) => {
  return new Promise(async (resolve, reject) => {
    const icons = [], names = [];
    for (const book of books) {
      if (book.item.name.includes(bookName)) {
        icons.push(`=IMAGE("https://genshin.honeyhunterworld.com${book.item.pic}")`);
        names.push(book.item.name.replace('Philosophies of ', ''));

        for (const char of book.char) {
          icons.push(`=IMAGE("https://genshin.honeyhunterworld.com${char.pic}")`);
          const charName = await retrieveCharacterName(char.URL);
          names.push(charName);
        }
      }
    }
    resolve({ icons, names });
  })
};

const buildWeekliesTable = (obj) => {
  return new Promise(async (resolve, reject) => {
    const table = [];
    for (const weekItem of obj.weeklies) {
      const icons = [], names = [];
      weekItem.item.name
      weekItem.item.pic
      icons.push(`=IMAGE("https://genshin.honeyhunterworld.com${weekItem.item.pic}")`);
      names.push(weekItem.item.name);
      
      for (const char of weekItem.char) {
        char.URL
        char.pic
        icons.push(`=IMAGE("https://genshin.honeyhunterworld.com${char.pic}")`);
        const charName = await retrieveCharacterName(char.URL);
        names.push(charName);
      }

      table.push( icons, names );
    }
    
    resolve(table);
  });
}

const buildRowWeaps = (domains, arr) => {
  let temp = [];
  domains.each(function (i, elem) {
    const dropIMG = $(this).find('img').first().attr('src');
    // Append talent book image
    // for (const weap of arr) {
    //   if (dropIMG == weap.weaponAscensionMaterial) {
    //     temp.push(`=IMAGE("https://genshin.honeyhunterworld.com${dropIMG}")`);
    //     break;
    //   }
    // }

    // Append the corresponding characters
    for (const weap of arr) {
      if (dropIMG == weap.weaponAscensionMaterial) {
        temp.push(`=IMAGE("https://genshin.honeyhunterworld.com${weap.portrait}")`);
      }
    }
  })
  return temp;
}

const buildWeapon = (arr) => {
  const fetch = require('node-fetch');
  const cheerio = require('cheerio');

  return new Promise((resolve, reject) => {
    const options = {
      url: `https://genshin.honeyhunterworld.com/`
    }

    request(options, (err, res, body) => {
      $ = cheerio.load(body)
      // Mon, Tue, Wed
      const mon = $('.homepage_index_cont.calendar_day_wrap').eq(0);
      const tue = $('.homepage_index_cont.calendar_day_wrap').eq(1);
      const wed = $('.homepage_index_cont.calendar_day_wrap').eq(2);
      // Domain
      const monDomains = mon.find('.item_secondary_title');
      const tueDomains = tue.find('.item_secondary_title');
      const wedDomains = wed.find('.item_secondary_title');

      // Build column arrays
      const monday = buildRowWeaps(monDomains, arr);
      const tuesday = buildRowWeaps(tueDomains, arr);
      const wednesday = buildRowWeaps(wedDomains, arr);

      const table = [monday, tuesday, wednesday];
      resolve(table);
    });
  });
};

const buildBooksTable = (obj) => {
  return new Promise(async (resolve, reject) => {
    const free = await buildIconNameRows(obj.books, 'Freedom');
    const resi = await buildIconNameRows(obj.books, 'Resistance');
    const ball = await buildIconNameRows(obj.books, 'Ballad');
    const pros = await buildIconNameRows(obj.books, 'Prosperity');
    const dili = await buildIconNameRows(obj.books, 'Diligence');
    const gold = await buildIconNameRows(obj.books, 'Gold');

    const table = [
      free.icons, free.names,
      pros.icons, pros.names,
      resi.icons, resi.names,
      dili.icons, dili.names,
      ball.icons, ball.names,
      gold.icons, gold.names
    ]
    resolve(table);
  });
};

module.exports = { 
  buildBooksTable, 
  buildWeekliesTable, 
  buildWeapon, 
}
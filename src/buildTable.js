const buildWeekly = (arr) => {
  return new Promise((resolve, reject) => {
    const table = [];
    const obj = {};
    for (const char of arr) {
      if (char.talentWeeklyIMG in obj) {
        obj[char.talentWeeklyIMG].push(`=IMAGE("https://genshin.honeyhunterworld.com${char.portrait}")`);
      }
      else {
        obj[char.talentWeeklyIMG] = [`=IMAGE("https://genshin.honeyhunterworld.com${char.portrait}")`];
      }
    }

    for (const key in obj) {
      table.push([`=IMAGE("https://genshin.honeyhunterworld.com${key}")`, ...obj[key]])
    }
    
    resolve(table);
  });
}

const buildColumnChars = (domains, arr) => {
  let temp = [];
  domains.each(function (i, elem) {
    const dropIMG = $(this).find('img').last().attr('src');
    // Append talent book image
    // for (const char of arr) {
    //   if (dropIMG == char.talentBookIMG) {
    //     temp.push(`=IMAGE("https://genshin.honeyhunterworld.com${dropIMG}")`);
    //     break;
    //   }
    // }

    // Append the corresponding characters
    for (const char of arr) {
      if (dropIMG == char.talentBookIMG) {
        temp.push(`=IMAGE("https://genshin.honeyhunterworld.com${char.portrait}")`);
      }
    }
  })
  return temp;
}

const buildTalentBook = (arr) => { 
  const request = require('request');
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
      const monday = buildColumnChars(monDomains, arr);
      const tuesday = buildColumnChars(tueDomains, arr);
      const wednesday = buildColumnChars(wedDomains, arr);

      const table = [monday, tuesday, wednesday];
      resolve(table);
    });
  });
}

const buildColumnWeaps = (domains, arr) => {
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
  const request = require('request');
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
      const monday = buildColumnWeaps(monDomains, arr);
      const tuesday = buildColumnWeaps(tueDomains, arr);
      const wednesday = buildColumnWeaps(wedDomains, arr);

      const table = [monday, tuesday, wednesday];
      resolve(table);
    });
  });
};

module.exports = { buildWeekly, buildTalentBook, buildWeapon }
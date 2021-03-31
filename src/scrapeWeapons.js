const request = require('request');
const cheerio = require('cheerio');

const scrapeByWeaponType = (weaponType) => {
  return new Promise ((resolve, reject) => {
    const options = {
      url: `https://genshin.honeyhunterworld.com/${weaponType}/`
    }

    const weapons = [];
    request(options, (err, res, body) => {
      $ = cheerio.load(body)

      let arrOfWeapons = $('table.art_stat_table').first().find('tr') // Live
      // let arrOfWeapons = $('table.art_stat_table').last().find('tr') // Beta

      arrOfWeapons.each(function (i, elem) {
        // Skip the first tr
        if (i === 0) return

        let weaponPic = $(this).find('img.itempic').eq(0).attr('src')

        let weaponName = $(this).find('td').eq(2).text()
        let weaponStar = $(this).find('td').eq(3).find('div').length

        let weaponAscensionMaterial = $(this).find('img.itempic').eq(1).attr('src')
        let eliteMaterial = $(this).find('img.itempic').eq(2).attr('src')
        let commonMaterial = $(this).find('img.itempic').eq(3).attr('src')
        
        weapons.push({
          name: weaponName,
          portrait: weaponPic,
          weaponStar,
          weaponAscensionMaterial,
          eliteMaterial,
          commonMaterial
        });
      })
      
      resolve(weapons);
    })
  })
}

const scrapeWeapons = () => {
  return new Promise(async (resolve, reject) => {
    console.log('    - Swords')
    const swords = await scrapeByWeaponType('sword')
    console.log('    - Claymores')
    const claymores = await scrapeByWeaponType('claymore')
    console.log('    - Polearms')
    const polearms = await scrapeByWeaponType('polearm')
    console.log('    - Bows')
    const bows = await scrapeByWeaponType('bow')
    console.log('    - Catalysts')
    const catalysts = await scrapeByWeaponType('catalyst')
    // resolve([...swords, ...claymores, ...polearms, ...bows, ...catalysts]);
    resolve({ swords, claymores, polearms, bows, catalysts });
  })
}

module.exports = {
  scrapeWeapons
}

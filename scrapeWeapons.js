const request = require('request');
const cheerio = require('cheerio');

let table = []
let arrOfDecarabian = []
let arrOfWolf = []
let arrOfGladiator = []
let arrOfGuyun = []
let arrOfVeiled = []
let arrOfAerosiderite = []
let arrOfWeaponAscMat = []

const scrapeByWeaponType = (weaponType) => {
  return new Promise ((resolve, reject) => {
    const options = {
      url: `https://genshin.honeyhunterworld.com/${weaponType}/`
    }

    request(options, (err, res, body) => {
      $ = cheerio.load(body)

      // let arrOfWeapons = $('table.art_stat_table').first().find('tr') // Live
      let arrOfWeapons = $('table.art_stat_table').last().find('tr') // Beta

      arrOfWeapons.each(function (i, elem) {
        // Skip the first tr
        if (i === 0) return

        let weaponName = $(this).find('td').eq(2).text()
        let weaponStar = $(this).find('td').eq(3).find('div').length

        let weaponPic = $(this).find('img.itempic').eq(0).attr('src')
        let weaponAscensionMaterial = $(this).find('img.itempic').eq(1).attr('src')
        let eliteMaterial = $(this).find('img.itempic').eq(2).attr('src')
        let commonMaterial = $(this).find('img.itempic').eq(3).attr('src')
        
        if (weaponAscensionMaterial.includes('decarabian')) {
          arrOfDecarabian.push([`=IMAGE("${weaponPic}")`, `${weaponStar}☆ ${weaponName}`])
        }
        else if (weaponAscensionMaterial.includes('wolf')) {
          arrOfWolf.push([`=IMAGE("${weaponPic}")`, `${weaponStar}☆ ${weaponName}`])
        }
        else if (weaponAscensionMaterial.includes('gladiator')) {
          arrOfGladiator.push([`=IMAGE("${weaponPic}")`, `${weaponStar}☆ ${weaponName}`])
        }
        else if (weaponAscensionMaterial.includes('guyun')) {
          arrOfGuyun.push([`=IMAGE("${weaponPic}")`, `${weaponStar}☆ ${weaponName}`])
        }
        else if (weaponAscensionMaterial.includes('veiled')) {
          arrOfVeiled.push([`=IMAGE("${weaponPic}")`, `${weaponStar}☆ ${weaponName}`])
        }
        else if (weaponAscensionMaterial.includes('aerosiderite')) {
          arrOfAerosiderite.push([`=IMAGE("${weaponPic}")`, `${weaponStar}☆ ${weaponName}`])
        }

        arrOfWeaponAscMat.push(weaponAscensionMaterial)
      })
      
      resolve()
    })
  })
}

const scrapeWeapons = () => {
  return new Promise(async (resolve, reject) => {
    console.log('Scraping swords')
    await scrapeByWeaponType('sword')
    console.log('Scraping claymores')
    await scrapeByWeaponType('claymore')
    console.log('Scraping polearms')
    await scrapeByWeaponType('polearm')
    console.log('Scraping bows')
    await scrapeByWeaponType('bow')
    console.log('Scraping catalysts')
    await scrapeByWeaponType('catalyst')

    console.log('Building weapons table')
    table.push([`=IMAGE("${arrOfWeaponAscMat.find(ele => ele.includes('decarabian'))}")`,
      '"Decarabian"',
      `=IMAGE("${arrOfWeaponAscMat.find(ele => ele.includes('wolf'))}")`,
      '"Wolf"',
      `=IMAGE("${arrOfWeaponAscMat.find(ele => ele.includes('gladiator'))}")`,
      '"Gladiator"',
    ])

    while(arrOfDecarabian.length > 0 ||
      arrOfWolf.length > 0 ||
      arrOfGladiator.length > 0) {

      let decarabianSlot = pullFromArray(arrOfDecarabian)
      let wolfSlot = pullFromArray(arrOfWolf)
      let gladiatorSlot = pullFromArray(arrOfGladiator)

      table.push([...decarabianSlot, ...wolfSlot, ...gladiatorSlot])
    }

    table.push(['', '', '', '', '', ''])
    
    table.push([`=IMAGE("${arrOfWeaponAscMat.find(ele => ele.includes('guyun'))}")`,
      '"Guyun"',
      `=IMAGE("${arrOfWeaponAscMat.find(ele => ele.includes('veiled'))}")`,
      '"Veiled"',
      `=IMAGE("${arrOfWeaponAscMat.find(ele => ele.includes('aerosiderite'))}")`,
      '"Aerosiderite"',
    ])

    while (arrOfGuyun.length > 0 ||
      arrOfVeiled.length > 0 ||
      arrOfAerosiderite.length > 0) {

      let guyunSlot = pullFromArray(arrOfGuyun)
      let veiledSlot = pullFromArray(arrOfVeiled)
      let aerosideriteSlot = pullFromArray(arrOfAerosiderite)

      table.push([...guyunSlot, ...veiledSlot, ...aerosideriteSlot])
    }

    resolve(table)
  })
}

const pullFromArray = (arr) => {
  arrayElement = arr.shift()
  if (arrayElement) return arrayElement
  return ['', '']
}

module.exports = {
  scrapeWeapons
}
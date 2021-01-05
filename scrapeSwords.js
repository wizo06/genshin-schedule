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

const scrapeSwords = () => {
  return new Promise ((resolve, reject) => {
    const options = {
      url: 'https://genshin.honeyhunterworld.com/sword/'
    }

    request(options, (err, res, body) => {
      $ = cheerio.load(body)

      let arrOfWeapons = $('table.art_stat_table').first().find('tr')

      arrOfWeapons.each(function (i, elem) {
        // Skip the first tr
        if (i === 0) return

        weaponName = $(this).find('td').eq(2).text()

        weaponPic = $(this).find('img.itempic').eq(0).attr('src')
        weaponAscensionMaterial = $(this).find('img.itempic').eq(1).attr('src')
        eliteMaterial = $(this).find('img.itempic').eq(2).attr('src')
        commonMaterial = $(this).find('img.itempic').eq(3).attr('src')
        
        if (weaponAscensionMaterial.includes('decarabian')) {
          arrOfDecarabian.push([`=IMAGE("${weaponPic}")`, weaponName])
        }
        else if (weaponAscensionMaterial.includes('wolf')) {
          arrOfWolf.push([`=IMAGE("${weaponPic}")`, weaponName])
        }
        else if (weaponAscensionMaterial.includes('gladiator')) {
          arrOfGladiator.push([`=IMAGE("${weaponPic}")`, weaponName])
        }
        else if (weaponAscensionMaterial.includes('guyun')) {
          arrOfGuyun.push([`=IMAGE("${weaponPic}")`, weaponName])
        }
        else if (weaponAscensionMaterial.includes('veiled')) {
          arrOfVeiled.push([`=IMAGE("${weaponPic}")`, weaponName])
        }
        else if (weaponAscensionMaterial.includes('aerosiderite')) {
          arrOfAerosiderite.push([`=IMAGE("${weaponPic}")`, weaponName])
        }

        arrOfWeaponAscMat.push(weaponAscensionMaterial)
      })

      table.push([`=IMAGE("${arrOfWeaponAscMat.find(ele => ele.includes('decarabian'))}")`,
                  '"Decarabian"',
                  `=IMAGE("${arrOfWeaponAscMat.find(ele => ele.includes('wolf'))}")`,
                  '"Wolf"',
                  `=IMAGE("${arrOfWeaponAscMat.find(ele => ele.includes('gladiator'))}")`,
                  '"Gladiator"',
      ])

      while (arrOfDecarabian.length > 0 ||
             arrOfWolf.length > 0 ||
             arrOfGladiator.length > 0) {
          
        let decarabianSlot = pullFromArray(arrOfDecarabian)
        let wolfSlot = pullFromArray(arrOfWolf)
        let gladiatorSlot = pullFromArray(arrOfGladiator)

        table.push([...decarabianSlot, ...wolfSlot, ...gladiatorSlot])
      }

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
      
      // console.log(table)
      resolve(table)
    })
  })
}

const pullFromArray = (arr) => {
  arrayElement = arr.shift()
  if (arrayElement) return arrayElement
  return ['', '']
}

module.exports = {
  scrapeSwords
}
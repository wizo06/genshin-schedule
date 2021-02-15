const request = require('request');
const cheerio = require('cheerio');

let table = []
let plume = []
let claw = []
let sigh = []
let tail = []
let ring = []
let locket = []
let tusk = []
let shard = []
let shadow = []
let arrOfItems = []

const scrapeTalentMaterials = () => {
  return new Promise((resolve, reject) => {
    const options = {
      url: 'https://genshin.honeyhunterworld.com/db/item/talent-level-up-material/'
    }

    request(options, (err, res, body) => {
      $ = cheerio.load(body)

      let rows = $('div.itemcont')

      rows.each(function (i, elem) {
        // let starCount = $(this).find('div.stars_wrap').length
        let itemName = $(this).find('span.itemname').text()
        let itemPic = $(this).find('img.itempic').attr('src')
        let chars = $(this).find('div.sea_item_used_by_char').find('img')

        if (itemName.includes(`Dvalin's Plume`)) {
          chars.each(function (index, element) {
            plume.push([`=IMAGE("https://genshin.honeyhunterworld.com/${$(this).attr('src')}")`])
          })
        }
        else if (itemName.includes(`Dvalin's Claw`)) {
          chars.each(function (index, element) {
            claw.push([`=IMAGE("https://genshin.honeyhunterworld.com/${$(this).attr('src')}")`])
          })
        }
        else if (itemName.includes(`Dvalin's Sigh`)) {
          chars.each(function (index, element) {
            sigh.push([`=IMAGE("https://genshin.honeyhunterworld.com/${$(this).attr('src')}")`])
          })
        }
        else if (itemName.includes(`Tail of Boreas`)) {
          chars.each(function (index, element) {
            tail.push([`=IMAGE("https://genshin.honeyhunterworld.com/${$(this).attr('src')}")`])
          })
        }
        else if (itemName.includes(`Ring of Boreas`)) {
          chars.each(function (index, element) {
            ring.push([`=IMAGE("https://genshin.honeyhunterworld.com/${$(this).attr('src')}")`])
          })
        }
        else if (itemName.includes(`Spirit Locket of Boreas`)) {
          chars.each(function (index, element) {
            locket.push([`=IMAGE("https://genshin.honeyhunterworld.com/${$(this).attr('src')}")`])
          })
        }
        else if (itemName.includes(`Tusk of Monoceros Caeli`)) {
          chars.each(function (index, element) {
            tusk.push([`=IMAGE("https://genshin.honeyhunterworld.com/${$(this).attr('src')}")`])
          })
        }
        else if (itemName.includes(`Shard of a Foul Legacy`)) {
          chars.each(function (index, element) {
            shard.push([`=IMAGE("https://genshin.honeyhunterworld.com/${$(this).attr('src')}")`])
          })
        }
        else if (itemName.includes(`Shadow of the Warrior`)) {
          chars.each(function (index, element) {
            shadow.push([`=IMAGE("https://genshin.honeyhunterworld.com/${$(this).attr('src')}")`])
          })
        }

        arrOfItems.push(itemPic)
      })

      resolve()
    })
  })
}

const scrapeTalents = () => {
  return new Promise(async (resolve, reject) => {
    console.log('Scraping Talent Materials')
    await scrapeTalentMaterials()

    console.log('Building talent table')
    table.push([`=IMAGE("https://genshin.honeyhunterworld.com/${arrOfItems.find(ele => ele.includes('plume'))}")`,
      `=IMAGE("https://genshin.honeyhunterworld.com/${arrOfItems.find(ele => ele.includes('claw'))}")`,
      `=IMAGE("https://genshin.honeyhunterworld.com/${arrOfItems.find(ele => ele.includes('sigh'))}")`,
    ])

    while (plume.length > 0 ||
      claw.length > 0 ||
      sigh.length > 0) {

      let plumeSlot = pullFromArray(plume)
      let clawSlot = pullFromArray(claw)
      let sighSlot = pullFromArray(sigh)

      table.push([...plumeSlot, ...clawSlot, ...sighSlot])
    }

    table.push(['', '', ''])

    table.push([`=IMAGE("https://genshin.honeyhunterworld.com/${arrOfItems.find(ele => ele.includes('tail'))}")`,
      `=IMAGE("https://genshin.honeyhunterworld.com/${arrOfItems.find(ele => ele.includes('ring'))}")`,
      `=IMAGE("https://genshin.honeyhunterworld.com/${arrOfItems.find(ele => ele.includes('locket'))}")`,,
    ])

    while (tail.length > 0 ||
      ring.length > 0 ||
      locket.length > 0) {

      let tailSlot = pullFromArray(tail)
      let ringSlot = pullFromArray(ring)
      let locketSlot = pullFromArray(locket)

      table.push([...tailSlot, ...ringSlot, ...locketSlot])
    }

    table.push(['', '', ''])

    table.push([`=IMAGE("https://genshin.honeyhunterworld.com/${arrOfItems.find(ele => ele.includes('tusk'))}")`,
    `=IMAGE("https://genshin.honeyhunterworld.com/${arrOfItems.find(ele => ele.includes('shard'))}")`,
    `=IMAGE("https://genshin.honeyhunterworld.com/${arrOfItems.find(ele => ele.includes('shadow'))}")`, ,
    ])

    while (tusk.length > 0 ||
      shard.length > 0 ||
      shadow.length > 0) {

      let tuskSlot = pullFromArray(tusk)
      let shardlot = pullFromArray(shard)
      let shadowSlot = pullFromArray(shadow)

      table.push([...tuskSlot, ...shardlot, ...shadowSlot])
    }

    // console.log(table)
    resolve(table)
  })
}

const pullFromArray = (arr) => {
  arrayElement = arr.shift()
  if (arrayElement) return arrayElement
  return ['']
}

module.exports = {
  scrapeTalents
}

scrapeTalentMaterials()
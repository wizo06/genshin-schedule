const request = require('request');
const cheerio = require('cheerio');

let table = []
let arrOfFreedom = []
let arrOfResistance = []
let arrOfBallad = []
let arrOfProsperity = []
let arrOfDiligence = []
let arrOfGold = []
let arrOfTalentBooks = []

const scrapeCharacters = () => {
  return new Promise ((resolve, reject) => {
    const options = {
      url: 'https://genshin.honeyhunterworld.com/db/char/characters/'
    }

    request(options, (err, res, body) => {
      $ = cheerio.load(body)

      let arrOfChars = $('div.char_sea_cont')

      arrOfChars.each(function (i, elem) {
        charName = $(this).find('span.sea_charname').text()

        // Skip current character if it's the Traveler
        if (charName.includes('Traveler')) return
        
        charPortrait = $(this).find('img.char_portrait_card_sea').attr('src')
        talentBook = $(this).find('div.sea_char_mat_cont').find('img').eq(0).attr('src')
        eleStone = $(this).find('div.sea_char_mat_cont').find('img').eq(1).attr('src')
        jewel = $(this).find('div.sea_char_mat_cont').find('img').eq(2).attr('src')
        localMaterial = $(this).find('div.sea_char_mat_cont').find('img').eq(3).attr('src')
        commonMaterial = $(this).find('div.sea_char_mat_cont').find('img').eq(4).attr('src')
        talentWeekly = $(this).find('div.sea_char_mat_cont').find('img').eq(5).attr('src')

        if (talentBook.includes('freedom')) {
          arrOfFreedom.push([`=IMAGE("${charPortrait}")`, charName])
        }
        else if (talentBook.includes('resistance')) {
          arrOfResistance.push([`=IMAGE("${charPortrait}")`, charName])
        }
        else if (talentBook.includes('ballad')) {
          arrOfBallad.push([`=IMAGE("${charPortrait}")`, charName])
        }
        else if (talentBook.includes('prosperity')) {
          arrOfProsperity.push([`=IMAGE("${charPortrait}")`, charName])
        }
        else if (talentBook.includes('diligence')) {
          arrOfDiligence.push([`=IMAGE("${charPortrait}")`, charName])
        }
        else if (talentBook.includes('gold')) {
          arrOfGold.push([`=IMAGE("${charPortrait}")`, charName])
        }

        arrOfTalentBooks.push(talentBook)
      })

      table.push([`=IMAGE("${arrOfTalentBooks.find(ele => ele.includes('freedom'))}")`,
                  '"Freedom"',
                  `=IMAGE("${arrOfTalentBooks.find(ele => ele.includes('resistance'))}")`,
                  '"Resistance"',
                  `=IMAGE("${arrOfTalentBooks.find(ele => ele.includes('ballad'))}")`,
                  '"Ballad"',
      ])

      while (arrOfFreedom.length > 0 ||
             arrOfResistance.length > 0 ||
             arrOfBallad.length > 0) {
          
        let freedomSlot = pullFromArray(arrOfFreedom)
        let resistanceSlot = pullFromArray(arrOfResistance)
        let balladSlot = pullFromArray(arrOfBallad)

        table.push([...freedomSlot, ...resistanceSlot, ...balladSlot])
      }

      table.push([`=IMAGE("${arrOfTalentBooks.find(ele => ele.includes('prosperity'))}")`,
                  '"Prosperity"',
                  `=IMAGE("${arrOfTalentBooks.find(ele => ele.includes('diligence'))}")`,
                  '"Diligence"',
                  `=IMAGE("${arrOfTalentBooks.find(ele => ele.includes('gold'))}")`,
                  '"Gold"',
      ])

      while (arrOfProsperity.length > 0 ||
             arrOfDiligence.length > 0 ||
             arrOfGold.length > 0) {

        let prosperitySlot = pullFromArray(arrOfProsperity)
        let diligenceSlot = pullFromArray(arrOfDiligence)
        let goldSlot = pullFromArray(arrOfGold)

        table.push([...prosperitySlot, ...diligenceSlot, ...goldSlot])
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
  scrapeCharacters
}
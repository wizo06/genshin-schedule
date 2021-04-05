const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');

// const { scrapeCharacters } = require('./scrapeCharacters.js');
// const { scrapeWeapons } = require('./scrapeWeapons.js');
const { buildWeekliesTable, buildWeapon, buildBooksTable } = require('./buildTable.js');
const { scrapeTalentMaterial } = require('./scrapeTalentMaterial.js');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Sheets API.
    authorize(JSON.parse(content), listMajors);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getNewToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
    });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error while trying to retrieve access token', err);
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) return console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });
            callback(oAuth2Client);
        });
    });
}

/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
async function listMajors(auth) {
  const sheets = google.sheets({ version: 'v4', auth });

  console.log('Scraping Talent Level-Up Material');
  const scrapedTalentMaterial = await scrapeTalentMaterial();
  
  console.log('  - Clearing')
  await sheets.spreadsheets.values.clear({
    spreadsheetId: '1r64uJbwQN4KQmsZ0OBFPvd6U2F482WTTRfDhOiwV0n4',
    range: '4.0!B2:1000'
  });

  console.log('  - Building');
  const booksTable = await buildBooksTable(scrapedTalentMaterial);
  const weekliesTable = await buildWeekliesTable(scrapedTalentMaterial);

  console.log('  - Writing')
  await sheets.spreadsheets.values.update({
    spreadsheetId: '1r64uJbwQN4KQmsZ0OBFPvd6U2F482WTTRfDhOiwV0n4',
    range: '4.0!B2:13',
    valueInputOption: 'USER_ENTERED',
    resource: {
      values: booksTable
    }
  });
  await sheets.spreadsheets.values.update({
    spreadsheetId: '1r64uJbwQN4KQmsZ0OBFPvd6U2F482WTTRfDhOiwV0n4',
    range: '4.0!A15:1000',
    valueInputOption: 'USER_ENTERED',
    resource: {
      values: weekliesTable
    }
  });

  // console.log('Weapon Table');
  // console.log('  - Scraping');
  // const scrapedWeapons = await scrapeWeapons();
  // console.log('  - Clearing')
  // await sheets.spreadsheets.values.clear({
  //   spreadsheetId: '1r64uJbwQN4KQmsZ0OBFPvd6U2F482WTTRfDhOiwV0n4',
  //   range: 'Page2!C4:26'
  // });
  // console.log('  - Building');
  // const swords = await buildWeapon(scrapedWeapons.swords);
  // const claymores = await buildWeapon(scrapedWeapons.claymores);
  // const polearms = await buildWeapon(scrapedWeapons.polearms);
  // const bows = await buildWeapon(scrapedWeapons.bows);
  // const catalysts = await buildWeapon(scrapedWeapons.catalysts);
  // console.log('  - Writing')
  // console.log('    - Swords')
  // await sheets.spreadsheets.values.update({
  //   spreadsheetId: '1r64uJbwQN4KQmsZ0OBFPvd6U2F482WTTRfDhOiwV0n4',
  //   range: 'Page2!C4:6',
  //   valueInputOption: 'USER_ENTERED',
  //   resource: {
  //     values: swords
  //   }
  // });
  // console.log('    - Claymores')
  // await sheets.spreadsheets.values.update({
  //   spreadsheetId: '1r64uJbwQN4KQmsZ0OBFPvd6U2F482WTTRfDhOiwV0n4',
  //   range: 'Page2!C9:11',
  //   valueInputOption: 'USER_ENTERED',
  //   resource: {
  //     values: claymores
  //   }
  // });
  // console.log('    - Polearms')
  // await sheets.spreadsheets.values.update({
  //   spreadsheetId: '1r64uJbwQN4KQmsZ0OBFPvd6U2F482WTTRfDhOiwV0n4',
  //   range: 'Page2!C14:16',
  //   valueInputOption: 'USER_ENTERED',
  //   resource: {
  //     values: polearms
  //   }
  // });
  // console.log('    - Bows')
  // await sheets.spreadsheets.values.update({
  //   spreadsheetId: '1r64uJbwQN4KQmsZ0OBFPvd6U2F482WTTRfDhOiwV0n4',
  //   range: 'Page2!C19:21',
  //   valueInputOption: 'USER_ENTERED',
  //   resource: {
  //     values: bows
  //   }
  // });
  // console.log('    - Catalysts')
  // await sheets.spreadsheets.values.update({
  //   spreadsheetId: '1r64uJbwQN4KQmsZ0OBFPvd6U2F482WTTRfDhOiwV0n4',
  //   range: 'Page2!C24:26',
  //   valueInputOption: 'USER_ENTERED',
  //   resource: {
  //     values: catalysts
  //   }
  // });

  console.log('Done')
}
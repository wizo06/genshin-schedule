const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');

const { scrapeCharacters } = require('./scrapeCharacters.js');
const { scrapeWeapons } = require('./scrapeWeapons.js');
const { scrapeTalents } = require('./scrapeTalents.js');

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

  console.log('Clearing sheet')
  sheets.spreadsheets.values.clear({
    spreadsheetId: '1r64uJbwQN4KQmsZ0OBFPvd6U2F482WTTRfDhOiwV0n4',
    range: '2.0!B3:K'
  })
  
  console.log('Scraping characters')
  let scrapedCharacters = await scrapeCharacters();
  console.log('Scraping weapons')
  let scrapedWeapons = await scrapeWeapons();
  console.log('Scraping talents');
  let scrapedTalents = await scrapeTalents();

  let emptyRow = [['', '', '', '', '', '']]

  console.log('Writing book and weapon')
  sheets.spreadsheets.values.update({
    spreadsheetId: '1r64uJbwQN4KQmsZ0OBFPvd6U2F482WTTRfDhOiwV0n4',
    range: '2.0!B3:G',
    valueInputOption: 'USER_ENTERED',
    resource: {
      values: [...scrapedCharacters, ...emptyRow, ...scrapedWeapons]
    }
  });

  console.log('Writing talent')
  sheets.spreadsheets.values.update({
    spreadsheetId: '1r64uJbwQN4KQmsZ0OBFPvd6U2F482WTTRfDhOiwV0n4',
    range: '2.0!I3:K',
    valueInputOption: 'USER_ENTERED',
    resource: {
      values: [...scrapedTalents]
    }
  });
}
const express = require('express')
const app = express()
app.set('view engine', 'ejs')
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.get('/', function (req, res) {
  res.render('index');
})

app.listen(4000, function () {
  console.log('Example app listening on port 4000!')
})

app.post('/', function (req, res) {
  res.render('index');
  console.log(req.body.city);
})
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Sheets API.
  authorize(JSON.parse(content), listData);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
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







function listData(auth) {
  var listOfData = [];
  const sheets = google.sheets({version: 'v4', auth});
  sheets.spreadsheets.values.get({
    spreadsheetId: '17bmr6R3f4pzm5GXGsH8zHcIcfxHd6ETxvzGK3_LKtUA',
    range: 'Grants',
  }, (err, res) => {
    rowMe = 0;
    if (err) return console.log('The API returned an error: ' + err);
    const rows = res.data.values;
    if (rows.length) {
      //console.log('Name, Provider, Deadline, Funding, Type, Grant Categories');
      // Print columns A and E, which correspond to indices 0 and 4.
      rows.map((row) => {
        listOfData.push(`${row[0]},${row[1]},${row[2]},${row[3]},${row[4]},${row[5]},${row[6]},${row[7]},${row[8]},${row[9]},${row[10]}`);
        
      });
      
    } else {
      console.log('No data found.');
    }
    //console.log(listOfData[1]);
    app.locals.myHTML = data2D(listOfData);

});
}

function data2D(listOfData){
  var array2D = [];
  app.locals.weather = listOfData[1];
  for(line in listOfData){
    console.log(line);
    var lineOf = listOfData[line].toString().split(',');
    array2D.push(lineOf);
  }
  console.log(array2D);
  var myHTML = makeTableHTML(array2D);
  return myHTML;
}

function makeTableHTML(myArray) {
  var result = '<table class=”searchable sortable” id="scrolltable" border=1>';
  for(var i=0; i<myArray.length; i++) {
      result += "<tr>";
      for(var j=0; j<myArray[i].length; j++){
          result += "<td>"+myArray[i][j]+"</td>";
      }
      result += "</tr>";
  }
  result += "</table>";

  return result;
}
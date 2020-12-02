const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');

const CRED_FILE_PATH = 'credentials.json';
console.log(`Your cred path is ${CRED_FILE_PATH}`); // ../creds.json
const VIEW_ID = '254840709';
console.log(`Your view id is ${VIEW_ID}`);

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/analytics.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
fs.readFile(CRED_FILE_PATH, (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Drive API.
  authorize(JSON.parse(content), getUserReport);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.web;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
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
function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', code => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), err => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Number of users between last week and two weeks ago.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function getUserReport(auth) {
  const service = google.analyticsreporting({ version: 'v4', auth });
  const googleAnalyticsReports = {
    resource: {
      reportRequests: [
        {
          viewId: VIEW_ID,
          dateRanges: [
            {
              startDate: '14daysAgo',
              endDate: '7daysAgo'
            }
          ],
          metrics: [
            {
              expression: 'ga:users'
            }
          ]
        }
      ]
    }
  };

  service.reports.batchGet(googleAnalyticsReports, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const reports = res.data.reports;
    if (reports.length) {
      console.log('Reports:');
      reports.forEach(report => {
        console.log('\tMetrics:');
        report.columnHeader.metricHeader.metricHeaderEntries.forEach(
          metricHeader => console.log('\t\t', metricHeader.name)
        );
        report.data.rows.forEach(row => console.log('\t\t', row.metrics));
      });
    } else {
      console.log('No data found.');
    }
  });
}

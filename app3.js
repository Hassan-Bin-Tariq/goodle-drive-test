const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
const { CallTracker } = require('assert');

const CLIENT_ID = '415909867180-3qsq9763f4fn19p6apd3jjpopfcgm8jl.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';

const REFRESH_TOKEN = '1//04M0ikiwU6OZUCgYIARAAGAQSNwF-L9IrIg2s124iUtx_OwI926BCPcntsjIHSVoJFGdHYBQdeVNR6LqdQHSaNnYCFtHyPpbd5Lg';

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({
  version: 'v3',
  auth: oauth2Client,
});

/* 
filepath which needs to be uploaded
Note: Assumes example.jpg file is in root directory, 
though this can be any filePath
*/
const filePath = path.join(__dirname, 'cat.jpg');

async function folder() {
  try {
    const response = await drive.files.create({
        
      requestBody: {
        'name': "UserEmail",
        mimeType: 'application/vnd.google-apps.folder',
        'parents':  ['10elnl3PbYG1OkJ3VpXWg8kg1hcesoe_v']
      },
    });

    console.log(response.data);
  } catch (error) {
    console.log(error.message);
  }

}
//folder()

async function uploadFile() {
  try {
    const response = await drive.files.create({
        
      requestBody: {
        name: 'example.jpg', //This can be name of your choice
        mimeType: 'image/jpg',
        'parents':  ['10elnl3PbYG1OkJ3VpXWg8kg1hcesoe_v']
      },
      media: {
        mimeType: 'image/jpg',
        body: fs.createReadStream(filePath),
      },
    });

    console.log(response.data);
  } catch (error) {
    console.log(error.message);
  }
}

//uploadFile();

async function deleteFile() {
  try {
    const response = await drive.files.delete({
        'parents':  ['10elnl3PbYG1OkJ3VpXWg8kg1hcesoe_v'],
        fileId: '1KAwxachYPf3qwV8l9MDDyb4RWzN9oCsX',
    });
    console.log(response.data, response.status);
  } catch (error) {
    console.log(error.message);
  }
}

//deleteFile();

async function generatePublicUrl() {
  try {
    const fileId = 'YOUR FILE ID';
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    /* 
    webViewLink: View the file in browser
    webContentLink: Direct download link 
    */
    const result = await drive.files.get({
      fileId: fileId,
      fields: 'webViewLink, webContentLink',
    });
    console.log(result.data);
  } catch (error) {
    console.log(error.message);
  }
}
// generatePublicUrl();

rollNumbers = []
folderIDS = []
imageIDS = []
imageURLS = []
var dict = {};
async function listFolders() {
  try {
    const fileId = '188FbNu8fX8L5qDbgi_2zCO5ecSAum7KH';

    const result = await drive.files.list({
      q: "mimeType='application/vnd.google-apps.folder' and '17McWc-DAfayH0BYiM7jmGbdLd-PXQNyH' in parents"
        //parent: fileId 
      //fields: 'webViewLink, webContentLink'
    });
    for (let i = 0; i < result.data.files.length; i++) {
      rollNumbers.push(result.data.files[i].name)
      folderIDS.push(result.data.files[i].id)
    }
    console.log(rollNumbers);
    console.log(folderIDS);
  } catch (error) {
    console.log(error.message);
  }
}

async function getpicsInsideFolders() {
  try {
    for (let i = 0; i < folderIDS.length; i++) {    
      //console.log(folderIDS[i])
      const result = await drive.files.list({
        q:"mimeType='image/jpeg'and '"+folderIDS[i]+"' in parents"
      });
      imageIDS.push(result.data.files[0].id) //SIRF PEHLI PEHLI FILES UTHANI HA MATCH KRNEY K LIA JO SIGN UP K TIME DI USER NE
    }
    console.log(imageIDS)
  } catch (error) {
    console.log(error.message);
  }
}

async function generateUrls() {
  try {
    for (let i = 0; i < imageIDS.length; i++) {
      const result = await drive.files.get({
        fileId: imageIDS[i],
        fields: 'webViewLink, webContentLink'
      });
      imageURLS.push(result.data.webViewLink)
    }
    console.log(imageURLS);
  } catch (error) {
    console.log(error.message);
  }
}

function generateDictonary(){
  for (let i = 0; i < imageURLS.length; i++) {
    dict[rollNumbers[i]] = imageURLS[i];
  }
  console.log(dict)
}

async function function_caller(){
  await listFolders()
  await getpicsInsideFolders()
  await generateUrls()
  generateDictonary()
}

function_caller()
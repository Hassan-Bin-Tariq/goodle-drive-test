const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

const CLIENT_ID = '120395212123-9hk2kljiph2u2jedsuqojvmjbcrrv1v0.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';

const REFRESH_TOKEN = '1//04DwuItFgZ6pGCgYIARAAGAQSNwF-L9IrqmvaF3TM06EFMtH8Mr4u7Syp7ZCRn2jQ0CvhM3xEASoMt0ZHwXQ4NNi5W3eUbpDOD-o';


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
  
const filePath = path.join(__dirname, 'hassan.jpg');


async function uploadFile() {
    try {
      const response = await drive.files.create({
        requestBody: {
          name: 'hassan.jpg', //This can be name of your choice
          mimeType: 'image/jpg',
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
  
// uploadFile();


async function deleteFile() {
    try {
      const response = await drive.files.delete({
        fileId: '112y0OwFBqCgH_1TmenJSrrbPyInNInH0',
      });
      console.log(response.data, response.status);
    } catch (error) {
      console.log(error.message);
    }
  }
  
deleteFile();
async function generatePublicUrl() {
    try {
      const fileId = '1bPNXLPmMElgCyRQ_d_68vn87l3TQBvEK';
      await drive.permissions.create({
        fileId: fileId,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });
  
      const result = await drive.files.get({
        fileId: fileId,
        fields: 'webViewLink, webContentLink',
      });
      console.log(result.data);
    } catch (error) {
      console.log(error.message);
    }
  }

  //generatePublicUrl();
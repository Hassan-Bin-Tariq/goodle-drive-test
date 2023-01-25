const fs = require('fs')
const readline = require('readline');
const {google} = require('googleapis');

// service account key file from Google Cloud console.
const KEYFILEPATH = 'C:\\Users\\SmartCom\\Desktop\\key2.json';

// Request full drive access.
const SCOPES = ['https://www.googleapis.com/auth/drive'];

// Create a service account initialize with the service account key file and scope needed
const auth = new google.auth.GoogleAuth({
    keyFile: KEYFILEPATH,
    scopes: SCOPES 
});

async function createAndUploadFile(auth){

    const driveService = google.drive({version: 'v3', auth});

    let fileMetadata = {
        'name': 'hassan2.jpg',
        'parents':  ['15jMGzpWRGkYtV1mitmM6AcUhuB-xWS0J']
    };

    let media = {
        mimeType: 'image/jpeg',
        body: fs.createReadStream('hassan2.png')
    };

    let response = await driveService.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id'
    });

    switch(response.status){
        case 200:
            let file = response.result;
            console.log('Created File Id: ', response.data.id);
            break;
        default:
            console.error('Error creating the file, ' + response.errors);
            break;
    }
}

createAndUploadFile(auth).catch(console.error);

async function generatePublicUrl(auth) {
    const driveService = google.drive({version: 'v3', auth});
    try {
      const fileId = '1_XjR5RZcWTGluPNYTeLFlR7Bgc4FIt-u';
      await driveService.permissions.create({
        fileId: fileId,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });
  
      const result = await driveService.files.get({
        fileId: fileId,
        fields: 'webViewLink, webContentLink',
      });
      console.log(result.data);
    } catch (error) {
      console.log(error.message);
    }
  }
 // generatePublicUrl(auth)

 async function DlImgFromFolder(auth, folderId) {
    const drive = google.drive({ version: "v3", auth });
    const res = await drive.files
      .get({ fileId: folderId })
      .catch((err) => console.log(err.errors));
    if (!res) return;
    const folderName = res.data.name;
  
    var query =
      "'" +
      folderId +
      "' in parents and mimeType contains 'image/' and trashed = false";
    drive.files.list(
      {
        q: query,
        fields: "files(id, name)",
      },
      function (error, response) {
        if (error) {
          return console.log("ERROR", error);
        }
  
        response.data.files.forEach(function (item) {
        //   var file = fs.createWriteStream("./" + folderName + "/" + item.name);
        //   file.on("finish", function () {
            console.log("DDownloaded", item.id);
          //});
  
          // Download file
          drive.files.get(
            {
              fileId: item.id,
              alt: "media",
            },
            {
              responseType: "stream",
            },
            function (err, response) {
              if (err) return "";
  
              response.data
                .on("error", (err) => {})
                .on("end", () => {})
                //.pipe(file);
            }
          );
        });
      }
    );
  }
  //DlImgFromFolder(auth,'1iQ0NAYlyx2TVOKEkF7aFMH1CoQ7CO_Jg')
const fs = require('fs');
const path = require('path');
const moment = require('moment');

const getCurrentTimestamp = () => {
  return moment().format('YYYYMMDDHHmmss');
};

const uploadSameTypeInServer = async (request, ImageLocation = '', base64 = '') => {
  var buf = Buffer.from(base64, 'base64');

  const UploadActName = 'account1';
  const uploadDirectory = path.join(__dirname, '..' , 'uploads', UploadActName, ImageLocation);

  console.log(uploadDirectory, "uploadDirectory");

  let ImageName = `${getCurrentTimestamp()}.png`;
  let ImagePath = path.join(uploadDirectory, ImageName);

  return new Promise((resolve, reject) => {
    fs.writeFile(ImagePath, buf, function (err) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(ImageName);
      }
    });
  });
};

module.exports = uploadSameTypeInServer;

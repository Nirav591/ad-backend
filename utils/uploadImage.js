const getCurrentTimestamp = () => {
  return moment().format('YYYYMMDDHHmmss');
};


const uploadSameTypeInServer = async (request, ImageLocation = '', base64 = '') => {
  var buf = Buffer.from(base64, 'base64');

  const UploadActName = 'account1';
  const uploadDirectory = path.join(__dirname, '..', '..', 'uploads', UploadActName, ImageLocation);

  console.log(uploadDirectory , "uploadDirectory");


  let ImageName = await getCurrentTimestamp + ".png";
  let ImagePath = path.join(uploadDirectory, ImageName);
  return new Promise(resolve => {
    fs.writeFile(ImagePath, buf, function (err, res) {
      if (err) {
        console.log(err);
        console.log(err);
        return resolve('');
      } else {
        return resolve(ImageName);
      }
    });
  });
}

module.exports = uploadSameTypeInServer;



const getCurrentTimestamp = () => {
  return moment().format('YYYYMMDDHHmmss');
};


Common.uploadSameTypeInServer = async (request, ImageLocation = '') => {
  var buf = Buffer.from(request.base64, 'base64');

  if (request.base64) {



    const UploadActName = 'account1';
    const uploadDirectory = path.join(__dirname, '..', '..', 'uploads', UploadActName, ImageLocation);


    let ImageName = getCurrentTimestamp + '.png';
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

}
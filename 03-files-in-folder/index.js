const path = require('path');
const fs = require('fs');
const pathToSecretFolder = path.join(__dirname, 'secret-folder');

try {
  fs.readdir(pathToSecretFolder, { withFileTypes: true }, (_, files) => {
    files.forEach((file) => {
      if (file.isFile()) {
        const filePath = path.join(pathToSecretFolder, file.name);
        const stats = fs.statSync(filePath);

        const fileExtension = path.extname(filePath);
        const fileName = path.basename(filePath, fileExtension);
        const fileSize = stats.size;

        const fileInfo = `${fileName} - ${fileExtension.replace(
          '.',
          '',
        )} - ${fileSize}`;

        console.log(fileInfo);
      }
    });
  });
} catch (err) {
  console.log(err);
}

(async function copyFolder() {
  const fs = require('fs');
  const fsPromises = require('fs/promises');
  const path = require('path');
  const oldFolderPath = path.join(__dirname, 'files');
  const newFolderPath = path.join(__dirname, 'files-copy');
  let isNewFolder = false;

  // check if files-copy folder exists
  try {
    await fsPromises.access(newFolderPath);
    isNewFolder = true;
    console.log('files-copy folder exists!');
  } catch (err) {
    console.log('There is no files-copy folder!');
    throw err;
  }

  //if files-copy folder exists delete it with all its files
  if (isNewFolder) {
    try {
      await fsPromises.rm(newFolderPath, { recursive: true });
      console.log('file-copy folder deleted!');
    } catch (err) {
      console.log('file-copy folder not found or already deleted!');
      throw err;
    }
  }

  // create a files-copy folder
  try {
    await fsPromises.mkdir(newFolderPath, { recursive: true });
    console.log('file-copy folder created!');
  } catch (err) {
    console.log('file-copy folder has not been created!');
    throw err;
  }

  // copy files from files folder to files-copy folder.
  fs.readdir(oldFolderPath, (err, files) => {
    if (err) {
      throw err;
    }
    files.forEach((file) => {
      const oldFilePath = path.join(oldFolderPath, file);
      const newFilePath = path.join(newFolderPath, file);
      fs.copyFile(oldFilePath, newFilePath, (err) => {
        if (err) {
          throw err;
        }
        console.log(file + ' has been coppied');
      });
    });
  });
})();

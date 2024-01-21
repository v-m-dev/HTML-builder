(async function bundleStyles() {
  const path = require('path');
  const fsPromises = require('fs/promises');
  const pathToStylesFolder = path.join(__dirname, 'styles');
  let files = null;
  const stylesToBundle = [];

  try {
    files = await fsPromises.readdir(pathToStylesFolder, {
      withFileTypes: true,
    });
  } catch (error) {
    console.log('cannot read styles folder');
  }

  // Read all CSS files in the styles folder and push their content to the stylesToBundle array.
  for (const file of files) {
    if (file.isFile()) {
      const filePath = path.join(pathToStylesFolder, file.name);

      const fileExtension = path.extname(filePath);
      if (fileExtension === '.css') {
        try {
          const data = await fsPromises.readFile(filePath, 'utf8');
          stylesToBundle.push(data);
        } catch (error) {
          console.log('cannot read file ' + file.name);
        }
      }
    }
  }

  //   Write the stylesToBundle array to a new file called bundle.css.
  try {
    await fsPromises.writeFile(
      path.join(__dirname, 'project-dist/bundle.css'),
      stylesToBundle.join('\n'),
    );
  } catch (error) {
    console.log('cannot add bundle.css to project-dist folder');
  }
})();

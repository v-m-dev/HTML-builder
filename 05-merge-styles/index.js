(async function bundleStyles() {
  const path = require('path');
  const fsPromises = require('fs/promises');
  const pathToStylesFolder = path.join(__dirname, 'styles');

  const stylesToBundle = [];

  const files = await fsPromises.readdir(pathToStylesFolder, {
    withFileTypes: true,
  });

  // Read all CSS files in the styles folder and push their content to the stylesToBundle array.
  for (const file of files) {
    if (file.isFile()) {
      const filePath = path.join(pathToStylesFolder, file.name);

      const fileExtension = path.extname(filePath);
      if (fileExtension === '.css') {
        const data = await fsPromises.readFile(filePath, 'utf8');

        stylesToBundle.push(data);
      }
    }
  }

  //   Write the stylesToBundle array to a new file called bundle.css.
  await fsPromises.writeFile(
    path.join(__dirname, 'project-dist/bundle.css'),
    stylesToBundle.join('\n'),
  );
})();

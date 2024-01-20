const fsPromises = require('fs/promises');
const path = require('path');

(async function buildPage() {
  const projectDistPath = path.join(__dirname, 'project-dist');
  const indexHtmlPath = path.join(projectDistPath, 'index.html');
  const indexHtml = await composeIndexHtml();
  const styles = await collectStyles(path.join(__dirname, 'styles'));
  const sorceAssetsPath = path.join(__dirname, 'assets');
  const targetAssetsPath = path.join(projectDistPath, 'assets');

  //   Create project-dist folder
  await createFolder(projectDistPath);

  //   Add index.html to project-dist folder
  await createFile(indexHtmlPath, indexHtml);

  //   Add styles to project-dist folder
  try {
    await fsPromises.writeFile(
      path.join(__dirname, 'project-dist/style.css'),
      styles,
    );
  } catch (err) {
    console.log(err.message);
  }

  //   Reset project-dist/assets folder if it exists to remove unneeded files
  await removeFolder(targetAssetsPath);
  await createFolder(targetAssetsPath);

  //   Copy assets to project-dist/assets folder
  await copyFolder(sorceAssetsPath, targetAssetsPath);
})();

async function createFolder(folderPath) {
  let folder = null;
  try {
    folder = await fsPromises.mkdir(folderPath, {
      recursive: true,
    });
  } catch (err) {
    console.log(err.message);
  }
  return folder;
}

async function copyFolder(sorcePath, targetPath) {
  try {
    const files = await fsPromises.readdir(sorcePath, { withFileTypes: true });
    for (const file of files) {
      if (file.isFile()) {
        const sorceFilePath = path.join(sorcePath, file.name);
        const targetFilePath = path.join(targetPath, file.name);
        await fsPromises.copyFile(sorceFilePath, targetFilePath);
      } else {
        await createFolder(path.join(targetPath, file.name));
        await copyFolder(
          path.join(sorcePath, file.name),
          path.join(targetPath, file.name),
        );
      }
    }
  } catch (err) {
    console.log(err.message);
  }
}

async function removeFolder(folderPath) {
  let isNewFolder = false;

  if (isNewFolder) {
    try {
      await fsPromises.rm(folderPath, { recursive: true, force: true });
    } catch (err) {
      console.log(err.message);
    }
  }
}

async function createFile(filePath, fileContent) {
  let file = null;
  try {
    file = await fsPromises.writeFile(filePath, fileContent);
  } catch (err) {
    console.log(err.message);
  }
  return file;
}

async function getFileContent(filePath) {
  let fileContent = '';
  try {
    fileContent = await fsPromises.readFile(filePath, 'utf8');
  } catch (err) {
    console.log(err.message);
  }
  return fileContent;
}

async function collectStyles(stylesPath) {
  const styles = [];

  const files = await fsPromises.readdir(stylesPath);

  // Read all css files in the styles folder and push their content to the stylesToBundle array.
  for (const file of files) {
    const filePath = path.join(stylesPath, file);
    const data = await fsPromises.readFile(filePath, 'utf8');
    styles.push(data);
  }

  return styles.join('\n');
}

async function composeIndexHtml() {
  const templatePath = path.join(__dirname, 'template.html');
  const headerPath = path.join(__dirname, 'components', 'header.html');
  const articlesPath = path.join(__dirname, 'components', 'articles.html');
  const footerPath = path.join(__dirname, 'components', 'footer.html');

  //   Get data from html files
  const headerContent = await getFileContent(headerPath);
  const articlesContent = await getFileContent(articlesPath);
  const footerContent = await getFileContent(footerPath);
  let templateContent = await getFileContent(templatePath);

  //   Add components to template
  templateContent = templateContent.replace('{{header}}', headerContent);
  templateContent = templateContent.replace('{{articles}}', articlesContent);
  templateContent = templateContent.replace('{{footer}}', footerContent);

  return templateContent;
}

const fsPromises = require('fs/promises');
const path = require('path');

(async function buildPage() {
  const projectDistPath = path.join(__dirname, 'project-dist');
  const templatePath = path.join(__dirname, 'template.html');
  const headerPath = path.join(__dirname, 'components', 'header.html');
  const articlesPath = path.join(__dirname, 'components', 'articles.html');
  const footerPath = path.join(__dirname, 'components', 'footer.html');

  //   Get data from html files
  let templateContent = await getFileContent(templatePath);
  const headerContent = await getFileContent(headerPath);
  const articlesContent = await getFileContent(articlesPath);
  const footerContent = await getFileContent(footerPath);

  //   Add components to template
  templateContent = templateContent.replace('{{header}}', headerContent);
  templateContent = templateContent.replace('{{articles}}', articlesContent);
  templateContent = templateContent.replace('{{footer}}', footerContent);

  //   Create project-dist folder
  await createFolder(projectDistPath);

  //   Add index.html to project-dist folder
  await createFile(path.join(projectDistPath, 'index.html'), templateContent);
})();

async function getFileContent(filePath) {
  let fileContent = '';
  try {
    fileContent = await fsPromises.readFile(filePath, 'utf8');
  } catch (err) {
    console.log(err.message);
  }
  return fileContent;
}

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

async function createFile(filePath, fileContent) {
  let file = null;
  try {
    file = await fsPromises.writeFile(filePath, fileContent);
  } catch (err) {
    console.log(err.message);
  }
  return file;
}

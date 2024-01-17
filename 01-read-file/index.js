const path = require('path');
const fs = require('fs');

(function readFile() {
  const textPath = path.join(__dirname, 'text.txt');
  let text = '';

  const readStream = fs.createReadStream(textPath, 'utf8');

  readStream.on('data', (chunk) => {
    text += chunk;
  });

  readStream.on('end', () => {
    console.log(text);
  });
})();

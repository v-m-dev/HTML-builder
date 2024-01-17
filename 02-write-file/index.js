const readline = require('readline');
const fs = require('fs');
const path = require('path');
const textPath = path.join(__dirname, 'text.txt');

const rl = readline.createInterface(process.stdin, process.stdout);
console.log('Hello there! Do you whant to add something to text.txt file?');

rl.setPrompt('Add any text or type "exit" to close the program: ');
rl.prompt();
rl.on('line', (userInput) => {
  if (userInput.toLowerCase() === 'exit') {
    rl.close();
    console.log('See you later!');
    rl.removeAllListeners();
    return;
  }

  fs.appendFile(textPath, `${userInput}\n`, function (err) {
    if (err) throw err;
  });
});

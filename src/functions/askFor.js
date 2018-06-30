const readline = require('readline');

module.exports = async label => new Promise((resolve) => {
  const rl = readline.createInterface(process.stdin, process.stdout);
  rl.question(`${label}: `, (result) => {
    rl.close();
    resolve(result);
  });
});

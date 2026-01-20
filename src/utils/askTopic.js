const readline = require("readline");


function askTopic() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve => {
    rl.question("Informe o tema para pesquisa: ", answer => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

module.exports = {
    askTopic
};

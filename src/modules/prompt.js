const readline = require('readline');

const getValue = label => new Promise((resolve) => {
  const rl = readline.createInterface(process.stdin, process.stdout);
  rl.question(`${label}: `, (result) => {
    rl.close();
    resolve(result);
  });
});

const getChoice = (label, choices) => new Promise(async (resolve) => {
  let input = await getValue(`${label} - (${choices.join(', ')})`);
  while (!choices.includes(input)) {
    console.log('Invalid choice');
    input = await getValue(label);
  }
  
  resolve(input);
});

const getInteger = label => new Promise(async (resolve) => {
  let input = await getValue(`${label} - (integer)`);
  while (typeof input !== 'number') {
    console.log('Invalid input');
    input = await getValue(label);
  }
  
  resolve(input);
});

const isBooleanString = val => val === 'true' || val === 'false';

const getBoolean = label => new Promise(async (resolve) => {
  let input = await getValue(`${label} - (true/false)`);
  while (!isBooleanString(input)) {
    console.log('Invalid input');
    input = await getValue(label);
  }
  
  resolve(input === 'true');
});

const isJSONString = (val) => {
  try { 
    JSON.parse(val); 
    return true;
  } catch (e) { 
    return false;
  }
}

const getJSON = label => new Promise(async (resolve) => {
  let input = await getValue(`${label} - (JSON)`);
  while (!isJSONString(input)) {
    console.log('Invalid input');
    input = await getValue(label);
  }
  
  resolve(JSON.parse(input));
});

const getArray = async (label) => {
  const input = await getValue(`${label} - (comma-separated strings)`);
  return input.split(',');
};

const getConfirmation = async () => {
  console.log();
  const input = await getValue('Confirm operation (yes/no)');
  return input === 'yes';
};

module.exports = {
  isBooleanString,
  isJSONString,
  getValue,
  getChoice,
  getInteger,
  getBoolean,
  getJSON,
  getArray,
  getConfirmation,
};

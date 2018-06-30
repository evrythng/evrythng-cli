const evrythng = require('evrythng-extended');

const config = require('../modules/config');
const switches = require('../modules/switches');

const REGIONS = {
  us: 'https://api.evrythng.com',
  eu: 'https://api-eu.evrythng.com',
};

const getAvailableOperators = () => Object.keys(config.get('operators'));

const checkOperatorExists = (name) => {
  const items = getAvailableOperators();
  if (!items.includes(name)) throw new Error(`\nOperator '${name}' not found in ${config.PATH}.`);
};

const resolveKey = (name) => {
  checkOperatorExists(name);

  return config.get('operators')[name].apiKey;
};

const useOperator = ([name]) => {
  checkOperatorExists(name);
  config.set('using', name);
};

const formatOperator = item => `'${item}' (Key: ${resolveKey(item).substring(0, 4)}...)`;

const list = () => {
  const operators = getAvailableOperators();
  if (!operators.length) {
    console.log('No Operators available.');
    return { operators: [], using: '' };
  }

  const { noOutput } = config.get('options');
  if (!noOutput) {
    const formatted = operators.map(formatOperator).join('\n- ');
    console.log(`\nCurrent Operator: '${config.get('using')}'`);
    console.log(`\nAvailable Operators:\n\n- ${formatted}\n`);
  }

  return { operators, using: config.get('using') };
};

const showKey = ([name]) => {
  const key = resolveKey(name);

  const { noOutput } = config.get('options');
  if (!noOutput) console.log(key);

  return key;
};

const addOperator = ([, name, region, apiKey]) => {
  if (!REGIONS[region]) throw new Error(`$region must be one of ${Object.keys(REGIONS).join(', ')}`);
  if (apiKey.length !== 80) throw new Error('API key is an invalid length');

  const operators = config.get('operators');
  operators[name] = { apiKey, region };
  config.set('operators', operators);

  // If this is the first one, automatically use it.
  if (Object.keys(operators).length === 1) useOperator([name]);

  return operators[name];
};

const removeOperator = ([name]) => {
  const operators = config.get('operators');
  delete operators[name];
  config.set('operators', operators);

  if (config.get('using') === name) config.set('using', '');
};

const applyRegion = () => {
  const name = config.get('using');
  if (!name) return;

  const { region } = config.get('operators')[name];
  evrythng.setup({ apiUrl: REGIONS[region] });
};


// ------------------------------------ API ------------------------------------

const getKey = () => {
  const key = switches.using(switches.API_KEY);
  if (key) return key.value;

  const operator = config.get('using');
  if (!operator) throw new Error('No Operator has been selected yet. Use \'operator add\' to add one.');

  return resolveKey(operator);
};

module.exports = {
  about: 'View and choose an Operator API Key for global use.',
  startsWith: 'operator',
  operations: {
    add: {
      execute: addOperator,
      pattern: 'operator add $name $region $apiKey',
    },
    list: {
      execute: list,
      pattern: 'operator list',
    },
    read: {
      execute: showKey,
      pattern: 'operator $name read',
    },
    use: {
      execute: useOperator,
      pattern: 'operator $name use',
    },
    remove: {
      execute: removeOperator,
      pattern: 'operator $name remove',
    },
  },
  getKey,
  applyRegion,
};

const config = require('./config');
const indent = require('../functions/indent');
const payloadBuilder = require('./payloadBuilder');
const switches = require('./switches');

const INDENT_SIZE = 2;

const isId = input => input.length === 24;

const pretty = obj => JSON.stringify(obj, null, 2);

const printListSummary = (list) => {
  const { noOutput } = config.get('options');

  list.forEach((item) => {
    if (!noOutput) console.log(`- ${item.id} '${item.name}'`);
  });
};

const printSimple = (obj, level) => {
  const { noOutput } = config.get('options');

  Object.keys(obj).forEach((item) => {
    const value = obj[item];
    if (typeof value === 'object' && !(typeof value === 'string')) {
      if (!noOutput) console.log(indent(`${item}:`, level, INDENT_SIZE));
      if (Array.isArray(value)) {
        if (typeof value[0] === 'string') {
          value.forEach(item2 => console.log(indent(item2, level + 1, INDENT_SIZE)));
          return;
        }

        value.forEach(item2 => printSimple(item2, level + 1));
        return;
      }

      printSimple(value, level + 1);
      return;
    }

    if (!noOutput) console.log(indent(`${item}: ${value}`, level, INDENT_SIZE));
  });
};

const buildPayload = async (defName, jsonStr) => {
  if (switches.using(switches.BUILD)) return payloadBuilder.build(defName);

  return JSON.parse(jsonStr);
};

const requireKey = (name) => {
  const apiKey = switches.using(switches.API_KEY);
  if (!apiKey) throw new Error(`Requires --api-key switch specifying the ${name} API Key.`);
};

module.exports = {
  isId,
  pretty,
  buildPayload,
  printListSummary,
  printSimple,
  requireKey,
};

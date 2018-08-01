const buildPayload = require('../functions/buildPayload');
const indent = require('../functions/indent');
const logger = require('./logger');
const switches = require('./switches');

const INDENT_SIZE = 2;

const isId = input => input.length === 24;

const pretty = obj => JSON.stringify(obj, null, 2);

const printListSummary = (list) => {
  list.forEach(item => logger.info(`- ${item.id} '${item.name}'`));
};

const printSimple = (obj, level) => {
  Object.keys(obj).forEach((item) => {
    const value = obj[item];
    if (typeof value === 'object' && !(typeof value === 'string')) {
      logger.info(indent(`${item}:`, level, INDENT_SIZE));

      if (Array.isArray(value)) {
        if (typeof value[0] === 'string') {
          value.forEach(item2 => logger.info(indent(item2, level + 1, INDENT_SIZE)));
          return;
        }

        value.forEach(item2 => printSimple(item2, level + 1));
        return;
      }

      printSimple(value, level + 1);
      return;
    }

    logger.info(indent(`${item}: ${value}`, level, INDENT_SIZE));
  });
};

const getPayload = async (defName, jsonStr) => {
  try {
    const parsed = JSON.parse(jsonStr);
    return switches.using(switches.BUILD) ? buildPayload(defName) : parsed;
  } catch (e) {
    throw new Error('Invalid or missing JSON payload');
  }
};

const requireKey = (name) => {
  const apiKey = switches.using(switches.API_KEY);
  if (!apiKey) {
    throw new Error(`Requires --api-key switch specifying the ${name} API Key.`);
  }
};

module.exports = {
  isId,
  pretty,
  getPayload,
  printListSummary,
  printSimple,
  requireKey,
};

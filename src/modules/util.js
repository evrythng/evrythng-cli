/**
 * (c) Copyright Reserved EVRYTHNG Limited 2018.
 * All rights reserved. Use of this material is subject to license.
 */

const jsonschema = require('jsonschema');
const indent = require('../functions/indent');
const logger = require('./logger');
const payloadBuilder = require('./payloadBuilder');
const switches = require('./switches');

const INDENT_SIZE = 2;

// TODO: Redirector, Reactor schedules, etc...
const SPECIAL_BUILDERS = {
  task: payloadBuilder.task,
};

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
  if (switches.BUILD) {
    // Special builders, such as tasks
    if (SPECIAL_BUILDERS[defName]) {
      return SPECIAL_BUILDERS[defName]();
    }

    return payloadBuilder.resource(defName);
  }

  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    throw new Error('Invalid or missing JSON payload');
  }
};

const requireKey = (name) => {
  if (!switches.API_KEY) {
    throw new Error(`Requires --api-key switch specifying the ${name} API Key.`);
  }
};

const validate = (instance, schema) => {
  const { errors } = jsonschema.validate(instance, schema);
  if (!errors || errors.length === 0) {
    return [];
  }

  return errors.map(item => item.stack);
};

/**
 * Sequentially run a series of functions that return Promises.
 *
 * @param {Function[]} items - Array of functions that return Promises.
 * @returns {Promise} A Promise that resolves when all items have been processed.
 */
const nextTask = async (items) => {
  if (!items.length) {
    return;
  }

  return items.splice(0, 1)[0]().then(() => nextTask(items));
};

module.exports = {
  isId,
  pretty,
  getPayload,
  printListSummary,
  printSimple,
  requireKey,
  validate,
  nextTask,
};

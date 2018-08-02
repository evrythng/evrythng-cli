/**
 * (c) Copyright Reserved EVRYTHNG Limited 2018.
 * All rights reserved. Use of this material is subject to license.
 */

const commands = require('../modules/commands');
const switches = require('../modules/switches');

const extractJsonRange = (argStr) => {
  if (argStr.includes('[') && argStr.indexOf('[') < argStr.indexOf('{')) {
    // JSON is an object array
    return [argStr.indexOf('['), argStr.lastIndexOf(']') + 1];
  }

  // JSON is an object
  return [argStr.indexOf('{'), argStr.lastIndexOf('}') + 1];
};

const argsWithJson = (argStr) => {
  const [jsonStart, jsonEnd] = extractJsonRange(argStr);
  const jsonArg = argStr.substring(jsonStart, jsonEnd);

  // Args until JSON
  return argStr.substring(0, jsonStart)
    .split(' ')

    // Add on JSON (could contain spaces)
    .concat(jsonArg)

    // Add on switches after JSON arg
    .concat(argStr.substring(jsonEnd).split(' '))
    .filter(item => item.length);
};

const includesJson = argStr => argStr.includes('{');

module.exports = async (argStr) => {
  let args = includesJson(argStr) ? argsWithJson(argStr) : argStr.split(' ');
  args = switches.apply(args);

  return commands.identify(args).execute(args.slice(1));
};

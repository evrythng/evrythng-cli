const fs = require('fs');
const logger = require('./logger');
const switches = require('./switches');
const util = require('./util');

/**
 * Read a whole file as the given 'type' of resource, and create them.
 *
 * @param {string} type - The resource type, such as 'thng'.
 */
const read = async type =>
  util.readFile(
    type,
    switches.FROM_JSON,
    path => JSON.parse(fs.readFileSync(path, 'utf8'))
  );

/**
 * Write a list of objects to file.
 * TODO: Homogenise with csvFile.
 *
 * @param {Array} items - Array of items.
 * @param {string} path - Path to the output file.
 */
const write = (items, path) => fs.writeFileSync(path, JSON.stringify(items, null, 2), 'utf8');

module.exports = {
  write,
  read,
};

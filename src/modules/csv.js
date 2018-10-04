/**
 * (c) Copyright Reserved EVRYTHNG Limited 2018.
 * All rights reserved. Use of this material is subject to license.
 */

const evrythng = require('evrythng-extended');
const fs = require('fs');
const logger = require('./logger');
const operator = require('../commands/operator');
const switches = require('./switches');
const util = require('./util');

// Keys that are expanded to individual columns, or do not make sense for CSV file.
const IGNORE = [
  'resource',
  'properties',
  'collections',
  'location',
  'customFields',
  'identifiers',
];

// Keys that are read-only
const READ_ONLY = [
  'id',
  'createdAt',
  'updatedAt',
  'activatedAt',
  'batch',
  'createdByTask',
  'fn',
  'scopes',
  'properties',
];

// Keys that are not currently supported
const UNSUPPORTED = [
  'photos',
];

/**
 * Use a character other than ','' to encode lists
 */
const LIST_SEPARATOR = '|';

// Get de-deuplicated list of object keys, with optional prefix
const getAllKeys = (arr, prefix) => {
  const result = [];
  arr.forEach((arrItem) => {
    Object.keys(arrItem)
      .filter(itemKey => !result.includes(itemKey))
      .filter(itemKey => !IGNORE.includes(itemKey))
      .forEach(newItem => result.push(newItem));
  });

  const buildKey = item => prefix ? `${prefix}.${item}` : item;
  return result.map(buildKey);
};

// Object, 'customFields', and 'identifiers' are supported
const getColumnHeaders = (arr) => {
  const objKeys = getAllKeys(arr);
  const cfKeys = getAllKeys(arr.map(item => item.customFields || {}), 'customFields');
  const idKeys = getAllKeys(arr.map(item => item.identifiers || {}), 'identifiers');

  return { objKeys, cfKeys, idKeys };
};

// Escape , with ", and " with ""
const esc = val => `"${String(val).split('"').join('""')}"`;

// Add cells to row with value of each applicable key, else add empty cell (,)
const addCells = (obj = {}, objKeys) => objKeys.reduce((res, item) => {
  // Handle any prefix
  const key = item.includes('.') ? item.substring(item.indexOf('.') + 1) : item;
  let value = obj[key];
  if (value === '[object Object]') {
    logger.info(`Warning: Object exporting not supported (key: ${item})`);
  }

  // Empty cell
  if (!value) {
    res.push('');
    return res;
  }

  // Handle 'tags'
  if (key === 'tags' && value.length) {
    value = value.join(LIST_SEPARATOR);
  }

  res.push(esc(value));
  return res;
}, []);

const createCsvData = (arr) => {
  const { objKeys, cfKeys, idKeys } = getColumnHeaders(arr);
  const columnHeaders = [...objKeys, ...cfKeys, ...idKeys, ''].join(',');

  const rows = arr.map((item) => {
    const { customFields, identifiers } = item;
    return [
      addCells(item, objKeys),
      addCells(customFields, cfKeys),
      addCells(identifiers, idKeys)
    ].join(',');
  });
  return [columnHeaders, ...rows];
};

/**
 * Write some array of EVRYTHNG objects to a CSV file.
 * @param {Object[]} arr - Array of objects to write to file.
 * @param {String} path - Path of the file to write.
 */
const write = (arr, path) => fs.writeFileSync(path, createCsvData(arr).join('\n'), 'utf8');

/**
 * Create a single resource from a data object.
 * @async
 * @param {Object} scope - evrythng.js Operator scope.
 * @param {Object} resource - The object to create as a resource.
 * @param {String} type - The resource type, as evrythng.js Operator member name.
 */
const createResource = async (scope, resource, type) => {
  try {
    const params = {};
    const projectId = switches.PROJECT;
    if (projectId) {
      params.project = projectId;
    }

    const res = await scope[type]().create(resource, { params });
    logger.info(`Created ${type} ${res.id}`);
  } catch (e) {
    logger.error(`Failed to create ${JSON.stringify(resource)} as a ${type}!`);
    logger.error(e.message || e.errors[0]);
  }
};

/**
 * Convert a CSV row to an EVRYTHNG resource, using the CSV headers
 * @param {String} row - The row to convert.
 * @param {String[]} headers - The CSV headers.
 */
const rowToObject = (row, headers) => {
  const cells = row.split(',');
  return headers.reduce((res, key, i) => {
    // Skip read-only keys, or empty cells
    if (READ_ONLY.includes(key) || !cells[i]) {
      return res;
    }

    if (UNSUPPORTED.includes(key)) {
      logger.info(`Skipping unsupported key: ${key}`);
      return res;
    }

    // Decode CSV comma escaping
    let value = cells[i].split('"').join('');
    if (value === '[object Object]') {
      logger.info(`Warning: Object importing not supported (key: ${key})`);
    }

    // Tags
    //  TODO need to handle escaping quotes AND commas...
    if (key === 'tags') {
      res[key] = value.split(LIST_SEPARATOR);
      return res;
    }

    // Custom fields
    if (key.includes('customFields')) {
      if (!res.customFields) {
        res.customFields = {};
      }

      key = key.split('.')[1];
      res.customFields[key] = value;
      return res;
    }

    // Identifiers
    if (key.includes('identifiers')) {
      if (!res.identifiers) {
        res.identifiers = {};
      }

      key = key.split('.')[1];
      res.identifiers[key] = value;
      return res;
    }

    // Simple value
    res[key] = value;
    return res;
  }, {});
};

/**
 * Read a CSV file and upload the contents to the account.
 * @async
 * @param {String} type - Type of EVRYTHNG resource the items in the file should be treated as.
 * @returns {Promise} A Promise that resolves when all items have been created.
 */
const read = async (type) => {
  const path = switches.FROM_CSV;
  if (!fs.existsSync(path)) {
    throw new Error('File was not found!');
  }

  // Get headers
  const rows = fs.readFileSync(path, 'utf8').toString().split('\n');
  const headers = rows[0].split(',').filter(item => item.length);
  
  const scope = new evrythng.Operator(operator.getKey());
  const resourceRows = rows.slice(1);
  await util.nextTask(resourceRows.map((item) => () => {
    const resource = rowToObject(item, headers);
    return createResource(scope, resource, type);
  }));
};

module.exports = {
  write,
  read,
};

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

/* Keys that are expanded to individual columns, or do not make sense for CSV file. */
const IGNORE = [
  // Do not make sense
  'resource',
  'collections',

  // Not supported
  'location',

  // Expanded
  'properties',
  'customFields',
  'identifiers',
];

/* Keys that are read-only */
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

/* Keys that are not currently supported */
const UNSUPPORTED = [
  'photos',
];

/* Use a character other than ','' to encode lists */
const LIST_SEPARATOR = '|';

/** Get de-deuplicated list of object keys of a specific type (denoted by prefix)
 * @param {Object[]} arr - Array of objects to search for keys.
 * @param {String} prefix - Optional prefix when searching a sub-object.
 * @returns {String[]} - Array of keys found in the objects.
 */
const getAllKeys = (arr, prefix) => {
  const buildKey = item => prefix ? `${prefix}.${item}` : item;
  
  return arr.reduce((res, arrItem) => {
    Object.keys(arrItem)
      .filter(itemKey => !res.includes(itemKey))
      .filter(itemKey => !IGNORE.includes(itemKey))
      .forEach(newItem => res.push(newItem));
    return res;
  }, []).map(buildKey);
};

/**
 * Get all applicable column headers for all objects.
 * Object, 'customFields', 'identifiers', and 'properties' are supported as types.
 * @param {Object[]} arr - Array of objects to search for keys.
 * @returns {Object} Object containing a list of each kind of keys
 */
const getColumnHeaders = (arr) => {
  const objKeys = getAllKeys(arr);
  const cfKeys = getAllKeys(arr.map(item => item.customFields || {}), 'customFields');
  const idKeys = getAllKeys(arr.map(item => item.identifiers || {}), 'identifiers');
  const propKeys = getAllKeys(arr.map(item => item.properties || {}), 'properties');

  return { objKeys, cfKeys, idKeys, propKeys };
};

/**
 * Escape , with ", and " with ""
 * @param {any} val - The value to escape.
 * @returns {String} - Escaped string of the value.
 */
const esc = val => `"${String(val).split('"').join('""')}"`;

/**
 * Create row of cell values for each applicable key, else add empty cell (,).
 * @param {Object} obj - The object to convert to a row.
 * @param {String[]} objKeys - Array of object keys to use.
 * @returns {String[]} Array of cell values for this row.
 */
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

/**
 * Create CSV data from input object array.
 * @param {Object[]} arr - Array of input objects to convert.
 * @returns {String[]} Array of CSV rows as strings.
 */
const createCsvData = (arr) => {
  const { objKeys, cfKeys, idKeys, propKeys } = getColumnHeaders(arr);
  const columnHeaders = [...objKeys, ...cfKeys, ...idKeys, ...propKeys, ''].join(',');

  const rows = arr.map((item) => {
    const { customFields, identifiers, properties } = item;
    return [
      addCells(item, objKeys),
      addCells(customFields, cfKeys),
      addCells(identifiers, idKeys),
      addCells(properties, propKeys),
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

const addKeyToObject = (obj, objKey, key, value) => {
  if (!obj[objKey]) {
    obj[objKey] = {};
  }

  key = key.split('.')[1];
  obj[objKey][key] = value;
  return obj;
};

/**
 * Convert a CSV row to an EVRYTHNG resource, using the CSV headers
 * @param {String} row - The row to convert.
 * @param {String[]} headers - The CSV headers.
 * @returns {Object} - An object representation of this CSV row.
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
      value = value.split(LIST_SEPARATOR);
      if (value.length) {
        res[key] = value;
      }
      return res;
    }

    if (key.includes('customFields')) {
      return addKeyToObject(res, 'customFields', key, value);
    }
    if (key.includes('identifiers')) {
      return addKeyToObject(res, 'identifiers', key, value);
    }
    if (key.includes('properties')) {
      return addKeyToObject(res, 'properties', key, value);
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

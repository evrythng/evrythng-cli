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
  // SDK property
  'resource',

  // Objects that are expanded later on into individual columns
  'address',
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
];

/* Keys that are complex object that aren't supported or cannot be specified for import */
const IMPORT_UNSUPPORTED = [
  'location',
];

/* Keys that are array type */
const CONVERTED_ARRAYS = [
  'photos',
  'tags',
  'collections',
];

/* Use a character other than ','' to encode lists and object pairs */
const LIST_SEPARATOR = '|';

/* Separates object key-value pairs */
const PAIR_SEPARATOR = ':';

/**
 * Get de-duplicated list of object keys of a specific type (denoted by prefix)
 *
 * @param {Object[]} arr - Array of objects to search for keys.
 * @param {string} prefix - Optional prefix when searching a sub-object.
 * @returns {string[]} Array of keys found in the objects.
 */
const getAllKeys = (arr, prefix) => {
  const buildKey = item => { return prefix ? `${prefix}.${item}` : item; };

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
 *
 * Object, 'address', 'customFields', 'identifiers', and 'properties' are supported as types.
 * @param {Object[]} arr - Array of objects to search for keys.
 * @returns {Object} Object containing a list of each kind of keys
 */
const getColumnHeaders = (arr) => {
  const object = getAllKeys(arr);
  const address = getAllKeys(arr.map(item => item.address || {}), 'address');
  const customFields = getAllKeys(arr.map(item => item.customFields || {}), 'customFields');
  const identifiers = getAllKeys(arr.map(item => item.identifiers || {}), 'identifiers');
  const properties = getAllKeys(arr.map(item => item.properties || {}), 'properties');

  return { object, address, customFields, identifiers, properties };
};

/**
 * Escape , with ", and " with ""
 *
 * @param {any} value - The value to escape.
 * @returns {string} - Escaped string of the value.
 */
const escapeCommas = (value) => {
  let output = String(value);
  if (output.includes('"')) {
    output = output.split('"').join('""');
  }
  if (output.includes(',')) {
    output = `"${output}"`;
  }

  return output;
};

/**
 * Encode a single level object into a CSV compatible format.
 *
 * @param {Object} obj - The object to encode.
 * @returns {string} The encoded form.
 */
const encodeObject = obj => {
  const pairs = Object.keys(obj).map(key => `${key}:${obj[key]}`);
  return `{${pairs.join(LIST_SEPARATOR)}}`;
};

/**
 * Decode a single level object string from a CSV compatible format.
 *
 * @param {string} objStr - The object string to decode.
 * @returns {Object} The decoded object.
 */
const decodeObject = objStr => objStr
  .slice(1, objStr.length - 1)
  .split(LIST_SEPARATOR)
  .reduce((res, pair) => {
    const [key, value] = pair.split(PAIR_SEPARATOR);
    res[key] = value;
    return res;
  }, {});

/**
 * Create row of cell values for each applicable key, else add empty cell (,).
 *
 * @param {Object} obj - The object to convert to a row.
 * @param {string[]} objKeys - Array of object keys to use.
 * @returns {string[]} Array of cell values for this row.
 */
const objectToCells = (obj, objKeys) => {
  // If this object doesn't exist, add an empty cell for every key missing
  if (!obj) {
    return objKeys.reduce(res => res.concat(''), []);
  }

  // For each key, add the value as a cell to the array
  return objKeys.reduce((res, item) => {
    // Handle any prefix
    const key = item.includes('.') ? item.split('.')[1] : item;
    const value = obj[key];

    // Empty cell
    if (!value) {
      res.push('');
      return res;
    }

    // Handle Array types
    if (CONVERTED_ARRAYS.includes(key) && value.length) {
      res.push(escapeCommas(value.join(LIST_SEPARATOR)));
      return res;
    }

    // Position - special case, encode with the separator
    if (key === 'position') {
      const [lon, lat] = obj.position.coordinates;
      res.push(`${lon}|${lat}`);
      return res;
    }

    // Other objects not supported
    if (String(value).includes('[object Object]')) {
      logger.info(`Warning: Object exporting not fully supported (key: ${item})`);
      res.push(escapeCommas(encodeObject(value)));
      return res;
    }

    res.push(escapeCommas(value));
    return res;
  }, []);
};

/**
 * Create CSV data from input object array.
 *
 * @param {Object[]} arr - Array of input objects to convert.
 * @returns {string[]} Array of CSV rows as strings.
 */
const createCsvData = (arr) => {
  const { object, address, customFields, identifiers, properties } = getColumnHeaders(arr);
  const columnHeaders = [
    ...object, ...address, ...customFields, ...identifiers, ...properties,
  ].join(',');

  const rows = arr.map((item) => {
    return objectToCells(item, object)
      .concat(objectToCells(item.address, address))
      .concat(objectToCells(item.customFields, customFields))
      .concat(objectToCells(item.identifiers, identifiers))
      .concat(objectToCells(item.properties, properties))
      .join(',');
  });
  return [columnHeaders, ...rows];
};

/**
 * Write some array of EVRYTHNG objects to a CSV file.
 *
 * @param {Object[]} arr - Array of objects to write to file.
 * @param {string} path - Path of the file to write.
 */
const write = (arr, path) => fs.writeFileSync(path, createCsvData(arr).join('\n'), 'utf8');

/**
 * Create a single resource from a data object.
 *
 * @param {Object} scope - evrythng.js Operator scope.
 * @param {Object} resource - The object to create as a resource.
 * @param {string} type - The resource type, as evrythng.js Operator member name.
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
 * Assign a prefixed property to an object property
 *
 * @param {Object} obj - The object to modify.
 * @param {string} objKey - The object property to modify.
 * @param {string} fullKey - The key of the property to assign.
 * @param {string} value - The value to assign.
 */
const assignPrefixProperty = (obj, objKey, fullKey, value) => {
  if (!obj[objKey]) {
    obj[objKey] = {};
  }

  const [, key] = fullKey.split('.');
  obj[objKey][key] = value;
  return obj;
};

/**
 * Consume CSV row cell by cell, since splitting on ',' doesn't work for cells that contain ','.
 *
 * @param {string} row - The row to consume.
 * @returns {string[]} Array of cell contents.
 */
const readCells = (row) => {
  const result = [];
  while (row) {
    switch (row.charAt(0)) {
      case '"':
        // Value between (" to ",)
        result.push(row.substring(1, row.indexOf('"', 1)));
        row = row.substring(row.indexOf('"', 1) + 2);
        break;
      case ',':
        // Empty cell (,,)
        result.push('');
        row = row.substring(1);
        break;
      default:
        // Assume a cell until the next comma (,until,)
        if (!row.includes(',')) {
          // Last cell
          result.push(row);
          row = '';
          return result;
        }
        
        // Not the last cell
        result.push(row.substring(0, row.indexOf(',')));
        row = row.substring(row.indexOf(',') + 1);  
        break;
    }
  }
  return result;
};

/**
 * Convert a CSV row to an EVRYTHNG resource, using the CSV headers.
 *
 * @param {string} row - The row to convert.
 * @param {string[]} headers - The CSV headers.
 * @returns {Object} - An object representation of this CSV row.
 */
const rowToObject = (row, headers) => {
  const cells = readCells(row.trim());
  return headers.reduce((res, key, i) => {
    // Skip read-only keys, or empty cells
    if (READ_ONLY.includes(key) || !cells[i]) {
      return res;
    }

    // Decode CSV comma escaping
    const value = cells[i].split('"').join('');

    // Sub-objects are not supported
    if (value === '[object Object]') {
      logger.info(`Warning: Object importing not supported (key: ${key})`);
      return res;
    }

    // Other unsupported object
    if (IMPORT_UNSUPPORTED.includes(key)) {
      logger.info(`Warning: Importing not supported (key: ${key})`);
      return res;
    }

    // Tags
    if (CONVERTED_ARRAYS.includes(key)) {
      if (value.length) {
        res[key] = value.split(LIST_SEPARATOR);
      }
      return res;
    }

    // Sub-objects
    if (key.includes('address')) {
      return assignPrefixProperty(res, 'address', key, value);
    }
    if (key.includes('customFields')) {
      return assignPrefixProperty(res, 'customFields', key, value);
    }
    if (key.includes('identifiers')) {
      return assignPrefixProperty(res, 'identifiers', key, value);
    }
    if (key.includes('properties')) {
      return assignPrefixProperty(res, 'properties', key, value);
    }

    // Position - special case, decode with the separator into fixed object
    if (key === 'position') {
      const [lon, lat] = value.split(LIST_SEPARATOR);
      res[key] = {
        type: 'Point',
        coordinates: [parseFloat(lon), parseFloat(lat)],
      };
      return res;
    }

    // Simple value
    res[key] = value;
    return res;
  }, {});
};

/**
 * Read a CSV file and upload the contents to the account.
 *
 * @param {string} type - Type of EVRYTHNG resource the items in the file should be treated as.
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
  await util.nextTask(resourceRows.map(item => () => {
    const resource = rowToObject(item, headers);
    return createResource(scope, resource, type);
  }));
};

module.exports = {
  write,
  read,
  rowToObject,
  assignPrefixProperty,
  createCsvData,
  encodeObject,
  decodeObject,
  READ_ONLY,
};

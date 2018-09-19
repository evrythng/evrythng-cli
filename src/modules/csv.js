/**
 * (c) Copyright Reserved EVRYTHNG Limited 2018.
 * All rights reserved. Use of this material is subject to license.
 */

const fs = require('fs');

// Keys that are expanded to individual columns, or do not make sense for CSV file.
const IGNORE = [
  'resource', 'properties', 'tags', 'collections', 'location', 'customFields', 'identifiers',
];

// Get de-deuplicated list of object keys, with optional prefix
const getAllKeys = (arr, prefix) => {
  const result = [];
  arr.forEach((arrItem) => {
    Object.keys(arrItem)
      .filter(itemKey => !result.includes(itemKey))
      .filter(itemKey => !IGNORE.includes(itemKey))
      .forEach(newItem => result.push(newItem));
  });

  return result.map((item) => {
    if (prefix) {
      return `${prefix}.${item}`;
    }

    return item;
  });
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
const addCells = (obj = {}, objKeys) => {
  let result = '';
  objKeys.forEach((item) => {
    // Handle any  prefix
    const key = item.includes('.') ? item.substring(item.indexOf('.') + 1) : item;
    result += obj[key] ? `${esc(obj[key])},` : ',';
  });

  return result;
};

const createCsvData = (arr) => {
  const { objKeys, cfKeys, idKeys } = getColumnHeaders(arr);
  const columnHeaders = objKeys.concat(cfKeys).concat(idKeys);

  const firstRow = `${columnHeaders.join(',')},`;
  const otherRows = arr.map(item => addCells(item, objKeys)
    + addCells(item.customFields, cfKeys)
    + addCells(item.identifiers, idKeys));
  return [firstRow].concat(otherRows);
};

const toFile = (arr, fileName) => fs.writeFileSync(fileName, createCsvData(arr).join('\n'), 'utf8');

module.exports = {
  toFile,
};

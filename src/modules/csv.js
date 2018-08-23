/**
 * (c) Copyright Reserved EVRYTHNG Limited 2018.
 * All rights reserved. Use of this material is subject to license.
 */

const fs = require('fs');

// Keys that are expanded to individual columns, or do not make sense for CSV file.
const IGNORE = [
  'resource', 'properties', 'tags', 'collections', 'location', 'customFields', 'identifiers',
];

const getAllKeys = (arr) => {
  const result = [];
  arr.forEach((arrItem) => {
    const newItems = Object.keys(arrItem)
      .filter(itemKey => !result.includes(itemKey))
      .filter(itemKey => !IGNORE.includes(itemKey));
    newItems.forEach(newItem => result.push(newItem));
  });
  return result;
};

const getAllHeaders = (arr) => {
  const itemKeys = getAllKeys(arr);
  const cfKeys = getAllKeys(arr.map(item => item.customFields || {}));
  const idKeys = getAllKeys(arr.map(item => item.identifiers || {}));

  return { itemKeys, cfKeys, idKeys };
};

// Escape , with ", and " with ""
const esc = val => `"${String(val).split('"').join('""')}"`;

const createCells = (obj = {}, objKeys) => {
  let result = '';
  objKeys.forEach((key) => {
    result += obj[key] ? `${esc(obj[key])},` : ',';
  });

  return result;
};

const createRows = (arr) => {
  const { itemKeys, cfKeys, idKeys } = getAllHeaders(arr);
  const allHeaders = itemKeys.concat(cfKeys).concat(idKeys);
  
  const firstRow = `${allHeaders.join(',')},`;
  return [firstRow].concat(arr.map((item) => {
    return createCells(item, itemKeys) +
      createCells(item.customFields, cfKeys) +
      createCells(item.identifiers, idKeys);
  })).join('\n');
};

const toFile = (data, fileName) => fs.writeFileSync(fileName, createRows(data), 'utf8');

module.exports = {
  toFile,
};

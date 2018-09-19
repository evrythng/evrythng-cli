/**
 * (c) Copyright Reserved EVRYTHNG Limited 2018.
 * All rights reserved. Use of this material is subject to license.
 */

const SWITCH_LIST = [{
  name: '--filter',
  about: 'Specify a Platform filter, such as \'tags=test\'.',
  constant: 'FILTER',
  valueLabel: '<query>',
}, {
  name: '--with-scopes',
  about: 'Include resource scopes in the response.',
  constant: 'SCOPES',
}, {
  name: '--per-page',
  about: 'Specify number of resources per page.',
  constant: 'PER_PAGE',
  valueLabel: '<count>',
}, {
  name: '--summary',
  about: 'Show a list of resources as a summarised single-line format',
  constant: 'SUMMARY',
}, {
  name: '--api-key',
  about: 'Use a specific API key instead of the current Operator\'s API Key.',
  constant: 'API_KEY',
  valueLabel: '<API key>',
}, {
  name: '--expand',
  about: 'Expand some ID fields, timestamps to date, etc.',
  constant: 'EXPAND',
}, {
  name: '--field',
  about: 'Print only a certain field from the response.',
  constant: 'FIELD',
  valueLabel: '<key>',
}, {
  name: '--simple',
  about: 'Print response in non-JSON friendly format.',
  constant: 'SIMPLE',
}, {
  name: '--build',
  about: 'Interactively build a create request payload using the EVRYTHNG Swagger API description.',
  constant: 'BUILD',
}, {
  name: '--project',
  about: 'Specify the \'project\' query parameter.',
  constant: 'PROJECT',
  valueLabel: '<project ID>',
}, {
  name: '--page',
  about: 'Go to a specific page of results.',
  constant: 'PAGE',
  valueLabel: '<page>',
}, {
  name: '--to-csv',
  about: 'Output array response to a CSV file, such as \'./data.csv\'.',
  constant: 'TO_CSV',
  valueLabel: '<output file>',
}, {
  name: '--context',
  about: 'Specify the \'context=true\' query parameter.',
  constant: 'CONTEXT',
}, {
  name: '--to-page',
  about: 'Read up to 30 pages before returning results (only with --to-csv).',
  constant: 'TO_PAGE',
  valueLabel: '<page>',
}];

const apply = (args) => {
  args
    .filter(item => item.includes('--'))
    .forEach((arg) => {
      const valid = SWITCH_LIST.find(item => item.name === arg);
      if (!valid) {
        throw new Error(`Invalid switch: ${arg}`);
      }

      const foundIndex = args.indexOf(arg);
      const rule = SWITCH_LIST.find(item => item.name === arg);
      const { constant, valueLabel } = rule;

      // For CLI
      module.exports[constant] = valueLabel ? args[foundIndex + 1] : true;

      // For API
      module.exports.active[constant] = valueLabel ? args[foundIndex + 1] : true;

      args.splice(foundIndex, valueLabel ? 2 : 1);
    });

  return args;
};

module.exports = {
  SWITCH_LIST,
  apply,
  active: {},
};

const SWITCH_LIST = [{
  name: '--filter',
  about: 'Specify a Platform filter, such as \'tags=test\'.',
  constant: 'FILTER',
  hasValue: true,
}, {
  name: '--scopes',
  about: 'Include resource scopes in the response.',
  constant: 'SCOPES',
}, {
  name: '--perpage',
  about: 'Specify number of resources per page.',
  constant: 'PER_PAGE',
  hasValue: true,
}, {
  name: '--summary',
  about: 'Show a list of resources as a summarised single-line format',
  constant: 'SUMMARY',
}, {
  name: '--api-key',
  about: 'Use a specific API key instead of the current Operator\'s API Key',
  constant: 'API_KEY',
  hasValue: true,
}, {
  name: '--expand',
  about: 'Expand some ID fields, timestamps to date, etc.',
  constant: 'EXPAND',
}, {
  name: '--field',
  about: 'Print only a certain field from the response.',
  constant: 'FIELD',
  hasValue: true,
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
  hasValue: true,
}, {
  name: '--page',
  about: 'Go to a specific page of results',
  constant: 'PAGE',
  hasValue: true,
}];

const active = [];

const apply = (args) => {
  SWITCH_LIST.forEach((item) => {
    const found = args.find(item1 => item1 === item.name);
    if (!found) return;

    const foundIndex = args.indexOf(found);
    active.push({
      name: item.name,
      value: item.hasValue ? args[foundIndex + 1] : '',
    });
    args.splice(foundIndex, item.hasValue ? 2 : 1);
  });

  return args;
};

const using = query => active.find(item => item.name === query);

const set = (name, value = '') => active.push({ name, value });

const unset = (name) => {
  const found = using(name);
  if (!found) return;

  active.splice(active.indexOf(found), 1);
};

const buildParams = () => {
  const result = {};
  const filter = using(module.exports.FILTER);
  const perPage = using(module.exports.PER_PAGE);
  const project = using(module.exports.PROJECT);
  if (filter) result.filter = filter.value;
  if (perPage) result.perPage = perPage.value;
  if (project) result.project = project.value;
  if (using(module.exports.SCOPES)) result.withScopes = true;

  return result;
};

module.exports = {
  SWITCH_LIST,
  apply,
  using,
  buildParams,
  set,
  unset,
};

(() => {
  SWITCH_LIST.forEach((item) => {
    module.exports[item.constant] = item.name;
  });
})();

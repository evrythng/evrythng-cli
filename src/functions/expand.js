const evrythng = require('evrythng-extended');
const operator = require('../commands/operator');

const expandTimestamp = async timestamp => Promise.resolve(new Date(timestamp).toLocaleString());

const expandResourceId = (type, id) => evrythng.api({
  url: `/${type}s/${id}`,
  authorization: operator.getKey(),
});

const EXPANSION_MAP = {
  activatedAt: expandTimestamp,
  createdAt: expandTimestamp,
  timestamp: expandTimestamp,
  updatedAt: expandTimestamp,
  batch: async id => expandResourceId('batche', id),
  createdByProject: async id => expandResourceId('project', id),
  product: async id => expandResourceId('product', id),
  thng: async id => expandResourceId('thng', id),
  user: async id => expandResourceId('user', id),
};

const expand = async (obj) => {
  const promises = Object.keys(obj)
    .filter(item => EXPANSION_MAP[item])
    .map(async (item) => {
      const newValue = await EXPANSION_MAP[item](obj[item]);
      obj[item] = newValue;
    });
  return Promise.all(promises);
};

module.exports = async (input) => {
  if (typeof input === 'object' && Array.isArray(input)) {
    return Promise.all(input.map(expand));
  }

  return expand(input);
};

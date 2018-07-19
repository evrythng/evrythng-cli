const jsonSchemaParser = require('json-schema-ref-parser');
const evrythngSwagger = require('evrythng-swagger');

const { getValue } = require('../modules/prompt');
const indent = require('../functions/indent');

// Some properties are writable, just not at create time
const NON_CREATE_PROPERTIES = [
  'scopes', 'properties', 'fn', 'startsAt', 'endsAt', 'location',
];

// Values that are always the same value, and are not in the spec
const HARDCODE_MAP = {
  socialNetworks: {},
};

const SPECIAL_BUILDERS = {
  task: require('./buildTask'),
};

let spec;

const getKeyName = async () => getValue(indent('key', 2));

const buildCustomObject = async () => {
  const result = {};

  let key = await getKeyName();
  while (key) {
    const value = await getValue(indent('value', 2));
    result[key] = value;

    key = await getKeyName();
  }

  return result;
};

const buildDefObject = async (opts) => {
  const { key, target, index, total, propertyDef } = opts;

  // User-definable fields are not documented, present free-form
  if (key === 'customFields' || key === 'identifiers') {
    console.log(`${index + 1}/${total}: ${key} (object, leave 'key' blank to finish)`);
    target[key] = await buildCustomObject();
    return;
  }

  // Recurse
  target[key] = {};
  await buildObject(target[key], propertyDef.properties, key);
};

const buildDefProperty = async (opts) => {
  const { index, total, target, key, propertyDef } = opts;
  
  // Fields with only one allowed value
  if (HARDCODE_MAP[key]) {
    target[key] = HARDCODE_MAP[key];
    console.log(`${index + 1}/${total}: ${key} is always ${JSON.stringify(HARDCODE_MAP[key])}`);
    return;
  }

  // Build sub-object
  // TODO handle sub-object properties
  if (propertyDef.type === 'object') {
    await buildDefObject({ key, target, index, total, propertyDef });
    return;
  }

  // Determine type hint string
  let typeStr = propertyDef.type;
  if (propertyDef.type === 'array') {
    typeStr = `comma-separated list of ${propertyDef.items.type}`;
  }
  if (propertyDef.enum) {
    typeStr = `${propertyDef.type}, one of '${propertyDef.enum.join('\', \'')}'`;
  }

  // Get a simple value
  const input = await getValue(`${index + 1}/${total}: ${key} (${typeStr})`);
  if (!input) return;

  // Handle input arrays as comma-separated values
  // TODO handle arrays of non-strings?
  if (propertyDef.type === 'array') {
    if (propertyDef.items.type === 'string') {
      target[key] = input.split(',');
      return;
    }

    if (['integer', 'number'].includes(propertyDef.items.type)) {
      target[key] = input.split(',').map(parseInt);
      return;
    }
  }

  // Simple value
  target[key] = input;
};

const filteredPropertyKeys = properties => Object.keys(properties)
  .filter(item => !properties[item].readOnly)
  .filter(item => !NON_CREATE_PROPERTIES.includes(item));

const buildObject = async (properties, name) => {
  const propertyKeys = filteredPropertyKeys(properties);
  const context = name ? `of ${name} ` : '';
  console.log(`Provide values for each field ${context}(or leave blank to skip):\n`);

  const payload = {};
  for (let index = 0; index < propertyKeys.length; index += 1) {
    const key = propertyKeys[index];
    await buildDefProperty({
      key, 
      index, 
      total: propertyKeys.length, 
      target: payload, 
      propertyDef: properties[key],
    });
  }

  return payload;
};

module.exports = async (defName) => {
  // Special builders
  if (SPECIAL_BUILDERS[defName]) return SPECIAL_BUILDERS[defName]();

  spec = await jsonSchemaParser.dereference(evrythngSwagger);
  if (!spec.definitions[defName]) throw new Error(`\ndefName ${defName} not found in spec!`);

  console.log();
  const { properties } = spec.definitions[defName];
  const payload = await buildObject(properties);

  console.log();
  return payload;
};

const jsonSchemaParser = require('json-schema-ref-parser');
const evrythngSwagger = require('evrythng-swagger');

const askFor = require('../functions/askFor');
const indent = require('../functions/indent');

// Some properties are writable, just not at create time
const NON_CREATE_PROPERTIES = [
  'scopes', 'properties', 'fn', 'startsAt', 'endsAt', 'location',
];

// Values that are always the same value, and are not in the spec
const HARDCODE_MAP = {
  socialNetworks: {},
};

let spec;

const getKeyName = async () => askFor(indent('key', 2));

const buildCustomObject = async () => {
  const result = {};

  let key = await getKeyName();
  while (key) {
    const value = await askFor(indent('value', 2));
    result[key] = value;

    key = await getKeyName();
  }

  return result;
};

const buildProperty = async (index, total, target, key, propertyDef) => {
  // Hardcoded value?
  if (HARDCODE_MAP[key]) {
    target[key] = HARDCODE_MAP[key];
    console.log(`${index + 1}/${total}: ${key} is always ${JSON.stringify(HARDCODE_MAP[key])}`);
    return;
  }

  let typeStr = propertyDef.type;
  if (propertyDef.type === 'array') {
    typeStr = `comma-separated list of ${propertyDef.items.type}`;
  }

  // If enum, present options
  if (propertyDef.enum) {
    typeStr = `${propertyDef.type}, one of '${propertyDef.enum.join('\', \'')}'`;
  }

  // TODO handle sub-object properties
  if (propertyDef.type === 'object') {
    // User-definable fields are not documented, present free-form
    if (key === 'customFields' || key === 'identifiers') {
      console.log(`${index + 1}/${total}: ${key} (object, leave 'key' blank to finish)`);
      target[key] = await buildCustomObject();
      return;
    }

    if (!propertyDef.properties) {
      console.log(`<no definition available> for '${key}'`);
      return;
    }

    // Recurse
    target[key] = {};
    await buildObject(target[key], propertyDef.properties, key);
  }

  // Get a simple value
  const input = await askFor(`${index + 1}/${total}: ${key} (${typeStr})`);
  if (!input) return;

  // Handle arrays as csv
  if (propertyDef.type === 'array') {
    if (propertyDef.items.type === 'string') {
      target[key] = input.split(',');
      return;
    }

    if (propertyDef.items.type === 'string') {
      target[key] = input.split(',').map(parseInt);
      return;
    }

    // TODO handle arrays of non-strings?
    return;
  }

  // Simple value
  target[key] = input;
};

const filteredPropertyKeys = properties => Object.keys(properties)
  .filter(item => !properties[item].readOnly)
  .filter(item => !NON_CREATE_PROPERTIES.includes(item));

const buildObject = async (payload, properties, name) => {
  const propertyKeys = filteredPropertyKeys(properties);
  const context = name ? `of ${name} ` : '';
  console.log(`Provide values for each field ${context}(or leave blank to skip):\n`);
  for (let i = 0; i < propertyKeys.length; i += 1) {
    const key = propertyKeys[i];
    await buildProperty(i, propertyKeys.length, payload, key, properties[key]);
  }

  return payload;
};

const build = async (defName) => {
  spec = await jsonSchemaParser.dereference(evrythngSwagger);
  if (!spec.definitions[defName]) throw new Error(`\ndefName ${defName} not found in spec!`);

  console.log();
  const { properties } = spec.definitions[defName];
  const payload = {};
  await buildObject(payload, properties);

  console.log();
  return payload;
};

module.exports = {
  build,
};

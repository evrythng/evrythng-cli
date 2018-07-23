const evrythng = require('evrythng-extended');
const config = require('../modules/config');
const logger = require('../modules/logger');
const operator = require('../commands/operator');
const prompt = require('../modules/prompt');

const TASK_TYPES = ['POPULATING', 'SHORT_ID_GENERATION'];

const SHORT_ID_TEMPLATE_TYPES = ['SEQUENTIAL', 'PSEUDO_RANDOM'];
const SHORT_ID_PADDING_TYPES = ['ZERO', 'CHAR'];
const SHORT_ID_GENERATION_BASE = {
  type: 'SHORT_ID_GENERATION',
  inputParameters: {},
};
const SHORT_ID_TEMPLATE = { type: 'THNG_ID' };
const POPULATING_INPUT_TYPES = [
  'FIXED_AMOUNT', 'FILE_BASED', 'LIST_BASED', 'IDENTIFIERS_LIST_BASED',
];
const POPULATING_TASK_BASE = {
  type: 'POPULATING',
  inputParameters: { generateThngs: true },
};
const FILE_FORMATS = ['CSV', 'ZIP'];

// --------------------------- Batch Populating Task ---------------------------

const apiRequest = (url) => {
  const apiKey = operator.resolveKey(config.get('using'));
  return evrythng.api({ url, authorization: apiKey });
};

const getShortDomains = async () => {
  const accounts = await apiRequest('/accounts');
  return apiRequest(`/accounts/${accounts[0].id}/shortDomains`);
};

const buildFixedAmount = async (task) => {
  task.inputParameters.type = 'FIXED_AMOUNT';
  task.inputParameters.quantity = await prompt.getInteger('Quantity');
  task.inputParameters.thngTemplate = await prompt.getJSON('Thng template');
  
  task.inputParameters.generateRedirections = await prompt.getBoolean('Generate redirections');
  if (task.inputParameters.generateRedirections) {
    task.inputParameters.defaultRedirectUrl = await prompt.getValue('Default redirect URL');

    const shortDomains = await getShortDomains();
    task.inputParameters.shortDomain = await prompt.getChoice('Short domain', shortDomains);
    task.inputParameters.shortIdTemplate = SHORT_ID_TEMPLATE;
  }

  return task;
};

const buildFileBased = async (task) => {
  task.inputParameters.type = 'FILE_BASED';
  task.inputParameters.generateRedirections = true;
  task.inputParameters.shortIdTemplate = SHORT_ID_TEMPLATE;
  task.inputParameters.location = await prompt.getValue('File URL');
  task.inputParameters.format = await prompt.getChoice('File format', FILE_FORMATS);
  task.inputParameters.defaultRedirectUrl = await prompt.getValue('Default redirect URL');
  
  const shortDomains = await getShortDomains();
  task.inputParameters.shortDomain = await prompt.getChoice('Short domain', shortDomains);
  task.inputParameters.thngTemplate = await prompt.getJSON('Thng template');
  return task;
}; 

const buildListBased = async (task) => {
  task.inputParameters.type = 'LIST_BASED';
  task.inputParameters.generateRedirections = true;
  task.inputParameters.shortIdTemplate = SHORT_ID_TEMPLATE;
  task.inputParameters.defaultRedirectUrl = await prompt.getValue('Default redirect URL');
  
  const shortDomains = await getShortDomains();
  task.inputParameters.shortDomain = await prompt.getChoice('Short domain', shortDomains);
  task.inputParameters.thngTemplate = await prompt.getJSON('Thng template');

  const ids = await prompt.getArray('ID list');
  task.inputParameters.inputData = ids.map(item => ({ shortId: item }));
  return task;
};

const buildCustomIdentifier = async () => {
  const key = await prompt.getValue('Custom identifier key (string)');
  const values = await prompt.getArray('identifier values');
  return { key, values };
};

const buildIdentifiersListBased = async (task) => {
  task.inputParameters.type = 'IDENTIFIERS_LIST_BASED';
  task.inputParameters.generateRedirections = false;
  task.inputParameters.thngTemplate = await prompt.getJSON('Thng template');
  task.inputParameters.customIdentifier = await buildCustomIdentifier();
  return task;
};

const buildPopulatingTask = async () => {
  const inputType = await prompt.getChoice('Input type', POPULATING_INPUT_TYPES);
  const builders = {
    FIXED_AMOUNT: buildFixedAmount,
    FILE_BASED: buildFileBased,
    LIST_BASED: buildListBased,
    IDENTIFIERS_LIST_BASED: buildIdentifiersListBased,
  };

  const task = Object.assign({}, POPULATING_TASK_BASE);
  return builders[inputType](task);
};


// ---------------------------- Short ID Generation ----------------------------

const buildShortIdTemplate = async (task) => {
  const template = {};

  template.type = await prompt.getChoice('Template type', SHORT_ID_TEMPLATE_TYPES);
  if (template.type === 'SEQUENTIAL') {
    template.start = await prompt.getInteger('Start value');
    template.increment = await prompt.getInteger('Increment value');

    template.padding = await prompt.getChoice('Padding type', SHORT_ID_PADDING_TYPES);
    if (template.padding === 'CHAR') {
      template.paddingChar = await prompt.getValue('Padding character (char)');
    }
  }

  template.length = await prompt.getInteger('ID length');
  template.prefix = await prompt.getValue('Prefix (string)');
  template.suffix = await prompt.getValue('Suffix (string)');
  template.separator = await prompt.getValue('Separator character (char)');
  return template;
};

const buildShortIdGenerationTask = async () => {
  const task = Object.assign({}, SHORT_ID_GENERATION_BASE);
  task.inputParameters.quantity = await prompt.getInteger('Quantity');
  task.inputParameters.shortIdTemplate = await buildShortIdTemplate(task);

  return task;
};

// ------------------------------------ API ------------------------------------

module.exports = async () => {
  const taskType = await prompt.getChoice('Task type', TASK_TYPES);
  const builders = {
    POPULATING: buildPopulatingTask,
    SHORT_ID_GENERATION: buildShortIdGenerationTask,
  };
  const task = await builders[taskType]();
  logger.info(`\Task:\n${JSON.stringify(task, null, 2)}\n`);

  const confirmation = await prompt.getConfirmation();
  if (!confirmation) {
    logger.info('Cancelled');
    process.exit();
  }

  return task;
};

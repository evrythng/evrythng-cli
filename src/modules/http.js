/**
 * (c) Copyright Reserved EVRYTHNG Limited 2018.
 * All rights reserved. Use of this material is subject to license.
 */

const { parse } = require('url');
const evrythng = require('evrythng');
const { getConfirmation } = require('./prompt');
const config = require('./config');
const csvFile = require('./csvFile');
const expand = require('../functions/expand');
const jsonFile = require('./jsonFile');
const logger = require('./logger');
const operator = require('../commands/operator');
const switches = require('./switches');
const util = require('./util');

const INDENT_SIZE = 2;
const STATUS_LABELS = {
  200: 'OK',
  201: 'Created',
  202: 'Accepted',
  204: 'No Content',
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  500: 'Internal Server Error',
  503: 'Service Unavailable',
  504: 'Gateway Timeout',
};

const fullResponse = true;

/**
 * Determine if a request is a list request for a list of results.
 * In this case, the perPage param isn't required.
 *
 * @param {string} url - The request url.
 * @returns {boolean} true if the request URL looks like it might be a list request.
 */
const isListRequest = (url) => {
  const parts = url.split('/');
  return parts[parts.length - 1].length !== 24;
};

/**
 * Build a query params dictionary object.
 *
 * @param {string} method - The request method.
 * @param {string} url - The request url.
 * @returns {Object} Object containing all applicable query param keys and values.
 */
const buildQueryParams = (method, url) => {
  const { defaultPerPage } = config.get('options');
  const filter = switches.FILTER;
  const perPage = switches.PER_PAGE;
  const project = switches.PROJECT;
  const ids = switches.IDS;

  const result = {};
  if (filter) {
    result.filter = filter;
  }

  // Use options value, unless it's specified with the --per-page flag
  if (method === 'get' && isListRequest(url)) {
    result.perPage = perPage || defaultPerPage;
  }
  if (project) {
    result.project = project;
  }
  if (switches.SCOPES) {
    result.withScopes = true;
  }
  if (switches.CONTEXT) {
    result.context = true;
  }
  if (switches.WITH_ERRORS) {
    result.withErrors = true;
  }
  if (switches.WITH_IDS) {
    result.withIds = true;
  }
  if (ids) {
    result.ids = ids;
  }

  return result;
};

/**
 * Build the query parameter string.
 *
 * @param {string} method - The request method.
 * @param {string} url - The request url.
 * @returns {string} The completed query parameter string.
 */
const buildParamString = (method, url) => {
  const params = buildQueryParams(method, url);
  const keys = Object.keys(params);
  if (!keys.length) {
    return '';
  }

  return Object.keys(params)
    .reduce((res, item) => res.concat(`${item}=${encodeURIComponent(params[item])}`), [])
    .reduce((res, item, i) => i === 0 ? `${res}${item}` : `${res}&${item}`, '?');
};

const formatHeaders = headers => Object.keys(headers)
  .map(item => `${item}: ${headers[item]}`);

const printRequest = (options) => {
  logger.info(`\n>> ${options.method} ${options.url}`);
  formatHeaders(options.displayHeaders).forEach(item => logger.info(item));
  logger.info();
  if (options.data) {
    logger.info(`${JSON.stringify(options.data, null, INDENT_SIZE)}\n`);
  }
};

/**
 * Usually an array with fetch
 */
const extractUrlFromLink = (links) => {
  const [link] = links;
  const encodedUrl = link.slice(1, link.indexOf('>') - link.length);
  return parse(decodeURIComponent(encodedUrl)).path;
};

const goToPage = async (res, endPage) => {
  for (let page = 0; page <= endPage; page += 1) {
    if (!res.headers.link) {
      logger.info('No more pages. Returning last found page.');
      return res;
    }

    const url = extractUrlFromLink(res.headers.link);
    res = await evrythng.api({
      apiKey: operator.getKey(),
      fullResponse,
      url,
    });
    if (page === endPage - 1) {
      return res;
    }
  }

  return res;
};

const getMorePages = async (res, max) => {
  const items = [...res.data];

  for (let page = 1; page < max; page += 1) {
    if (!res.headers.link) {
      break;
    }

    const url = extractUrlFromLink(res.headers.link);
    res = await evrythng.api({
      apiKey: operator.getKey(),
      fullResponse,
      url,
    });

    // Patch data and headers
    res.data = await res.json();
    res.headers = res.headers._headers;

    items.push(...res.data);
    logger.info(`Reading - ${items.length} items`, true);
  }

  logger.info(`\nRead ${items.length} items.`);
  return items;
};

const printResponse = async (res) => {
  if (!res) {
    return null;
  }
  if (!res.data) {
    return res;
  }

  // Wait until page reached
  const page = switches.PAGE;
  if (page) {
    res = await goToPage(res, parseInt(page, 10));
  }

  // Get all pages and update res.data
  const csvFileName = switches.TO_CSV;
  const jsonFileName = switches.TO_JSON;
  const toPage = switches.TO_PAGE;
  if (toPage) {
    if (!csvFileName && !jsonFileName) {
      throw new Error('--to-page is only available when using --to-csv or --to-json');
    }

    res.data = await getMorePages(res, toPage);
  }

  const { data, status, headers } = res;

  // Expand known fields
  if (switches.EXPAND) {
    await expand(data);
  }

  // Print HTTP response information
  const { showHttp } = config.get('options');
  if (showHttp) {
    logger.info(`<< ${status} ${STATUS_LABELS[status]}`);
    formatHeaders(headers).forEach(item => logger.info(item));
    logger.info();
  }

  // Print summary view
  if (switches.SUMMARY) {
    util.printListSummary(data);
    return res;
  }

  // Print simple view
  if (switches.SIMPLE) {
    util.printSimple(data, 1);
    return res;
  }

  // Get just one field
  const field = switches.FIELD;
  if (field) {
    logger.info(JSON.stringify(data[field], null, INDENT_SIZE));
    return data[field];
  }

  // Print to file?
  if (csvFileName) {
    await csvFile.write(Array.isArray(data) ? data : [data], csvFileName);
    return res;
  }
  if (jsonFileName) {
    await jsonFile.write(Array.isArray(data) ? data : [data], jsonFileName);
    return res;
  }

  // Regular pretty JSON output
  logger.info(util.pretty(data));
  return res;
};

/**
 * Make an EVRYTHNG.js request.
 *
 * @param {Object} options - The request options.
 * @returns {Promise} A promise that resolves to the result of the request
 */
const sendRequest = options => evrythng.api(options).then((res) => {
  // If not delete, transparently decode the stream to JSON
  if (options.method && options.method.toLowerCase() !== 'delete') {
    return res.json().then((json) => {
      // Restore headers
      res.headers = res.headers._headers;

      res.data = json;
      return res;
    }).catch((err) => {
      // Some POST and PUT don't return a body, but that's OK
      if (!err.message && err.message.includes('invalid json response body')) {
        throw err;
      }
    });
  }

  return res;
});

const createApiRequest = async (options) => {
  if (!options.method) {
    options.method = 'GET';
  }

  options.displayHeaders = { Authorization: `${options.apiKey.substring(0, 4)}...` };
  if (['POST', 'PUT'].includes(options.method)) {
    options.displayHeaders['Content-Type'] = 'application/json';
  }

  const { showHttp, noConfirm } = config.get('options');
  const methods = ['POST', 'PUT', 'DELETE'];
  if (methods.includes(options.method.toUpperCase()) && !noConfirm) {
    const confirmation = await getConfirmation();
    if (!confirmation) {
      logger.info('Cancelled');
      process.exit();
    }
  }

  if (showHttp) {
    printRequest(options);
  }

  options.fullResponse = true;
  return options;
};

/**
 * CLI wrapper for evrythng.api for any general set of options
 *
 * @param {object} options - evrythng.js compatible options.
 * @returns {Promise}
 */
const api = async options => createApiRequest(Object.assign(options, {
  apiKey: operator.getKey(),
}))
  .then(module.exports.sendRequest)
  .then(printResponse);

/**
 * Perform a POST request.
 *
 * @param {string} url - API path.
 * @param {object} data - Payload object data.
 * @returns {Promise<object>}
 */
const post = async (url, data) => api({
  url: `${url}${buildParamString('post', url)}`,
  method: 'POST',
  apiKey: operator.getKey(),
  data,
});

/**
 * Perform a GET request.
 *
 * @param {string} url - API path.
 * @param {boolean} silent - If true, don't print response to console.
 * @returns {Promise<object>}
 */
const get = async (url, silent = false) => createApiRequest({
  url: `${url}${buildParamString('get', url)}`,
  apiKey: operator.getKey(),
})
  .then(module.exports.sendRequest)
  .then(res => silent ? res : printResponse(res));

/**
 * Perform a PUT request.
 *
 * @param {string} url - API path.
 * @param {object} data - Payload object data.
 * @returns {Promise<object>}
 */
const put = async (url, data) => api({
  url: `${url}${buildParamString('put', url)}`,
  method: 'PUT',
  apiKey: operator.getKey(),
  data,
});

/**
 * Perform a deletion request.
 *
 * @param {string} url - URL of the resource to delete.
 */
 const deleteMethod = async url => api({
  url,
  method: 'DELETE',
  apiKey: operator.getKey(),
})
  .then((res) => {
    logger.info(`\nDeleted ${url}`);
    return res;
  });

/**
 * Helper for repetitive shortDomain focussed requests.
 *
 * @param {object} changes - Additional options.
 * @returns {Promise<object>} API response.
 */
const shortDomainRequest = async (shortDomain, changes) => api(Object.assign({
  apiUrl: `https://${shortDomain}`,
  url: '/redirections',
  headers: { Accept: 'application/json' },
}, changes));

module.exports = {
  post,
  get,
  put,
  delete: deleteMethod,
  api,
  formatHeaders,
  printRequest,
  sendRequest,
  shortDomainRequest,
};

/**
 * (c) Copyright Reserved EVRYTHNG Limited 2018.
 * All rights reserved. Use of this material is subject to license.
 */

const evrythng = require('evrythng-extended');
const { getConfirmation } = require('./prompt');
const config = require('./config');
const csv = require('./csv');
const expand = require('../functions/expand');
const logger = require('./logger');
const operator = require('../commands/operator');
const switches = require('./switches');
const util = require('./util');

const TO_PAGE_MAX = 30;
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

const buildParams = (method) => {
  const { defaultPerPage } = config.get('options');
  const filter = switches.FILTER;
  const perPage = switches.PER_PAGE;
  const project = switches.PROJECT;

  const result = {};
  if (filter) {
    result.filter = filter;
  }

  // Use global value, unless it's specified with flag
  if (method === 'get') {
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

  return result;
};

const buildParamString = (method) => {
  const params = buildParams(method);
  const keys = Object.keys(params);
  if (!keys.length) {
    return '';
  }

  return Object.keys(params).reduce((result, item) => {
    const addition = `${item}=${encodeURIComponent(params[item])}&`;
    return `${result}${addition}`;
  }, '?');
};

const formatHeaders = headers => Object.keys(headers)
  .map(item => `${item}: ${headers[item]}`);

const printRequest = (options) => {
  logger.info(`\n>> ${options.method} ${options.url}`);
  formatHeaders(options.displayHeaders).forEach(item => logger.info(item));
  logger.info();
  if (options.data) {
    logger.info(`${JSON.stringify(options.data, null, 2)}\n`);
  }
};

const goToPage = async (res, endPage) => {
  let currentPage = 1;
  let linkStr = res.headers.link;
  let nextRes = res;
  while (currentPage !== endPage) {
    let url = decodeURIComponent(linkStr);
    url = url.substring(url.indexOf('.com') + '.com'.length, url.indexOf('>'));
    nextRes = await evrythng.api({
      url,
      authorization: operator.getKey(),
      fullResponse: true,
    });

    linkStr = nextRes.headers.link;
    if (!linkStr) {
      throw new Error(`Ran out of pages at page ${currentPage}`);
    }

    currentPage += 1;
  }

  return nextRes;
};

const getAllPages = async (res, max) => {
  let { link } = res.headers;
  let result = res.data;
  let pages = 1;
  while (link && pages < max && pages < TO_PAGE_MAX) {
    let url = decodeURIComponent(link);
    url = url.substring(url.indexOf('.com') + '.com'.length, url.indexOf('>'));
    const nextRes = await evrythng.api({
      url,
      authorization: operator.getKey(),
      fullResponse: true,
    });
    ({ link } = nextRes.headers);
    pages += 1;

    result = result.concat(nextRes.data);
    logger.info(`Reading - ${result.length} items`, true);
  }

  logger.info(`\nRead ${result.length} items (${pages} pages).`);
  return result;
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
  const toPage = switches.TO_PAGE;
  if (toPage) {
    if (!csvFileName) {
      throw new Error('--to-page is only available when using --to-csv.');
    }

    res.data = await getAllPages(res, toPage);
  }

  // Expand known fields
  const { data, status, headers } = res;
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
    logger.info(data[field]);
    return data[field];
  }

  // Print to file?
  if (csvFileName) {
    csv.toFile(Array.isArray(data) ? data : [data], csvFileName);
    return res;
  }

  // Regular pretty JSON output
  logger.info(util.pretty(data));
  return res;
};

const apiRequest = async (options) => {
  if (!options.method) {
    options.method = 'GET';
  }

  options.displayHeaders = { Authorization: `${options.authorization.substring(0, 4)}...` };
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
  return evrythng.api(options);
};

const post = async (url, data) => apiRequest({
  url: `${url}${buildParamString('post')}`,
  method: 'post',
  authorization: operator.getKey(),
  data,
}).then(printResponse);

const get = async (url, silent = false) => apiRequest({
  url: `${url}${buildParamString('get')}`,
  authorization: operator.getKey(),
}).then((res) => {
  if (silent) {
    return res;
  }

  return printResponse(res);
});

const put = async (url, data) => apiRequest({
  url,
  method: 'PUT',
  authorization: operator.getKey(),
  data,
}).then(printResponse);

const deleteMethod = async url => apiRequest({
  url,
  method: 'DELETE',
  authorization: operator.getKey(),
});

module.exports = {
  post,
  get,
  put,
  delete: deleteMethod,
};

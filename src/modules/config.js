const fs = require('fs');

const PATH = `${require('os').homedir()}/.evrythng-cli-config`;

const DEFAULT_CONFIG = {
  using: '',
  operators: {},
  options: {
    errorDetail: false,
    noConfirm: true,
    showHttp: false,
  },
  logger: {
    level: 'info',
  },
  regions: {
    us: 'https://api.evrythng.com',
    eu: 'https://api-eu.evrythng.com',
  },
};

let data;

const write = () => fs.writeFileSync(PATH, JSON.stringify(data, null, 2), 'utf8');

const load = () => {
  if (!fs.existsSync(PATH)) {
    data = DEFAULT_CONFIG;
    write();
    return;
  }

  data = JSON.parse(fs.readFileSync(PATH, 'utf8'));
};

const get = key => data[key];

const set = (key, value) => {
  data[key] = value;
  write();
};

module.exports = {
  PATH,
  get,
  set,
};

load();

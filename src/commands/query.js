const tq = require('thng-query');
const evrythng = require('evrythng-extended');
const operator = require('./operator');

module.exports = {
  about: 
`Runs thng-query queries against EVRYTHNG API:
      evrythng query run "thngs where properties.temperature=24"  
      evrythng query run "thngs tagged Wifi where customFields.version~5.0.2"  
`,
  firstArg: 'query',
  operations: {
    run: {
      execute: async ([,query]) => 
        setup()
          .then(() => tq.run(query))
          .then(serialize)
          .then(console.log),
          
      pattern: 'query run $query'
    }
  }
};

function setup() {
  tq.setup({
    authorization: operator.getKey(),
    apiUrl: evrythng.settings.apiUrl
  });

  return Promise.resolve();
}

function serialize() {
  return JSON.stringify(...arguments);
}
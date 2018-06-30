const commands = require('../modules/commands');
const switches = require('../modules/switches');

const argsWithJson = (argStr) => {
  let jsonStart;
  let jsonEnd;

  if (argStr.indexOf('[') > 0 && argStr.indexOf('[') < argStr.indexOf('{')) {
    // JSON is an object array
    jsonStart = argStr.indexOf('[');
    jsonEnd = argStr.lastIndexOf(']') + 1;
  } else {
    // JSON is an object
    jsonStart = argStr.indexOf('{');
    jsonEnd = argStr.lastIndexOf('}') + 1;
  }

  const jsonArg = argStr.substring(jsonStart, jsonEnd);
  return argStr.substring(0, jsonStart)
    .split(' ')
    .concat(jsonArg)
    .concat(argStr.substring(jsonEnd).split(' '))
    .filter(item => item.length);
};

module.exports = async (argStr) => {
  let args = (argStr.includes('{')) ? argsWithJson(argStr) : argStr.split(' ');
  args = switches.apply(args);

  return commands.identify(args).execute(args.slice(1));
};

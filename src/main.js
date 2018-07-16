const operator = require('./commands/operator');
const commands = require('./modules/commands');
const config = require('./modules/config');
const printHelp = require('./functions/printHelp');
const switches = require('./modules/switches');

const main = async () => {
  try {
    await operator.checkFirstRun();
    
    const args = switches.apply(process.argv.slice(2));
    const command = commands.identify(args);
    if (!command) {
      printHelp();
      return;
    }

    operator.applyRegion();
    await command.execute(args.slice(1));
  } catch (e) {
    const { errorDetail } = config.get('options');
    if (e.errors) {
      const errStr = errorDetail ? JSON.stringify(e, null, 2) : e.errors[0];
      console.log(`\nEVRYTHNG Error (${e.status}): ${errStr}`);
      return;
    }

    const errStr = errorDetail ? e.stack : e.message;
    console.log(`\n${errStr}`);
  }
};

main();

/* eslint-disable no-console */

const spawn = require('child_process').spawn;
const path = require('path');

const root = `${__dirname}/..`;

// Get command options
const paramKarma = process.argv.indexOf('karma') !== -1;
const paramWatch = process.argv.indexOf('watch') !== -1;
const paramNodeDebug = process.argv.indexOf('debug') !== -1;

// Run Test suite
const testCommand = getTestCommand();
console.log(`${testCommand.command} ${testCommand.args.join(' ')}`);
const testProcess = spawn(testCommand.command, testCommand.args, testCommand.options);
testProcess.on('exit', () => {
  process.exit();
});

// Take care of Ctrl-C
process.on('SIGINT', (code) => {
  testProcess.kill();
});

/**
 * @returns {String[]} Proper parameters to run with `spawn` depending on the command parameters
 */
function getTestCommand() {
  let command;
  let args;
  const options = {
    stdio: ['ignore', 1, 2],
  };
  const istanbul = path.normalize(`${root}/node_modules/istanbul/lib/cli.js`);
  const karma = path.normalize(`${root}/node_modules/.bin/karma`);
  const mocha = path.normalize(`${root}/node_modules/mocha/bin/mocha`);
  const coverageDir = path.normalize(`${root}/coverage`);
  const testDir = path.normalize(`${root}/test/*.spec.js`);


  if (paramKarma) {
    command = karma;
    args = ['start', `--singleRun=${!paramWatch}`];
  } else {
    args = [];
    command = mocha;
    if (paramNodeDebug) {
      args.push('--inspect-brk');
    } else {
      args.push(istanbul, 'cover', `--dir=${coverageDir}/NodeJS/`);
    }
    args.push(testDir);
  }

  return { command, options, args };
}

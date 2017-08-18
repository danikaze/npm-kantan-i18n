const minimist = require('minimist');
const Mocha = require('mocha');
const glob = require('glob').Glob;
const includeAll = require('include-all');

const root = `${__dirname}/..`;
const argv = minimist(process.argv.slice(2), {
  alias: {
    c: 'component',
    g: 'grep',
  },
});

const mocha = new Mocha({
  grep: argv.grep ? argv.grep : undefined,
  reporter: 'dot',
});

includeAll({
  dirname: `${root}/src`,
  filter: /(.+)\.js$/,
});

glob(`${root}/test/*.spec.js`,
  {},
  (err, files) => {
    files.forEach((file) => mocha.addFile(file));
    mocha.run((failures) => {
      process.on('exit', () => {
        process.exit(failures);
      });
    });
  });


const yargs = require('yargs/yargs');
const chalk = require('chalk');

const init = require('./init');
const build = require('./build');
const keygen = require('./keygen');

let argv = yargs(process.argv.slice(2))
    .command('init', 'Create the distribution')
    .command('build', 'Build a distribution out of specs file')
    .command('generate-keys', 'Generate keys')
    .help('h')
    .alias('h', 'help')
    .argv._;

function usage() {
    console.log('Usage: authg [init|build]');
}

if (argv.length < 1) {
    console.log(chalk.red('Error: missing command'));
    usage();
} else {
    if (argv[0] == 'init') {
        init.start();
    } else if (argv[0] == 'build') {
        build.run();
    } else if (argv[0] == 'generate-keys') {
        keygen.run(argv[1]);
    } else {
        console.log(chalk.red('Error: invalid command'));
        usage();
    }
}

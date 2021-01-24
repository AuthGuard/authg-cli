
const yargs = require('yargs/yargs');
const chalk = require('chalk');

const init = require('./init');
const build = require('./build');

let argv = yargs(process.argv.slice(2))
    .command('init', 'Create the distribution')
    .help('h')
    .alias('h', 'help')
    .argv._;

function usage() {
    console.log('Usage: authg [init|build]');
}

module.exports = {
    start: () => {
        if (argv.length < 1) {
            console.log(chalk.red('Error: missing command'));
            usage();
        } else {
            if (argv[0] == 'init') {
                init.start();
            } else if (argv[0] == 'build') {
                build.run();
            } else {
                console.log(chalk.red('Error: invalid command'));
                usage();
            }
        }
    }
}

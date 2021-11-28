'use strict'

const childProcess = require('child_process');
const path = require('path');
const chalk = require('chalk');
const util = require('util');

const promiseExec = util.promisify(childProcess.exec);

const allowedRsaAlgorithms = ['RSA256', 'RSA512'];
const allowedEcAlgorithms = ['EC256', 'EC512', 'EC256K'];
const allAllowedAlgorithms = ['RSA256', 'RSA512', 'EC256', 'EC512', 'EC256K'];

function scriptPath(relativePath) {
    return path.join(__dirname, '..', 'openssl-keygen', relativePath);
}

async function execGenerateScript(script, algorithm, windows) {
    console.log(chalk.green('Generating keys for '), algorithm);

    let rootPath = path.join(__dirname, '..', 'openssl-keygen');

    try {
        windows ? await promiseExec(`${script} ${rootPath} ${algorithm}`) 
                : await promiseExec(`bash ${script} ${rootPath} ${algorithm}`);

        console.log(chalk.green('Keys generated successfully'));
    } catch (e) {
        console.error(chalk.red('Failed to generate keys'));
        console.error(`Exit code: ${e.code}. Error: ${e.stderr}`);

        return false;
    }

    return true;
}

async function generateRsaKeys(algorithm, windows) {
    if (allowedRsaAlgorithms.indexOf(algorithm.toUpperCase()) === -1) {
        console.error(chalk.red('Invalid algorithm: ', algorithm));
        console.error('Allowed algorithms: ', allAllowedAlgorithms.join(', '));

        return false;
    }

    let script = windows ? scriptPath('generate-rsa.cmd') 
                    : scriptPath('generate-rsa.sh');
    
    return await execGenerateScript(script, algorithm, windows);
}

async function generateEcKeys(algorithm, windows) {
    if (allowedEcAlgorithms.indexOf(algorithm.toUpperCase()) === -1) {
        console.error(chalk.red('Invalid algorithm: ', algorithm));
        console.error('Allowed algorithms: ', allAllowedAlgorithms.join(', '));

        return false;
    }

    let script = windows ? scriptPath('generate-elliptic-curves.cmd') 
                    : scriptPath('generate-elliptic-curves.sh');

    return await execGenerateScript(script, algorithm, windows);
}

async function execute(algorithm) {
    if (!algorithm) {
        console.error('An algorithm must be specified for key generation');
    }

    try {
        if (algorithm.startsWith("RSA")) {
            await generateRsaKeys(algorithm);
        } else if (algorithm.startsWith("EC")) {
            await generateEcKeys(algorithm);
        } else {
            console.error(chalk.red('Invalid algorithm: ', algorithm));
            console.error('Allowed algorithms: ', allAllowedAlgorithms.join(', '));
        }
    } catch(e) {
        console.error('Failed to generate keys', e);
    }
}

module.exports = {
    run: execute
}

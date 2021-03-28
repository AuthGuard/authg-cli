
const process = require('process');
const childProcess = require('child_process');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const util = require('util');

const promiseExec = util.promisify(childProcess.exec);

async function buildJarsMaven(windows) {
    console.log(chalk.green('[mvnw clean package] '), 'building jars...');

    let { _, stderr } = windows ? await promiseExec('mvnw.cmd package') 
                                : await promiseExec('./mvnw package');

    if (stderr) {
        console.log(chalk.red('There was error output while building a maven project'));
        console.log(stderr);
    }

    return true;
}

async function buildDockerMaven(windows) {
    console.log(chalk.green('[mvnw docker:build] '), 'building docker image...');

    let { _, stderr } = windows ? await promiseExec('mvnw.cmd docker:build')
                                : await promiseExec('./mvnw docker:build');

    if (stderr) {
        console.log(chalk.red('There was error output while building a docker image'));
        console.log(stderr);
    }

    return true;
}

async function buildJarsGradle(windows) {
    console.log(chalk.green('[gradlew clean build] '), 'building jars...');

    let { _, stderr } = windows ? await promiseExec('gradlew.bat build')
                                : await promiseExec('./gradlew build');

    if (stderr) {
        console.log(chalk.red('There was error output while building a maven project'));
        console.log(stderr);
    }

    return true;
}

async function buildDockerGradle() {
    console.log(chalk.green('[gradle docker] '), 'building docker image...');

    let { _, stderr } = windows ? await promiseExec('gradlew.bat docker')
                                : await promiseExec('./gradlew docker');

    if (stderr) {
        console.log(chalk.red('There was error output while building a docker image'));
        console.log(stderr);
    }

    return true;
}

async function executeUnix(specs, windows) {
    if (specs.project.system == 'maven') {
        console.log('Prject type: Maven');

        await buildJarsMaven(windows);

        if (specs.project.docker) {
            await buildDockerMaven(windows);
        }

        console.log(chalk.green('[mvnw] '), 'successful build');

    } else if (specs.project.system == 'gradle') {
        console.log('Prject type: Gradle');

        await buildJarsGradle(windows);

        if (specs.project.docker) {
            await buildDockerGradle(windows);
        }

        console.log(chalk.green('[gradlew] '), 'successful build');

    } else {
        console.error('Unknown build systme ' + specs.project.system);
    }
}

function execute() {
    let specsFileContent = fs.readFileSync('specs.json', 'utf-8');
    let specs = JSON.parse(specsFileContent);

    if (process.platform == 'win32') {
        executeWindows(specs);
    } else {
        executeUnix(specs);
    }
}

module.exports = {
    run: execute
}

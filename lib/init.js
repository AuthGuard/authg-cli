'use strict'

const prompts = require('./interruptible_prompts');
const extensionsDefinitions = require('./extensions');
const generator = require('./generator');
const chalk = require('chalk');

const versions = require('./versions.json');

const versionChoice = (version) => {
    return { title: version, value: version };
}

const projectPrompts = (projectName) => [
    {
        type: 'select',
        name: 'authguardVersion',
        message: 'Choose AuthGuard version',
        choices: versions.authguard.map(versionChoice)
    },
    {
        type: 'select',
        name: 'system',
        message: 'Choose a build system',
        choices: [
          { title: 'Maven', value: 'maven' },
          { title: 'Gradle', value: 'gradle' },
          { title: 'Specs', value: 'specs' }
        ],
        initial: 0
    },
    {
        type: 'text',
        name: 'groupId',
        message: 'Group',
        initial: 'com.example'
    },
    {
        type: 'text',
        name: 'artifactName',
        message: 'Artifact name',
        initial: projectName
    },
    {
        type: 'text',
        name: 'version',
        message: 'Project version',
        initial: '0.1.0'
    },
    {
        type: 'select',
        name: 'artifactType',
        message: 'Choose an artifact type',
        choices: [
          { title: 'Jar', value: 'jar' },
          { title: 'Fat jar', value: 'fatJar' },
          { title: 'Native image', value: 'native', disabled: true }
        ],
        initial: 0
    },
    {
        type: 'confirm',
        name: 'docker',
        message: 'Build a Docker image?',
        initial: false
    }
];

const extensionsPromps = [
    {
        type: 'multiselect',
        name: 'standard',
        message: 'Choose standard extensions',
        choices: [
          { title: 'JWT', value: 'jwt' },
          { title: 'Sessions', value: 'sessions' },
          { title: 'Account lock', value: 'accountLock' },
          { title: 'Verification', value: 'verification' },
          { title: 'Passwordless Send', value: 'passwordlessSend' },
        ],
        hint: '- Space to select. Return to submit'
    },
    {
        type: 'multiselect',
        name: 'nonStandard',
        message: 'Choose other extensions',
        choices: [
          { title: 'JavaMail', value: 'javaMail' },
          { title: 'Kafka bridge', value: 'kafkaBridge' },
          { title: 'LDAP', value: 'ldap' }
        ],
        hint: '- Space to select. Return to submit'
    },
];

const dalPrompts = [
    {
        type: 'select',
        name: 'persistence',
        message: 'Choose persistence implementation',
        choices: [
          { title: 'PostgreSQL', value: 'postgresqlPersistence' },
          { title: 'MySQL', value: 'mysqlPersistence' },
          { title: 'CockroachDB', value: 'cockrachdbPersistence' },
          { title: 'MongoDB', value: 'mongoPersistence' },
          { title: 'Other -- if you will add your own', value: 'other' }
        ]
    },
    {
        type: 'select',
        name: 'cache',
        message: 'Choose cache implementation',
        choices: [
          { title: 'PostgreSQL', value: 'postgresqlCache' },
          { title: 'MySQL', value: 'mysqlCache' },
          { title: 'CockroachDB', value: 'cockrachdbCache' },
          { title: 'Redis', value: 'redis' },
          { title: 'MongoDB', value: 'mongoCache' },
          { title: 'Other -- you will need to configure it', value: 'other' }
        ]
    }
]

async function promptProjectInformation(projectName) {
    return await prompts(projectPrompts(projectName));
}

function extensionVersionsPrompts(extensions) {
    const choices = extensions.possibleVersions.map(v => {
        return {
            title: v,
            value: v
        }
    });

    return [
        {
            type: 'select',
            name: 'version',
            message: 'Choose the version of ' + extensions.name,
            choices: choices,
            initial: 0
        }
    ]
}

/**
 * Prompt the user to pick the version of an extension. The 
 * extension itself must have a definition in extensionDefinitions.
 */
async function promptExtensionVersion(extensionsName) {
    const definition = extensionsDefinitions[extensionsName];

    if (!definition) {
        throw new Error(`No definition was found for extension ${extensionsName} in ${extensionsDefinitions}`);
    }

    const value = await prompts(extensionVersionsPrompts(definition));

    definition.version = value.version;

    return definition;
}

/**
 * Prompt the user to choose standard and non-standard extensions.
 * For non-standard extensions, the user will be prompted to pick 
 * a version since their versions may not match that of AuthGuard
 * itself.
 */
async function promptExtensions() {
    const chosen = await prompts(extensionsPromps);

    let extensions = {};

    // keep standard extensions as they are
    extensions.standard = chosen.standard.map(ext => extensionsDefinitions[ext]);

    // read the versions of non-standard extensions
    extensions.nonStandard = [];

    for (const ext of chosen.nonStandard) {
        extensions.nonStandard.push(await promptExtensionVersion(ext));
    }

    return extensions;
}

/**
 * Prompt the user to choose persistence and cache implementations 
 * as well their their versions.
 */
async function promptDal() {
    let dal = await prompts([
        {
            type: 'confirm',
            name: 'inMemory',
            message: 'Use an in-memory data store?',
            initial: false
        }
    ]);

    if (dal.inMemory) {
        dal.extensions = {};
        dal.extensions.persistence = await promptExtensionVersion('memoryDal'); // contains cache implementation
    } else {
        dal = await prompts(dalPrompts);

        dal.extensions = {};

        // database prompts
        dal.extensions.persistence = await promptExtensionVersion(dal.persistence);

        // cache prompts
        dal.extensions.cache = await promptExtensionVersion(dal.cache);
    }

    return dal;
}

async function promptSpecsAndGenerate(projectName) {
    let specs = {
        projectName: projectName
    };

    console.log(chalk.green.bold('Enter project information'));
    specs.project = await promptProjectInformation(projectName);

    console.log('');
    
    console.log(chalk.green.bold('Choose extensions'));
    specs.extensions = await promptExtensions();

    console.log('');

    console.log(chalk.green.bold('Choose data access implementation'));
    specs.dal = await promptDal();

    console.log('');

    generator.generate(specs);
}
 
module.exports = { 
    start: async () => {
        let proceed = true;

        let projectName = await prompts([
            {
                type: 'text',
                name: 'value',
                message: 'Project name',
                initial: 'authguard-dist'
            }
        ]);

        // make sure that a distribution doesn't already exist (or clear the existing one)
        if (generator.distExists(projectName.value)) {
            let clearPrompt = await prompts([        
                {
                    type: 'confirm',
                    name: 'clear',
                    message: 'A distribution directory ' + projectName.value + ' already exists. Do you want to remove it?',
                    initial: true
                }
            ]);

            if (clearPrompt.clear) {
                generator.clear(projectName.value);

                console.log('Removed directory ' + projectName.value);
            } else {
                proceed = false;
            }
        }

        if (proceed) {
            console.log('Proceed');
            promptSpecsAndGenerate(projectName.value);
        }
    }
}
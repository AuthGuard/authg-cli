'use strict'

const fs = require('fs');
const path = require('path')
const handlebars = require('handlebars');

handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

function templatePath(relativePath) {
    return path.join(__dirname, '..', 'templates', relativePath);
}

function createDockerfile(specs, rootPath) {
    let dest = specs.projectName;
    let dockerFileTemplateContent;

    if (specs.project.artifactType == 'jar' || specs.project.artifactType == 'fatJar') {
        dockerFileTemplateContent = fs.readFileSync(rootPath + '/jar-dockerfile.hbs', 'utf-8')
    }

    let dockerFileTemplate = handlebars.compile(dockerFileTemplateContent);

    let dockerFile = dockerFileTemplate(specs);

    fs.writeFileSync(dest + '/Dockerfile', dockerFile, { encoding: 'utf-8' });
}

function copyConfiguration(specs) {
    let dest = specs.projectName;
    fs.mkdirSync(dest + '/config', { recursive: true });

    fs.copyFileSync(templatePath('common/application.yaml'), 
                    dest + '/config/application.yaml');
}

function writeSpecs(specs) {
    let dest = specs.projectName;
    let content = JSON.stringify(specs, null, 2);

    fs.writeFileSync(dest + '/specs.json', content, { encoding: 'utf-8' });
}

function generateMaven(specs) {
    let dest = specs.projectName;
    let pomTemplateContent = fs.readFileSync(templatePath('maven/pom.xml.hbs'), 'utf-8');
    let pomTemplate = handlebars.compile(pomTemplateContent);

    let pom = pomTemplate(specs);

    // create the directory structure
    fs.mkdirSync(dest + '/src/main/resources/META-INF', { recursive: true });
    fs.mkdirSync(dest + '/.mvn/wrapper', { recursive: true });

    // write the processed pom
    fs.writeFileSync(dest + '/pom.xml', pom, { encoding: 'utf-8' });

    // copy the wrapper
    fs.copyFileSync(templatePath('maven/mvnw'), dest + '/mvnw');
    fs.copyFileSync(templatePath('maven/mvnw.cmd'), dest + '/mvnw.cmd');
    fs.copyFileSync(templatePath('maven/.mvn/wrapper/maven-wrapper.jar'), 
                        dest + '/.mvn/wrapper/maven-wrapper.jar');
    fs.copyFileSync(templatePath('maven/.mvn/wrapper/maven-wrapper.properties'), 
                        dest + '/.mvn/wrapper/maven-wrapper.properties');
    fs.copyFileSync(templatePath('maven/.mvn/wrapper/MavenWrapperDownloader.java'), 
                        dest + '/.mvn/wrapper/MavenWrapperDownloader.java');

    // copy the other files
    fs.copyFileSync(templatePath('common/logback.xml'), 
                    dest + '/src/main/resources/logback.xml');

    fs.copyFileSync(templatePath('maven/src/main/resources/META-INF/MANIFEST.MF'), 
                    dest + '/src/main/resources/META-INF/MANIFEST.MF');

    // copy config files
    copyConfiguration(specs);

    // create a docker file if needed
    if (specs.project.docker) {
        createDockerfile(specs, templatePath('maven'));
    }

    // write the specs
    writeSpecs(specs);
}

function generateGradle(specs) {
    let dest = specs.projectName;
    let buildTemplateContent = fs.readFileSync('gradle/build.gradle.hbs', 'utf-8');
    let settingsTemplateContent = fs.readFileSync('gradle/settings.gradle.hbs', 'utf-8');

    let buildTemplate = handlebars.compile(buildTemplateContent);
    let settingsTemplate = handlebars.compile(settingsTemplateContent);

    let build = buildTemplate(specs);
    let settings = settingsTemplate(specs);

    // create the directory structure
    fs.mkdirSync(dest + '/src/main/resources/', { recursive: true });
    fs.mkdirSync(dest + '/gradle/wrapper', { recursive: true });

    // write the processed build.gradle and settings.gradle
    fs.writeFileSync(dest + '/build.gradle', build, { encoding: 'utf-8' });
    fs.writeFileSync(dest + '/settings.gradle', settings, { encoding: 'utf-8' });

    // copy the wrapper
    fs.copyFileSync(templatePath('gradle/gradlew'), dest + '/gradlew');
    fs.copyFileSync(templatePath('gradle/gradlew.bat'), dest + '/gradlew.bat');
    fs.copyFileSync(templatePath('gradle/gradle/wrapper/gradle-wrapper.jar'), 
                        dest + '/gradle/wrapper/gradle-wrapper.jar');
    fs.copyFileSync(templatePath('gradle/gradle/wrapper/gradle-wrapper.properties'), 
                        dest + '/gradle/wrapper/gradle-wrapper.properties');

    // copy the other files
    fs.copyFileSync(templatePath('common/logback.xml'), 
                    dest + '/src/main/resources/logback.xml');

    // copy config files
    copyConfiguration(specs);

    // create a docker file if needed
    if (specs.project.docker) {
        createDockerfile(specs, templatePath('gradle'));
    }

    // write the specs
    writeSpecs(specs);
}

function generateSpecs(specs) {
    writeSpecs(specs);
}

function generate(specs) {
    if (specs.project.system === 'maven') {
        generateMaven(specs);
    } else if (specs.project.system == 'gradle') {
        generateGradle(specs);
    } else if (specs.project.system == 'specs') {
        generateSpecs(specs);
    } else {
        console.error('Unknown build system ', specs.project.system);
    }
}

function distExists(projectDirectory) {
    return fs.existsSync(projectDirectory);
}

function clear(projectDirectory) {
    fs.rmdirSync(projectDirectory, { recursive: true });
}

module.exports = {
    distExists: distExists,
    clear: clear,
    generate: generate
}

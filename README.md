# AuthGuard CLI

A simple CLI to generate and build custom AuthGuard distributions.

## Installing
The CLI is yet to be available to install through NPM, and will need to be installed 
from source. Simply clone and the repository and the install it.
```
git clone git@github.com:AuthGuard/authg-cli.git
```
Then go into the repository directory and run
```
npm install -g
```

Now the command `authg` will be available globally.

### Requirements
* NodeJS (to run the CLI)
* Java 11+ (to build the distribution)

## Usage
To create a new distribution, you can execute the following command, and answer the 
prompts
```
authg init
```
After the distribution project was created, go to its directory and run
```
authg build
```
The build command is just a wrapper around either Maven or Gradle, depending on which 
one you chose to build your project. As well as Docker, if enabled.

## Build Types
With the CLI, you have the option to build: a thin jar, a fat jar, or a native image 
(will be supported in new releases). You can also choose to build a docker image of 
any of those builds.

### Thin Jar
This builds the main executable jar by itself, with all its dependencies copied to a lib 
directory relative to its root path. Those dependencies are added to the classpath even 
though they're not packaged with the executable jar.

### Fat Jar
This one just packages everything into a single self-contained executable jar.

### Native Image
Not currently supported.

### Docker Image
If you chose to enable building a docker image, a docker plugin will be added to the 
build file, and a docker file will also be included in the project. You can build the 
image manually, or keep it as part of running `authg build`.


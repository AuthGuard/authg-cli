'use strict'

const AUTHGUARD_GROUP_ID = 'com.nexblocks.authguard';

function standardExtension(name) {
    return {
        type: 'standard',
        groupId: AUTHGUARD_GROUP_ID,
        name: name
    }
}

function nonStandardExtension(name, possibleVersions) {
    return {
        type: 'non-standard',
        groupId: AUTHGUARD_GROUP_ID,
        name: name,
        possibleVersions: possibleVersions
    }
}

// standard
const jwt = standardExtension('jwt');
const sessions = standardExtension('sessions');
const verification = standardExtension('verification-plugin');
const accountLock = standardExtension('account-lock');

// local testing non-standard plugins
const logEmb = nonStandardExtension('log-emb', ['0.3.0']);
const logExternal = nonStandardExtension('log-external', ['0.3.0']);
const memoryDal = nonStandardExtension('memory-dal', ['0.3.0']);

// DAL plugins
const mongoPersistence = nonStandardExtension('mongo-persistence', ['0.3.0']);
const mongoCache = nonStandardExtension('mongo-cache', ['0.3.0']);
const postgresql = nonStandardExtension('postgresql-persistence', ['0.3.0']);
const redis = nonStandardExtension('redis-cache', ['0.3.0']);

// non-standard plugins
const javaMail = nonStandardExtension('java-mail-plugin', ['0.3.0']);
const kafkaBridge = nonStandardExtension('kafka-bridge', ['0.3.0']);

module.exports = {
    jwt: jwt,
    sessions: sessions,
    verification: verification,
    accountLock: accountLock,

    logEmb: logEmb,
    logExternal: logExternal,
    memoryDal: memoryDal,

    mongoPersistence: mongoPersistence,
    mongoCache: mongoCache,
    postgresql: postgresql,
    redis: redis,

    javaMail: javaMail,
    kafkaBridge: kafkaBridge
}

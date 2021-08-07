'use strict'

const versions = require('./versions.json');

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
const otp = standardExtension('otp');
const passwordless = standardExtension('passwordless');
const passwordlessSend = standardExtension('passwordless-send');
const verification = standardExtension('verification-plugin');
const accountLock = standardExtension('account-lock');

// local testing non-standard plugins
const logEmb = nonStandardExtension('log-emb', versions.nonStandardExtensions);
const logExternal = nonStandardExtension('log-external', versions.nonStandardExtensions);
const memoryDal = nonStandardExtension('memory-dal', versions.nonStandardExtensions);

// DAL plugins
const mongoPersistence = nonStandardExtension('mongo-persistence', versions.nonStandardExtensions);
const mongoCache = nonStandardExtension('mongo-cache', versions.nonStandardExtensions);

const postgresqlPersistence = nonStandardExtension('postgres-persistence', versions.nonStandardExtensions);
const postgresqlCache = nonStandardExtension('postgres-cache', versions.nonStandardExtensions);

const mysqlPersistence = nonStandardExtension('mysql-persistence', versions.nonStandardExtensions);
const mysqlCache = nonStandardExtension('mysql-cache', versions.nonStandardExtensions);

const cockroachdbPersistence = nonStandardExtension('cockroachdb-persistence', versions.nonStandardExtensions);
const cockroachdbCache = nonStandardExtension('cockroachdb-cache', versions.nonStandardExtensions);

const redis = nonStandardExtension('redis-cache', versions.nonStandardExtensions);

// non-standard plugins
const javaMail = nonStandardExtension('javamail-provider', versions.nonStandardExtensions);
const kafkaBridge = nonStandardExtension('kafka-bridge', versions.nonStandardExtensions);
const sendgrid = nonStandardExtension('sendgrid', versions.nonStandardExtensions);

module.exports = {
    jwt: jwt,
    sessions: sessions,
    verification: verification,
    accountLock: accountLock,
    passwordlessSend: passwordlessSend,
    otp: otp,
    passwordless,

    logEmb: logEmb,
    logExternal: logExternal,
    memoryDal: memoryDal,

    mongoPersistence: mongoPersistence,
    mongoCache: mongoCache,

    postgresqlPersistence: postgresqlPersistence,
    postgresqlCache: postgresqlCache,

    mysqlPersistence: mysqlPersistence,
    mysqlCache: mysqlCache,
    
    cockroachdbPersistence: cockroachdbPersistence,
    cockroachdbCache: cockroachdbCache,

    redis: redis,

    javaMail: javaMail,
    sendgrid: sendgrid,
    kafkaBridge: kafkaBridge
}

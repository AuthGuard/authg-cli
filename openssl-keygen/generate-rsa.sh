#!/bin/sh

ROOT=$1
ALGORITHM_NAME=$2

. ${ROOT}/openssl-exists.sh

generate_rsa() {
    KEY_BITS=$1
    NAME=$2

    openssl genpkey -algorithm RSA -out "${NAME}-private.pem" -pkeyopt "rsa_keygen_bits:${KEY_BITS}" 
    openssl rsa -in "${NAME}-private.pem" -outform PEM -pubout -out "${NAME}-public.pem"
}

# check that OpenSSL is installed
openssl_exists

if [ -$? -ne 0 ]; then
    exit 1
fi

echo "Will generate for algorithm ${ALGORITHM_NAME}"

if [ "${ALGORITHM_NAME}" = "RSA256" ]; then
    generate_rsa 2048 rsa256
elif [ "${ALGORITHM_NAME}" = "RSA512" ]; then
    generate_rsa 4096 rsa512
else
    >&2 echo "Unsupported algorithm"
    exit 2
fi
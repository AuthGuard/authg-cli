#!/bin/sh

ROOT=$1
ALGORITHM_NAME=$2

. ${ROOT}/openssl-exists.sh

generate_ec() {
    CURVE=$1
    NAME=$2
    PCKS1_NAME="${NAME}-pcks1-key.pem"

    openssl ecparam -genkey -name "${CURVE}" -out "${PCKS1_NAME}" -text

    openssl pkcs8 -topk8 -inform PEM -outform PEM -nocrypt -in "${PCKS1_NAME}" \
      -out "${NAME}-key.private.pem"

    openssl ec -pubout -in "${PCKS1_NAME}" -out "${NAME}-key-public.pem"
}

# check that OpenSSL is installed
openssl_exists

if [ -$? -ne 0 ]; then
    exit 1
fi

echo "Will generate for algorithm ${ALGORITHM_NAME}"

if [ "${ALGORITHM_NAME}" = "EC256" ]; then
    generate_ec prime256v1 ec256
elif [ "${ALGORITHM_NAME}" = "EC512" ]; then
    generate_ec secp521r1 ec512
elif [ "${ALGORITHM_NAME}" = "EC256K" ]; then
    generate_ec secp256k1 ec256k
else
    >&2 echo "Unsupported algorithm"
    exit 2
fi
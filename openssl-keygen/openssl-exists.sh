#!/bin/sh

openssl_exists() {
  which openssl > /dev/null

  if [ -$? -ne 0 ]; then
      echo "OpenSSL is not installed checked using command (which openssl)"
      return 1
  fi

  return 0
}

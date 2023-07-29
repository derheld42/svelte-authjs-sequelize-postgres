#!/bin/bash
## https://devcenter.heroku.com/articles/ssl-certificate-self

cd $(dirname "$0")

# Prereq: apt-get install openssl

# Generate private key and certificate signing request
## private key = server.key
## certificate signing request = server.csr
openssl genrsa -aes256 -passout pass:gsahdg -out server.pass.key 4096
openssl rsa -passin pass:gsahdg -in server.pass.key -out server.key
rm server.pass.key
openssl req -new -key server.key -out server.csr

# Generate SSL certificate
## cert = server.crt
openssl x509 -req -sha256 -days 365 -in server.csr -signkey server.key -out server.crt

echo private key = server.key
echo signed certificate = server.crt
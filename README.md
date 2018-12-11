# @demimonde/electroscope

[![npm version](https://badge.fury.io/js/@demimonde/electroscope.svg)](https://npmjs.org/package/@demimonde/electroscope)

`@demimonde/electroscope`: The Azure Function To Return Metadata Of Received Base64-Encoded Image.

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/0.svg?sanitize=true"></a></p>

- [`/mnp`](#mnp)
- [`/letsencrypt`](#letsencrypt)
- [Copyright](#copyright)

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/1.svg?sanitize=true"></a></p>

## `/mnp`

The mnp function will receive the input and respond with the output.

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/2.svg?sanitize=true"></a></p>

## `/letsencrypt`

The path is used to serve the key manually put in the function directory for the greenlock debug session that can be started with the `./letsencrypt.sh` command:

```sh
node_modules/.bin/greenlock certonly --manual \
  --acme-version draft-11 --acme-url https://acme-staging-v02.api.letsencrypt.org/directory \
  --agree-tos --email ssh@adc.sh --domains metadata.photos \
  --community-member \
  --config-dir ~/acme/etc
```

The selection of certificates in the web interface for azure functions ssl bindings does not currently work..?

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/3.svg?sanitize=true"></a></p>

## Copyright

(c) [Demimonde][1] 2018

[1]: https://demimonde.cc

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/-1.svg?sanitize=true"></a></p>
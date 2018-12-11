node_modules/.bin/greenlock certonly --manual \
  --acme-version draft-11 --acme-url https://acme-staging-v02.api.letsencrypt.org/directory \
  --agree-tos --email ssh@adc.sh --domains metadata.photos \
  --community-member \
  --config-dir ~/acme/etc
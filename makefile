node_modules/@financial-times/n-gage/index.mk:
	npm install --no-save --no-package-lock @financial-times/n-gage
	touch $@

-include node_modules/@financial-times/n-gage/index.mk

VAULT_NAME=google-amp
HEROKU_APP_STAGING=google-amp-staging
HEROKU_APP_EU=google-amp-prod-eu
HEROKU_APP_US=google-amp-prod-us

js-files = app.js $(shell find server -name '*.js')
test-files = $(shell find test -name 'index.js')
test-files-all = $(shell find test -name '*.js')

test: verify $(js-files) $(test-files-all)
ifeq ($(CI),true)
	NODE_ENV=test istanbul cover node_modules/.bin/_mocha -- --reporter mocha-junit-reporter $(test-files)
else
	NODE_ENV=test istanbul cover node_modules/.bin/_mocha -- $(test-files)
endif

unit-test: $(js-files) $(test-files-all)
	NODE_ENV=test istanbul cover node_modules/.bin/_mocha -- -i --grep "amp validator" $(test-files)

run:
	npm start

build-production:
	node -r dotenv/config server/lib/article/css

certificate:
	openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 1461 -nodes -config certificate.cnf

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
lintspace-files = $(js-files) $(test-files-all) $(shell find scripts -name '*.js' -or -name '*.sh') $(wildcard scss/*.scss) $(shell find views -name '*.html')

test: lint $(js-files) $(test-files-all)
ifeq ($(CI),true)
	NODE_ENV=test istanbul cover node_modules/.bin/_mocha -- --reporter mocha-junit-reporter $(test-files)
else
	NODE_ENV=test istanbul cover node_modules/.bin/_mocha -- $(test-files)
endif

unit-test: $(js-files) $(test-files-all)
	NODE_ENV=test istanbul cover node_modules/.bin/_mocha -- -i --grep "amp validator" $(test-files)

eslint: $(js-files) $(test-files-all)
	npx eslint --fix $^

lintspaces: $(lintspace-files)
	lintspaces -n -d tabs -l 2 $^

lint: lintspaces eslint

run:
	npm start

build-production:
	node -r dotenv/config server/lib/article/css

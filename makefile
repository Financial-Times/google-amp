export SHELL := /bin/bash
export PATH := $(shell npm bin):$(PATH)

HAS_HEROKU_CLI := $(shell command -v heroku 2> /dev/null)

ifdef HAS_HEROKU_CLI
ifndef CI
	-include .env.mk
endif
endif

src-files = $(shell find src -name '*.js')
lib-files = $(patsubst src/%.js, lib/%.js, $(src-files))
js-files = app.js $(src-files)

scss-files = $(wildcard scss/*.scss)
scss-non-entries = $(wildcard scss/_*.scss)
scss-entries = $(filter-out $(scss-non-entries), $(scss-files))
css-files = $(patsubst scss/%.scss, css/%.css, $(scss-entries))

test-files = $(shell find test -name 'index.js')
test-files-all = $(shell find test -name '*.js')
lintspace-files = $(js-files) $(test-files-all) $(shell find scripts -name '*.js' -or -name '*.sh') $(wildcard scss/*.scss) $(shell find views -name '*.html')

HEROKU_CONFIG_OPTS = -i HEROKU_ -i NODE_ENV -l NODE_ENV=development
HEROKU_CONFIG_APP = ft-google-amp-staging

all: babel css

babel: $(lib-files)

lib/%.js: src/%.js
	mkdir -p $(@D)
	babel $< -o $@

css: $(css-files)

$(css-files): lib/article/css.js $(scss-files)
	node -r dotenv/config lib/article/css.js

.env:
	@if ! command -v heroku 2> /dev/null ; then\
		echo "✘ Trying to get env vars from Heroku, but you don't have the Heroku CLI installed" ;\
		echo "https://devcenter.heroku.com/articles/heroku-cli" ;\
		echo ;\
		exit 1 ;\
	fi
	if ! heroku whoami ; then heroku login --sso ; fi
	heroku-config-to-env $(HEROKU_CONFIG_OPTS) $(HEROKU_CONFIG_APP) $@

.env.mk: .env
	sed 's/"//g ; s/=/:=/ ; s/^/export /' < $< > $@

lintspaces: $(lintspace-files)
	lintspaces -n -d tabs -l 2 $^

eslint: $(js-files) $(test-files-all)
	eslint --fix $^

lint: lintspaces eslint

bench:
	./scripts/bench.sh

test: lint $(js-files) $(test-files-all)
	NODE_ENV=test istanbul cover node_modules/.bin/_mocha -- $(test-files)

unit-test: $(js-files) $(test-files-all)
	NODE_ENV=test istanbul cover node_modules/.bin/_mocha -- -i --grep "amp validator" $(test-files)

.PHONY: bench

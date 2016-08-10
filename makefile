export SHELL := /bin/bash
export PATH := $(shell npm bin):$(PATH)

HEROKU := $(shell command -v heroku 2> /dev/null)

ifdef HEROKU
	-include .env.mk
endif

js-files = app.js $(shell find server -name '.js')
lintspace-files = $(js-files) $(wildcard scripts/*) $(wildcard scss/*.scss) $(shell find views -name '*.html') $(wildcard server/stylesheets/*.xsl)

HEROKU_CONFIG_OPTS = -i HEROKU_ -i NODE_ENV -l NODE_ENV=development
HEROKU_CONFIG_APP = ft-google-amp-staging

.env:
	heroku-config-to-env $(HEROKU_CONFIG_OPTS) $(HEROKU_CONFIG_APP) $@

.env.mk: .env
	sed 's/"//g ; s/=/:=/ ; s/^/export /' < $< > $@

lintspaces: $(lintspace-files)
	lintspaces -n -d tabs -l 2 $^

eslint: $(js-files)
	eslint --fix $^

lint: lintspaces eslint

instrument:
	./scripts/instrument.js

bench:
	./scripts/bench.sh

test: lint
	./scripts/test.sh

.PHONY: instrument bench
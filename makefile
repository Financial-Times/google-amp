export SHELL := /bin/bash
export PATH := $(shell npm bin):$(PATH)

HEROKU := $(shell command -v heroku 2> /dev/null)

ifdef HEROKU
	-include .env.mk
endif

ifeq (,$(wildcard .env))
FASTLY_OPTS = --service FASTLY_SERVICE vcl
else
FASTLY_OPTS = --env --service FASTLY_SERVICE vcl
endif

js-files = app.js $(shell find server -name '*.js')
test-files = $(shell find test -name '*.js')
test-util-files = $(wildcard test-utils/*.js)
lintspace-files = $(js-files) $(test-files) $(test-util-files) $(wildcard scripts/*) $(wildcard scss/*.scss) $(shell find views -name '*.html') $(wildcard server/stylesheets/*.xsl)

HEROKU_CONFIG_OPTS = -i HEROKU_ -i NODE_ENV -l NODE_ENV=development
HEROKU_CONFIG_APP = ft-google-amp-staging

.env:
	heroku-config-to-env $(HEROKU_CONFIG_OPTS) $(HEROKU_CONFIG_APP) $@

.env.mk: .env
	sed 's/"//g ; s/=/:=/ ; s/^/export /' < $< > $@

lintspaces: $(lintspace-files)
	lintspaces -n -d tabs -l 2 $^

eslint: $(js-files) $(test-files) $(test-util-files)
	eslint --fix $^

lint: lintspaces eslint

instrument:
	$(if $(UUID),,$(eval $(error UUID is required, e.g. make instrument UUID=ffffffff-ffff-ffff-ffff-ffffffffffff)))
	./scripts/instrument.js $(UUID)

instrument-products:
	./scripts/instrument-products.js

bench:
	./scripts/bench.sh

test: lint unit-test integration-test

integration-test:
	./scripts/test.sh

mocha-opts := --require async-to-gen/register

unit-test: $(js-files) $(test-util-files) $(test-files)
	mocha $(mocha-opts) $(test-files)

test/transform/%.js: server/stylesheets/main.xsl server/stylesheets/%.xsl

# heroku and fastly
promote: merge-fixversions change-request deploy-vcl-prod heroku-promote

heroku-promote:
	heroku pipelines:promote -a ft-google-amp-staging --to ft-google-amp-prod-eu,ft-google-amp-prod-us

cr-description.txt:
	$(eval VERSION=$(shell scripts/version.sh))

	echo "JIRA tickets in $(VERSION):" > $@
	scripts/jira-release-issues.js google-amp-$(VERSION) >> $@
	heroku pipelines:diff -a ft-google-amp-staging >> $@

change-request: cr-description.txt | merge-fixversions
	$(if $(KONSTRUCTOR_CR_KEY),,$(eval $(error KONSTRUCTOR_CR_KEY is required, check your .env)))

	$(eval VERSION=$(shell scripts/version.sh))

	change-request \
		--api-key $(KONSTRUCTOR_CR_KEY) \
		--summary "Release google-amp $(VERSION)" \
		--description-file $< \
		--owner-email "matthew.brennan@ft.com" \
		--service "google amp" \
		--environment "Production" \
		--notify-channel "ft-tech-incidents"

merge-fixversions:
	jira-merge-unreleased-versions

deploy-vcl-prod:
	$(MAKE) -B HEROKU_CONFIG_APP=ft-google-amp-prod-eu .env deploy-vcl
	$(MAKE) -B .env

deploy-vcl:
	$(if $(FASTLY_APIKEY), node_modules/.bin/fastly deploy $(FASTLY_OPTS), @echo '⤼ No Fastly API key, not deploying VCL')

.PHONY: instrument bench cr-description.txt

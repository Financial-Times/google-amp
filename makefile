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
	$(if $(UUID),,$(eval $(error UUID is required, e.g. make instrument UUID=ffffffff-ffff-ffff-ffff-ffffffffffff)))
	./scripts/instrument.js $(UUID)

bench:
	./scripts/bench.sh

test: lint
	./scripts/test.sh

# heroku and fastly
promote: deploy-vcl-prod
	heroku pipelines:promote -a ft-google-amp-staging --to ft-google-amp-prod-eu,ft-google-amp-prod-us

deploy-vcl-prod:
	$(MAKE) -B HEROKU_CONFIG_APP=ft-google-amp-prod-eu .env deploy-vcl
	$(MAKE) -B .env

deploy-vcl:
	$(if $(FASTLY_APIKEY), node_modules/.bin/fastly deploy $(FASTLY_OPTS), @echo '⤼ No Fastly API key, not deploying VCL')

.PHONY: instrument bench

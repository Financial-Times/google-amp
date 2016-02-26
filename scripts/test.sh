#!/bin/bash

check_env_var() {
	if [ "" == "${!1}" ]; then
		echo "$1 not defined"
		exit 1
	fi
}

check_env_var AWS_ACCESS_KEY
check_env_var AWS_SECRET_ACCESS_KEY
check_env_var ELASTIC_SEARCH_URL

. ./scripts/test-uuids.sh

set -x -e -o pipefail

mkdir -p temp

for UUID in "${TEST_UUIDS[@]}"; do
	# use a temp file instead of pipes because we want it to bail asap
	TMP=$(mktemp temp/${UUID}-XXXXXXXX)
	node --use-strict server/controllers/amp-page.js "$UUID" > $TMP
	amp-validator-prebuilt $TMP
done

rm -rf temp

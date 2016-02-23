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

UUIDS=(
	"70d0bfd8-d1b3-11e5-831d-09f7778e7377"
	"7a199ac2-d8c2-11e5-98fd-06d75973fe09"
	"cf290804-25e9-3e4b-8a19-efc090b6fca0"
	"6a90c7e4-d681-11e5-829b-8564e7528e54"
	"181a2b02-d63d-11e5-8887-98e7feb46f27"
	"80c3164e-d644-11e5-8887-98e7feb46f27"
)

set -x -e -o pipefail

mkdir -p temp

for UUID in "${UUIDS[@]}"; do
	# use a temp file instead of pipes because we want it to bail asap
	TMP=$(mktemp temp/${UUID}-XXXXXXXX)
	node --use-strict server/controllers/amp-page.js "$UUID" > $TMP
	amp-validator-prebuilt $TMP
done

rm -rf temp

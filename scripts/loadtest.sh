#!/bin/bash

set -e
. ./scripts/test-uuids.sh

BASE_URL="$1"
REQUESTS="${2:-100}"
CONCURRENT="${3:-10}"

URLS=$(mktemp urls-XXXX)

cleanup() {
	rm -f $URLS
}

trap cleanup EXIT

for UUID in "${TEST_UUIDS[@]}"; do
	echo "$BASE_URL/content/$UUID"
done > $URLS

siege -f $URLS -r $REQUESTS -c $CONCURRENT

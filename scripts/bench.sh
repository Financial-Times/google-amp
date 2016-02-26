#!/bin/bash

. ./scripts/test-uuids.sh
. ./scripts/env.sh

set -x -e

PORT=5001 node --use-strict app.js & > /dev/null
PID=$!

sleep 5

TMP=$(mktemp urls-XXXX)
for UUID in "${TEST_UUIDS[@]}"; do
	echo "http://localhost:5001/content/$UUID"
done > $TMP

siege -f $TMP -r 100 -c 10

rm -f $TMP
kill $PID

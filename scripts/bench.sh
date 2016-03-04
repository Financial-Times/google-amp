#!/bin/bash

. ./scripts/test-uuids.sh
. ./scripts/env.sh

set -e

URLS=$(mktemp urls-XXXX)
LOG=$(mktemp log-XXXX)
PORT=5001 LOG_FORMAT=":response-time[6] ms :url" node --use-strict app.js | tee $LOG | prog-rock 1001 &
PID=$!

cleanup() {
	./scripts/analyse-log.js $LOG
	rm -f $LOG $URLS
	kill $PID
}

trap cleanup EXIT

sleep 5

for UUID in "${TEST_UUIDS[@]}"; do
	echo "http://localhost:5001/content/$UUID"
done > $URLS

siege -f $URLS -r 100 -c 10 > /dev/null 2>&1

#!/bin/bash

. ./scripts/test-uuids.sh
. ./scripts/env.sh

set -e

URLS=$(mktemp urls-XXXX)
LOGPIPE=$(mktemp -u log-pipe-XXXX)
mkfifo $LOGPIPE
LOG=$(mktemp -u log-XXXX)

PORT=5001 LOG_FORMAT=":response-time[6] ms :url" node --use-strict app.js > $LOGPIPE &
SERVER_PID=$!

tee $LOG < $LOGPIPE | prog-rock 1001 &
PROG_PID=$!

cleanup() {
	kill $SERVER_PID
	./scripts/analyse-log.js $LOG
	rm -f $LOG $LOGPIPE $URLS
}

trap cleanup EXIT

sleep 5

for UUID in "${TEST_UUIDS[@]}"; do
	echo "http://localhost:5001/content/$UUID"
done > $URLS

siege -f $URLS -r 100 -c 10 > /dev/null 2>&1
kill $PROG_PID

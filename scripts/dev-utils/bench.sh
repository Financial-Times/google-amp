#!/bin/bash

set -e

LOGPIPE=$(mktemp -u log-pipe-XXXX)
mkfifo $LOGPIPE
LOG=$(mktemp log-XXXX)

PORT=5001 LOG_FORMAT=":response-time[6] ms :url" node app.js > $LOGPIPE &
SERVER_PID=$!

tee $LOG < $LOGPIPE | prog-rock 1001 &
PROG_PID=$!

cleanup() {
	kill $SERVER_PID
	./scripts/dev-utils/analyse-log.js $LOG
	rm -f $LOG $LOGPIPE
}

trap cleanup EXIT

sleep 5

scripts/dev-utils/loadtest.sh "http://localhost:5050" > /dev/null 2>&1

kill $PROG_PID

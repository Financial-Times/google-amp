#!/bin/sh

# same algorithm as https://github.com/quarterto/heroku-version-infer/blob/master/src/index.js,
# just done locally with the current repository

SHA=$(git rev-list --max-count=1 HEAD)
MERGES=$(git rev-list $SHA --merges --first-parent | wc -l | xargs expr 1 +)

echo "$MERGES.0.0-heroku-${SHA:0:7}"

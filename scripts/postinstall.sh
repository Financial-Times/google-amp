#!/bin/sh

set -x -e

bower install

pushd bower_components/next-article
npm install --production
popd

node server/lib/compile-scss

#!/bin/sh

set -x -e

bower install

cd bower_components/next-article
npm install --production
cd ../..

node server/lib/compile-scss

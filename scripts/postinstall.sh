#!/bin/sh

set -x -e

bower install
node -e "require('./server/lib/get-css.js').compileForProduction()"

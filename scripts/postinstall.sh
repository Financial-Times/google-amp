#!/bin/sh

set -x -e

bower install
node -e "require('./server/lib/article/css.js').compileForProduction()"

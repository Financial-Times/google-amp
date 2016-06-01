#!/bin/sh

set -x -e

./scripts/version.js

bower install
post-sass --postCss autoprefixer --postCss cssnano

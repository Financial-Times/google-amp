#!/bin/sh

set -x -e

./version.js

bower install
post-sass --postCss autoprefixer --postCss cssnano

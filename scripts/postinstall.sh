#!/bin/sh

set -x -e

bower install
post-sass --postCss autoprefixer --postCss cssnano
heroku-version-infer

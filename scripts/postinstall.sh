#!/bin/sh

set -x -e

bower install

post-sass --postCss autoprefixer --postCss cssnano

env

# npm version --no-git-tag $(git log HEAD --merges --pretty=oneline | grep -v "Merge branch 'master'" | wc -l).0.0

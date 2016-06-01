#!/bin/sh

set -x -e

bower install

post-sass --postCss autoprefixer --postCss cssnano

version=$(git log HEAD --merges --pretty=oneline | grep -v "Merge branch 'master'" | wc -l).0.0
echo "Inferred version $version"
npm version --no-git-tag $version

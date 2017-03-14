#!/bin/sh

set -x -e

bower install

node server/lib/article/css

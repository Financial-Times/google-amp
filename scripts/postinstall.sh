#!/bin/sh

set -x -e

bower install

node -r dotenv/config server/lib/article/css

#!/bin/sh

ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Linuxbrew/install/master/install)"
PATH="$HOME/.linuxbrew/bin:$PATH"
brew install siege

scripts/loadtest.sh https://ft-google-amp-memory-test.herokuapp.com 50000 255

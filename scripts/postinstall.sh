#!/bin/sh

set -x -e

bower install
post-sass --postCss autoprefixer --postCss [ cssnano normalizeUrl:false ] --postCss @georgecrawford/postcss-remove-important

#!/bin/sh

set -x -e

bower install
post-sass --postCss autoprefixer --postCss @georgecrawford/postcss-remove-important --postCss postcss-inline-svg --postCss [ cssnano normalizeUrl:false ]

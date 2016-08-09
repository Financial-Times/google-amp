#!/bin/sh

set -x -e

bower install
post-sass --postCss autoprefixer --postCss @georgecrawford/postcss-remove-important --postCSS postcss-inline-svg --postCss [ cssnano normalizeUrl:false ]

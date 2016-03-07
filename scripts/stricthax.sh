#!/bin/bash

# this is horrible :(

HAXFILES=(
	node_modules/o-date/main.js
)

for f in "${HAXFILES[@]}"; do
	echo '"use strict";' | cat - "$f" > "${f}-tmp"
	mv "${f}-tmp" "$f"
done

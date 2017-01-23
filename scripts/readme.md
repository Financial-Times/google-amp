# AMP scripts

Utilities and scripts for developing AMP article features

## `transform-test.js`

Transforms the input file with our [body transforms](../server/lib/transforms/body.js). If run as `npm run transform-test -- test.html` it watches the transforms for changes and live updates the output when they change.

## `selector-example.js`

Searches our [test articles](../test/utils/test-uuids.js) for markup in `bodyXML` and `bodyHTML` that matches the given selector. Useful for finding example markup for writing transforms and tests.

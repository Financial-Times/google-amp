google-amp
===

[![Circle CI](https://circleci.com/gh/Financial-Times/google-amp/tree/master.svg?style=svg)](https://circleci.com/gh/Financial-Times/google-amp/tree/master)

AMP HTML rendering for FT articles

Prerequisites
---

 - node 4.x and npm
 - `brew install libxslt`
 - `scripts/env.sh` that exports the required environment variables from `app.json` (see `scripts/env-example.sh`)
   - If you add another environment variable, make sure to add it to `app.json`, `scripts/env-example.sh`, and `assertEnv` in `app.js`
 
Running
---
```
npm install
npm start
open http://localhost:5000/content/<FT article uuid>
```

Tests
---

To run the tests and linter locally, run `npm test`.

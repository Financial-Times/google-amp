google-amp
===

AMP HTML rendering for FT articles

Cloning
---

`git clone --recursive` is required

Prerequisites
---

 - node 4.x and npm
 - `brew install libxslt`
 - `scripts/env.sh` that exports the required environment variables from `app.json` (see `scripts/env-example.sh`)
   - If you add another environment variable, make sure to add it to `app.json`, `scripts/env-example.sh`, and `assertEnv` in `app.js`
 
Running
---
`npm install ; npm start ; open http://localhost:5000/content/<FT article uuid>`


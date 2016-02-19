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
 - `scripts/env.sh` that exports (see `scripts/env-example.sh`):
   - `AWS_ACCESS_KEY`
   - `AWS_SECRET_ACCESS_KEY`
   - `BRIGHTCOVE_ACCOUNT_ID`
   - `BRIGHTCOVE_PLAYER_ID`
   - `ELASTIC_SEARCH_URL`
   - `SENTRY_DSN`
   - `SPOOR_API_KEY`
 
Running
---
`npm install ; npm start ; open http://localhost:5000/content/<FT article uuid>`


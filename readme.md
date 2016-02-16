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
 - `env.sh` that exports `AWS_ACCESS_KEY`, `AWS_SECRET_ACCESS_KEY` and `ELASTIC_SEARCH_URL`, see `env-example.sh`
 
Running
---
`npm install ; npm start ; open http://localhost:5000/content/<FT article uuid>`


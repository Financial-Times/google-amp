google-amp
===

[![Circle CI](https://circleci.com/gh/Financial-Times/google-amp/tree/master.svg?style=svg)](https://circleci.com/gh/Financial-Times/google-amp/tree/master)

AMP HTML rendering for FT articles

Prerequisites
---

 - node 6.x and npm
 - `.env` that contains the required environment variables from `app.json` (see `scripts/env-example.sh`). if you have access to the heroku pipeline, you can run `npm run heroku-config` to copy variables from it.
   - If you add another environment variable, make sure to add it to `app.json`.

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

A Day in the Life of an AMP Article
---

1. Google crawls FT.com and finds an article, `/content/ffffffff-ffff-ffff-ffff-ffffffffffff`
2. The article has a `<link rel="amphtml">`, with href pointing to `amp.ft.com/content/ffffffff-ffff-ffff-ffff-ffffffffffff`
3. The Google crawler fetches the AMP URL, which hits this service
4. The [amp-page.js](server/controllers/amp-page.js) controller runs
    1. It fetches the content from Elastic Search using [n-es-client](https://github.com/financial-times/n-es-client)
    2. It runs various [transforms](server/lib/transforms) on the [article data](server/lib/transforms/article.js) and [body HTML](server/lib/transforms/body.js)
    3. It renders the transformed data into the [template](views/article.html) and responds with it
5. The crawler [validates](https://www.ampproject.org/docs/guides/validate) the returned markup, and if it's valid AMP markup, stores it in the AMP cache
6. When a mobile user searches for something that returns articles from FT with AMP versions, they're preloaded, and if the user taps on one of those results the AMP page is displayed immediately.

Scripts
---

The [scripts directory](scripts) has a few scripts that might be useful when developing AMP article features.

Deployment
---

The `master` branch deploys automatically to prod once the tests are green. Pull requests deploy to review apps, look out for the `@username deployed to ft-google-amp-staging-pr-XXX` messages in the PR.

### Rolling back

Use the `Roll back to...` button on the Heroku activity tab or the `heroku releases:rollback` command.

Benchmarking
------------

Run `npm run bench`. This requires [Siege](https://www.joedog.org/siege-home/), which can be installed with `brew install siege`.

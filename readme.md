google-amp
===

[![Circle CI](https://circleci.com/gh/Financial-Times/google-amp/tree/master.svg?style=svg)](https://circleci.com/gh/Financial-Times/google-amp/tree/master)

AMP HTML rendering for FT articles

Prerequisites
---

 - node 6.x and npm
 - `brew install libxslt`
 - `.env` that contains the required environment variables from `app.json` (see `scripts/env-example.sh`). if you have access to the staging environment on heroku, you can run `npm run heroku-config` to copy variables from staging.
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

Deployment
---

The `master` branch deploys automatically to staging once the tests are green. Pull requests deploy to review apps, look out for the `@username deployed to ft-google-amp-staging-pr-XXX` messages in the PR.

### Production

Run `make promote`.

We manually promote staging builds once they're "ready". **DO NOT** use the "Promote" button on Heroku. There's no way to run code when we do that, and we need to do things like deploy to Fastly, update JIRA fix versions etc.

### Rolling back

Use the `Roll back to...` button on the Heroku activity tab or the `heroku releases:rollback` command.

Benchmarking
------------

Run `npm run bench`. This requires [Siege](https://www.joedog.org/siege-home/), which can be installed with `brew install siege`.

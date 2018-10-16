# google-amp

[![Circle CI](https://circleci.com/gh/Financial-Times/google-amp/tree/master.svg?style=svg)](https://circleci.com/gh/Financial-Times/google-amp/tree/master) [![Known Vulnerabilities](https://snyk.io/test/github/Financial-Times/google-amp/badge.svg)](https://snyk.io/test/github/Financial-Times/google-amp)

AMP HTML rendering for FT articles

Prerequisites
---

1. Node.js v10 (`nvm install stable`)
2. An `.env` file that contains the required environment variables from `app.json`
   - To generate one, after running `npm install` you can login to Heroku with `heroku login --sso` and then make the file by running `npm run heroku-config` (note: for this command to work you will need to have access to the Heroku pipeline for this app)
   - If you add another environment variable, make sure to add it to `app.json`
3. A self-signed certificate
	 - Generate one with `openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 1461 -nodes -config scripts/dev-utils/certificate.cnf`
	 - Trust the certificate with `security import cert.pem; security add-trusted-cert cert.pem`

Running
---

```
npm install
npm start
open https://local.ft.com:5050/content/<FT article uuid>
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

The `master` branch deploys automatically to prod once the tests are green. Pull requests deploy to review apps, look out for the `@username deployed to ft-google-amp-prod-eu-pr-XXX` messages in the PR.

### Rolling back

Use the `Roll back to...` button on the Heroku activity tab or the `heroku releases:rollback` command.

# google-amp

[![Circle CI](https://circleci.com/gh/Financial-Times/google-amp/tree/master.svg?style=svg)](https://circleci.com/gh/Financial-Times/google-amp/tree/master) [![Known Vulnerabilities](https://snyk.io/test/github/Financial-Times/google-amp/badge.svg)](https://snyk.io/test/github/Financial-Times/google-amp)

AMP HTML rendering for FT articles

Getting started
---

1. Install the project dependencies, `make install`
2. Fetch the environment variables for the app, `make .env`
3.
    Generate a self-signed certificate:

    ```
    make certificate
    ```

    And add the certificate to your keychain:

    ```
    security import cert.pem; security add-trusted-cert cert.pem
    ```
4. Run the app (no build is required in development mode), `make run`
5. Open `https://local.ft.com:5050/content/<Content UUID>`

Barrier flow diagram
---
https://app.lucidchart.com/invitations/accept/97a58184-f4b9-4ebf-b253-17f62799e460

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

Deployment
---

The `master` branch deploys automatically to prod once the tests are green. Pull requests deploy to review apps, look out for the `@username deployed to google-amp-prod-eu-pr-XXX` messages in the PR.

### Rolling back

Use the `Roll back to...` button on the Heroku activity tab or the `heroku releases:rollback` command.

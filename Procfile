web: forever -c "node $(scripts/nodeargs.js)" -m 5 --minUptime 5000 --spinSleepTime 1000 app.js
release: scripts/build/release.js
worker: forever -m 5 --minUptime 5000 --spinSleepTime 1000 worker.js

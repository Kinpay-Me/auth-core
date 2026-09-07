# @kinpay-me/auth-core

KinPay shared auth core — a configurable, headless session store + API client
against the consumer identity service. No UI; each app keeps its own screens.

Consumed by the KinPay consumer app and the Circles Portal. First-party, so it's
resolved by **git URL** (not a private registry) — the built `dist/` is committed
so consumers install without a build step or a registry token:

```
"@kinpay-me/auth-core": "git+https://github.com/Kinpay-Me/auth-core.git#v0.2.1"
```

## Releasing a change

1. Edit `src/`, run `npm run build` (rebuilds `dist/`), `npm test`.
2. Bump `version` in `package.json`, commit the source **and** `dist/`.
3. Tag `vX.Y.Z` and push the tag.
4. Point each consumer's dependency at the new tag.

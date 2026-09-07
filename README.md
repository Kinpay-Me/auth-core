# kinpay-auth-core

KinPay shared auth core — a configurable, headless session store + API client
against the consumer identity service. No UI; each app keeps its own screens.

Consumed by the KinPay consumer app and the Circles Portal. First-party, so it's
installed from a **public tag tarball** (not a private registry) — the built
`dist/` is committed so consumers install without a build step, a prepare hook, or
a registry token:

```
"kinpay-auth-core": "https://github.com/Kinpay-Me/auth-core/archive/refs/tags/v0.2.2.tar.gz"
```

The package name is unscoped (`kinpay-auth-core`, not `@kinpay-me/…`) precisely so
there is no scope→registry association — it resolves purely from the tarball URL.
The GitHub repo stays `Kinpay-Me/auth-core`.

A plain https tarball (rather than a `git+https://` URL) is deliberate: npm
records GitHub `git+` deps in the lockfile as `git+ssh://`, which then fails to
install in headless CI with no SSH key. The tarball resolves over anonymous https
everywhere and is integrity-pinned in the lockfile.

The published `package.json` is deliberately a pure consumption manifest (no
`scripts`, `peerDependencies`, or `devDependencies`) so that an install never
triggers npm's git-dependency "prepare" pass. React is expected at runtime (it's
marked `--external` in the bundle); every consumer already provides it.

## Releasing a change

1. Edit `src/`, then rebuild + commit `dist/`:
   ```
   ./build.sh          # esbuild + tsc via npx, no local devDeps required
   ```
2. Bump `version` in `package.json`, commit the source **and** `dist/`.
3. Tag `vX.Y.Z` and push the tag.
4. Point each consumer's dependency at the new tag's tarball URL.

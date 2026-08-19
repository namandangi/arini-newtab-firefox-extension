# Arini New Tab (Firefox)

A minimal Firefox extension that replaces the new tab page with Arini's
founding-day counter and links through to the control plane. This is the
Firefox port of the Chrome/Brave "Arini Companion" extension. Manifest V3.

## What it does

- Overrides the new tab page with a live counter: the day number (plus a
  six-digit fractional day) and the week number since Arini was founded
  (2023-10-31, pinned to `America/Los_Angeles` so everyone sees the same
  number regardless of their own timezone).
- The whole page is a single link to <https://ari.ni>.

No permissions are requested and no data is collected.

## Requirements

- **Firefox 142+** — Manifest V3 new-tab override plus the
  `data_collection_permissions` manifest key both need a modern Gecko.

## Install

### Quick / temporary (for testing)

This drops off when Firefox restarts — good for a look, not for daily use.

1. Open `about:debugging#/runtime/this-firefox`
2. Click **Load Temporary Add-on…**
3. Select `manifest.json` in this folder.

### Permanent (signed)

Release and Beta Firefox only install **signed** add-ons permanently. You do
**not** need to list it publicly — sign it as an *unlisted* (self-distributed)
add-on. The manifest already carries the required add-on ID
(`arini-newtab@arini.ai`).

Using [`web-ext`](https://extensionworkshop.com/documentation/develop/web-ext-command-reference/)
with AMO API credentials (create them at
<https://addons.mozilla.org> → Developer Hub → **Manage API Keys**):

```sh
npx web-ext sign --channel=unlisted \
  --api-key=<JWT_ISSUER> --api-secret=<JWT_SECRET>
```

This uploads, signs, and drops a signed `.xpi` in `web-ext-artifacts/`. Then:

1. Open `about:addons`
2. Gear icon → **Install Add-on From File…**
3. Select the signed `.xpi`. It now persists across restarts.

**Manual alternative (no CLI):** AMO Developer Hub → *Submit a New Add-on* →
**"On your own site"** (unlisted) → upload a zip of this folder → download the
signed `.xpi` → install as above.

### Developer Edition / Nightly (unsigned)

On Firefox Developer Edition or Nightly you can skip signing entirely:

1. `about:config` → set `xpinstall.signatures.required` to `false`
2. Install the `.xpi` (or a zip of this folder) via `about:addons`.

This does **not** work on standard Release/Beta Firefox.

## Build a zip

```sh
zip -r -X arini-newtab-firefox.zip manifest.json newtab.* icons -x '*.DS_Store'
```

## Files

| File | Purpose |
|------|---------|
| `manifest.json` | MV3 manifest with Firefox `browser_specific_settings` (add-on ID, `strict_min_version`, `data_collection_permissions`). |
| `newtab.html` / `newtab.css` | The new-tab page and its styling. |
| `newtab.js` | The counter. Keep `FOUNDED_UTC` in sync with the control-plane founding counter. |
| `icons/icon-128.png` | Extension icon. |

## Verify

Lint against Mozilla's rules before shipping:

```sh
npx web-ext lint --self-hosted
```

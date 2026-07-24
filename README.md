# Shafter Online — Coverage Map

A website where a visitor types their Shafter, CA address and finds out
if Shafter Online serves it. Built with plain HTML/CSS/JS and
[Leaflet](https://leafletjs.com/) — no build tools, no frameworks, free
to host on GitHub Pages.

## What's in this folder

- `index.html` / `style.css` / `app.js` — the site (app.js is heavily commented)
- `data/serviceable-addresses.json` — **852 serviceable addresses**,
  built from your spreadsheet. Only the "yes" addresses are kept — see
  "Why only the serviceable addresses?" below.
- `census-geocoder-input.csv` — ready to upload to the free Census
  Bureau geocoder so the map can show individual pins (optional — the
  address-checker works without this).

## Why only the serviceable addresses?

Your original spreadsheet had 9,351 rows (852 serviceable, 8,499 not).
Since every row is in Shafter, 93263, the site only needs to know the
addresses that ARE covered — anything typed in that isn't on that list
is treated as not-yet-covered. That's a much smaller file to load and
easier to keep updated (just add a new address to the list when you
light up a new area).

One data note: 779 rows in your original file had a blank address
field (all marked unserviceable) — those were dropped since there's
nothing to match against. Worth a quick look at the source data if
that seems like more than expected.

## Step 1 — Create a GitHub account (skip if you already have one)

1. Go to https://github.com/signup
2. Enter an email, password, and username, and follow the prompts.
3. Verify your email when GitHub sends you the confirmation.

## Step 2 — Create the repository

1. Click the **+** icon (top right) → **New repository**.
2. Name it `shafter-online-coverage-map`.
3. Set it to **Public** (required for free GitHub Pages hosting).
4. Leave "Add a README" unchecked and click **Create repository**.

## Step 3 — Upload the files

1. On the repo page, click **Add file → Upload files**.
2. Drag in `index.html`, `style.css`, `app.js`, and the whole `data`
   folder (keep its folder structure — GitHub preserves it as you drag
   the folder in).
3. Click **Commit changes**.

(`census-geocoder-input.csv` doesn't need to go in the repo — it's just
for the geocoding step below.)

## Step 4 — Turn on GitHub Pages

1. **Settings → Pages** (left sidebar).
2. **Source**: Deploy from a branch.
3. **Branch**: `main`, folder `/ (root)` → **Save**.
4. Your site goes live in a minute or two at:
   `https://YOUR-USERNAME.github.io/shafter-online-coverage-map/`

The address checker works immediately at this point — the map will
just say "pins coming soon" until you do the next step.

## Step 5 — Map pins (done)

`data/coordinates.json` is included and has pins for 779 of the 852
serviceable addresses (91%), geocoded via the free Census Bureau batch
geocoder. Upload it into the `data` folder along with the others in
Step 3, and the map will show a dot for each one.

73 addresses didn't get a match — mostly ones with unit numbers or
highway-style addresses the geocoder couldn't pin down precisely. The
address checker still works for these; they just won't show a dot on
the map. If you want those filled in too, look them up manually at
https://www.latlong.net/ and add them to `coordinates.json` in this
format:

```json
{ "address": "700 Central Ave", "lat": 35.5001, "lng": -119.2701 }
```

## Keeping it updated

When you light up a new street or address, add a row to
`data/serviceable-addresses.json` in this format:

```json
{ "address": "500 W Los Angeles Ave", "normalized": "500 w los angeles ave" }
```

The `normalized` value is just the address lowercased, with `Street`
→`st`, `Avenue`→`ave`, `Drive`→`dr`, `West`→`w`, etc. — matching what
`app.js` does automatically when someone types their address.

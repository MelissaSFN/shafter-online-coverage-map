# Syber Fiber — Serviceability Map

A simple website where a visitor types their address and finds out if
Syber Fiber serves their street. Built with plain HTML/CSS/JS and
[Leaflet](https://leafletjs.com/) for the map — no build tools, no
frameworks, free to host.

## What's in this folder

- `index.html` — the page structure
- `style.css` — the look and feel
- `app.js` — the map + address-checking logic (heavily commented)
- `data/serviceable-streets.json` — **your coverage list**. Right now
  it has 5 sample streets in Springfield, IL so you can see it working.
  This is the file you'll replace with your real data.

## Step 1 — Create a GitHub account

1. Go to https://github.com/signup
2. Enter an email, password, and username, and follow the prompts.
3. Verify your email when GitHub sends you the confirmation.

## Step 2 — Create a new repository

1. Once logged in, click the **+** icon (top right) → **New repository**.
2. Name it something like `syber-fiber-coverage-map`.
3. Set it to **Public** (required for free GitHub Pages hosting).
4. Leave "Add a README" unchecked (we already have one) and click
   **Create repository**.

## Step 3 — Upload these files

The easiest way as a beginner: use the web upload feature (no command
line needed).

1. On your new repo's page, click **Add file → Upload files**.
2. Drag in all the files from this folder (keep the `data` folder
   structure intact — drag the whole `data` folder in too).
3. Scroll down and click **Commit changes**.

## Step 4 — Turn on GitHub Pages

1. In your repo, go to **Settings → Pages** (left sidebar).
2. Under "Build and deployment" → **Source**, choose **Deploy from a
   branch**.
3. Under **Branch**, choose `main` and folder `/ (root)`, then **Save**.
4. GitHub will give you a live URL after a minute or two, usually:
   `https://YOUR-USERNAME.github.io/syber-fiber-coverage-map/`

That's it — your site is live with the sample data.

## Step 5 — Replace the sample data with your real list

Open `data/serviceable-streets.json`. Each street needs this shape:

```json
{ "street": "Main St", "city": "Springfield", "state": "IL", "zip": "62701", "lat": 39.7990, "lng": -89.6440 }
```

- `street`, `city`, `state`, `zip` come straight from your list.
- `lat`/`lng` (latitude/longitude) are needed to draw the dot on the
  map. If you don't have these yet, you have two options:
  - Send me your address/street list (a spreadsheet, CSV, or plain
    text is fine) and I'll geocode it and hand back a ready-to-use
    JSON file.
  - Look each one up manually on https://www.latlong.net/ (slow if
    you have a long list, fine for a handful of streets).

Once you edit the file, upload it again the same way (Step 3) — GitHub
Pages will update automatically within a minute or two.

## Notes on how matching works

Right now, the checker matches on **street name** (plus city, if the
visitor typed one) — it doesn't check specific house-number ranges.
If your fiber build only covers part of a street (e.g. addresses
100–300 on Main St, not the whole street), tell me and we can add
house-number range support to `app.js`.

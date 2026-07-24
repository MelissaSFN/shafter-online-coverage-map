/* ============================================================
   Syber Fiber — Serviceability Checker
   Beginner-friendly, commented walkthrough of what each part does.
   ============================================================ */

// ---- 1. Set up the map ----
// Centered roughly on the sample data; you'll want to change these
// coordinates to the center of YOUR service area (lat, lng, zoom level).
const map = L.map('map').setView([39.799, -89.644], 12);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors',
  maxZoom: 18,
}).addTo(map);

// ---- 2. Load the serviceable streets data and plot it ----
let streetsData = [];

fetch('data/serviceable-streets.json')
  .then((res) => res.json())
  .then((data) => {
    streetsData = data.streets;
    plotStreets(streetsData);
  })
  .catch((err) => {
    console.error('Could not load serviceable-streets.json', err);
  });

function plotStreets(streets) {
  streets.forEach((entry) => {
    if (typeof entry.lat !== 'number' || typeof entry.lng !== 'number') return;

    L.circleMarker([entry.lat, entry.lng], {
      radius: 7,
      color: '#4CD3C2',
      fillColor: '#4CD3C2',
      fillOpacity: 0.85,
      weight: 1,
    })
      .addTo(map)
      .bindPopup(`<strong>${entry.street}</strong><br>${entry.city}, ${entry.state}`);
  });
}

// ---- 3. Address matching logic ----
// This is intentionally simple: it checks whether the street name in
// what someone typed matches a street name in our serviceable list.
// It does NOT verify house-number ranges — if you need that level of
// precision (e.g. only the first 200 addresses on a street have fiber),
// let me know and we can add that.

const ABBREVIATIONS = {
  street: 'st',
  avenue: 'ave',
  drive: 'dr',
  boulevard: 'blvd',
  road: 'rd',
  lane: 'ln',
  court: 'ct',
  place: 'pl',
  circle: 'cir',
  parkway: 'pkwy',
  highway: 'hwy',
};

function normalize(text) {
  let t = text.toLowerCase().replace(/[.,#]/g, ' ').replace(/\s+/g, ' ').trim();
  Object.entries(ABBREVIATIONS).forEach(([long, short]) => {
    t = t.replace(new RegExp(`\\b${long}\\b`, 'g'), short);
  });
  return t;
}

function checkAddress(inputAddress) {
  const normalizedInput = normalize(inputAddress);

  return streetsData.find((entry) => {
    const normalizedStreet = normalize(entry.street);
    const normalizedCity = normalize(entry.city);

    const streetMatches = normalizedInput.includes(normalizedStreet);
    // If the user's input also mentions a city, require it to match too
    // (helps avoid false positives when the same street name exists
    // in more than one town). If no city was typed, street match is enough.
    const cityMentioned = normalizedInput.length > normalizedStreet.length + 3;
    const cityMatches = !cityMentioned || normalizedInput.includes(normalizedCity);

    return streetMatches && cityMatches;
  });
}

// ---- 4. Wire up the UI ----
const input = document.getElementById('address-input');
const button = document.getElementById('check-btn');
const result = document.getElementById('result');

function runCheck() {
  const value = input.value.trim();
  if (!value) {
    result.className = 'result empty';
    return;
  }

  const match = checkAddress(value);

  if (match) {
    result.textContent = `Good news — ${match.street}, ${match.city} is in our Syber Fiber coverage area.`;
    result.className = 'result available';
    if (typeof match.lat === 'number') {
      map.setView([match.lat, match.lng], 15);
    }
  } else {
    result.textContent = "That address isn't in our coverage area yet — but we're expanding regularly. Check back soon.";
    result.className = 'result unavailable';
  }
}

button.addEventListener('click', runCheck);
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') runCheck();
});

/* ============================================================
   Shafter Online — Serviceability Checker
   Beginner-friendly, commented walkthrough of what each part does.
   ============================================================ */

// ---- 1. Set up the map, centered on Shafter, CA ----
const SHAFTER_CENTER = [35.5005, -119.2718];
const map = L.map('map').setView(SHAFTER_CENTER, 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors',
  maxZoom: 18,
}).addTo(map);

// ---- 2. Load the serviceable address list (used for matching) ----
let serviceableEntries = [];   // [{ address, normalized }]
let serviceableSet = new Set(); // normalized strings, for fast exact-match lookup

fetch('data/serviceable-addresses.json')
  .then((res) => res.json())
  .then((data) => {
    serviceableEntries = data.addresses;
    serviceableSet = new Set(serviceableEntries.map((e) => e.normalized));
  })
  .catch((err) => console.error('Could not load serviceable-addresses.json', err));

// ---- 3. Load geocoded coordinates for the map pins (optional) ----
// This file doesn't exist yet — see README "Step: add map pins" for how
// to generate it with the free Census Bureau batch geocoder. Until then,
// the checker still works fully; the map just won't show individual pins.
fetch('data/coordinates.json')
  .then((res) => {
    if (!res.ok) throw new Error('no coordinates file yet');
    return res.json();
  })
  .then((coords) => plotPins(coords))
  .catch(() => {
    document.getElementById('map-caption').textContent =
      'Map pins coming soon — the address checker below is fully functional.';
  });

function plotPins(coords) {
  // coords is expected as: [{ address, lat, lng }, ...]
  coords.forEach((entry) => {
    if (typeof entry.lat !== 'number' || typeof entry.lng !== 'number') return;
    L.circleMarker([entry.lat, entry.lng], {
      radius: 6,
      color: '#4CD3C2',
      fillColor: '#4CD3C2',
      fillOpacity: 0.85,
      weight: 1,
    })
      .addTo(map)
      .bindPopup(`<strong>${entry.address}</strong><br>Serviceable`);
  });
}

// ---- 4. Address normalization (must mirror the Python script used to
// build serviceable-addresses.json, so the same address normalizes the
// same way on both sides) ----
const SUFFIXES = {
  street: 'st', avenue: 'ave', drive: 'dr', boulevard: 'blvd', road: 'rd',
  lane: 'ln', court: 'ct', place: 'pl', circle: 'cir', parkway: 'pkwy', highway: 'hwy',
};
const DIRECTIONS = { west: 'w', east: 'e', north: 'n', south: 's' };
const CITY_STATE_ZIP_WORDS = ['shafter', 'ca', 'california', '93263'];

function normalize(text) {
  let t = text.toLowerCase().replace(/[.,#]/g, ' ').replace(/\s+/g, ' ').trim();
  Object.entries({ ...SUFFIXES, ...DIRECTIONS }).forEach(([long, short]) => {
    t = t.replace(new RegExp(`\\b${long}\\b`, 'g'), short);
  });
  // Drop city/state/zip if the visitor typed the full address
  CITY_STATE_ZIP_WORDS.forEach((word) => {
    t = t.replace(new RegExp(`\\b${word}\\b`, 'g'), '');
  });
  return t.replace(/\s+/g, ' ').trim();
}

// ---- 5. Matching logic ----
function checkAddress(inputAddress) {
  const normalizedInput = normalize(inputAddress);
  if (!normalizedInput) return null;

  // Exact match first (most reliable)
  if (serviceableSet.has(normalizedInput)) {
    return serviceableEntries.find((e) => e.normalized === normalizedInput);
  }

  // Fallback: handles a visitor omitting/adding a unit number, e.g.
  // typing "100 S Reiker St" when the record is "100 S Reiker St Unit B"
  return serviceableEntries.find(
    (e) => e.normalized.startsWith(normalizedInput) || normalizedInput.startsWith(e.normalized)
  );
}

// ---- 6. Wire up the UI ----
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
    result.textContent = `Good news — ${match.address} is in our Shafter Online coverage area.`;
    result.className = 'result available';
  } else {
    result.textContent = "That address isn't in our coverage area yet — but we're expanding regularly. Check back soon.";
    result.className = 'result unavailable';
  }
}

button.addEventListener('click', runCheck);
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') runCheck();
});

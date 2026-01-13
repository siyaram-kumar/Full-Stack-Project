const lng = coordinates[0];
const lat = coordinates[1];

// Initialize map
const map = L.map("map").setView([lat, lng], 13);

// OpenStreetMap tiles
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors"
}).addTo(map);

// Marker with location name
L.marker([lat, lng])
  .addTo(map)
  .bindPopup(`<b>${listingLocation}</b>`)
  .openPopup();

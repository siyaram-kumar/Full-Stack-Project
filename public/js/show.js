function initMap(coords) {
  if (!coords || coords.length !== 2) return;

  const map = L.map("map").setView([coords[1], coords[0]], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
  }).addTo(map);

  L.marker([coords[1], coords[0]]).addTo(map);
}

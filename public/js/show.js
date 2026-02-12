// 🗺️ MAP
function initMap(coords) {
  if (!coords || coords.length !== 2) return;

  const map = L.map("map").setView([coords[1], coords[0]], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
  }).addTo(map);

  L.marker([coords[1], coords[0]]).addTo(map);
}

// 🔗 SHARE – लिंक कॉपी
function copyLink() {
  navigator.clipboard
    .writeText(window.location.href)
    .then(() => alert("🔗 Listing link copied"))
    .catch(() => alert("Copy failed"));
}

// 💰 PRICE + MAP
document.addEventListener("DOMContentLoaded", () => {

  // MAP LOAD
  if (window.coordinates) {
    initMap(window.coordinates);
  }

  // PRICE CALCULATION
  if (!window.listingPrice) return;

  const price = window.listingPrice;
  const checkIn = document.getElementById("checkIn");
  const checkOut = document.getElementById("checkOut");
  const nightsEl = document.getElementById("nights");
  const totalEl = document.getElementById("total");

  function calc() {
    if (checkIn.value && checkOut.value) {
      const nights = Math.max(
        Math.ceil(
          (new Date(checkOut.value) - new Date(checkIn.value)) /
          (1000 * 60 * 60 * 24)
        ),
        0
      );
      nightsEl.innerText = nights;
      totalEl.innerText = nights * price;
    }
  }

  checkIn?.addEventListener("change", calc);
  checkOut?.addEventListener("change", calc);
});




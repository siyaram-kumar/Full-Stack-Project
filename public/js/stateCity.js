const stateCityMap = {
  Bihar: ["Patna", "Gaya", "Muzaffarpur", "Bhagalpur"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi", "Noida"],
  Delhi: ["New Delhi", "Dwarka", "Rohini"],
  Maharashtra: ["Mumbai", "Pune", "Nagpur"]
};

const stateSelect = document.getElementById("state");
const citySelect = document.getElementById("city");

stateSelect.addEventListener("change", () => {
  const selectedState = stateSelect.value;

  citySelect.innerHTML = `<option value="">Select City</option>`;

  if (!selectedState) return;

  stateCityMap[selectedState].forEach(city => {
    const option = document.createElement("option");
    option.value = city;
    option.textContent = city;
    citySelect.appendChild(option);
  });
});

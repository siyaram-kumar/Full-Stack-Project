const axios = require("axios");

async function forwardGeocode(address) {
    const response = await axios.get("https://nominatim.openstreetmap.org/search", {
        params: {
            q: address,
            format: "json",
            limit: 1
        },
        headers: {
            "User-Agent": "wanderlust-project"
        }
    });

    if (!response.data || response.data.length === 0) return null;

    return {
        latitude: Number(response.data[0].lat),
        longitude: Number(response.data[0].lon)
    };
}

module.exports = forwardGeocode;

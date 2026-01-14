const express = require("express");
const router = express.Router();
const forwardGeocode = require("../utils/geocode");

router.get("/", async (req, res) => {
    const address = req.query.address;
    if(!address) return res.json({});
    const geo = await forwardGeocode(address);
    res.json(geo || {});
});

module.exports = router;

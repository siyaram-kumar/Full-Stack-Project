const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isOwner, validateListing } = require("../middleware");
const listingController = require("../controllers/listings");

// 🔹 MULTER SETUP
const multer = require("multer");
const { storage } = require("../cloudConfig");
const upload = multer({ storage });

// ================= ROUTES =================

// INDEX + CREATE LISTING
router.route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("image"), // 👈 यही line जरूरी है
    validateListing,
    wrapAsync(listingController.createListing)
  );

// NEW LISTING FORM
router.get("/new", isLoggedIn, listingController.renderNewForm);

// SHOW / UPDATE / DELETE
router.route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("image"), // 👈 edit ke liye bhi
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.destroyListing)
  );

// EDIT FORM
router.get("/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;

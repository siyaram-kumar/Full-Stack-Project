const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { isLoggedIn } = require("../middleware");
const upload = require("../utils/multer");

// SHOW PROFILE
router.get("/", isLoggedIn, (req, res) => {
  res.render("profile/show", { user: req.user });
});

// EDIT PROFILE FORM
router.get("/edit", isLoggedIn, (req, res) => {
  res.render("profile/edit", { user: req.user });
});

// UPDATE PROFILE + IMAGE (FIXED)
router.put("/", isLoggedIn, upload.single("profileImage"), async (req, res, next) => {
  try {
    const { username, email, mobile } = req.body;
    const updateData = { username, email, mobile };

    if (req.file) {
      updateData.profileImage = `/uploads/profiles/${req.file.filename}`;
    }

    // 🔴 OLD (problematic)
    // await User.findByIdAndUpdate(req.user._id, updateData);

    // ✅ NEW (session-safe)
    const user = await User.findById(req.user._id);

    Object.assign(user, updateData);

    await user.save();

    // 🔥 Passport session refresh (MOST IMPORTANT)
    req.login(user, (err) => {
      if (err) return next(err);

      req.flash("success", "Profile updated successfully!");
      res.redirect("/profile");
    });

  } catch (err) {
    next(err);
  }
});

module.exports = router;

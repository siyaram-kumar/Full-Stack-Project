const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl, isLoggedIn } = require("../middleware.js");
const userController = require("../controllers/users.js");
const User = require("../models/user"); 

// ------------------------- SIGNUP -------------------------
router.get("/signup", userController.renderSignupForm);
router.post("/signup", wrapAsync(userController.signup));

// ------------------------- LOGIN -------------------------
router.get("/login", saveRedirectUrl, userController.renderLoginForm);
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.login
);

// ------------------------- LOGOUT -------------------------
router.get("/logout", userController.logOut);

// ------------------------- PROFILE PAGE -------------------------
router.get("/profile", isLoggedIn, (req, res) => {
  res.render("users/profile");
});

// ------------------------- EDIT PROFILE -------------------------
router.get("/profile/edit", isLoggedIn, (req, res) => {
  res.render("users/edit");
});

// ------------------------- FORGOT PASSWORD -------------------------

// GET page for forgot password (mobile)
router.get("/forgot-password", (req, res) => {
  res.render("users/forgot"); // forgot.ejs
});

// POST mobile number for OTP
router.post("/forgot-password", async (req, res) => {
  const { mobile } = req.body;

  // check if mobile number is registered
  const user = await User.findOne({ mobile });
  if (!user) {
    req.flash("error", "Mobile number not registered");
    return res.redirect("/forgot-password");
  }

  // Agar mobile registered hai, OTP page pe redirect karo
  res.redirect("/mobile-otp?mobile=" + mobile);
});

// ------------------------- OTP PAGE -------------------------
router.get("/mobile-otp", (req, res) => {
  res.render("users/otp", { mobile: "+91" + req.query.mobile }); // otp.ejs
});

// ------------------------- VERIFY MOBILE (OPTIONAL) -------------------------
router.get("/verify-mobile", (req, res) => {
  res.render("users/verify-mobile"); // verify-mobile.ejs
});

module.exports = router;

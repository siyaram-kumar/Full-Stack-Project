const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

router.
    route("/signup")
        .get(userController.renderSignupForm)
        .post( wrapAsync(userController.singup))

router
  .route("/login")
  .get(saveRedirectUrl, userController.renderLoginForm)
  .post(
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true
    }),
    async (req, res) => {
        req.flash("success", "Welcome back to Wanderlust!");
        const redirectUrl = res.locals.redirectUrl || "/listings/new";
        // delete req.session.redirectUrl;
        res.redirect(redirectUrl);      
    }
  );



router.get("/logout",userController.logOut);

module.exports = router;
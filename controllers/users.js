const User = require("../models/user.js");

// Render Signup Page
module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

// Handle Signup Logic
module.exports.signup = async (req, res, next) => {
    try {
        const { username, email, mobile, password, confirmPassword, terms } = req.body;

        // Terms & Conditions check
        if (!terms) {
            req.flash("error", "Please accept Terms & Conditions");
            return res.redirect("/signup");
        }

        // Password match check
        if (password !== confirmPassword) {
            req.flash("error", "Passwords do not match");
            return res.redirect("/signup");
        }

        // Create & register user
        const newUser = new User({ username, email, mobile });
        const registeredUser = await User.register(newUser, password);

        // Auto-login after signup
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash("success", "Signup successful! Welcome to Wanderlust.");
            res.redirect("/listings");
        });

    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

// Render Login Page
module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

// Handle Login (after passport.authenticate)
module.exports.login = (req, res) => {
    req.flash("success", "Welcome back to Wanderlust!");
    const redirectUrl = req.session.redirectUrl || "/listings";
    delete req.session.redirectUrl;
    res.redirect(redirectUrl);
};

// Handle Logout
module.exports.logOut = (req, res, next) => {
    req.logOut((err) => {
        if (err) return next(err);
        req.flash("success", "You are successfully logged out.");
        res.redirect("/listings");
    });
};

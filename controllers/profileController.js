const User = require("../models/Users.js");

// Show profile
module.exports.showProfile = async (req, res) => {
  const user = await User.findById(req.user._id); // Passport sets req.user
  res.render("profile/show", { user });
};

// Edit profile form
module.exports.editProfileForm = async (req, res) => {
  const user = await User.findById(req.user._id);
  res.render("profile/edit", { user });
};

// Update profile
module.exports.updateProfile = async (req, res) => {
  const { username, email, mobile } = req.body;

  await User.findByIdAndUpdate(req.user._id, {
    username,
    email,
    mobile
  });

  req.flash("success", "Profile updated successfully!");
  res.redirect("/profile");
};

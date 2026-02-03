// ================= EXISTING IMPORTS =================
const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const User = require("./models/user"); // OTP check ke liye

// ================= LOGIN CHECK =================
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to create listing!");
        return res.redirect("/login");
    }
    next();
};

// ================= REDIRECT URL SAVE =================
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
        delete req.session.redirectUrl;
    }
    next();
};

// ================= OWNER CHECK =================
module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing does not exist");
        return res.redirect("/listings");
    }
    if (!listing.owner._id.equals(req.user._id)) {
        req.flash("error", "You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

// ================= LISTING VALIDATION =================
module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate({ listing: req.body.listing });
    if (error) {
        const errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    next();
};

// ================= REVIEW VALIDATION =================
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    next();
};

// ================= REVIEW AUTHOR CHECK =================
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash("error", "You did not delete this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

// ================= OTP VERIFIED CHECK =================
module.exports.isVerified = async (req, res, next) => {
    const user = await User.findById(req.user._id);
    if (!user.isVerified) {
        req.flash("error", "Please verify your mobile first!");
        return res.redirect("/verify-otp/" + req.user._id);
    }
    next();
};

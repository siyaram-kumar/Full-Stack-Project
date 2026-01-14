const Listing = require("../models/listing");
const forwardGeocode = require("../utils/geocode");

// Index
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

// New Form
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs", { listing: {} });
};

// Show Listing
module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({ path: "reviews", populate: { path: "author" } })
        .populate("owner");
    if (!listing) {
        req.flash("error", "Listing does not exist");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
};

// Create Listing
module.exports.createListing = async (req, res) => {
    const listing = new Listing(req.body.listing);

    // Geocode location
    const geo = await forwardGeocode(req.body.listing.location);
    if (geo) {
        listing.geometry = {
            type: "Point",
            coordinates: [geo.longitude, geo.latitude]
        };
    } else {
        listing.geometry = {
            type: "Point",
            coordinates: [85.1376, 25.5941] // fallback
        };
    }

    if (req.file) {
        listing.image = { url: req.file.path, filename: req.file.filename };
    }

    listing.owner = req.user._id;
    await listing.save();

    req.flash("success", "New Listing Created!");
    res.redirect(`/listings/${listing._id}`);
};

// Edit Form
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing does not exist");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image?.url || "/images/default.jpg";
    if (listing.image?.url) originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", { listing, originalImageUrl });
};

// Update Listing
module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    const data = { ...req.body.listing };

    if (req.body.listing.location) {
        const geo = await forwardGeocode(req.body.listing.location);
        if (geo) {
            data.geometry = {
                type: "Point",
                coordinates: [geo.longitude, geo.latitude]
            };
        }
    }

    const listing = await Listing.findByIdAndUpdate(id, data, { new: true, runValidators: true });

    if (req.file) {
        listing.image = { url: req.file.path, filename: req.file.filename };
        await listing.save();
    }

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

// Delete Listing
module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};

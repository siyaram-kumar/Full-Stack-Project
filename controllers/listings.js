const Listing = require("../models/listing");
const forwardGeocode = require("../utils/geocode");
const { cloudinary } = require("../cloudConfig");

// ===================== INDEX =====================
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

// ===================== NEW FORM =====================
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs", { listing: {} });
};

// ===================== SHOW LISTING =====================
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

// ===================== CREATE LISTING =====================
module.exports.createListing = async (req, res) => {
    const listing = new Listing(req.body.listing);

    // Geocode location
    const geo = await forwardGeocode(req.body.listing.location);
    listing.geometry = geo ? {
        type: "Point",
        coordinates: [geo.longitude, geo.latitude]
    } : {
        type: "Point",
        coordinates: [85.1376, 25.5941] // fallback coordinates
    };

    // Cloudinary image upload
    if (req.file) {
        listing.image = {
            url: req.file.path,       // Cloudinary URL
            filename: req.file.filename
        };
    }

    listing.owner = req.user._id;
    await listing.save();

    req.flash("success", "New Listing Created!");
    res.redirect(`/listings/${listing._id}`);
};

// ===================== EDIT FORM =====================
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing does not exist");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
};

// ===================== UPDATE LISTING =====================
module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    const data = { ...req.body.listing };

    // Update coordinates if location changed
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

    // Cloudinary: update image if new uploaded
    if (req.file) {
        if (listing.image && listing.image.filename) {
            await cloudinary.uploader.destroy(listing.image.filename); // Delete old image
        }
        listing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
        await listing.save();
    }

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${listing._id}`);
};

// ===================== DELETE LISTING =====================
module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing does not exist");
        return res.redirect("/listings");
    }

    // Delete image from Cloudinary
    if (listing.image && listing.image.filename) {
        try {
            await cloudinary.uploader.destroy(listing.image.filename);
        } catch (err) {
            console.error("Cloudinary delete error:", err);
        }
    }

    // Delete listing from DB
    await Listing.findByIdAndDelete(id);

    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};

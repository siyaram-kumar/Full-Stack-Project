const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    image: {
        url: String,
        filename: String
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    category: {
        type: String,
        enum: [
            "trending",
            "rooms",
            "iconic",
            "mountains",
            "castles",
            "pools",
            "camping",
            "farms",
            "arctic",
            "domes",
            "boats"
        ]
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const review = require("./review.js");
// const review = require("./review.js");

const listingSchema = new Schema({
    title:{
        type: String,
        required: true,
    },
    description: String,
  image: {
    type:{
    url: String,
    filename: String,
    },
    required: false
    },
    price:{
        type: Number,
        required: true,
        default: 0
    },
    location: String,
    country: String,
    reviews:[
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    geometry: {
      type: {
        type: String,
         enum: ['Point'],
         default: 'Point'
     },
        coordinates: {
        type: [Number],
        default: []        

         }
    }
    // category: {
    //     type: String,
    //     encum: ["mountains", "camping", "rooms",]
    // }
});


listingSchema.post("findOneAndDelete", async(listing) => {
    if (listing) {
        await review.deleteMany({_id: {$in: listing.reviews}});
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
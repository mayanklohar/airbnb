const express=require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync=require('../utils/wrapAsync.js');
const ExpressError=require('../utils/ExpressError.js');
const { listingSchema,reviewSchema } = require('../schema.js');
const reviews=require('../routes/review.js');
const listings=require('../routes/listing.js');
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const { isLoggedIn, validateReview, isReviewAuthor } = require("../middleware.js");
const reviewsController=require("../controllers/reviews.js");



//Reviews
        //post route
        router.post("/",
            isLoggedIn, validateReview, wrapAsync (reviewsController.createReview));

        //Delete review route
        router.delete("/:reviewId",isReviewAuthor, wrapAsync(reviewsController.destroyReview));

        module.exports=router;
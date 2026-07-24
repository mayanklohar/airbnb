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

// const validateReview = (req, res, next) => {
//     let { error } = reviewSchema.validate(req.body);

//     if (error) {
//         let errMsg = error.details.map(el => el.message).join(",");
//         throw new ExpressError(400, errMsg);
//     }

//     next();
// };
 

//Reviews
        //post route
        router.post("/",
            isLoggedIn, validateReview, wrapAsync (async (req,res)=>{
            let listing=await Listing.findById(req.params.id);
            let newReview=new Review(req.body.review);
            newReview.author = req.user._id;
            listing.reviews.push(newReview);
            console.log(newReview);
            await newReview.save(); 
            await listing.save();
            req.flash("success","Successfully added a new review!");
            res.redirect(`/listings/${listing._id}`);
        }));

        //Delete review route
        router.delete("/:reviewId",isReviewAuthor, wrapAsync(async (req,res)=>{
            let {id,reviewId}=req.params;
            await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
            await Review.findByIdAndDelete(reviewId);
            req.flash("success","Successfully deleted the review!");
            res.redirect(`/listings/${id}`);
        }));

        module.exports=router;
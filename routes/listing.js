const express = require("express");
const router = express.Router();


const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const { isLoggedIn,isOwner,validateListing } = require("../middleware.js");


// const validateListing = (req, res, next) => {
//     let { error } = listingSchema.validate(req.body);

//     if (error) {
//         let errMsg = error.details.map(el => el.message).join(",");
//         throw new ExpressError(400, errMsg);
//     }

//     next();
// };

//Index route
 router.get("/", wrapAsync(async (req,res)=>{
const allListings=await Listing.find({});
res.render("listings/index.ejs",{allListings})
 }));

//New route
router.get("/new", isLoggedIn,wrapAsync(async (req,res)=>{
    res.render("listings/new.ejs");
}));


 //Show route
router.get("/:id", wrapAsync(async (req,res)=>{
        let {id}=req.params;
        const listing=await Listing.findById(id)
        .populate("reviews")
        .populate("owner");
        if(!listing){
            req.flash("error","Cannot find that listing!");
             return res.redirect("/listings");
        }
      console.log("Owner:", listing.owner);
        res.render("listings/show.ejs",{listing});
     }));

     //Create route
     router.post("/",
        isLoggedIn,
         validateListing,
        wrapAsync(async (req,res,next)=>{
   let result=listingSchema.validate(req.body);
   console.log(result);
   if(result.error){
    throw new ExpressError(400,result.error);
   }
        const newListing=new Listing(req.body.listing);
         newListing.owner = req.user._id;
        await newListing.save();
        req.flash("success","Successfully made a new listing");
        res.redirect("/listings");
    }  ) );

     //Edit route
        router.get("/:id/edit", isLoggedIn,
         isOwner,
             wrapAsync(async (req,res)=>{
        //      if(!req.body.listing){
        //     throw new ExpressError(400,"Send valid data for listing");
        // }
            let{id}=req.params;
            const listing=await Listing.findById(id).populate("owner");
            if(!listing){
            req.flash("error","Cannot find that listing!");
            res.redirect("/listings");
        }
            res.render("listings/edit.ejs",{listing});
        }));
     //Update route
        router.put("/:id",
                isLoggedIn,
                isOwner,
            validateListing ,
            wrapAsync(async (req,res)=>{
            let{id}=req.params;
            await Listing.findByIdAndUpdate(id,{...req.body.listing});
            req.flash("success","Successfully updated the listing!");
            res.redirect(`/listings/${id}`);
        }));

        //Delete route
        router.delete("/:id", isLoggedIn,
            isOwner,
             wrapAsync(async (req,res)=>{
            let{id}=req.params;
            let deletedListing=await Listing.findByIdAndDelete(id);
            console.log(deletedListing);
            req.flash("success","Successfully deleted the listing!");
            res.redirect("/listings");
        }));

        module.exports=router;
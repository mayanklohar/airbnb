const Listing = require("../models/listing");
const { listingSchema } = require("../schema");
const ExpressError = require("../utils/ExpressError");
const axios = require("axios"); 
module.exports.index=
async (req,res)=>{
const allListings=await Listing.find({});

res.render("listings/index.ejs",{allListings})
 };

 module.exports.renderNewForm=
 async (req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.showListing=
async (req,res)=>{
        let {id}=req.params;
        const listing=await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author"
            }
        })
        .populate("owner");
        if(!listing){
            req.flash("error","Cannot find that listing!");
             return res.redirect("/listings");
        }
      console.log("Owner:", listing.owner);
        // res.render("listings/show.ejs",{listing});
        res.render("listings/show.ejs", {
    listing,
    apiKey: process.env.GEOAPIFY_API_KEY
});
};



module.exports.createListing = async (req, res, next) => {
    console.log("req.body =", req.body);
    console.log("req.file =", req.file);

    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };


      const searchText =
        `${req.body.listing.location}, ${req.body.listing.country}`;

    const geoURL =
        `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(searchText)}&apiKey=${process.env.GEOAPIFY_API_KEY}`;
console.log("Geo URL:", geoURL);
    const response = await axios.get(geoURL);

    // Check if location exists
    if (!response.data.features.length) {
        req.flash("error", "Location not found!");
        return res.redirect("/listings/new");
    }

    const coordinates =
        response.data.features[0].geometry.coordinates;

    newListing.geometry = {
        type: "Point",
        coordinates: coordinates
    };

    await newListing.save();

    req.flash("success", "Successfully made a new listing");
    res.redirect("/listings");
};

module.exports.renderEditForm=
async (req,res)=>{
        //      if(!req.body.listing){
        //     throw new ExpressError(400,"Send valid data for listing");
        // }
            let{id}=req.params;
            const listing=await Listing.findById(id).populate("owner");
            if(!listing){
            req.flash("error","Cannot find that listing!");
            res.redirect("/listings");
        }

        let originalImageUrl=listing.image.url;
        originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250");
            res.render("listings/edit.ejs",{listing,originalImageUrl});
};

module.exports.updateListing=        
async (req,res)=>{
            let{id}=req.params;
            let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});

            if(typeof req.file !== "undefined"){
                let url = req.file.path;
                let filename = req.file.filename;
                listing.image={url,filename};
                await listing.save(); 
            }
            req.flash("success","Successfully updated the listing!");
            res.redirect(`/listings/${id}`);
};

module.exports.destroyListing=
async (req,res)=>{
            let{id}=req.params;
            let deletedListing=await Listing.findByIdAndDelete(id);
            console.log(deletedListing);
            req.flash("success","Successfully deleted the listing!");
            res.redirect("/listings");
};

const express = require("express");
const router = express.Router();
const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({storage});


const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const { isLoggedIn,isOwner,validateListing } = require("../middleware.js");

const listingsController=require("../controllers/listings.js");


// const validateListing = (req, res, next) => {
//     let { error } = listingSchema.validate(req.body);

//     if (error) {
//         let errMsg = error.details.map(el => el.message).join(",");
//         throw new ExpressError(400, errMsg);
//     }

//     next();
// };

router.
route("/")
.get(wrapAsync(listingsController.index))
.post( isLoggedIn,
     
    upload.single("listing[image]") ,
   validateListing,
    wrapAsync(listingsController.createListing) );

 

    //New route
router.get("/new", isLoggedIn,wrapAsync(listingsController.renderNewForm));


router.
route("/:id") 

.get( wrapAsync(listingsController.showListing))

.put(isLoggedIn,
    isOwner,
    upload.single("listing[image]") ,
    validateListing ,
    wrapAsync(listingsController.updateListing))
 
.delete( isLoggedIn,
            isOwner,
             wrapAsync(listingsController.destroyListing));            

//Edit route
        router.get("/:id/edit", isLoggedIn,
         isOwner,
             wrapAsync(listingsController.renderEditForm));



//Index route
//  router.get("/", wrapAsync(listingsController.index));



 //Show route
// router.get("/:id", wrapAsync(listingsController.showListing));

     //Create route
    //  router.post("/",
    //     isLoggedIn,
    //      validateListing,
    //     wrapAsync(listingsController.createListing) );

     
     //Update route
        // router.put("/:id",
        //         isLoggedIn,
        //         isOwner,
        //     validateListing ,
        //     wrapAsync(listingsController.updateListing));

        //Delete route
    
        // router.delete("/:id", isLoggedIn,
        //     isOwner,
        //      wrapAsync(listingsController.destroyListing));

        module.exports=router;
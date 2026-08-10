const mongoose = require("mongoose");
const path = require("path");

require("dotenv").config({
    path: path.join(__dirname, "../.env"),
});

const axios = require("axios");
const initData = require("./data.js");
const Listing = require("../models/listing.js");


const MONGO_URL='mongodb://127.0.0.1:27017/wanderlust';



// main()
// .then(()=>{
//     console.log('Connected to MongoDB');
// }).catch((err)=>{
//     console.error(err);
// });

main()
.then(async () => {
    console.log("Connected to MongoDB");
    await initDB();
})
.catch((err) => {
    console.error(err);
});

async function main(){
    await mongoose.connect(MONGO_URL);
}

// const initDB=async()=>{
//     await Listing.deleteMany({});   
//     initData.data=initData.data.map((obj)=>({...obj,
//         owner:"6a3eb825cd5deac3737064bd"
//     }));
//     await Listing.insertMany(initData.data);
//     console.log('Database initialized with sample data');

// };


const initDB = async () => {

    await Listing.deleteMany({});

    const listings = [];

    console.log(process.env.GEOAPIFY_API_KEY);

    for (let obj of initData.data) {

        const searchText = `${obj.location}, ${obj.country}`;

       const geoURL =
`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(searchText)}&apiKey=${process.env.GEOAPIFY_API_KEY}`;

        let geometry = null;

        try {

           console.log(searchText);
console.log(geoURL);

const response = await axios.get(geoURL);

console.log(response.data);

            if (response.data.features.length > 0) {
                geometry = {
                    type: "Point",
                    coordinates: response.data.features[0].geometry.coordinates
                };
            }

        } catch (err) {
            console.log("Location not found:", searchText);
        }

        listings.push({
            ...obj,
            owner: "6a3eb825cd5deac3737064bd",
            geometry: geometry
        });
    }

    await Listing.insertMany(listings);

    console.log("Database initialized successfully!");

    mongoose.connection.close();
};

// initDB();
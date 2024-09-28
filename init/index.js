const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("./data.js");


//connecting data base(mongob)
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(() =>{
    console.log("connected to db");
}).catch((err) =>{
        console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
};

const initDB = async () =>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=> ({...obj, owner: "66ab795471c6750762eaa47d"}));
    await Listing.insertMany(initData.data);
    console.log("data initialised");
};

initDB();
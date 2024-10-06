const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync.js');
const port = 8080;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

main().then((res)=>{
    console.log("Connected DB");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/airbnb');

};

app.listen(port, ()=>{
   console.log("app is listening on port 8080");
});

app.get("/", (req, res)=>{
   res.send("root");
});

//index route
app.get("/listings", async (req, res)=>{
   let allListings = await Listing.find();
   res.render("listings/index.ejs", {allListings});
});

//new route
app.get("/listings/new", (async (req, res)=>{
   res.render("listings/new.ejs");
}));

//new route
app.post("/listings", wrapAsync( async (req, res, next)=>{  
      let {title, description, price, location, country} = req.body;
      const data = new Listing({
         title : title,
         description : description,
         price : price,
         location : location,
         country : country
      });
      await data.save();
      res.redirect("/listings"); 
}));

//show route
app.get("/listings/:id", async (req, res)=>{
   let {id} = req.params;
   let listing = await Listing.findById(id);
   res.render("listings/show.ejs", {listing});
});

//edit route
app.get("/listings/:id/edit", async (req, res)=>{
   let {id} = req.params;
   let listing = await Listing.findById(id);
   res.render("listings/edit.ejs", {listing});
});

//update route
app.put("/listings/:id", async (req, res)=>{
   let {id} = req.params;
   let {title, description, price, location, country} = req.body;
  await Listing.findByIdAndUpdate(id, {title : title, description : description, price : price, location : location, country : country});
   res.redirect("/listings");
});

//delete route
app.delete("/listings/:id", async (req, res)=>{
   let {id} = req.params;
   await Listing.findByIdAndDelete(id);
   res.redirect(`/listings`);
});

//error handler middleware
app.use((err, req, res, next)=>{
    res.send("Something went wrong");
});

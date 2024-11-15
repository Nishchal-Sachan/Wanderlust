if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");



const listingsRouter = require("./routes/listings.js");
const reviewsRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");



//connecting data base(mongob)
const dbUrl = process.env.ATLASDB_URL;

main().then(() => {
    console.log("connected to db");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(dbUrl);
};


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


let sessionOptions = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000, //7days from now in milliseconds
        httpOnly: true,
    },
};
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});


// LISTINGS
app.use("/listings", listingsRouter);

// Reviews
app.use("/listings/:id/reviews", reviewsRouter);

// user signup
app.use("/", userRouter);


app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});


// error handling middleware
app.use((err, req, res, next) => {
    // console.log(err);
    let { statusCode = 500, message = "Something went wrong!!" } = err;
    res.status(statusCode).render("error.ejs", { message });
});


app.listen(8080, () => {
    console.log("app is listening on port 8080");
});
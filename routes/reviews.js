const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middlewares.js");

const reviewController = require("../controllers/reviews.js");


// post route
router.post("/",
    isLoggedIn, 
    validateReview,
    wrapAsync(reviewController.createReview )
);

// delete route
router.delete("/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.destroyReview)
);

module.exports = router;
const express = require('express');

const { Spot, SpotImage, User, Review, ReviewImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleSpotValidationErrors } = require('../../utils/validation');

const router = express.Router();

//Auth true
//GET /api/reviews/current | Return all reviews by a user
router.get('/current', requireAuth, async (req, res) => {
    const Reviews = await Review.findAll({ where: { userId: req.user.id } })

    res.json({ Reviews })
})

//Auth true
//POST /api/reviews/:reviewId/images | Make a review image
router.post('/:reviewId/images', requireAuth, async (req, res) => {
    const { url } = req.body;
    const reviewId = +req.params.reviewId;

    const review = await Review.findByPk(reviewId);

    if (!review) {
        res.statusCode = 404;
        return res.json({ message: "Review couldn't be found", statusCode: 404 })
    }

    const newReviewImage = await ReviewImage.create({
        reviewId,
        url
    })

    return res.json(newReviewImage)
})

//Auth true
//PUT /api/reviews/:reviewId | Edit review
router.put('/:reviewId', requireAuth, async (req, res) => {
    const reviewId = +req.params.reviewId;
    const reviewObj = await Review.findByPk(reviewId);

    if (!reviewObj) {
        res.statusCode = 404;
        return res.json({ message: "Review couldn't be found", statusCode: 404 });
    }

    const { review, stars } = req.body;

    reviewObj.review = review;
    reviewObj.stars = stars;
    await reviewObj.save();

    return res.json(reviewObj)
})

//Auth true
//DELETE /api/reviews/:reviewId | Delete Review

module.exports = router
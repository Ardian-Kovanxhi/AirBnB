const express = require('express');

const { Review, ReviewImage, User, Spot } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

//Auth true
//GET /api/reviews/current | Return all reviews by a user
router.get('/current', requireAuth, async (req, res) => {
    const Reviews = await Review.findAll({
        where: { userId: req.user.id },
        include: [
            { model: User, attributes: ['id', 'firstName', 'lastName'] },
            {
                model: Spot, attributes: [
                    'id',
                    'ownerId',
                    'address',
                    'city',
                    'state',
                    'country',
                    'lat',
                    'lng',
                    'name',
                    'price',
                    'previewImage',
                ]
            },
            { model: ReviewImage, attributes: ['id', 'url'] }
        ]
    })

    res.json({ Reviews })
})

//Auth true
//POST /api/reviews/:reviewId/images | Make a review image
// add max of 10
router.post('/:reviewId/images', requireAuth, async (req, res) => {
    const { url } = req.body;
    const reviewId = +req.params.reviewId;

    const review = await Review.findByPk(reviewId);

    if (!review) {
        res.statusCode = 404;
        return res.json({ message: "Review couldn't be found", statusCode: 404 })
    }

    const reviewImageArr = await ReviewImage.findAll({ where: { reviewId } })

    if (reviewImageArr.length === 10) {
        res.statusCode = 403;
        return res.json({ message: "Maximum number of images for this resource was reached", statusCode: 403 })
    }

    const newReviewImage = await ReviewImage.create({
        reviewId,
        url
    })
    const id = newReviewImage.id
    const scoped = await ReviewImage.findByPk(id, {
        attributes: { exclude: ['reviewId', 'createdAt', 'updatedAt'] }
    })
    return res.json(scoped)
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
router.delete('/:reviewId', requireAuth, async (req, res) => {
    const reviewId = +req.params.reviewId;

    const review = await Review.findByPk(reviewId);

    if (!review) {
        res.statusCode = 404;
        return res.json({ message: "Review not found", statusCode: 404 })
    }

    await review.destroy();
    return res.json({ message: "successfully deleted", statusCode: 200 })
})

module.exports = router
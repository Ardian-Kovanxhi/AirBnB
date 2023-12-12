const express = require('express');

const { Spot, SpotImage, User, Review, Booking, ReviewImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleSpotValidationErrors } = require('../../utils/validation');

const router = express.Router();


const validateSpot = [
    check('address')
        .exists({ checkFalsy: true })
        .withMessage('Street address is required'),
    check('city')
        .exists({ checkFalsy: true })
        .withMessage('City is required'),
    check('state')
        .exists({ checkFalsy: true })
        .withMessage('State is required'),
    check('country')
        .exists({ checkFalsy: true })
        .withMessage('Country is required'),
    // check('lat')
    //     .exists({ checkFalsy: true })
    //     .withMessage('Latitude is not valid'),
    // check('lng')
    //     .exists({ checkFalsy: true })
    //     .withMessage('Longitude is not valid'),
    check('name')
        .exists({ checkFalsy: true })
        .isLength({ max: 50 })
        .withMessage('Name must exist and be 50 characters or less'),
    check('description')
        .exists({ checkFalsy: true })
        .withMessage('Description is required'),
    check('price')
        .exists({ checkFalsy: true })
        .withMessage('Price per day is required'),
    handleSpotValidationErrors,
];

const validateSpotGet = [
    check('page')
        .isInt({ min: 1 })
        .withMessage('Page must be greater than or equal to 1'),
    check('size')
        .isInt({ min: 1 })
        .withMessage('Size must be greater than or equal to 1'),
    handleSpotValidationErrors,
]


//GET /api/spots | all spots
router.get('/', async (req, res) => {
    let { page, size } = req.query;
    if (!page) page = 1;
    if (page > 10) page = 10;
    if (!size || size > 20) size = 20;

    if (page < 1 || size < 1) {
        const errors = {};
        if (page < 1) {
            errors.page = 'Page must be greater than or equal to 1';
        }
        if (size < 1) {
            errors.size = 'Size must be greater than or equal to 1';
        }
        res.statusCode = 400;
        return res.json({ message: "Validation Error", statusCode: 400, errors: errors })
    }


    let pagination = {}
    pagination.limit = size
    pagination.offset = size * (page - 1)

    const spots = await Spot.findAll({ ...pagination });

    for (let spot of spots) {
        const rev = await Review.findAll({ where: { spotId: spot.id } });

        if (!rev.length) continue

        else {
            let stars = 0
            for (let review of rev) {
                stars += review.stars
            }

            spot.numReviews = rev.length;
            spot.avgStarRating = (stars / rev.length).toFixed(2)
            await spot.save();
        }
    }

    res.json(spots);
});

//POST /api/spots | create a spot
router.post('/', requireAuth, validateSpot, async (req, res) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const userId = req.user.id;

    const newSpot = await Spot.create({
        ownerId: userId,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
    })

    const scoped = await Spot.scope("spotCreation").findByPk(newSpot.id)

    res.statusCode = 201;
    return res.json(scoped)
});

//POST /api/spots/:spotId/images | create spot image
router.post('/:spotId/images', requireAuth, async (req, res) => {
    const { url, preview } = req.body;
    const spotId = +req.params.spotId

    const spot = await Spot.findByPk(spotId);

    if (!spot) {
        res.statusCode = 404;
        return res.json({ message: "Spot couldn't be found", statusCode: 404 })
    }

    const newSpotImage = await SpotImage.create({
        spotId,
        url,
        preview
    });

    if (newSpotImage.preview === true) {
        if (spot.previewImage === null) {
            spot.previewImage = newSpotImage.url
            spot.save()
        }
        //need to make a way to change past preview images
    }

    const scoped = await SpotImage.findByPk(newSpotImage.id, { attributes: ['id', 'url', 'preview'] })

    return res.json(scoped)
});

//GET /api/spots/current | all spots of a user
router.get('/current', requireAuth, async (req, res) => {
    const Spots = await Spot.findAll({ where: { ownerId: req.user.id } })

    res.json({ Spots })
})

//GET /api/spots/:spotId  | details of a spot by spot Id
router.get('/:spotId', async (req, res) => {
    const spotId = req.params.spotId;

    const Reviews = await Review.findAll({ where: { spotId } });



    const spot = await Spot.scope("spotDetails").findByPk(spotId, {
        include: [
            { model: SpotImage, attributes: ['id', 'url', 'preview'] },
            { model: User, as: 'Owner', attributes: ['id', 'firstName', 'lastName'] }
        ]
    });

    if (!spot) {
        res.statusCode = 404;
        return res.json({ message: "Spot couldn't be found", statusCode: 404 })
    }

    return res.send(spot)
})

//PUT /api/spots/:spotId | edit spot
router.put('/:spotId', requireAuth, async (req, res) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    const spot = await Spot.findByPk(req.params.spotId);

    if (!spot) {
        res.statusCode = 404;
        return res.json({ message: "Spot couldn't be found", statusCode: 404 })
    }

    spot.address = address
    spot.city = city
    spot.state = state
    spot.country = country
    spot.lat = lat
    spot.lng = lng
    spot.name = name
    spot.description = description
    spot.price = price
    await spot.save();


    const scoped = await Spot.scope("spotCreation").findByPk(spot.id)

    return res.json(scoped);
})


//Auth false
//GET /api/spots/:spotId/reviews | Get reviews of a spot
router.get('/:spotId/reviews', async (req, res) => {
    const spotId = +req.params.spotId;

    const spot = await Spot.findByPk(spotId);

    if (!spot) {
        res.statusCode = 404;
        return res.json({ message: "Spot couldn't be found", statusCode: 404 })
    }

    const Reviews = await Review.findAll({
        where: { spotId },
        include: [
            { model: User, attributes: ['id', 'firstName', 'lastName'] },
            { model: ReviewImage, attributes: ['id', 'url'] }
        ]
    })

    return res.json({ Reviews });
})

//Auth true
//POST /api/spots/:spotId/reviews | Make a review for a spot
router.post('/:spotId/reviews', requireAuth, async (req, res) => {
    const { review, stars } = req.body;
    const userId = req.user.id;
    const spotId = +req.params.spotId
    const spot = await Spot.findByPk(spotId);

    if (!spot) {
        res.statusCode = 404;
        return res.json({ message: "Spot couldn't be found", statusCode: 404 });
    }

    const reviews = await Review.findAll({ where: { userId } })

    if (reviews[0]) {
        if (reviews[0].spotId === spotId) {
            res.statusCode = 403;
            return res.json({ message: "user has already made a review", statusCode: 403 })
        }
    }

    const newReview = await Review.create({
        spotId: +req.params.spotId,
        userId,
        review,
        stars
    })

    spot.numReviews++
    spot.avgStarRating = (((spot.avgStarRating * (spot.numReviews - 1)) + newReview.stars) / spot.numReviews).toFixed(2)

    res.statusCode = 201;
    res.json(newReview);
})

//Auth true
//GET /api/spots/:spotId/bookings | get all bookings of a spot
router.get('/:spotId/bookings', requireAuth, async (req, res) => {
    const spotId = +req.params.spotId
    const spot = await Spot.findByPk(spotId)

    if (!spot) {
        res.statusCode = 404;
        return res.json({ message: "Spot couldn't be found", statusCode: 404 });
    }

    if (spot.ownerId === req.user.id) {
        const ownerBookingList = await Booking.findAll({
            where: { spotId },
            include: { model: User, attributes: ['id', 'firstName', 'lastName'] }
        });

        return res.json(ownerBookingList);
    }

    const Bookings = await Booking.findAll({
        where: { spotId },
        include: { model: User, attributes: ["id", "firstName", "lastName"] }
    });

    return res.json({ Bookings })
})


//Auth true
//POST /api/spot/:spotId/bookings
router.post('/:spotId/bookings', requireAuth, async (req, res) => {
    const spotId = +req.params.spotId;
    const spot = await Spot.findByPk(spotId);
    const userId = +req.user.id;
    //make sure the spot exists | code = 404
    if (!spot) {
        res.statusCode = 404;
        return res.json({ message: "Spot couldn't be found", statusCode: 404 })
    }
    //spot must not belong to user
    if (userId === spot.ownerId) {
        res.statusCode = 400;
        return res.json({ message: "owner can't book owned location", statusCode: 400 })
    }
    //Date checking set up
    const bookingArr = await Booking.findAll({ where: { spotId } });
    const { startDate, endDate } = req.body;
    const sepStart = startDate.split('-');
    const sepEnd = endDate.split('-');
    const currStart = new Date(sepStart).getTime();
    const currEnd = new Date(sepEnd).getTime();
    //endDate before startDate validation | code = 400
    if (currStart > currEnd) {
        res.statusCode = 400;
        return res.json({ message: "End date cannot come before start date", statusCode: 400 })
    }
    //make sure no overlap between booking | code = 403
    for (let booking of bookingArr) {
        const tempStart = booking.startDate.getTime();
        const tempEnd = booking.endDate.getTime();
        const errors = {};

        if (currStart >= tempStart && currStart <= tempEnd) {
            errors.startDate = "start date conflicts with existing booking"
        }
        if (currEnd >= tempStart && currEnd <= tempEnd) {
            errors.endDate = "end date conflicts with existing booking"
        }
        if (Object.values(errors).length > 0) {
            res.statusCode = 403
            return res.json({
                message: "Sorry, this spot is already booked for the specified dates",
                statusCode: 403,
                errors: errors
            })
        }
    }

    const newBooking = await Booking.create({
        userId: req.user.id,
        spotId: +req.params.spotId,
        startDate,
        endDate
    })

    return res.json(newBooking)
})

//Auth true
//DELETE /api/spots/:spotId
router.delete('/:spotId', requireAuth, async (req, res) => {
    const spotId = +req.params.spotId;
    const spot = await Spot.findByPk(spotId);

    if (!spot) {
        res.statusCode = 404;
        return res.json({ message: "Spot couldn't be found", statusCode: 404 });
    }

    if (spot.ownerId !== req.user.id) {
        res.statusCode = 400;
        return res.json({ message: "non owner cannot delete spot", statusCode: 400 });
    }

    await spot.destroy();
    return res.json({ message: "successfully deleted", statusCode: 200 })
})


module.exports = router
// SR + V400.30
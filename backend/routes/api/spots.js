const express = require('express');

const { Spot, SpotImage, User, Review, Booking } = require('../../db/models');
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
    check('lat')
        .exists({ checkFalsy: true })
        .withMessage('Latitude is not valid'),
    check('lng')
        .exists({ checkFalsy: true })
        .withMessage('Longitude is not valid'),
    check('name')
        .exists({ checkFalsy: true })
        .isLength({ max: 50 })
        .withMessage('Name must exist and be less than 50 characters'),
    check('description')
        .exists({ checkFalsy: true })
        .withMessage('Description is required'),
    check('price')
        .exists({ checkFalsy: true })
        .withMessage('Price per day is required'),
    handleSpotValidationErrors
];


//GET /api/spots | all spots
router.get('/', async (req, res) => {
    let { page, size } = req.query;

    let pagination = {}
    if (parseInt(page) >= 1 && parseInt(size) >= 1) {
        pagination.limit = size
        pagination.offset = size * (page - 1)
    }

    const spots = await Spot.findAll({ ...pagination });

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

    const scoped = await SpotImage.scope("defaultScope").findByPk(newSpotImage.id)

    return res.json(scoped)
});

//GET /api/spots/current | all spots of a user
router.get('/current', requireAuth, async (req, res) => {
    const Spots = await Spot.findAll({ where: { ownerId: req.user.id } })

    res.json({ Spots })
})

//GET /api/spots/:spotId  | details of a spot by user Id
router.get('/:spotId', async (req, res) => {
    const spotId = req.params.spotId;
    const spot = await Spot.scope("spotDetails").findByPk(spotId, {
        include: [
            { model: SpotImage, attributes: ['id', 'url', 'preview'] },
            { model: User, as: 'Owner', attributes: ['id', 'firstName', 'lastName'] }
        ]
    });

    //query for reviews and update numreviews and avgrating with agregate

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

    const reviews = await Review.findAll({ where: { spotId } })

    return res.json(reviews);
})

//Auth true
//POST /api/spots/:spotId/reviews | Make a review for a spot
router.post('/:spotId/reviews', requireAuth, async (req, res) => {
    const { review, stars } = req.body;
    const userId = req.user.id;
    const spot = await Spot.findByPk(req.params.spotId);

    if (!spot) {
        res.statusCode = 404;
        return res.json({ message: "Spot couldn't be found", statusCode: 404 });
    }

    const newReview = await Review.create({
        spotId: +req.params.spotId,
        userId,
        review,
        stars
    })

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

    const genBookingList = await Booking.findAll({ where: { spotId } });

    return res.json(genBookingList)
})


//Auth true
//POST /api/spot/:spotId/bookings
router.post('/:spotId/bookings', requireAuth, async (req, res) => {
    const spotId = +req.params.spotId
    const { startDate, endDate } = req.body
    const spot = await Spot.findByPk(spotId);

    if (!spot) {
        res.statusCode = 404;
        return res.json({ message: "Spot couldn't be found", statusCode: 404 });
    }

    if (spot.ownerId === req.user.id) {
        res.statusCode = 400
        return res.json({ message: "owner cannot book location", statusCode: 400 })
    }

    if (endDate < startDate) {
        res.statusCode = 400;
        return res.json({ message: "End date cannot be before start date" })
    }

    const newBooking = await Booking.create({
        userId: req.user.id,
        spotId: +req.params.spotId,
        startDate,
        endDate
    })

    const today = new Date().getTime();
    const bookingArr = await Booking.findAll({ where: { spotId } })
    const currStart = newBooking.startDate.getTime();
    const currEnd = newBooking.endDate.getTime();
    const errors = {}
    if (currStart < today) {
        res.statusCode = 403;
        return res.json({ message: "Bookings can't be made in the past", statusCode: 403 })
    }
    for (let booking of bookingArr) {
        const tempStart = booking.startDate.getTime();
        const tempEnd = booking.endDate.getTime();

        if (currStart >= tempStart || currStart <= tempEnd) {
            errors.startDate = "start date conflicts with existing booking"
        }
        if (currEnd >= tempStart || currEnd <= tempEnd) {
            errors.endDate = "end date conflicts with existing booking"
        }
    }

    if (Object.keys(errors)) {
        res.statusCode = 403;
        return res.json({
            message: "Sorry, this spot is already booked for the specified dates",
            statusCode: 403,
            errors: errors
        })
    }

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
    return res.json({ message: "successfully deleted" })
})


module.exports = router
const express = require('express');

const { Spot, SpotImage, User } = require('../../db/models');
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


//GET /api/spots all spots
router.get('/', async (req, res) => {
    const spots = await Spot.findAll();

    res.json(spots);
});

//POST /api/spots create a spot
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

//POST /api/spots/:spotId/images
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

//GET /api/spots/current all spots of a user
router.get('/current', requireAuth, async (req, res) => {
    const Spots = await Spot.findAll({ where: { ownerId: req.user.id } })

    res.json({ Spots })
})

//GET /api/spots/:spotId details of a spot by user Id
router.get('/:spotId', async (req, res) => {
    const spotId = req.params.spotId;
    const spot = await Spot.scope("spotDetails").findByPk(spotId, {
        include: [
            { model: SpotImage, attributes: ['id', 'url', 'preview'] },
            { model: User, as: 'Owner', attributes: ['id', 'firstName', 'lastName'] },
        ]
    });

    if (!spot) {
        res.statusCode = 404;
        return res.json({ message: "Spot couldn't be found", statusCode: 404 })
    }

    return res.send(spot)
})

//PUT /api/spots/:spotId
router.put('/:spotId', requireAuth, async (req, res) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const userId = req.user.id;

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
    spot.save();


    const scoped = await Spot.scope("spotCreation").findByPk(spot.id)

    return res.json(scoped);
})


module.exports = router
const express = require('express');

const { Spot, SpotImage, Review, User } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

//GET /spots all spots
router.get('/', async (req, res) => {
    const spots = await Spot.findAll();

    res.json(spots);
});

//POST / create a spot
router.post('/', requireAuth, async (req, res) => {
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

    res.statusCode = 201;
    return res.json(newSpot)
});


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

    const scoped = await SpotImage.scope("defaultScope").findByPk(newSpotImage.id)

    return res.json(scoped)
});


router.get('/current', requireAuth, async (req, res) => {
    const Spots = await Spot.findAll({ where: { ownerId: req.user.id } })

    res.json({ Spots })
})


router.get('/:spotId', async (req, res) => {
    const spotId = req.params.spotId;
    const spot = await Spot.findByPk(spotId, {
        include: [
            { model: SpotImage, attributes: ['id', 'url', 'preview'] },
            { model: User, as: 'Owner', attributes: ['id', 'firstName', 'lastName'] },
        ]
    });
    const spotImages = await SpotImage.findAll({ where: { spotId } })
    // const test = {
    //     ...spot.dataValues,
    //     spotImages
    //     // test: "test",
    //     // ...SpotImage.dataValues,
    //     // ...User.dataValues
    // }
    // console.log(test)
    // // const reviews = await Review.findAll({ where: { spotId: req.params.spotId } })

    if (!spot) {
        res.statusCode = 404;
        return res.json({ message: "Spot couldn't be found", statusCode: 404 })
    }

    console.log(spotImages[0].dataValues.preview)

    return res.send(spot)
})


module.exports = router
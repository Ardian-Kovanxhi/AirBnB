const express = require('express');

const { Spot } = require('../../db/models')

const router = express.Router();

router.get('/', async (req, res, next) => {
    const spots = await Spot.findAll();

    res.json(spots);
});

router.post('/', async (req, res, next) => {
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

    res.json(newSpot)
});

module.exports = router
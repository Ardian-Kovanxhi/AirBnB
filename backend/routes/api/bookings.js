const express = require('express');

const { Spot, User, Review, Booking } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleSpotValidationErrors } = require('../../utils/validation');

const router = express.Router();

//Auth true
//GET /api/bookings/current | get all bookings of current user
router.get('/current', requireAuth, async (req, res) => {
    const userId = req.user.id;
    const bookings = await Booking.findAll({
        where: { userId },
        include: { model: Spot, attributes: { exclude: ["avgStarRating", "description"] } }
    })

    res.json(bookings)
})

//Auth true
//PUT /api/bookings/:bookingId | edit a booking
router.put('/:bookingId', requireAuth, async (req, res) => {
    const bookingId = +req.params.bookingId
    const booking = await Booking.findByPk(bookingId);
    const prevStartDate = booking.startDate.getTime();
    const prevEndDate = booking.endDate.getTime();
    const today = new Date().getTime();

    if (!booking) {
        res.statusCode = 404;
        return res.json({ message: "booking could not be found", statusCode: 404 });
    }

    const userId = req.user.id;

    if (booking.userId !== userId) {
        res.statusCode = 400;
        return res.json({
            message: "cannot edit a booking that isn't yours",
            statusCode: 400
        })
    }

    if (prevEndDate < today) {
        res.statusCode = 403;
        return res.json({
            message: "Past bookings can't be altered",
            statusCode: 403
        })
    }

    const { startDate, endDate } = req.body;
    const sepStart = startDate.split('-');
    const currStart = new Date(...sepStart).getTime();

    const sepEnd = endDate.split('-');
    const currEnd = new Date(...sepEnd).getTime();

    res.json(booking)
})

//Auth true
//DELETE /api/bookings/:bookingId

module.exports = router
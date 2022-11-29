const express = require('express');

const { Spot, Booking } = require('../../db/models');
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
        include: { model: Spot, attributes: { exclude: ["avgStarRating", "description", "numReviews", "createdAt", "updatedAt"] } }
    })

    res.json(bookings)
})

//Auth true
//PUT /api/bookings/:bookingId | edit a booking
router.put('/:bookingId', requireAuth, async (req, res) => {
    const bookingId = +req.params.bookingId
    const booking = await Booking.findByPk(bookingId);
    //check if booking exists
    if (!booking) {
        res.statusCode = 404;
        res.json({ message: "Booking couldn't be found", statusCode: 404 })
    }

    //set up
    const bookingArr = await Booking.findAll({ where: { spotId: booking.spotId } })
    const { startDate, endDate } = req.body;
    const sepStart = startDate.split('-');
    const sepEnd = endDate.split('-');
    const currStart = new Date(sepStart).getTime();
    const currEnd = new Date(sepEnd).getTime();
    const prevStartDate = booking.startDate.getTime();
    const prevEndDate = booking.endDate.getTime();
    const today = new Date().getTime();

    //check if end date before start date
    if (currStart > currEnd) {
        res.statusCode = 400;
        return res.json({ message: "End date cannot come before start date", statusCode: 400 })
    }
    //can't edit booking from the past
    if (currEnd < today) {
        res.statusCode = 403;
        return res.json({ message: "Cannot edit past bookings", statusCode: 403 })
    }
    //check if booking overlap
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

    booking.startDate = startDate;
    booking.endDate = endDate;
    await booking.save();

    res.json(booking)
})

//Auth true
//DELETE /api/bookings/:bookingId
router.delete('/:bookingId', requireAuth, async (req, res) => {
    const bookingId = +req.params.bookingId;

    const booking = await Booking.findByPk(bookingId);

    if (!booking) {
        res.statusCode = 404;
        return res.json({ message: "Booking not found", statusCode: 404 })
    }

    await booking.destroy();
    return res.json({ message: "successfully deleted", statusCode: 200 })
})

module.exports = router
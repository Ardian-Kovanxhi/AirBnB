const express = require('express');

const { SpotImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

//Auth true
//DELETE /api/spot-images/:spotImageId | delete image by id
router.delete('/:spotImageId', requireAuth, async (req, res) => {
    const spotImageId = +req.params.spotImageId;

    const spotImage = await SpotImage.findByPk(spotImageId);

    if (!spotImage) {
        res.statusCode = 404;
        return res.json({ message: "Spot image not found", statusCode: 404 })
    }

    await spotImage.destroy();
    return res.json({ message: "successfully deleted", statusCode: 200 })
})

module.exports = router
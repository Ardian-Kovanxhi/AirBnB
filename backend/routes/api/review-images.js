const express = require('express');

const { ReviewImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

//Auth true
//DELETE /api/review-images/:reviewImageId | Delete Review image
router.delete('/:reviewImageId', requireAuth, async (req, res) => {
    const imageId = +req.params.reviewImageId;

    const image = await ReviewImage.findByPk(imageId);

    if (!image) {
        res.statusCode = 404;
        return res.json({ message: "Review image not found", statusCode: 404 })
    }

    await image.destroy();
    return res.json({ message: "successfully deleted", statusCode: 200 })
})

module.exports = router
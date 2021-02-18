const express = require('express');
const router = express.Router();
const stickerService = require('./sticker.service');
const authenticateJWT = require('../../auth/auth')

// routes
router.post('/get/verificationInfo', authenticateJWT ,getStickerVerificationInfo);
router.post('/get/stickerInfo', authenticateJWT ,getStickerInfo);
router.delete('/remove',authenticateJWT,removeSticker)
module.exports = router;

function getStickerVerificationInfo(req, res, next) {
    stickerService.getStickerVerificationInfo(req.body)
        .then(response => res.json(response))
        .catch(err => next(err));
}

function getStickerInfo(req, res, next) {
    stickerService.getStickerInfo(req.body)
        .then(response => res.json(response))
        .catch(err => next(err));
}

function removeSticker(req, res, next) {
    stickerService.removeSticker(req.body)
        .then(response => res.json(response))
        .catch(err => next(err));
}


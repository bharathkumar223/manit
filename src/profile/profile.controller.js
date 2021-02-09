const express = require('express');
const router = express.Router();
const authenticateJWT = require('../../auth/auth')
const profileService = require('./profile.service');

const multer = require('multer')
var upload = multer({ dest: 'assets/Images' })

// routes
// router.get('/get', authenticateJWT ,getProfile);
router.post('/upload', authenticateJWT , upload.single('profilePic') ,uploadProfilePic);

module.exports = router;

function uploadProfilePic(req, res, next) {
    profileService.uploadProfilePic(req)
        .then(response => res.json(response))
        .catch(err => next(err));
}

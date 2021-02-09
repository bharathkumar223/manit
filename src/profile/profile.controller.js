const express = require('express');
const router = express.Router();
const authenticateJWT = require('../../auth/auth')
const profileService = require('./profile.service');

const multer = require('multer')
var upload = multer({ dest: 'assets/Images' })

// routes
router.get('/get', authenticateJWT ,getProfile);
router.get('/post', upload.single('post'),authenticateJWT ,addPost);
router.post('/upload' , upload.single('profilePic') ,authenticateJWT,uploadProfilePic);
// router.add('/add', authenticateJWT ,getProfile);

module.exports = router;

function uploadProfilePic(req, res, next) {
    profileService.uploadProfilePic(req)
        .then(response => res.json(response))
        .catch(err => next(err));
}

function getProfile(req, res, next) {
    profileService.getProfile(req)
        .then(response => res.json(response))
        .catch(err => next(err));
}

function addPost(req, res, next) {
    profileService.addPost(req)
        .then(response => res.json(response))
        .catch(err => next(err));
}

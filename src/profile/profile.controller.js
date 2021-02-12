const express = require('express');
const router = express.Router();
const authenticateJWT = require('../../auth/auth')
const profileService = require('./profile.service');

const multer = require('multer')
var upload = multer({ dest: 'assets/Images' })

// routes
router.get('/get', authenticateJWT ,getProfile);
router.post('/post', upload.single('post'),authenticateJWT ,addPost);
router.post('/upload' , upload.single('profilePic') ,authenticateJWT,uploadProfilePic);
router.post('/comment', authenticateJWT ,comment);
router.post('/get/comment', authenticateJWT ,getComment);
router.post('/like/post', authenticateJWT ,likePost);
router.post('/dislike/post', authenticateJWT ,dislikePost);

module.exports = router;

function uploadProfilePic(req, res, next) {
    profileService.uploadProfilePic(req)
        .then(response => res.json(response))
        .catch(err => next(err));
}

function likePost(req, res, next) {
    profileService.likePost(req.body)
        .then(response => res.json(response))
        .catch(err => next(err));
}

function dislikePost(req, res, next) {
    profileService.dislikePost(req.body)
        .then(response => res.json(response))
        .catch(err => next(err));
}

function getComment(req, res, next) {
    profileService.getComment(req.body)
        .then(response => res.json(response))
        .catch(err => next(err));
}

function getProfile(req, res, next) {
    profileService.getProfile(req.body)
        .then(response => res.json(response))
        .catch(err => next(err));
}

function addPost(req, res, next) {
    profileService.addPost(req)
        .then(response => res.json(response))
        .catch(err => next(err));
}

function comment(req, res, next) {
    profileService.comment(req.body)
        .then(response => res.json(response))
        .catch(err => next(err));
}

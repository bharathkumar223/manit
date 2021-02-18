const express = require('express');
const router = express.Router();
const authenticateJWT = require('../../auth/auth')
const profileService = require('./profile.service');

const multer = require('multer')
var upload = multer({ dest: 'assets/Images' })

// routes
router.get('/get', authenticateJWT ,getProfile);
router.post('/photo', upload.single('document'),authenticateJWT ,uploadPhoto);
router.get('/get/photos',authenticateJWT, getPhotos)
router.delete('/remove/photo',authenticateJWT,removePhoto)
router.post('/edit/photo',upload.single('document') ,authenticateJWT, editPhoto)
router.post('/upload' , upload.single('profilePic') ,authenticateJWT,uploadProfilePic);
router.delete('/delete'  ,authenticateJWT,removeProfilePic);
router.post('/comment', authenticateJWT ,addComment);
router.post('/get/comments', authenticateJWT ,getComments);
router.post('/like/post', authenticateJWT ,likePost);
router.post('/dislike/post', authenticateJWT ,dislikePost);

module.exports = router;

function uploadProfilePic(req, res, next) {
    profileService.uploadProfilePic(req)
        .then(response => res.json(response))
        .catch(err => next(err));
}

function removePhoto(req, res, next) {
    profileService.removePhoto(req.body)
        .then(response => res.json(response))
        .catch(err => next(err));
}

function editPhoto(req, res, next) {
    profileService.editPhoto(req)
        .then(response => res.json(response))
        .catch(err => next(err));
}

function getPhotos(req, res, next) {
    console.log(req.body)
    profileService.getPhotos(req.body)
        .then(response => res.json(response))
        .catch(err => next(err));
}

function removeProfilePic(req, res, next) {
    profileService.removeProfilePic(req.body)
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

function getComments(req, res, next) {
    profileService.getComments(req.body)
        .then(response => res.json(response))
        .catch(err => next(err));
}

function getProfile(req, res, next) {
    profileService.getProfile(req.body)
        .then(response => res.json(response))
        .catch(err => next(err));
}

function uploadPhoto(req, res, next) {
    profileService.uploadPhoto(req)
        .then(response => res.json(response))
        .catch(err => next(err));
}

function addComment(req, res, next) {
    profileService.addComment(req.body)
        .then(response => res.json(response))
        .catch(err => next(err));
}

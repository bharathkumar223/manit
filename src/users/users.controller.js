const express = require('express');
const router = express.Router();
const userService = require('./user.service');
const authenticateJWT = require('../../auth/auth')

// routes

router.get('/get/userInfo',authenticateJWT,getUserInfo);
router.get('/get/profile',authenticateJWT,getProfile);
router.post('/login', login);

router.post('/signup/otp/request',authenticateJWT,requestOTP);
router.post('/signup/otp/resend', authenticateJWT, resendOTP);
router.post('/signup/otp/validate',authenticateJWT,  validateOTP);
router.post('/signup/save/credential', saveInfo);
router.post('/signup/save/personalInfo',authenticateJWT,savePersonalInfo);
router.post('/signup/id/validation', isIdAvailable);

router.post('/request/verification', authenticateJWT,requestVerification);
router.post('/get/verification/request',authenticateJWT, getVerificationRequest);
router.post('/respond/verification/request',authenticateJWT, respondVerificationRequest);
router.get('/get/navigation',authenticateJWT, getNavigation)
router.post('/edit/isNewUser',authenticateJWT, editIsNewUser)
// router.get('/current', getCurrent);
// router.get('/:id', getById);
// router.put('/:id', update);
// router.delete('/:id', _delete);
// router.post('/register', register);
// router.get('/', getAll);

module.exports = router;

function login(req, res, next) {
    userService.login(req.body)
        .then(response => res.json(response))
        .catch(err => next(err));
}
function editIsNewUser(req, res, next) {
    userService.editIsNewUser(req.body)
        .then(response => res.json(response))
        .catch(err => next(err));
}

function getNavigation(req, res, next) {
    userService.getNavigation(req.body)
        .then(response => res.json(response))
        .catch(err => next(err));
}

function getProfile(req, res, next) {
    userService.getProfile(req.body)
        .then(response => res.json(response))
        .catch(err => next(err));
}

function getUserInfo(req, res, next) {
    userService.getUserInfo(req.body)
        .then(response => res.json(response))
        .catch(err => next(err));
}

function requestOTP(req, res, next) {
    userService.requestOTP(req.body)
        .then(response => res.json(response))
        .catch(err => next(err));
}

function resendOTP(req, res, next) {
    userService.resendOTP(req.body)
        .then(response => res.json(response))
        .catch(err => next(err));
}

function validateOTP(req, res, next) {
    userService.validateOTP(req.body)
        .then(response => res.json(response))
        .catch(err => next(err));
}

function saveInfo(req, res, next) {
    userService.saveInfo(req.body)
        .then(response => res.json(response))
        .catch(err => next(err));
}

function isIdAvailable(req, res, next) {
    userService.isIdAvailable(req.body)
        .then(response => res.json(response))
        .catch(err => next(err));
}

function savePersonalInfo(req, res, next) {
    userService.savePersonalInfo(req.body)
        .then(response => res.json(response))
        .catch(err => next(err));
}

function requestVerification(req, res, next) {
    userService.requestVerification(req.body)
        .then(response => res.json(response))
        .catch(err => next(err));
}

function getVerificationRequest(req, res, next) {
    userService.getVerificationRequest(req.body)
        .then(response => res.json(response))
        .catch(err => next(err));
}

function respondVerificationRequest(req, res, next) {
    userService.respondVerificationRequest(req.body)
        .then(response => res.json(response))
        .catch(err => next(err));
}

// function getCurrent(req, res, next) {
//     userService.getById(req.user.sub)
//         .then(user => user ? res.json(user) : res.sendStatus(404))
//         .catch(err => next(err));
// }

// function getById(req, res, next) {
//     userService.getById(req.params.id)
//         .then(user => user ? res.json(user) : res.sendStatus(404))
//         .catch(err => next(err));
// }

// function update(req, res, next) {
//     userService.update(req.params.id, req.body)
//         .then(() => res.json({}))
//         .catch(err => next(err));
// }

// function _delete(req, res, next) {
//     userService.delete(req.params.id)
//         .then(() => res.json({}))
//         .catch(err => next(err));
// }

// function authenticate(req, res, next) {
//     userService.authenticate(req.body)
//         .then(user => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
//         .catch(err => next(err));
// }

// function getAll(req, res, next) {
//     userService.getAll()
//         .then(users => res.json(users))
//         .catch(err => next(err));
// }
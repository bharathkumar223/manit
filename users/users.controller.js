const express = require('express');
const router = express.Router();
const userService = require('./user.service');
const config = require('./../config.json');
const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
    console.log("inside auth jwt");
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, config.secret, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            // req.user = user;
            console.log("user => ",user);
            req.body.user = user.sub
            req.body.token = token
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

// routes

router.get('/get/userInfo',authenticateJWT,getUserInfo);
router.post('/login', login);
router.post('/signup/otp/request',  authenticateJWT, requestOTP);
router.post('/signup/otp/resend',  authenticateJWT, resendOTP);
router.post('/signup/otp/validate',  authenticateJWT, validateOTP);
router.post('/signup/save/credential', saveInfo);
router.post('/signup/save/personalInfo',  authenticateJWT,savePersonalInfo);
router.get('/signup/id/validation', isIdAvailable);
router.get('/hobbies/get', getHobbies);
router.post('/hobbies/save', saveHobbies);
router.post('/request/verification', authenticateJWT,requestVerification);
router.post('/get/verification/request',authenticateJWT, getVerificationRequest);
router.post('/respond/verification/request',authenticateJWT, respondVerificationRequest);
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

function getUserInfo(req, res, next) {
    userService.getUserInfo(req.body)
        .then(response => res.json(response))
        .catch(err => next(err));
}

function requestOTP(req, res, next) {
    userService.requestOTP(res,req.body)
        .then(response => response)
        .catch(err => next(err));
}

function resendOTP(req, res, next) {
    userService.resendOTP(res,req.body)
        .then(response => response)
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

function getHobbies(req, res, next) {
    userService.getHobbies(req.body)
        .then(response => res.json(response))
        .catch(err => next(err));
}

function saveHobbies(req, res, next) {
    userService.saveHobbies(req.body)
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
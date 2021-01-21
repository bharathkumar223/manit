const express = require('express');
const router = express.Router();
const userService = require('./user.service');

// routes
router.post('/login', login);
router.post('/signup/otp/request', requestOTP);
router.post('/signup/otp/resend', resendOTP);
router.post('/signup/otp/validate', validateOTP);
router.post('/signup/save', saveInfo);
router.get('/hobbies/get', getHobbies);
router.post('/hobbies/save', saveHobbies);
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
const express = require('express');
const router = express.Router();
const userService = require('./user.service');

// routes
router.post('/login', authenticate);
// router.post('/register', register);
// router.get('/', getAll);
router.post('/', register);
router.get('/current', getCurrent);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', _delete);

module.exports = router;

function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
        .catch(err => next(err));
}

function register(req, res, next) {
    userService.create(req.body)
        .then(() => {
            userService.authenticate(req.body)
                .then(user => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
                .catch(err => next(err));
        })
        .catch(err => next(err));

    
}

// {
//     "id": "ThisIsId",
//     "enrollment": "enrollmentInfo",
//     "createdDate": "2021-01-18T03:06:33.221Z",
//     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJUaGlzSXNJZCIsImlhdCI6MTYxMDkzOTE5NCwiZXhwIjoxNjExNTQzOTk0fQ.Vk7KOgiBTkcOYYsi6E-5NIX07FI6ApvSUW_tqlOljok"
// }

function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getCurrent(req, res, next) {
    userService.getById(req.user.sub)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getById(req, res, next) {
    userService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function update(req, res, next) {
    userService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    userService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}
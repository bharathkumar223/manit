const jwt = require('jsonwebtoken');
const config = require('../config.json');

module.exports = function setCurrentUser(req, res, next) {
    
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, config.secret, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            // req.user = user;
            console.log("user => ",user);
            next();
        });
    } else {
        res.sendStatus(401);
    }

  };
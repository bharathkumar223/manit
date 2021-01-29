const jwt = require('jsonwebtoken');
const config = require('../config.json');

module.exports = function authenticateJWT(req, res, next) {
    
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, config.secret, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            req.body.userId = user.sub;
            console.log("user => ",user);
            next();
        });
    } else {
        res.sendStatus(401);
    }

  };
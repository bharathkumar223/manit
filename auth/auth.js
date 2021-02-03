const jwt = require('jsonwebtoken');
const config = require('../config.json');

module.exports = function authenticateJWT(req, res, next) {
    
    const authHeader = req.headers.authorization;
    console.log("authHeader => ",req.headers);
    console.log("req.params => ",req.query);

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, config.secret, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            console.log(req.body)

            req.body.userId = user.sub;
            req.query.userId = user.sub
            console.log("user => ",user);
            next();
        });
    } else {
        res.sendStatus(401);
    }

  };
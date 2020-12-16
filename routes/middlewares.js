const jwt = require('jsonwebtoken');
const { getByEmail } = require('../models/user');


const checkToken = async (req, res, next) => {
    if (process.env.MIDDLEWARE_ACTIVE == 'OFF') {
        return next()
    }

    if (!req.headers['authorization']) {
        return res.status(403).json({ error: process.env.RESPONSE_UNAUTHORIZED });

    } else {

        const token = req.headers['authorization'];

        // comprobamos si el token esta codificado con la secret key correcta
        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY);

            const usuario = await getByEmail(decoded.email);
            if (!usuario) {
                return res.status(400).json({ error: process.env.RESPONSE_NOT_FOUND });
            }
            req.user = usuario;
            next();

        } catch (err) {
            return res.status(403).json({ error: process.env.RESPONSE_UNAUTHORIZED });
        }
    }
}

const getToken = async (req, res, next) => {
    console.log(req.headers);

    const token = req.headers.authorization;

    req.user = jwt.verify(token, process.env.SECRET_KEY);

    next();
}

module.exports = {
    checkToken, getToken
}
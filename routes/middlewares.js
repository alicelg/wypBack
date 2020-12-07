const jwt = require('jsonwebtoken');
const { getByEmail } = require('../models/user');


const checkToken = async (req, res, next) => {
    console.log('aqui');

    if (process.env.MIDDLEWARE_ACTIVE == 'OFF') {
        return next()
    }

    if (!req.headers['authorization']) {
        return res.status(403).json({ error: 'Authorization not found' });

    } else {

        const token = req.headers['authorization'];

        // comprobamos si el token esta codificado con la secret key correcta
        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            
            const usuario = await getByEmail(decoded.email);
            if (!usuario) {
                return res.status(403).json({ error: 'User not found' });
            }
            req.user = usuario;
            next();

        } catch (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }



    }
}

module.exports = {
    checkToken
}
const envConfig = require('../../../config/env');
require('dotenv').config(envConfig);

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    console.log('Received Token', authHeader);

    if (!authHeader) {
        return res.status(401).json({
            message: 'Token não informado',
            success: false
        });
    }

    const parts = authHeader.split(' ');

    if (!parts.length === 2) {
        return res.status(401).json({
            message: 'Token inválido',
            success: false
        });
    }

    const [ scheme, token ] = parts;

    if (!/^Bearer$/i.test(scheme)) {
        return res.status(401).json({
            message: 'Token inválido',
            success: false
        });
    }

    jwt.verify(token, process.env.SECRET_HASH, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                message: 'Token inválido',
                success: false
            });
        }

        req.userId = decoded.id;
        return next();
    });
};
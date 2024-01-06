const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const Admin = require('../model/Admin');
const AdminToken = require('../model/AdminToken');
const md5 = require('md5');
const moment = require('moment');

const { JWT_SECRET_KEY, JWT_EXPIRATION } = process.env;

const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        let statusCode = 422;
        let statusRes = false;
        let message = null;
        let data = null;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                status: statusCode,
                message: 'Validation error',
                data: data,
                error: errors.array()
            });
        }

        const admin = await Admin.findOne({ where: { username } });
        if (username === admin.username && md5(password) === admin.password) {
            const expirationTime = moment().tz('Asia/Jakarta').add(parseInt(JWT_EXPIRATION, 10), 'hours').unix();
            console.log(expirationTime);
            const token = jwt.sign({ username, exp:expirationTime }, JWT_SECRET_KEY);

            // save to db admin_token
            const expired_at = moment.unix(expirationTime).toDate();
            await AdminToken.create({
                id_admin: admin.id,
                token,
                expired_at,
            });

            data = { token };
            statusCode = 200;
            message = 'Success create token.';
            statusRes = true;
        } else {
            statusCode = 401;
            message = 'Invalid credentials.';
        }

        return res.status(statusCode).json({
            status: statusRes,
            message: message,
            data: data,
        });
    } catch (error) {
        return res.status(500).json({ status: false, message: 'Internal server error', error });
    }
};

module.exports = {
    login,
};

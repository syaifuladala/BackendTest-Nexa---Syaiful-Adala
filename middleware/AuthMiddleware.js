const AdminToken = require('../model/AdminToken');
const { Op } = require('sequelize');
const moment = require('moment');

const authenticateToken = async (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ status: false, message: 'Unauthorized: Missing token' });
    }

    try {
        const adminToken = await AdminToken.findOne({ 
            where: { 
                token,
                expired_at: {
                    [Op.gte]: moment().toDate(),
                },
            },
        });

        if (!adminToken) {
            return res.status(401).json({ status: false, message: 'Unauthorized: Invalid token' });
        }

        req.admin_id = adminToken.id_admin;
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ status: false, message: 'Unauthorized: Invalid token', error });
    }
};

module.exports = authenticateToken;

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AdminToken = sequelize.define('admin_token', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_admin: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    token: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    expired_at: {
        type: DataTypes.DATE,
        allowNull: false,
    }
}, {
    timestamps: false,
    tableName: 'admin_token'
});

module.exports = AdminToken;

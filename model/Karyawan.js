const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const moment = require('moment');

const Karyawan = sequelize.define('karyawan', {
    nama: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    nip: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    address: {
        type: DataTypes.STRING,
    },
    gender: {
        type: DataTypes.ENUM('L', 'P'),
    },
    photo: {
        type: DataTypes.STRING,
    },
    birthdate: {
        type: DataTypes.DATE,
    },
    status: {
        type: DataTypes.INTEGER,
        defaultValue: true,
    },
    insert_at: {
        type: DataTypes.DATE,
        defaultValue: moment(),
    },
    update_at: {
        type: DataTypes.DATE,
        defaultValue: moment(),
    },
}, {
    tableName: 'karyawan',
    timestamps: false,
});

module.exports = Karyawan;

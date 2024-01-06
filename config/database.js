const { Sequelize } = require('sequelize');
require('dotenv').config();
const {
    DB_HOST,
    DB_DATABASE,
    DB_USERNAME,
    DB_PASSWORD
} = process.env;


const sequelize = new Sequelize({
    dialect: 'mysql',
    host: DB_HOST,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    timezone: '+07:00',
});

module.exports = sequelize;

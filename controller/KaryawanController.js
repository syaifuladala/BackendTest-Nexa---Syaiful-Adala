const { validationResult } = require('express-validator');
const Karyawan = require('../model/Karyawan');
const { Op } = require('sequelize');
const moment = require('moment');

const addKaryawan = async (req, res, next) => {
    try {
        const { nama, address, gender, photo, birthdate } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                status: false,
                message: 'Validation error',
                errors: errors.array(),
            });
        }

        let nip = moment().format('YYYY');
        const latestNip = await geLatestKaryawanNip();

        if (latestNip) {
            nip = nip + (parseInt((latestNip.nip).substring(4)) + 1).toString().padStart(4, '0')
        } else {
            nip = nip + '0001';
        }

        const newKaryawan = await Karyawan.create({
            nama,
            nip,
            address,
            gender,
            photo,
            birthdate,
        });

        return res.status(200).json({
            status: true,
            message: 'Employee registered successfully.',
            data: newKaryawan,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

async function geLatestKaryawanNip() {
    try {
        const data = await Karyawan.findOne({
            order: [['id', 'DESC']],
        });

        return data;
    } catch (error) {
        console.log(error);
        return false;
    }
}

const getKaryawanList = async (req, res, next) => {
    try {
        const { keyword, start = 0, count = 10 } = req.query;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                status: false,
                message: 'Validation error',
                errors: errors.array(),
            });
        }

        const query = {
            where: {},
            limit: parseInt(count, 10),
            offset: parseInt(start, 10),
        };

        if (keyword) {
            query.where.nama = { [Op.like]: `%${keyword}%` };
        }

        const karyawanList = await Karyawan.findAll(query);

        if (karyawanList.length === 0) {
            return res.status(404).json({
                status: false,
                message: 'No data found.',
                data: {
                    list: []
                },
            });
        }

        return res.status(200).json({
            status: true,
            message: 'Karyawan list retrieved successfully.',
            data: {
                list: karyawanList
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

const updateKaryawan = async (req, res, next) => {
    try {
        const nip = req.params.nip;
        const { nama, address, gender, photo, birthdate } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                status: false,
                message: 'Validation error',
                errors: errors.array(),
            });
        }

        const existingKaryawan = await Karyawan.findOne({ where: { nip } });

        if (!existingKaryawan) {
            return res.status(404).json({
                status: false,
                message: 'Employee not found.',
            });
        }

        // update data
        existingKaryawan.nama = nama;
        existingKaryawan.address = address;
        existingKaryawan.gender = gender;
        existingKaryawan.photo = photo;
        existingKaryawan.birthdate = birthdate;

        await existingKaryawan.save();

        return res.status(200).json({
            status: true,
            message: 'Employee updated successfully.',
            data: existingKaryawan,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

const deactiveKaryawan = async (req, res, next) => {
    try {
        const nip = req.params.nip;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                status: false,
                message: 'Validation error',
                errors: errors.array(),
            });
        }

        const existingKaryawan = await Karyawan.findOne({ where: { nip } });

        if (!existingKaryawan) {
            return res.status(404).json({
                status: false,
                message: 'Employee not found.',
            });
        }

        existingKaryawan.status = 9;

        await existingKaryawan.save();

        return res.status(200).json({
            status: true,
            message: 'Employee deactivated successfully.',
            data: existingKaryawan,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

module.exports = {
    addKaryawan,
    geLatestKaryawanNip,
    getKaryawanList,
    updateKaryawan,
    deactiveKaryawan
};
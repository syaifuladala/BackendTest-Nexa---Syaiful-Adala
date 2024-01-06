const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const AuthController = require('../controller/AuthController');
const KaryawanController = require('../controller/KaryawanController');
const authenticateToken = require('../middleware/AuthMiddleware');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post(
  '/login',
  [
    check('username').notEmpty().withMessage('Username is required').isString().withMessage('Username must be a string'),
    check('password').notEmpty().withMessage('Password is required').isString().withMessage('Password must be a string'),
  ],
  AuthController.login
);

const KaryawanValidation = [
  check('nama').notEmpty().withMessage('Nama is required').isString().withMessage('Nama must be a string'),
  check('address').notEmpty().withMessage('Address is required').isString().withMessage('Address must be a string'),
  check('birthdate').notEmpty().withMessage('Birth date is required').isDate().withMessage('Birth date must be a date'),
  check('gender')
    .notEmpty().withMessage('Gender is required')
    .isIn(['L', 'P']).withMessage('Invalid gender value. Should be either "L" or "P"'),
  check('photo')
    .optional({ nullable: true, checkFalsy: true })
    .custom((value, { req }) => {
      if (!value) {
        return true;
      }

      if (typeof value !== 'string' || value.indexOf('.') === -1) {
        throw new Error('Invalid data type or format for photo');
      }

      const validExtensions = ['png', 'jpg', 'jpeg'];
      const extension = value.split('.').pop().toLowerCase();

      if (!validExtensions.includes(extension)) {
        throw new Error('Photo must be a PNG or JPG file');
      }

      return true;
    }),
]

router.post('/karyawan/add', authenticateToken,
  KaryawanValidation,
  KaryawanController.addKaryawan
);

router.post('/karyawan/list', authenticateToken, KaryawanController.getKaryawanList);

router.put('/karyawan/update/:nip', authenticateToken,
  KaryawanValidation,
  KaryawanController.updateKaryawan
);

router.get('/karyawan/deactive/:nip', authenticateToken, KaryawanController.deactiveKaryawan);

module.exports = router;

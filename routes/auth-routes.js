const express = require('express');
const {check} = require('express-validator');
const router = express.Router();

const {signup, login, forgotPassword, resetPassword} = require('../controllers/auth/Auth-controller');
const fileUpload = require('../middleware/file-upload');

router.post('/signup',
fileUpload.single('image'),
[
    check('first_name').not().isEmpty(),
    check('last_name').not().isEmpty(),
    check('role').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({min: 6})
], signup);

router.post('/login', login);
router.post('/forgotpassword', forgotPassword);
router.post('/passwordreset/:resetToken', resetPassword);

module.exports = router;
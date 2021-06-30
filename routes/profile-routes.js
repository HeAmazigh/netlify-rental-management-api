const express = require('express');
const {check} = require('express-validator');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const {userProfile, profinInfo} = require('../controllers/profile/profile-controller');


router.use(checkAuth);

router.get('/', userProfile);
router.post('/profile',
[
    check('user_type').not().isEmpty(),
    check('company_type').not().isEmpty(),
    check('company_name').not().isEmpty(),
    check('rcs_number').not().isEmpty(),
    check('civility').not().isEmpty(),
    check('last_name').not().isEmpty(),
    check('first_name').not().isEmpty(),
    check('phone').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('address').not().isEmpty(),
    check('postal_code').not().isEmpty(),
    check('city').not().isEmpty(),
    check('country').not().isEmpty(),
], profinInfo);


module.exports = router;
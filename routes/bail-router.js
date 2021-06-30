const express = require('express');
const {check} = require('express-validator');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const {addBail, addBailinfo, getMyBails, getBailById} = require('../controllers/bails/bails-controller');
const {addLocataire} = require('../controllers/locataire/locataire-controller')


router.use(checkAuth);
router.get('/bail/:bailID', getBailById);
router.get('/', getMyBails);
router.post('/locataire', addLocataire);
router.post('/add/info',
[
    check('bail_id').not().isEmpty(),
    check('living_space').not().isEmpty(),
    check('kitchens').not().isEmpty(),
    check('num_bedroom').not().isEmpty(),
    check('num_bathroom').not().isEmpty(),
    check('num_bathroom_2').not().isEmpty(),
    check('num_wc').not().isEmpty(),
    check('year_construction').not().isEmpty(),
    check('type_heating').not().isEmpty(),
    check('hot_water_type').not().isEmpty(),
], addBailinfo);


router.post('/add',
[
    check('category').not().isEmpty(),
    check('type').not().isEmpty(),
    check('legal_regime').not().isEmpty(),
    check('destination').not().isEmpty(),
    check('num_pieces').not().isEmpty(),
    check('address').not().isEmpty(),
    check('postal_code').not().isEmpty(),
    check('city').not().isEmpty(),
], addBail);



module.exports = router;
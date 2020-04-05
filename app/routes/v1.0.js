const _ = require('lodash');
const router = require('express').Router();

const resError = require('../middleware/res-error');
const resSuccess = require('../middleware/res-success');

const userCtrl = require('../controllers/users.controller')();

router.use(resError);
router.use(resSuccess);

// ####### Health Check #########
router.get('/', (req, res) => res.status(200).send('Naya Studio API.'));
router.get('/health-check', (req, res) => res.status(200).send('Beat.'));

// ######### Signup Route #############
router.post('/signup', userCtrl.signup.bind(userCtrl));

module.exports = router;

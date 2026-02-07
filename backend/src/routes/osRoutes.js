const express = require ('express')
const auth = require('../middlewares/authMiddleware.js')
const router = express.Router();
const osController = require('../controllers/osController.js');
const authController = require('../controllers/authController');

router.post('/', auth, osController.create)

router.post('/register', authController.register);


router.post('/login', authController.login);

router.get('/', auth, osController.listAll)

router.get('/:id', auth, osController.getById)

router.patch('/:id/status', auth, osController.updateStatus);

module.exports = router
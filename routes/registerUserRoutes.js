const express = require('express');
const router = express.Router();
const registerController = require('../controllers/registerController');
const auth = require("../middlewares/auth");

router.post('/register',auth.checkUserRegisterOrNot, registerController.registerUser);

module.exports = router;
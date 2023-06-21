const express = require('express');

const resetPasswordController = require('../controllers/resetpassword');

const router = express.Router();

 
router.use('/forgotpassword', resetPasswordController.forgotPassword);
router.get('/resetpassword/:id', resetPasswordController.resetPassword);
router.get('/updatepassword/:rid', resetPasswordController.updatePassword);


module.exports = router
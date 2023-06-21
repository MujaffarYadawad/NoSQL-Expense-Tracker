const express = require('express')
const userAuthentication = require('../middleware/auth');
 

const expneseController =require('../controllers/expense');
const e = require('cors');
 
const router=express.Router();

router.post('/postExpenses', userAuthentication.authenticate, expneseController.postExpense);
router.get('/getAllExpenses', userAuthentication.authenticate, expneseController.getAllExpense);
router.delete('/deleteExpenses/:id', userAuthentication.authenticate, expneseController.deleteExpense);
//router.get('/download', userAuthentication.authenticate, expneseController.downloadExpense);

module.exports = router;
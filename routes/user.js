const express = require ('express')

const userController = require('../controllers/user')

const router = express.Router()

router.post('/postUser', userController.postUser);
router.post("/postLoginUser", userController.postLoginsUser);



module.exports = router
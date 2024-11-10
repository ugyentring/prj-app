const express = require('express');
const router = express.Router()
const userController = require("../controller/user");
const authController = require("../controller/authController");

router.post("/login", authController.login);
router.get('/logout', authController.logout);

// router.post('/verifiyEmail/:id', authController.verifyEmail)
// router.get('/verifiyEmail/:id', authController.getEmail)

router
    .route('/')
    .get(userController.getAllUsers)
    .post(userController.upload , userController.createUser)

router
    .route('/:id')
    .get(userController.getUserById)
    .patch(userController.updateUser)
    .delete(userController.deleteUser)


module.exports = router;
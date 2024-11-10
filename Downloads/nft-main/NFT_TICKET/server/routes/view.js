const express = require('express')
const router = express.Router()
const viewsController = require('./../controller/viewController')
// const authController = require('./../controllers/authController')

router.get('/', viewsController.getHome)
router.get('/login', viewsController.getLoginForm)
router.get('/signup', viewsController.getSignupForm)
router.get('/profile', viewsController.getProfile)
router.get('/event', viewsController.getContact)
router.get('/ticket', viewsController.getticket)


// router.get('/me', authController.protect, viewsController.getProfile)



module.exports = router;
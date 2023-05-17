const controller = require('../controllers/auth')
const validate = require('../controllers/auth.validate')
const express = require('express')
const router = express.Router()

const passport = require('passport')

const requireAuth = passport.authenticate('jwt', {
  session: false
})

const trimRequest = require('trim-request')
const rateLimit = require('express-rate-limit')

const otpLimitations = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 3,
  message: {
    message: "Action temporarily suspended. Please try again after an hour"
  }
})


/*
 * Auth routes
 */

/*
 * Register route
 */
router.post(
  '/api/v1/auth/register',
  trimRequest.all,
  validate.register,
  controller.register
)

/*
 * Verify route
 */
router.get(
  '/api/v1/auth/verify',
  trimRequest.all,
  controller.verify
)

router.post(
  '/api/v1/auth/resetPassword',
  otpLimitations,
  trimRequest.all,
  validate.resetPassword,
  controller.resetPassword
)

/*
 * Login route
 */
router.post(
  '/api/v1/auth/login',
  trimRequest.all,
  validate.login,
  controller.login
)

module.exports = router

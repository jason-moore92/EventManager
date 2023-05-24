const controller = require('../controllers/book_event')

const express = require('express')
const router = express.Router()
const trimRequest = require('trim-request')
const rateLimit = require('express-rate-limit')

require('../../config/passport')
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', {
  session: false
})

router.post(
  '/api/v1/book_event/add',
  requireAuth,
  trimRequest.all,
  controller.add
)

router.post(
  '/api/v1/book_event/update',
  requireAuth,
  trimRequest.all,
  controller.update
)

router.post(
  '/api/v1/book_event/delete',
  requireAuth,
  trimRequest.all,
  controller.delete
)

router.get(
  '/api/v1/book_event/getAll',
  requireAuth,
  trimRequest.all,
  controller.getAll
)

module.exports = router

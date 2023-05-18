const controller = require('../controllers/event_type')

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
  '/api/v1/event_type/add',
  requireAuth,
  trimRequest.all,
  controller.add
)

router.post(
  '/api/v1/event_type/update',
  requireAuth,
  trimRequest.all,
  controller.update
)

router.post(
  '/api/v1/event_type/delete',
  requireAuth,
  trimRequest.all,
  controller.delete
)

router.get(
  '/api/v1/event_type/getAll',
  requireAuth,
  trimRequest.all,
  controller.getAll
)

module.exports = router

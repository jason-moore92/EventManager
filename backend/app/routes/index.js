const express = require('express')
const router = express.Router()

// Load Auth route
router.use('/', require('./auth'))
router.use('/', require('./event_type'))
router.use('/', require('./event'))
router.use('/', require('./venue'))
router.use('/', require('./food_catalog'))


/*
 * Setup routes for index
 */
router.get('/', (req, res, next) => {
  res.render('index')
})

/*
 * Handle 404 error
 */
router.use('*', (req, res, next) => {
  res.status(404).json({
    errors: {
      msg: 'URL_NOT_FOUND'
    }
  })
})

module.exports = router

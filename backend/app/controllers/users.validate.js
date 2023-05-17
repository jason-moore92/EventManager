const { validationResult } = require('../middleware/utils')
const validator = require('validator')
const { check } = require('express-validator')
const sanitizer = require('sanitizer');


  const sanitizeValue = value =>{
       return sanitizer.escape(value) 
 }

/**
 * Validates create new item request
 */
exports.createItem = [
  check('firstName')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .customSanitizer(value =>{
      return sanitizeValue(value)
    }),
  check('email')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .isEmail()
    .withMessage('EMAIL_IS_NOT_VALID'),
  check('password')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .isLength({
      min: 5
    })
    .withMessage('PASSWORD_TOO_SHORT_MIN_5'),
  check('role')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .isIn(['user', 'admin'])
    .withMessage('USER_NOT_IN_KNOWN_ROLE'),
  check('phone')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .trim(),
  check('city')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .trim(),
  check('country')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .trim(),
  check('urlTwitter')
    .optional()
    .custom(v => (v === '' ? true : validator.isURL(v)))
    .withMessage('NOT_A_VALID_URL'),
  check('urlGitHub')
    .optional()
    .custom(v => (v === '' ? true : validator.isURL(v)))
    .withMessage('NOT_A_VALID_URL'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

exports.changePassword = [
  check('oldPassword')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .isLength({
      min: 8
    })
    .withMessage('PASSWORD_TOO_SHORT_MIN_8'),
  check('password')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .isLength({
      min: 8
    })
    .withMessage('PASSWORD_TOO_SHORT_MIN_8'),
  check('passwordConfirm')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .isLength({
      min: 8
    })
    .withMessage('PASSWORD_TOO_SHORT_MIN_8'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]


/**
 * Validates update item request
 */
exports.updateItem = [
  check('name')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .customSanitizer(value =>{
      return sanitizeValue(value)
    }),
  check('email')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('role')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('phone')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .trim(),
  check('city')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .trim(),
  check('country')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .trim(),
  check('urlTwitter')
    .optional()
    .custom(v => (v === '' ? true : validator.isURL(v)))
    .withMessage('NOT_A_VALID_URL'),
  check('urlGitHub')
    .optional()
    .custom(v => (v === '' ? true : validator.isURL(v)))
    .withMessage('NOT_A_VALID_URL'),
  check('id')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

/**
 * Validates get item request
 */
exports.getItem = [
  check('id')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

/**
 * Validates delete item request
 */
exports.deleteItem = [
  check('id')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

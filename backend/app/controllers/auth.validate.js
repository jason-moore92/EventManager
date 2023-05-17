const { validationResult } = require('../middleware/utils')
const { check } = require('express-validator')
const sanitizer = require('sanitizer');

const sanitizeValue = value => {
  return sanitizer.escape(value)
}

/**
 * Validates register request
 */
exports.register = [
  check('firstName')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .customSanitizer(value =>{
      return sanitizeValue(value)
    }),
  check('lastName')
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
    .customSanitizer(value =>{
      return sanitizeValue(value)
    }),
  check('phoneNumber')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .customSanitizer(value =>{
      return sanitizeValue(value)
    }),
  check('password')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .isLength({ min: 8 })
    .matches(
      /^(?=.*\d)(?=.*[a-zA-Z])[a-zA-Z\d@$.!%*#?&]/,
    )
    .withMessage('PASSWORD_TOO_SHORT_MIN_5'),
  check('role')
    .optional(),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

/**
 * Validates login request
 */
exports.login = [
  check('email')
    .exists()
    .withMessage('email is missing')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .customSanitizer(value => {
      return sanitizeValue(value)
    }),
  check('password')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .isLength({ min: 8 })
    .withMessage('PASSWORD_TOO_SHORT_MIN_5'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

/**
 * Validates reset password request
 */
exports.resetPassword = [
  check('newPassword')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .isLength({ min: 8 })
    .matches(
      /^(?=.*\d)(?=.*[a-zA-Z])[a-zA-Z\d@$.!%*#?&]/,
    )
    .withMessage('PASSWORD_TOO_SHORT_MIN_5'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

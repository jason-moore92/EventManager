const { validationResult } = require('express-validator')

/**
 * Builds error for validation files
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @param {Object} next - next object
 */
exports.validationResult = (req, res, next) => {
  try {
    validationResult(req).throw()
    if (req.body.email) {
      req.body.email = req.body.email.toLowerCase()
    }
    return next()
  } catch (err) {
    return this.handleError(res, this.buildErrObject(422, err.array()))
  }
}

/**
 * Handles error by printing to console in development env and builds and sends an error response
 * @param {Object} res - response object
 * @param {Object} err - error object
 */
exports.handleError = (res, err) => {
  // Prints error in console
  if (process.env.NODE_ENV === 'development') {
    console.log(err)
  }
  if (err.code == undefined) {
    err.code = 500;
    err.message = "Some unexpected error occured";
  }
  // Sends error to user
  res.status(err.code).json({
    success: false,
    code: err.code,
    message: err.message
  })
}

/**
 * Builds error object
 * @param {number} code - error code
 * @param {string} message - error text
 */
exports.buildErrObject = (code, message) => {
  return {
    code,
    message
  }
}
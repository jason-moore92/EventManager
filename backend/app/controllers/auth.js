const jwt = require('jsonwebtoken')
const uuid = require('uuid')
const { matchedData } = require('express-validator')
const i18n = require('i18n')

const User = require('../models/user')
const utils = require('../middleware/utils')
const auth = require('../middleware/auth')

/**
 * Registers a new user in database
 * @param {Object} req - request object
 */
const registerUser = async req => {
  return new Promise((resolve, reject) => {
    const user = new User({
      firstName: req.firstName,
      lastName: req.lastName,
      phoneNumber: req.phoneNumber,
      email: req.email,
      password: req.password,
      role: req.role,
    })
    user.save((err, item) => {
      if (err) {
        reject(utils.buildErrObject(422, err.message))
      }
      resolve(item)
    })
  })
}

const sendVerifyEmail = async () => {
	try {
		var html = fs.readFileSync("./public/email_templates/verify_email.html", { encoding: 'utf-8' });

		var template = handlebars.compile(html);
		var replacements = {
			verifyLink: 'https://pub.dev/',
		};
		var htmlToSend = template(replacements);
		return htmlToSend;
	} catch (error) {
		console.log(error);
		return null;
	}
};

/**
 * Generates a token
 * @param {Object} user - user object
 */
const generateToken = user => {
  // Gets expiration time
  const expiration =
    Math.floor(Date.now() / 1000) + 60 * process.env.JWT_EXPIRATION_IN_MINUTES

  // returns signed and encrypted token
  return auth.encrypt(
    jwt.sign(
      {
        data: {
          _id: user._id
        },
        exp: expiration
      },
      process.env.JWT_SECRET
    )
  )
}

/**
 * Gets user id from token
 * @param {string} token - Encrypted and encoded token
 */
const getUserIdFromToken = async token => {
  return new Promise((resolve, reject) => {
    // Decrypts, verifies and decode token
    jwt.verify(auth.decrypt(token), process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        reject(utils.buildErrObject(409, i18n.__('auth.verify.BAD_TOKEN')))
      }
      resolve(decoded.data._id)
    })
  })
}

/**
 * Checks if verification id exists for user
 * @param {string} id - verification id
 */
const verificationExists = async id => {
  return new Promise((resolve, reject) => {
    User.findOne(
      {
        _id: id,
        verified: false
      },
      (err, user) => {
        if (err) {
          reject(utils.buildErrObject(422, i18n.__('auth.verify.NOT_FOUND_OR_ALREADY_VERIFIED')))
        }
        if (!user) {
          reject(utils.buildErrObject(404, i18n.__('auth.verify.NOT_FOUND_OR_ALREADY_VERIFIED')))
        }
        resolve(user)
      }
    )
  })
}

/**
 * Verifies an user
 * @param {Object} user - user object
 */
const verifyUser = async user => {
  return new Promise((resolve, reject) => {
    user.verified = true
    user.save((err, item) => {
      if (err) {
        reject(utils.buildErrObject(422, err.message))
      }
      resolve(item)
    })
  })
}

exports.register = async (req, res, next) => {
  try {
    // Gets locale from header 'Accept-Language'
    const locale = req.getLocale()
    i18n.setLocale(locale)

    req = matchedData(req);

    // const user = await User.findOne({
    //   email: req.email.toLowerCase(),
    //   phoneNumber: req.phoneNumber,
    // })

    const user = await User.findOne({
      $or: [
        { email: req.email.toLowerCase() }, 
        { phoneNumber: req.phoneNumber }
      ]
    })

    if (!user) {
      const item = await registerUser(req)
      res.status(200).json({
        success: true,
        data: {
          user: item,
          token: generateToken(item)
        }
      })
    } else {
      res.status(409).json({ 
        success: false,
        message: i18n.__('auth.register.existUser')
      });
    }
  } catch (error) {
    next(error)
  }
}

/**
 * Verify function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.verify = async (req, res, next) => {
  try {
    // Gets locale from header 'Accept-Language'
    const locale = req.getLocale()
    i18n.setLocale(locale)

    let userId = await getUserIdFromToken(req.query.token)
    const user = await verificationExists(userId)
    res.status(200).json({
      success: true,
      data: await verifyUser(user)
    })
  } catch (error) {
    next(error)
  }
}

exports.resetPassword = async (req, res, next) => {
  try {
    // Gets locale from header 'Accept-Language'
    const locale = req.getLocale()
    i18n.setLocale(locale)

    let userId = await getUserIdFromToken(req.query.token)

    const user = await User.findOne({ _id: userId })

    if (user != null) {
      user.verified = true
      user.password = req.body.newPassword
      user.save()

      res.status(200).json({
        success: true,
        message: i18n.__('auth.resetPassword.SUCCESS')
      })
    } else {
      return res.status(500).json({ 
        success: false,
        message: i18n.__('auth.resetPassword.FAILED')
      });
    }
  } catch (error) {
    next(error)
  }
}

/**
 * Login function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.login = async (req, res, next) => {
  try {
    // Gets locale from header 'Accept-Language'
    const locale = req.getLocale()
    i18n.setLocale(locale)

    const data = matchedData(req)

    let user = await User.findOne({ email: data.email.toLowerCase() })

    if (!user) {
      return res.status(421).json({ 
        success: false,
        message: i18n.__('auth.login.NOT_EXIST')
      });
    }

    if (!user.verified) {
      return res.status(422).json({ 
        success: false,
        message: i18n.__('auth.login.NO_VERIFIED')
      });
    }

    const isPasswordMatch = await auth.checkPassword(data.password, user)
    if (!isPasswordMatch) {
      return res.status(409).json({ 
        success: false,
        message: i18n.__('auth.login.WORNG_PASSWORD')
      });
    } else {
      return res.status(200).json({
        success: true,
        data: {
          user: user,
          token: generateToken(user)
        }
      })
    }
  } catch (error) {
    next(error)
  }
}

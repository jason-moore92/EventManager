const model = require('../models/user')
const GeneratedStoreUsers = require('../models/storegeneratedlogins')
const uuid = require('uuid')
const { matchedData } = require('express-validator')
const utils = require('../middleware/utils')
const auth = require('../middleware/auth')
const db = require('../middleware/db')

const User = require('../models/user')
const communicator = require('../middleware/communication')


/*********************
 * Private functions *
 *********************/

/**
 * Creates a new item in database
 * @param {Object} req - request object
 */
const createItem = async req => {
  return new Promise((resolve, reject) => {
    const user = new model({
      name: req.name,
      email: req.email,
      password: req.password,
      role: req.role,
      phone: req.phone,
      city: req.city,
      country: req.country,
      verification: uuid.v4(),
      referredBy:req.referredBy
    })
    user.save((err, item) => {
      if (err) {
        reject(utils.buildErrObject(422, err.message))
      }
      // Removes properties with rest operator
      const removeProperties = ({
        // eslint-disable-next-line no-unused-vars
        password,
        // eslint-disable-next-line no-unused-vars
        blockExpires,
        // eslint-disable-next-line no-unused-vars
        loginAttempts,
        ...rest
      }) => rest
      resolve(removeProperties(item.toObject()))
    })
  })
}

/********************
 * Public functions *
 ********************/

/**
 * Get items function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getItems = async (req, res, next) => {
  try {
    const query = await db.checkQueryString(req.query)
    res.status(200).json(await db.getItems(req, model, query))
  } catch (error) {
    next(error)
  }
}

/**
 * Get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getItem = async (req, res, next) => {
  try {
    req = matchedData(req)
    const id = await utils.isIDGood(req.id)
    res.status(200).json(await db.getItem(id, model))
  } catch (error) {
    next(error)
  }
}

/**
 * Update item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.updateItem = async (req, res, next) => {
  try {
    req = matchedData(req)
    const id = await utils.isIDGood(req.id)
    const doesEmailExists = await emailer.emailExistsExcludingMyself(
      id,
      req.email
    )
    if (!doesEmailExists) {
      res.status(200).json(await db.updateItem(id, model, req))
    }
  } catch (error) {
    next(error)
  }
}

/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.createItem = async (req, res, next) => {
  try {
    // Gets locale from header 'Accept-Language'
    const locale = req.getLocale()
    req = matchedData(req)
    const doesEmailExists = await emailer.emailExists(req.email)
    if (!doesEmailExists) {
      const item = await createItem(req)
      emailer.sendRegistrationEmailMessage(locale, item)
      res.status(201).json(item)
    }
  } catch (error) {
    next(error)
  }
}

const findUser = async name => {
  return new Promise((resolve, reject) => {
    //console.log(name)
    User.findOne(
      {
        $or:[  {'name':name}, {'mobile':name} ]
      },
      'password loginAttempts blockExpires name email role verified verification',
      (err, item) => {
        //console.log(err)
        utils.itemNotFound(err, item, reject, 'USER_DOES_NOT_EXIST')
        resolve(item)
      }
    )
  })
}

exports.changePassword = async (req, res, next) => {
  try {
    // Gets locale from header 'Accept-Language'
    const locale = req.getLocale()
    //console.log("--------------------------------")
    let user = await model.findOne({
      _id: req.user._id
    }, {password: 1, name: 1, email: 1, mobile: 1})
    if (user == null)
      res.status(404).json({message: "USER_NOT_FOUND"})
    req = matchedData(req)
    console.log(req)
    if(req.password === req.passwordConfirm) {
      console.log(user)
      const isPasswordMatch = await auth.checkPassword(req.oldPassword, user)
      if(isPasswordMatch) {
        user.password = req.password
       

        let storeGeneratedLogin = await GeneratedStoreUsers.findOne({
          "adminDetails.userId": user._id,
          active: true
        })
        if(storeGeneratedLogin != null) {
          storeGeneratedLogin.active = false
          storeGeneratedLogin.save()
          user.save()
        } else {
          user.save()
        }
        await communicator.sendPasswordChangeCommunication(locale, user)
        res.status(201).json({message: "Password changed successfully"})
      } else {
        res.status(500).json({message: "ERROR"})
      }
    } else {
      res.status(500).json({message: "ERROR"})
    }
  } catch (error) {
    next(error)
  }
}

/**
 * Delete item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.deleteItem = async (req, res, next) => {
  try {
    req = matchedData(req)
    const id = await utils.isIDGood(req.id)
    res.status(200).json(await db.deleteItem(id, model))
  } catch (error) {
    next(error)
  }
}

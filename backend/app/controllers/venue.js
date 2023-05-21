const i18n = require('i18n')

const Venue = require('../models/venue')

exports.add = async (req, res, next) => {
  try {
     // Gets locale from header 'Accept-Language'
    const locale = req.getLocale()
    i18n.setLocale(locale)

    let exist = await Venue.findOne({ name: req.body.name });
    if (exist) {
      return res.status(400).send({ 
        "success": false, 
        "message": i18n.__('venue.add.Exist_Venue'),
      });
    }

    var venue = await Venue.create(req.body);
    if (venue) {
      return res.send({ "success": true, "data": venue });
    } else {
      return res.status(400).send({ "success": false, "message": i18n.__('common.error.Normal') });
    }
  } catch (error) {
    next(error)
  }
}

exports.update = async (req, res, next) => {
  try {
    var exist = await Venue.findOne({ _id: req.body["_id"] });
    if (!exist) {
      return res.status(400).send({ 
        "success": false, 
        "message": i18n.__('venue.update.Not_Exist')
      });
    }

    Venue.findByIdAndUpdate(req.body["_id"], req.body, { new: true, upsert: true }, async (err, doc, any) => {
      if (err) {
        return res.status(400).send({ "success": false, "message": i18n.__('common.error.Normal') });
      }
      return res.send({ "success": true, "data": doc });
    });
  } catch (error) {
    next(error)
  }
}

exports.delete = async (req, res, next) => {
  try {
    var exist = await Venue.findOne({ _id: req.body["_id"] });
    if (!exist) {
      return res.status(400).send({ 
        "success": false, 
        "message": i18n.__('venue.delete.Not_Exist')
      });
    }

    Venue.findOneAndDelete({ "_id": exist["_id"] }, async (err, doc, any) => { 
      if (err) {
        return res.status(400).send({ "success": false, "message": i18n.__('common.error.Normal') });
      }
      return res.send({ "success": true, "data": doc });
    })

    // exist.isDeleted = true;
    // Venue.findByIdAndUpdate(exist["_id"], exist, { new: true, upsert: true }, async (err, doc, any) => {
    //   if (err) {
    //     return res.status(400).send({ "success": false, "message": i18n.__('common.error.Normal') });
    //   }
    //   return res.send({ "success": true, "data": doc });
    // });
  } catch (error) {
    next(error)
  }
}

exports.getAll = async (req, res, next) => {
  try {
    var venues = await Venue.find();
    return res.send({ "success": true, "data": venues });
  } catch (error) {
    next(error)
  }
}
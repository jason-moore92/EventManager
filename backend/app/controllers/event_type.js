const i18n = require('i18n')

const EventType = require('../models/event_type')

exports.add = async (req, res, next) => {
  try {
     // Gets locale from header 'Accept-Language'
    const locale = req.getLocale()
    i18n.setLocale(locale)

    let exist = await EventType.findOne({ name: req.body.name });
    if (exist) {
      return res.status(400).send({ 
        "success": false, 
        "message": i18n.__('event.add.Exist_EventType'),
      });
    }

    var event = await EventType.create(req.body);
    if (event) {
      return res.send({ "success": true, "data": event });
    } else {
      return res.status(400).send({ "success": false, "message": i18n.__('common.error.Normal') });
    }
  } catch (error) {
    next(error)
  }
}

exports.update = async (req, res, next) => {
  try {
    var exist = await EventType.findOne({ _id: req.body["_id"] });
    if (!exist) {
      return res.status(400).send({ 
        "success": false, 
        "message": i18n.__('event.update.Not_Exist')
      });
    }

    EventType.findByIdAndUpdate(req.body["_id"], req.body, { new: true, upsert: true }, async (err, doc, any) => {
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
    var exist = await EventType.findOne({ _id: req.body["_id"] });
    if (!exist) {
      return res.status(400).send({ 
        "success": false, 
        "message": i18n.__('event.delete.Not_Exist')
      });
    }

    exist.isDeleted = true;
    EventType.findByIdAndUpdate(exist["_id"], exist, { new: true, upsert: true }, async (err, doc, any) => {
      if (err) {
        return res.status(400).send({ "success": false, "message": i18n.__('common.error.Normal') });
      }
      return res.send({ "success": true, "data": doc });
    });
  } catch (error) {
    next(error)
  }
}

exports.getAll = async (req, res, next) => {
  try {
    var events = await EventType.find({ isDeleted: false });
    console.log(events)
    return res.send({ "success": true, "data": events });
  } catch (error) {
    next(error)
  }
}
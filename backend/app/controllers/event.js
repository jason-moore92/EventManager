const i18n = require('i18n')

const Event = require('../models/event')

exports.add = async (req, res, next) => {
  try {
     // Gets locale from header 'Accept-Language'
    const locale = req.getLocale()
    i18n.setLocale(locale)

    console.log("events:---" , req.body)

    var event = await Event.create(req.body);
    console.log("=========================")
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
    var exist = await Event.findOne({ _id: req.body["_id"] });
    if (!exist) {
      return res.status(400).send({ 
        "success": false, 
        "message": i18n.__('event.update.Not_Exist')
      });
    }

    Event.findByIdAndUpdate(req.body["_id"], req.body, { new: true, upsert: true }, async (err, doc, any) => {
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
    var exist = await Event.findOne({ _id: req.body["_id"] });
    if (!exist) {
      return res.status(400).send({ 
        "success": false, 
        "message": i18n.__('event.delete.Not_Exist')
      });
    }

    exist.isDeleted = true;
    Event.findByIdAndUpdate(exist["_id"], exist, { new: true, upsert: true }, async (err, doc, any) => {
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
	  var match = {};
		match["isDeleted"] = false;
    
    const pipeline = [
      { $match: match },
      { 
        "$addFields": {
          "types": {
            "$map": {
              "input": "$types",
              "in": { "$toObjectId": "$$this" }
            }
          }
        }
      },
      {
        $lookup:
        {
          from: "event_types",
          localField: 'types',
          foreignField: '_id',
          as: "types"
        },
      },
    ];

    var events = await Event.aggregate(pipeline);
    
    return res.send({ "success": true, "data": events });
  } catch (error) {
    next(error)
  }
}
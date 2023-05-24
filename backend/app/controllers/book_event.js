const i18n = require('i18n')

const BookEvent = require('../models/book_event')

exports.add = async (req, res, next) => {
  try {
     // Gets locale from header 'Accept-Language'
    const locale = req.getLocale()
    i18n.setLocale(locale)

    let exist = await BookEvent.findOne({ number: req.body.number });
    if (exist) {
      return res.status(400).send({ 
        "success": false, 
        "message": i18n.__('book_event.add.Exist_BookEvent'),
      });
    }

    var event = await BookEvent.create(req.body);
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
    var exist = await BookEvent.findOne({ _id: req.body["_id"] });
    if (!exist) {
      return res.status(400).send({ 
        "success": false, 
        "message": i18n.__('book_event.update.Not_Exist')
      });
    }

    BookEvent.findByIdAndUpdate(req.body["_id"], req.body, { new: true, upsert: true }, async (err, doc, any) => {
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
    var exist = await BookEvent.findOne({ _id: req.body["_id"] });
    if (!exist) {
      return res.status(400).send({ 
        "success": false, 
        "message": i18n.__('book_event.delete.Not_Exist')
      });
    }

    BookEvent.findByIdAndDelete(exist["_id"], async (err, doc, any) => {
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
    
    const pipeline = [
      { $match: match },
      {
        $lookup: {
          from: "event_types",
          localField: 'events',
          foreignField: '_id',
          as: "events"
        },
      },
      {
        $lookup: {
          from: "food_catalogs",
          localField: 'foods',
          foreignField: '_id',
          as: "foods"
        },
      },
      {
        $lookup: {
          from: "equipment_catalogs",
          localField: 'equipments',
          foreignField: '_id',
          as: "equipments"
        },
      },
    ];

    var events = await BookEvent.aggregate(pipeline);
    
    return res.send({ "success": true, "data": events });
  } catch (error) {
    next(error)
  }
}
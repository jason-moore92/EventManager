const i18n = require('i18n')

const EquipmentCatalog = require('../models/equipment_catalog')

exports.add = async (req, res, next) => {
  try {
     // Gets locale from header 'Accept-Language'
    const locale = req.getLocale()
    i18n.setLocale(locale)

    let exist = await EquipmentCatalog.findOne({ name: req.body.name });
    if (exist) {
      return res.status(400).send({ 
        "success": false, 
        "message": i18n.__('equipment_catalog.add.Exist_EquipmentCatalog'),
      });
    }

    var eventType = await EquipmentCatalog.create(req.body);
    if (eventType) {
      return res.send({ "success": true, "data": eventType });
    } else {
      return res.status(400).send({ "success": false, "message": i18n.__('common.error.Normal') });
    }
  } catch (error) {
    next(error)
  }
}

exports.update = async (req, res, next) => {
  try {
    var exist = await EquipmentCatalog.findOne({ _id: req.body["_id"] });
    if (!exist) {
      return res.status(400).send({ 
        "success": false, 
        "message": i18n.__('equipment_catalog.update.Not_Exist')
      });
    }

    EquipmentCatalog.findByIdAndUpdate(req.body["_id"], req.body, { new: true, upsert: true }, async (err, doc, any) => {
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
    var exist = await EquipmentCatalog.findOne({ _id: req.body["_id"] });
    if (!exist) {
      return res.status(400).send({ 
        "success": false, 
        "message": i18n.__('equipment_catalog.delete.Not_Exist')
      });
    }

    exist.isDeleted = true;
    EquipmentCatalog.findByIdAndUpdate(exist["_id"], exist, { new: true, upsert: true }, async (err, doc, any) => {
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
    var events = await EquipmentCatalog.find({ isDeleted: false });
    return res.send({ "success": true, "data": events });
  } catch (error) {
    next(error)
  }
}
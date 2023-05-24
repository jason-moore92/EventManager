const mongoose = require('mongoose')
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const EquipmentCatalogSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    cost: {
      type: Number,
      required: true
    },
    enabled: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    versionKey: false,
    timestamps: true
  }
)

EquipmentCatalogSchema.index( { "name" : 1 }, { unique: true } )

EquipmentCatalogSchema.plugin(aggregatePaginate)
module.exports = mongoose.model('equipment_catalogs', EquipmentCatalogSchema)

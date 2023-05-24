const mongoose = require('mongoose')
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const FoodCatalogSchema = new mongoose.Schema(
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

FoodCatalogSchema.index( { "name" : 1 }, { unique: true } )

FoodCatalogSchema.plugin(aggregatePaginate)
module.exports = mongoose.model('food_catalogs', FoodCatalogSchema)

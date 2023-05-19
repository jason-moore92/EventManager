const mongoose = require('mongoose')
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const EventSchema = new mongoose.Schema(
  {
    types: { type: Array, required: true },
    enabled: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    versionKey: false,
    timestamps: true
  }
)

EventSchema.plugin(aggregatePaginate)
module.exports = mongoose.model('events', EventSchema)

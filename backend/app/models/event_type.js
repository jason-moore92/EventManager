const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const EventTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    cost: {
      type: Number,
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

EventTypeSchema.index( { "name" : 1 }, { unique: true } )


EventTypeSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('event_types', EventTypeSchema)

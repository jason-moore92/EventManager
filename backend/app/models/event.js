const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const EventSchema = new mongoose.Schema(
  {
    eventType: {
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

EventSchema.index( { "eventType" : 1 }, { unique: true } )


EventSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('Events', EventSchema)

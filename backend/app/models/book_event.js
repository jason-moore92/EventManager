const mongoose = require('mongoose')
const Schema = mongoose.Schema
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const BookEventSchema = new mongoose.Schema(
  {
    number: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'users' }, 
    venueId: { type: Schema.Types.ObjectId, ref: 'venues' }, 
    events: [
      {
        type: Schema.Types.ObjectId,
        ref: 'event_types'
      }, 
    ],
    "foods": [
      {
        type: Schema.Types.ObjectId,
        ref: 'food_catalogs'
      }, 
    ],
    "equipments": [
      {
        type: Schema.Types.ObjectId,
        ref: 'equipment_catalogs'
      }, 
    ],
    checkIndate: { type: Date, required: true },
    checkOutdate: { type: Date, required: true },
    numberOfGuests: { type: Number, required: true },
    totalCost: { type: Number, required: true },
    paymentStatus: { type: String, required: true },
  },
  {
    versionKey: false,
    timestamps: true
  }
)

BookEventSchema.plugin(aggregatePaginate)

module.exports = mongoose.model('book_events', BookEventSchema)

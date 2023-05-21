const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');
const validator = require('validator')
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const VenueSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    photos: { type: Array, default: [] },
    menity: { type: Array, default: [] },
  },
  {
    versionKey: false,
    timestamps: true
  }
)

VenueSchema.plugin(aggregatePaginate)

module.exports = mongoose.model('Venues', VenueSchema)

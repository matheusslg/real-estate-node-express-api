const mongoose = require('mongoose');
const mongooseUniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const CitySchema = new Schema({
    description: { type: String, required: true, unique: true },
    uf: { type: String, required: true },
    active: { type: Boolean, default: true }
}, { collection: 'cities' })

CitySchema.plugin(mongooseUniqueValidator);

const City = mongoose.model('city', CitySchema);

module.exports = City;
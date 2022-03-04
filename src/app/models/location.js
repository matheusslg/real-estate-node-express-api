const mongoose = require('mongoose');
const mongooseUniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const LocationSchema = new Schema({
    description: { type: String, required: true, unique: true },
    slugType: { type: Schema.Types.ObjectId, ref: 'slugTypes', unique: true },
    active: { type: Boolean, default: true }
}, { collection: 'locations' })

LocationSchema.plugin(mongooseUniqueValidator);

const Location = mongoose.model('location', LocationSchema);

module.exports = Location;
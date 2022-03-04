const mongoose = require('mongoose');
const mongooseUniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const SlugTypeSchema = new Schema({
    description: { type: String, required: true, unique: true },
    slug: { type: String, unique: true },
    type: { type: String, required: true },
    showOnApp: { type: Boolean, default: false },
    active: { type: Boolean, default: true }
}, { collection: 'slugTypes' })

SlugTypeSchema.plugin(mongooseUniqueValidator);

const SlugType = mongoose.model('slugTypes', SlugTypeSchema);

module.exports = SlugType;
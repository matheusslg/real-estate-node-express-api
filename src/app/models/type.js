const mongoose = require('mongoose');
const mongooseUniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const TypeSchema = new Schema({
    description: { type: String, required: true, unique: true },
    slugType: { type: Schema.Types.ObjectId, ref: 'slugTypes', unique: true },
    active: { type: Boolean, default: true }
}, { collection: 'types' })

TypeSchema.plugin(mongooseUniqueValidator);

const Type = mongoose.model('type', TypeSchema);

module.exports = Type;
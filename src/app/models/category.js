const mongoose = require('mongoose');
const mongooseUniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    description: { type: String, required: true, unique: true },
    slugType: { type: Schema.Types.ObjectId, ref: 'slugTypes', unique: true },
    active: { type: Boolean, default: true }
}, { collection: 'categories' })

CategorySchema.plugin(mongooseUniqueValidator);

const Category = mongoose.model('category', CategorySchema);

module.exports = Category;
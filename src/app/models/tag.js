const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TagSchema = new Schema({
    description: { type: String, required: true },
    active: { type: Boolean, default: true }
}, { collection: 'tags' })

const Tag = mongoose.model('tag', TagSchema);

module.exports = Tag;
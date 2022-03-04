const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FileSchema = new Schema({
    description: String,
    url: { type: String, required: true },
    isFeatured: { type: Boolean, default: false }
}, { collection: 'files' })

const File = mongoose.model('file', FileSchema);

module.exports = File;
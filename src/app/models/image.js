const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    description: String,
    fileName: { type: String, required: true },
    filePath: { type: String, required: true },
    isFeatured: { type: Boolean, default: false }
}, { collection: 'images' })

const Image = mongoose.model('image', ImageSchema);

module.exports = Image;
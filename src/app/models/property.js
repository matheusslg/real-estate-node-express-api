const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PropertySchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    address: String,
    locations: [{ type: Schema.Types.ObjectId, ref: 'location', required: true }],
    categories: [{ type: Schema.Types.ObjectId, ref: 'category', required: true }],
    types: [{ type: Schema.Types.ObjectId, ref: 'type', required: true }],
    city: { type: Schema.Types.ObjectId, ref: 'city', required: true },
    geolocation: String,
    bedrooms: { type: Number, default: 0 },
    toilets: { type: Number, default: 0 },
    garage: { type: Number, default: 0 },
    size: String,
    tags: [{ type: Schema.Types.ObjectId, ref: 'tag' }],
    images: [{ type: Schema.Types.ObjectId, ref: 'image' }],
    priceNumber: Number,
    priceCustom: String,
    featured: { type: Boolean, default: false },
    advise: String,
    active: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    createdAt: String,
    updatedAt: String,
}, { collection: 'properties' })

const Property = mongoose.model('property', PropertySchema);

module.exports = Property;
const mongoose = require('mongoose')
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema

mongoose.plugin(slug);
const Product = new Schema({
    // _id: {type: String},
    img: {type: String},
    name: {type : String},
    price: {type : String},
    description: {type : String},
    slug: { type: String, slug: 'name', unique: true }
},
{
    timestamps: true,
});
// Add plugins mongoose-delete
Product.plugin(mongooseDelete, { 
    deletedAt: true,
    overrideMethods: true });

module.exports = mongoose.model('Product', Product)
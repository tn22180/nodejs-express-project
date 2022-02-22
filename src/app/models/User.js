const mongoose = require('mongoose')
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema

mongoose.plugin(slug);
const User = new Schema({
    email: {type: String},
    password: {type: String},
    img: {type: String},
    phone: {type: String},
    name: {type : String},
    slug: { type: String, slug: 'name', unique: true }
},
{
    timestamps: true,
});
// Add plugins mongoose-delete
User.plugin(mongooseDelete, { 
    deletedAt: true,
    overrideMethods: true });

module.exports = mongoose.model('user', User)
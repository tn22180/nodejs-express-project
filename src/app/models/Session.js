const mongoose = require('mongoose')
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema

const Session = new Schema({
   _id: { type: String },
   cart: { type: Object }
},
{   
    _id: false,
    timestamps: true,
});
// Add plugins mongoose-delete
Session.plugin(mongooseDelete, { 
    deletedAt: true,
    overrideMethods: true });

module.exports = mongoose.model('session', Session)
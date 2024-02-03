const mongoose = require('mongoose');

const callSchema = new mongoose.Schema({
  callStatus: {
    type: String,
    required: true,
    default:null
  },
  callDate: {
    type: Date,
    required: true,
    default:null
  },
});

const userSchema = new mongoose.Schema({
  phone_number: String,
  priority: {
    type: String,
    required: false,
    default:null
  },
  token: {
    type: String,
    required: false
  },
  callHistory:[callSchema]
});

module.exports = mongoose.model('user', userSchema);

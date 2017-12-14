'use strict';

const mongoose = require('mongoose');

const synthCompanySchema = mongoose.Schema({
  name : {
    type : String,
    required : true,
    unique : true,
  },
  location : {
    type : String,
    required : true,
  },
  yearEstablished : {
    type : Number,
  },
  digitalAnalogOrBoth : {
    type : String,
  },
});

module.exports = mongoose.model('synthCompany', synthCompanySchema);

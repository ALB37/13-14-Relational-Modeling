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
  synths : [{type : mongoose.Schema.Types.ObjectId,
    ref: 'synth'}],
},{
  usePushEach : true,
});

module.exports = mongoose.model('synthCompany', synthCompanySchema);

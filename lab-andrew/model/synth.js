'use strict';

const mongoose = require('mongoose');
const httpErrors = require('http-errors');
const Company = require('../model/synthcompany');

const synthSchema = mongoose.Schema({
  name : {
    type : String,
    required : true,
    unique : true,
  },
  polyphony : {
    type : String,
    required : true,
  },
  yearReleased : {
    type : Number,
  },
  digitalAnalogOrHybrid : {
    type : String,
  },
  synthCompany : {type : mongoose.Schema.Types.ObjectId,
    ref: 'synthCompany'},
});

synthSchema.pre('save', function(done){
  return Company.findById(this.synthCompany)
    .then(companyFound => {
      if (!companyFound){
        throw httpErrors(404, 'company not found');
      }
      companyFound.synths.push(this._id);
      return companyFound.save();
    })
    .then(() => done());
});

synthSchema.post('remove', (document, done) => {
  return Company.findById(document.synthCompany)
    .then(companyFound => {
      if (!companyFound){
        throw httpErrors(404, 'company not found');
      }
      companyFound.synths = companyFound.synths.filter(synth => {
        return synth._id.toString() !== document._id.toString();
      });
      return companyFound.save();
    })
    .then(() => done())
    .catch(done);
});

module.exports = mongoose.model('synth', synthSchema);

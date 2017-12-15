'use strict';

const faker = require('faker');
const companyMock = require('./synthcompany-mock');
const Synth = require('../../model/synth');

const synthMock = module.exports = {};

synthMock.create = () => {
  let mock = {};

  return companyMock.create()
    .then(company => {
      mock.company = company;

      return new Synth({
        name : faker.lorem.words(1),
        polyphony : faker.random.number(),
        digitalAnalogOrHybrid : faker.lorem.words(1),
        synthCompany : company._id,
      }).save();
    })
    .then(synth => {
      mock.synth = synth;
      return mock;
    });
};

synthMock.remove = () => Promise.all([
  Synth.remove({}),
  companyMock.remove(),
]);

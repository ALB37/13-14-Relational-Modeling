'use strict';

const faker = require('faker');
const Company = require('../../model/synthcompany');

const companyMock = module.exports = {};

companyMock.create = () => {
  return new Company({
    name : faker.lorem.words(1),
    location : faker.lorem.words(1),
  }).save();
};

companyMock.createMany = (howMany) => {
  return Promise.all(new Array(howMany).fill(0)
    .map(() => companyMock.create()));
};

companyMock.remove = () => Company.remove({});

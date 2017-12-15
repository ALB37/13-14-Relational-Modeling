'use strict';

const Company = require('../model/synthcompany');
const Synth = require('../model/synth');
const {Router} = require('express');
const logger = require('../lib/logger');
const httpErrors = require('http-errors');
const jsonParser = require('body-parser').json();
const companyRouter = module.exports = new Router();

companyRouter.post('/api/company', jsonParser, (request, response, next) => {

  if (!request.body.name || !request.body.location) {
    logger.log('info', 'POST - responding with a 400');
    return next(httpErrors(400, 'body and content are required'));
  }

  return new Company(request.body).save()
    .then(company => response.json(company))
    .catch(next);
});

companyRouter.get('/api/company/:id', (request, response, next) => {

  return Company.findById(request.params.id)
    .then(company => {
      if (!company){
        throw httpErrors(404, 'company not found');
      }
      logger.log('info', 'GET - Returning a 200 status code');
      logger.log('info', company);
      return response.json(company);
    })
    .catch(next);
});

companyRouter.put('/api/company/:id', jsonParser, (request, response, next) => {

  return Company.findById(request.params.id)
    .then(company => {
      if (!request.body.name || !request.body.location) {
        throw httpErrors(400, 'body and content are required');
      }
      if (!company){
        throw httpErrors(404, 'company not found');
      }
      company.set({
        name: `${request.body.name}`,
        location: `${request.body.location}`,
      });
      if (request.body.yearEstablished){
        company.set({
          yearEstablished: `${request.body.yearEstablished}`,
        });
      }
      if (request.body.digitalAnalogOrBoth){
        company.set({
          digitalAnalogOrBoth: `${request.body.digitalAnalogOrBoth}`,
        });
      }
      logger.log('info', 'PUT - Returning a 200 status code');
      logger.log('info', company);
      return company.save()
        .then(updatedCompany => response.json(updatedCompany))
        .catch(next);
    })
    .catch(next);
});

companyRouter.delete('/api/company/:id', (request, response, next) => {
  return Company.findByIdAndRemove(request.params.id)
    .then(company => {
      if (!company){
        throw httpErrors(404, 'company not found');
      }
      if (company.synths.length){
        throw httpErrors(401, 'company has active relations, delete unauthorized');
      }
      logger.log('info', 'DELETE - Returning a 200 status code');
      logger.log('info', company);
      return response.sendStatus(204);
    })
    .catch(next);
});

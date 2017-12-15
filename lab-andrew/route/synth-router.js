'use strict';

const Synth = require('../model/synth');
const {Router} = require('express');
const logger = require('../lib/logger');
const httpErrors = require('http-errors');
const jsonParser = require('body-parser').json();
const synthRouter = module.exports = new Router();

synthRouter.post('/api/synth', jsonParser, (request, response, next) => {

  if (!request.body.name || !request.body.polyphony || !request.body.synthCompany) {
    logger.log('info', 'POST - responding with a 400');
    return next(httpErrors(400, 'body and required content is required'));
  }

  return new Synth(request.body).save()
    .then(synth => response.json(synth))
    .catch(next);
});

synthRouter.get('/api/synth/:id', (request, response, next) => {

  return Synth.findById(request.params.id)
    .then(synth => {
      if (!synth){
        throw httpErrors(404, 'synth not found');
      }
      logger.log('info', 'GET - Returning a 200 status code');
      logger.log('info', synth);
      return response.json(synth);
    })
    .catch(next);
});

synthRouter.put('/api/synth/:id', jsonParser, (request, response, next) => {

  return Synth.findById(request.params.id)
    .then(synth => {
      if (!request.body.name || !request.body.polyphony || !request.body.synthCompany) {
        throw httpErrors(400, 'body and required content is required');
      }
      if (!synth){
        throw httpErrors(404, 'synth not found');
      }
      synth.set({
        name: `${request.body.name}`,
        polyphony: `${request.body.polyphony}`,
        synthCompany: `${request.body.synthCompany}`,
      });
      if (request.body.yearReleased){
        synth.set({
          yearReleased: `${request.body.yearReleased}`,
        });
      }
      if (request.body.digitalAnalogOrHybrid){
        synth.set({
          digitalAnalogOrHybrid: `${request.body.digitalAnaldigitalAnalogOrHybrid}`,
        });
      }
      logger.log('info', 'PUT - Returning a 200 status code');
      logger.log('info', synth);
      return synth.save()
        .then(updatedSynth => response.json(updatedSynth))
        .catch(next);
    })
    .catch(next);
});

synthRouter.delete('/api/synth/:id', (request, response, next) => {
  return Synth.findByIdAndRemove(request.params.id)
    .then(synth => {
      if (!synth){
        throw httpErrors(404, 'synth not found');
      }
      logger.log('info', 'DELETE - Returning a 200 status code');
      logger.log('info', synth);
      return response.sendStatus(204);
    })
    .catch(next);
});

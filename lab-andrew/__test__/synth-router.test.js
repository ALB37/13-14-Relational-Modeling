'use strict';

require('./lib/setup');

const server = require('../lib/server');
const superagent = require('superagent');
const faker = require('faker');
const synthMock = require('./lib/synth-mock');
const companyMock = require('./lib/synthcompany-mock');
const Synth = require('../model/synth');

const PORT = process.env.PORT;

const __API_URL__ = `http://localhost:${PORT}/api/synth`;

describe('/api/synth', () => {
  beforeAll(server.start);
  afterEach(synthMock.remove);
  afterAll(server.stop);

  describe('POST /api/synth', () => {
    test('POST should respond with 200 status code and a body if no errors', () => {
      let someCompany = null;
      return companyMock.create()
        .then(mock => {
          someCompany = mock;

          let synthPost = {
            name : faker.lorem.words(1),
            polyphony : faker.random.number(),
            yearReleased : faker.random.number(),
            digitalAnalogOrHybrid : 'digital',
            synthCompany : mock._id,
          };
          return superagent.post(`${__API_URL__}`)
            .send(synthPost)
            .then(response => {
              expect(response.status).toEqual(200);
              expect(response.body.name).toEqual(synthPost.name);
              expect(response.body.polyphony).toEqual(synthPost.polyphony);
              expect(response.body.yearReleased).toEqual(synthPost.yearReleased);
              expect(response.body.digitalAnalogOrHybrid).toEqual('digital');
              expect(response.body.synthCompany).toEqual(someCompany._id.toString());
              expect(response.body._id).toBeTruthy();
            });
        });
    });

    test('POST should respond with 400 if no body or invalid body request', () => {
      return superagent.post(`${__API_URL__}`)
        .catch(response => {
          expect(response.status).toEqual(400);
        });
    });

    test('POST should respond with 409 if request duplicates unique parameter', () => {
      let someSynth = null;
      let someCompany = null;
      return synthMock.create()
        .then(mock => {
          someSynth = mock.synth;
          someCompany = mock.company;
          return superagent.post(`${__API_URL__}`)
            .send({
              name : someSynth.name,
              polyphony : someSynth.polyphony,
              synthCompany : someCompany._id,
            })
            .catch(response => {
              expect(response.status).toEqual(409);
            });
        });
    });
  });

  describe('GET /api/synth', () => {

    test('GET should respond with 200 status code and synth if no errors when URL includes synth id; checking that a known value that is expected is returned', () => {
      let synthTest = null;

      return synthMock.create()
        .then(mock => {
          synthTest = mock.synth;
          return superagent.get(`${__API_URL__}/${mock.synth._id}`);
        })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body._id).toEqual(synthTest._id.toString());
          expect(response.body.name).toEqual(synthTest.name);
          expect(response.body.polyphony).toEqual(synthTest.polyphony);
          expect(response.body.yearReleased).toEqual(synthTest.yearReleased);
          expect(response.body.digitalAnalogOrHybrid).toEqual(synthTest.digitalAnalogOrHybrid);
        });
    });

    test('GET should respond with 404 if the id queried does not exist', () => {
      return superagent.get(`${__API_URL__}/5a2f38171865f60a35e145ff`)
        .catch(response => {
          expect(response.status).toEqual(404);
        });
    });
  });

  describe('PUT /api/synth', () => {

    test('PUT should respond with 200 and updated synth if successful', () => {
      let someCompany = null;
      let bodyId = null;
      return synthMock.create()
        .then(mock => {
          someCompany = mock.company;
          bodyId = mock.synth._id;
          let synthPut = {
            name : faker.lorem.words(1),
            polyphony : faker.random.number(),
            yearReleased : faker.random.number(),
            digitalAnalogOrHybrid : faker.lorem.words(1),
            synthCompany : someCompany._id,
          };
          return superagent.put(`${__API_URL__}/${bodyId}`)
            .send(synthPut)
            .then(response => {
              expect(response.status).toEqual(200);
              expect(response.body.name).toEqual(synthPut.name);
              expect(response.body.polyphony).toEqual(synthPut.polyphony);
              expect(response.body.yearReleased).toEqual(synthPut.yearReleased);
              expect(response.body.digitalAnalogOrHybrid).toEqual(synthPut.digitalAnalogOrHybrid);
              expect(response.body.synthCompany).toEqual(someCompany._id.toString());
              expect(response.body._id).toEqual(bodyId.toString());
            });
        });
    });

    test('PUT should respond with 400 if no body or invalid body request', () => {
      return synthMock.create()
        .then(mock => superagent.put(`${__API_URL__}/${mock.synth._id}`)
          .catch(response => {
            expect(response.status).toEqual(400);
          })
        );
    });

    test('PUT should respond with 404 if invalid id provided', () => {
      let someCompany = null;
      return synthMock.create()
        .then(mock => {
          someCompany = mock.company;
          let synthPut = {
            name : faker.lorem.words(1),
            polyphony : faker.random.number(),
            synthCompany : someCompany._id,
          };
          return superagent.put(`${__API_URL__}/5a2f38171865f60a35e145ff`)
            .send(synthPut)
            .catch(response => {
              expect(response.status).toEqual(404);
            });
        });
    });

    test('PUT should respond with 409 if request duplicates unique parameter', () => {
      let someSynth = null;
      let companyId = null;
      return synthMock.create()
        .then(mock => {
          companyId = mock.company._id;
          someSynth = mock.synth;
          return new Synth({
            name : 'Prophet5',
            polyphony : 5,
            synthCompany : companyId,
          }).save()
            .then(() => superagent.put(`${__API_URL__}/${someSynth._id}`)
              .send({name : 'Prophet5', polyphony : 5, synthCompany : companyId})
              .catch(response => {
                expect(response.status).toEqual(409);
              })
            );
        });
    });
  });

  describe('DELETE /api/synth', () => {

    test('DELETE should respond with a 404 message if invalid id provided', () => {
      return superagent.delete(`${__API_URL__}/5a2f38171865f60a35e145ff`)
        .catch(response => {
          expect(response.status).toEqual(404);
        });
    });

    test('DELETE should respond with a 204 message if successful', () => {
      return synthMock.create()
        .then(mock => {
          return superagent.delete(`${__API_URL__}/${mock.synth._id}`);
        })
        .then(response => {
          expect(response.status).toEqual(204);
        });
    });
  });

});

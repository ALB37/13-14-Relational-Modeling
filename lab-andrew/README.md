# Lab 14 Express and Mongo two resource RESTful API

## Overview

This API is a RESTful Synth API. It exists so you can create virtual companies and retrieve and delete them from memory as well as synthesizers made by that company. They will have a one to many relationship (one company may potentially make many synths). It is built using express and mongo.

## Getting Started

To get started using this application, familiarity with node and npm, as well as git is assumed. It is also assumed that you have a current version of mongodb. Fork/clone this repo to your machine, and do an `npm install`. You will need to set up a .env file (saved in the root directory of this project) with the PORT you would like to use (i.e. PORT=3000). To this file you should also add a MONGODB_URI variable set to the path to `mongodb://localhost/testing`.

Install jest if you do not have it globally installed with `npm i jest`. In the terminal, navigate to the project folder. Open another new tab in the terminal and in that tab run the command `npm run dbon`. To run the tests, in the original terminal tab type `npm run test`.

## Modules

There is a function from index.js which calls the server.js start function. There are two router modules for routing http requests: the synthcompany-router.js module and the synth-router.js module. These contain most of the functionality of this app. It uses the synthcompany.js/synth.js model to create new Company or Synth objects when a POST request is submitted. This uses the mongoose .save() method, which saves that object to mongodb. Furthermore, the synth module will also update the company to which it belongs (adding its own id to the company's synths) when posting a new synth or deleting a synth. synthcompany-router.js/synth-router.js also supplies the functionality which returns the companies/synths when a GET request is submitted, updates a specific company/synth when a PUT request is submitted, and deletes a company/synth when a DELETE request is submitted, and handles any errors. All that is exported from the server.js file is server.start and server.stop. There is a logger-middleware which is required in by express in the server. All requests to the API hit this logger which logs the actions in the log files. This then passes to the actual routing functionality (get, put, post and delete methods). If any errors occur during routing, they get passed to the error handling middleware (which is also required into express in server.js) which is parsed and handled from the modules exported from error-middleware.js. Logging is performed by the logger-middleware module, which is the first path in all routes. Tests are performed by the synth-router.test and synthcompany-router.test modules which use the synth-mock and synthcompany-mock modules to instantiate and imitate the real world RESTful behavior of this API.

## Making Requests to the API

#### Company
To start the server run `npm run start`. To make a GET request, the path will be '__server_address__/api/company/:id', e.g. 'http://localhost:3000/api/company/:id', and the company with that ID will be returned along with a success message. A POST request can be made, which expects a JSON object in the form of '{"name":"`<company's name>`","location":"`<where the company is located/originated>`","yearEstablished":"`<number corresponding to the year of establishment>`","digitalAnalogOrBoth":"`<what kind of synths the company specializes in>`"}' and a new Company will be created with a unique ID. Only the name and location are required, and the name must be unique. POST and PUT requests which duplicate existing names will be rejected with a 409 error. A PUT request will work similarly to the POST request, however a valid company ID must be supplied. A DELETE request can be made with the same route as a GET request with an ID; it will delete the company which has that ID. Any improper requests will be returned with an error code corresponding to the type of error, for instance, an improper request will be returned with a 400, an invalid ID or invalid API path will be returned with a 404, and any miscellaneous errors will be returned with a 500.
#### Synth
To make a an API request for synths, it will be mostly the same as making API requests for companies, however, to make a post, a company ID is required. The API path is also __server_address__/api/synths/:id instead. The keys which may be set on Synth documents are name, a string which must be unique and is required, polyphony, a number which is also reqired, yearReleased, a number, and digitalAnalogOrHybrid, a string. As previously mentioned, the ID of an existing company is also required by the key synthCompany.

## Technology/Credits

Created by Andrew Bloom. This app is being logged with winston and is using superagent and jest for testing server requests. Server built with express and persistence managed by mongoose/mongodb.

# Lab 13 Express and Mongo two resource RESTful API

## Overview

This API is a RESTful Synth Company API. It exists so you can create virtual companies and retrieve and delete them from memory. It is built using express and mongo.

## Getting Started

To get started using this applicompanyion, familiarity with node and npm, as well as git is assumed. It is also assumed that you have a current version of mongodb. Fork/clone this repo to your machine, and do an `npm install`. You will need to set up a .env file (saved in the root directory of this project) with the PORT you would like to use (i.e. PORT=3000). To this file you should also add a MONGODB_URI variable set to the path to `mongodb://localhost/testing`.

Install jest if you do not have it globally installed with `npm i jest`. In the terminal, navigate to the project folder. Open another new tab in the terminal and in that tab run the command `npm run dbon`. To run the tests, in the original terminal tab type `npm run test`.

## Modules

There is a function from index.js which calls the server.js start function. There is a synthcompany-router.js module, which contains most of the functionality of this app. It uses the synthcompany.js model to create new Company objects when a POST request is submitted. This uses the mongoose .save() method, which saves that object to mongodb. synthcompany-router.js also supplies the functionality which returns the companies when a GET request is submitted, updates a specific company when a PUT request is submitted, and deletes a company when a DELETE request is submitted, and handles any errors. All that is exported from the server.js file is server.start and server.stop. There is a logger-middleware which is required in by express in the server. All requests to the API hit this logger which logs the actions in the log files. This then passes to the actual routing functionality (get, put, post and delete methods). If any errors occur during routing, they get passed to the error handling middleware (which is also required into express in server.js) which is parsed and handled from the modules exported from error-middleware.js.

## Making Requests to the API

To start the server run `npm run start`. To make a GET request, the path will be '__server_address__/api/company/:id', e.g. 'http://localhost:3000/api/company/:id', and the company with that ID will be returned along with a success message. A POST request can be made, which expects a JSON object in the form of '{"name":"`<company's name>`","location":"`<where the company is located/originated>`","yearEstablished":"`<number corresponding to the year of establishment>`","digitalAnalogOrBoth":"`<what kind of synths the company specializes in>`"}' and a new Company will be created with a unique ID. Only the name and location are required, and the name must be unique. POST and PUT requests which duplicate existing names will be rejected with a 409 error. A PUT request will work similarly to the POST request, however a valid company ID must be supplied. A DELETE request can be made with the same route as a GET request with an ID; it will delete the company which has that ID.

## Technology/Credits

Created by Andrew Bloom. This app is being logged with winston and is using superagent and jest for testing server requests. Server built with express and persistence managed by mongoose/mongodb.

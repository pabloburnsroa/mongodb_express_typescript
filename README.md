# Building a REST API with Node.js, Express, TypeScript && MongoDB

## OBJECTIVES

Learn how to build a REST API using express & typescript and connect it to an external database such as MongoDB.

## SETUP

- First, lets create a package.json file using `npm init --yess`
- Create a basic express server first - install dependencies: `npm i express dotenv nodemon`
- Create an app.js file and setup a basic express server.

```
const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT;

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
```

- Add the following script in package.json: `"dev": "nodemon src/app.js"` and run the server using `npm run dev`.
- Next we can start to move over to TypeScript.
- Install the following dependencies: `npm i typescript @types/express @types/node -D`
- Generate a tsconfig.json file using the following terminal command : `npx tsc --init`.
- Make sure outDir is enabled so the build is compiled in dist folder.

## Connecting to MongoDB

TODO

## Setting up logging framework `Pino`

- `npm i pino pino-pretty`
-

## Routes

- Routes folder will be responsbile for taking any http requests and forwarding them on to a controller.

What routes do we need?

## Middleware

### validateResource.ts

This middleware will validate a request with a schema.
Define a variable validate that takes in schema, which will return another function - the next function takes req,res,next objects that will validate the req object against the schema. - Currying function

## Models

### Using `Mongoose` to model our application data

## User Controller

Handler for creating a user

```
CODE GOES HERE
```

## User Service

TODO

## User Schema

The user schema will validate the user endpoints passed through the createUserHandler controller.

# Session Management

Managing user sessions

## Session Handler

createUserSessionHandler

- Validate a user's password
- Create a session
- Create access token
- Create refresh token
- return access / refresh token

## JWT

- Returning access token to client side once user verified
- We will be using a RSA SHA256 algorithm for signing - private/public key...

### What happens if access token is valid or expired?

- if not valid, return unauthorized error
- if valid, check if token is expired
- if expired, is valid refresh token included in request?
- if valid refresh token included, issue new access token and proceed to route handler

# Product Route / Handler ...

TODO

# Testing

TODO

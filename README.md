# Texas Voting Platform

[![Build Status](https://travis-ci.org/regolithed/tx-voting-platform.svg?branch=master)](https://travis-ci.org/regolithed/tx-voting-platform)
[![Stories in Ready](https://badge.waffle.io/regolithed/tx-voting-platform.svg?label=ready&title=Ready)](http://waffle.io/regolithed/tx-voting-platform)

> A Texas Voting Platform

## Table of Contents

1. [Requirements](#requirements)
1. [Development](#development)
    1. [Environment Variables](#environment-variables)
    1. [Installing Dependencies](#installing-dependencies)
    1. [Linting Setup](#linting-setup)
    1. [Tasks](#tasks)
    1. [Database](#database)
1. [Team](#team)
1. [Contributing](#contributing)


## Requirements

- Node 5.6
- Postgres 9.2


## Development

### Environment Variables
Bedrock utilizes [dotenv](https://github.com/motdotla/dotenv) for environment variables. Create a file called ```.env``` in the root directory. Add environment-specific variables on new lines in the form of NAME=VALUE. For example:
```sh
DB_HOST=localhost
DB_USER=root
DB_PASS=s1mpl3
```

```process.env``` now has the keys and values you defined in your .env file.

```sh
db.connect({
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS
});
```
To load the config in your application:
```js
require('dotenv').config();
```

### Installing Dependencies & Running
From within the root directory:

```sh
npm install
```

### Linting Setup
ESLint is used for linting as it plays nicely with React and JSX. Bedrock linting adheres to the [Airbnb Stlye Guide](https://github.com/airbnb/javascript) and the react plugin (*both are included as dev-dependencies*). The ESLint settings can be seen in ```.eslintrc.json```. 
First, install ESLint globally:
```sh
npm install -g eslint
```
Next, add the following packages for integration with SublimeText. The easiest way to add these is via "**Package Control**":
- [SublimeLinter](https://github.com/SublimeLinter/SublimeLinter3) Note: The github repository name is “SublimeLinter3”, but the plugin name remains “**SublimeLinter**.”
- [SublimeLinter-eslint](https://github.com/roadhump/SublimeLinter-eslint)

**Note: Restart Sublime Text!!!**

### Tasks
From within the root directory:

```sh
// Run local development environment
npm start

// Run tests
npm test
```

### Database
From within the root directory

```sh
// Intialize postgres database
initdb db/

// Create Local Databases
createdb development
createdb test

// Verify knex CLI
knex --version
// If not installed
npm install knex -g

// Get latest version of database
knex migrate:latest

//If testing
knex migrate:latest --env test

// Update database
knex migrate:make addNewFeatureNameToTableName
```
An Example migration file

```sh
exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.table('todos', (table) => {
      table.string('somethingElse').notNullable();
    }),
  ]);
};

exports.down = (knex, Promise) => {
  return Promise.all([
    knex.schema.table('todos', (table) => {
      table.dropColumn('somethingElse');
    }),
  ]);
};
```

### Roadmap

View the project roadmap [here](https://github.com/regolithed/react-bedrock/issues).

## Team

  - **Product Owner**: Stephen Straus
  - **Scrum Master**: Clay Branch
  - **Development Team Members**: Andrew Moon, Dylan Swoope, Justin Seiter


## Contributing

See [CONTRIBUTING.md](https://github.com/regolithed/react-bedrock/blob/master/CONTRIBUTING.md) for contribution guidelines.

## System Layout

![Alt text](public/layout.png?raw=true "System Diagram")

## Credits

TexansVote icon courtesy of: [Shooting Star by Creative Stall from the Noun Project](https://thenounproject.com/search/?q=star&i=382314)

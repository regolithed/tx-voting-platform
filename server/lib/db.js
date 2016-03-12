// // Requires knexfile
// const config = require('../../knexfile');

// // Sets environment to either NODE_ENV or development
// const env = process.env.NODE_ENV || 'development';

// // Sets up postgres with knex and the environment
// const pg = require('knex')(config[env]);

// module.exports = pg;
const DbMocker = require('./db-mocker');

const collections = {
  entries: {
    mocks: [
      {
        embedID: 'fICcd-okQEs',
        thumbnailURL: 'https://i.ytimg.com/vi/fICcd-okQEs/hqdefault.jpg',
        publishedAt: '2010-03-23T07:25:42.000Z',
        title: '#CareLikeCrazy About Student Loans',
        description: "Do you #CareLikeCrazy about voting rights? Women's rights?",
      },
    ],
    delay: 100,
  },
};

module.exports = new DbMocker(collections);

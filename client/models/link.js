const ModelMocker = require('../lib/model-mocker');
const mockData = {
  mocks: [
    {
      publishedAt: '2010-03-23T07:25:42.000Z',
      title: 'WCW Nitro: March 16th 1998: Goldberg vs. Lodi',
      description: 'Goldberg takes on The Flock\'s resident sign man.',
    },
    {
      publishedAt: '2014-11-19T14:00:18.000Z',
      title: 'Mark Ronson - Uptown Funk ft. Bruno Mars',
      description: 'Mark Ronson\'s official music video for "Uptown Funk" ft. Bruno Mars.',
    },
  ],
  delay: 100,
};

const MockLink = new ModelMocker(mockData);
const linkInfo = {
  title: 'prebuilt stuff',
  description: 'description',
  stats: {
    views: 500,
  },
};

const Link = {
  fetch: () => MockLink.read(),
  create: (link) => MockLink.create(link),
  getInfo: () => {
    return Promise.resolve(linkInfo);
  },
};

module.exports = Link;

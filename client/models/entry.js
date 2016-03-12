const request = require('../lib/request.js');

const processData = (data) => {
  const videoData = data.data.items[0];
  const embedID = videoData.id;
  const title = videoData.snippet.title;
  const description = videoData.snippet.description;
  const statistics = videoData.statistics;
  const thumbnailURL = videoData.snippet.thumbnails.high.url;
  return {
    thumbnailURL,
    title,
    embedID,
    description,
    statistics,
  };
};

const Entry = {
  fetch: () => [],
  create: (entry) => {
    console.log(entry);
  },
  getInfo: (url) => {
    return request.fetch(request.addParams('http://localhost:4000/api/yt/links/info', { url }))
      .then(response => response.json())
      .then(processData);
  },
};

module.exports = Entry;

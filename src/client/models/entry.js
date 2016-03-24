const request = require('../../lib/request.js');

const processData = (data) => {
  const videoData = data.items[0];
  const embedID = videoData.id;
  const title = videoData.snippet.title;
  const description = videoData.snippet.description;
  const statistics = videoData.statistics;
  const thumbnailURL = videoData.snippet.thumbnails.high.url;
  const sortMetric = Number(videoData.statistics.viewCount);
  return {
    thumbnailURL,
    title,
    embedID,
    description,
    statistics,
    sortMetric,
  };
};

const Entry = {
  fetch: (offset, limit) => {
    return request.clientFetch(request.addParams('/api/yt/entries', { offset, limit }));
  },
  create: (entry) => {
    return request.clientFetch('/api/yt/entries', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(entry),
    });
  },
  update: (id, fields) => {
    return request.clientFetch(`/api/yt/entries/${id}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(fields),
    });
  },
  getInfo: (url) => {
    return request.clientFetch(request.addParams('/api/yt/entries/info', { url }))
      .then(processData);
  },
  getRefreshStats: (urlArray) => {
    return request.clientFetch(request.addParams('http://localhost:4000/api/yt/entries/refreshStats', { urlArray }));
  },
  delete: (id) => {
    return request.clientFetch(`/api/yt/entries/${id}`, {
      method: 'DELETE',
    });
  },
};

module.exports = Entry;

const routes = (handler) => [
  {
    method: 'GET',
    path: '/playlists/{id}/activities',
    handler: handler.getActivityHandler,
    options: {
      auth: 'openmusicapi_jwt',
    },
  },
];

module.exports = routes;
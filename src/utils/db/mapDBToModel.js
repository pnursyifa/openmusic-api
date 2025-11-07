/* eslint-disable camelcase */
const mapSongsToModel = ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  album_id,
}) => ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId: album_id,
});

const mapAlbumsToModel = ({
  id,
  name,
  year,
  cover
}) => ({
  id,
  name,
  year,
  coverUrl: cover
});

module.exports = {
  mapSongsToModel,
  mapAlbumsToModel,
};
const { Pool } = require('pg');

class PlaylistSongsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylist(playlistId) {
    const playlistQuery = {
      text: `SELECT playlists.id, playlists.name FROM playlists
      WHERE playlists.id = $1`,
      values: [playlistId],
    };

    const playlistResult = await this._pool.query(playlistQuery);
    const playlist = playlistResult.rows[0];
    return playlist;
  }

  async getSongs(playlistId) {    
    const SongsQuery = {
      text: `SELECT songs.id, songs.title, songs.performer FROM playlist_songs
      JOIN songs ON songs.id = playlist_songs.song_id
      WHERE playlist_songs.playlist_id = $1`,
      values: [playlistId],
    };

    const songsResult = await this._pool.query(SongsQuery);
    const songs = songsResult.rows;
    return songs;
  }
}

module.exports = PlaylistSongsService;
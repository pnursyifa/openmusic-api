const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistSongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong(playlistId, songId) {
    const id = `playlist-song-${nanoid(16)}`;
    console.log('Nyampe A');

    const songExistQuery = {
      text: 'SELECT id FROM songs WHERE songs.id = $1',
      values: [songId],
    };

    console.log('Nyampe B');

    const songExist = await this._pool.query(songExistQuery);

    console.log('Nyampe C');

    if (!songExist.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }

    console.log('Nyampe D');

    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);

    console.log('Nyampe E');

    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan ke playlist');
    }

    return result.rows[0].id;
  }

  async getSongs(playlistId) {
    const query = {
      text: `SELECT songs.id, songs.title, songs.performer FROM playlist_songs
        JOIN songs ON songs.id = playlist_songs.song_id
        WHERE playlist_songs.playlist_id = $1`,
      values: [playlistId],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async deleteSong(playlistId, songId) {
    const query = {
      text: `DELETE FROM playlist_songs
        WHERE playlist_id = $1 AND song_id = $2
        RETURNING id`,
      values: [playlistId, songId]
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu gagal dihapus dari playlist. Lagu tidak ditemukan');
    }
  }

  async verifySongExist(songId) {
    const query = {
      text: 'SELECT id FROM songs WHERE song_id = $1',
      values: [songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }

    return result.rows[0].id;
  }
}

module.exports = PlaylistSongsService;
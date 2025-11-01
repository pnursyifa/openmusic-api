const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

class ActivitiesService {
  constructor() {
    this._pool = new Pool();
  }

  async getActivities(playlistId) {

    const query = {
      text: `SELECT users.username, songs.title, psa.action, psa.time
            FROM playlist_song_activities psa
            LEFT JOIN songs ON songs.id = psa.song_id
            LEFT JOIN playlists ON playlists.id = psa.playlist_id
            LEFT JOIN users ON users.id = psa.user_id
            WHERE psa.playlist_id = $1
            ORDER BY psa.time ASC`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async addActivity(playlistId, songId, userId, action) {
    const id = `activity-${nanoid(16)}`;

    const time = new Date().toISOString();

    const query = {
      text: 'INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, playlistId, songId, userId, action, time],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Aksi gagal ditambahkan ke aktifitas');
    }

    return result.rows[0].id;
  }
}

module.exports = ActivitiesService;
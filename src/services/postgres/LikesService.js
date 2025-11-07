const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class LikesService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addLike(albumId, userId) {
    const id = `likes-${nanoid(16)}`;

    const isLikedQuery = {
      text: `SELECT id FROM likes 
      WHERE album_id = $1 AND user_id = $2`,
      values: [albumId, userId],
    };

    const isLiked = await this._pool.query(isLikedQuery);

    if (isLiked.rows.length) {
      throw new InvariantError('Like gagal diberikan. Album sudah dilike.');
    }

    const query = {
      text: `INSERT INTO likes
      VALUES($1, $2, $3)
      RETURNING id`,
      values: [id, albumId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Like gagal diberikan');
    }

    await this._cacheService.delete(`likes:${albumId}`);
    return result.rows[0].id;
  }

  async deleteLike(albumId, userId) {
    const query = {
      text: `DELETE FROM likes
      WHERE album_id = $1 AND user_id = $2
      RETURNING id`,
      values: [albumId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Like gagal dibatalkan. Album tidak ditemukan.');
    }

    await this._cacheService.delete(`likes:${albumId}`);
  }

  async getLikes(albumId) {
    try {
      const result = await this._cacheService.get(`likes:${albumId}`);
      return {
        cached: true,
        likes: JSON.parse(result)
      };
    } catch {
      const query = {
        text: `SELECT COUNT(*)
        FROM likes
        WHERE album_id = $1`,
        values: [albumId],
      };

      const result = await this._pool.query(query);
      const formattedResult = parseInt(result.rows[0].count, 10);

      await this._cacheService.set(`likes:${albumId}`, JSON.stringify(formattedResult));
      return { likes: formattedResult };
    }
  }
}

module.exports = LikesService;
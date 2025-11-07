const { default: autoBind } = require('auto-bind');

class LikesHandler {
  constructor(likesService, albumsService) {
    this._likesService = likesService;
    this._albumsService = albumsService;

    autoBind(this);
  }

  async postLikeHandler(request, h) {
    const { id: albumId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._albumsService.getAlbumById(albumId);
    await this._likesService.addLike(albumId, credentialId);

    const response = h.response({
      status: 'success',
      message: 'Like berhasil diberikan',
    });
    response.code(201);
    return response;
  }

  async deleteLikeHandler(request) {
    const { id: albumId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._albumsService.getAlbumById(albumId);
    await this._likesService.deleteLike(albumId, credentialId);

    return {
      status: 'success',
      message: 'Like berhasil dihapus',
    };
  }

  async getLikeHandler(request, h) {
    const { id: albumId } = request.params;

    await this._albumsService.getAlbumById(albumId);
    const { cached, likes } = await this._likesService.getLikes(albumId);

    const response = h.response({
      status: 'success',
      data: { likes }
    });

    if (cached) {
      response.header('X-Data-Source', 'cache');
    }

    return response;
  }
}

module.exports = LikesHandler;
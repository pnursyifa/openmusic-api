const { default: autoBind } = require('auto-bind');
const config = require('../../utils/config');

class UploadsHandler {
  constructor(storageService, albumsService, validator) {
    this._storageService = storageService;
    this._albumsService = albumsService;
    this._validator = validator;

    autoBind(this);
  }

  async postUploadImageHandler(request, h) {
    const { cover } = request.payload;
    const { id } = request.params;
    this._validator.validateImageHeaders(cover.hapi.headers);

    await this._albumsService.getAlbumById(id);
    const fileLocation = await this._storageService.writeFile(cover, cover.hapi);
    const coverUrl = `http://${config.app.host}:${config.app.port}/upload/images/${fileLocation}`;
    await this._albumsService.addAlbumCoverUrl(id, coverUrl);

    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah'
    });
    response.code(201);
    return response;
  }
}

module.exports = UploadsHandler;
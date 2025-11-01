const Joi = require('joi');
const currentYear = new Date().getFullYear();

const AlbumPayloadSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().integer().min(1000).max(currentYear).required(),
});

module.exports = { AlbumPayloadSchema };
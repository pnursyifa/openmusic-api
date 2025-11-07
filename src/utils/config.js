const dotenv = require('dotenv');
const envFile = process.env.NODE_ENV === 'production' ? '.env' : '.dev.env';
dotenv.config({ path: envFile });

const config = {
  app: {
    host: process.env.HOST || 'localhost',
    port: process.env.PORT || 5000,
  },
  jwt: {
    accessToken: process.env.ACCESS_TOKEN_KEY,
    refreshToken: process.env.REFRESH_TOKEN_KEY,
    accessTokenAge: process.env.ACCESS_TOKEN_AGE,
  },
  s3: {
    bucketName: process.env.AWS_BUCKET_NAME,
  },
  rabbitMq: {
    server: process.env.RABBITMQ_SERVER,
  },
  redis: {
    host: process.env.REDIS_SERVER,
  },
};

module.exports = config;
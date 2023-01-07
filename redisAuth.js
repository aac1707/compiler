const redis = require('redis');

const RedisClient = redis.createClient();
RedisClient.connect();

module.exports = {
    RedisClient
}
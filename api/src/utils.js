const { promisify } = require('util');
const redis = require('redis');

const redisClient = redis.createClient({
    host: 'redis-server',
});

const redisClientGet = promisify(redisClient.get)
    .bind(redisClient);

function roundCoordinate(coord) {
    return Number
        .parseFloat(coord)
        .toPrecision(8);
}

module.exports = {
    roundCoordinate,
    redisClient,
    redisClientGet,
};

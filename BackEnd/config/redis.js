const Redis = require('ioredis');
const mongoose = require('mongoose');

const { REDIS_PORT, REDIS_HOST, REDIS_USERNAME, REDIS_PASSWORD } = process.env;

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cacheRedis = function () {
  this.isCacheRedis = true;
  return this;
};

// [ioredis] Unhandled error event: Error: getaddrinfo ENOTFOUND redis-14732.c1.ap-southeast-1-1.ec2.cloud.redislabs.com
// at GetAddrInfoReqWrap.onlookup [as oncomplete] (node:dns:108:26)
mongoose.Query.prototype.exec = async function () {
  if (!this.isCacheRedis) return await exec.apply(this, arguments);

  try {
    const key = JSON.stringify(
      Object.assign({}, structuredClone(this.getQuery()), {
        collection: this.mongooseCollection.name,
      })
    );

    const cachedResult = await redis.get(key);

    if (cachedResult) {
      const result = JSON.parse(cachedResult);
      if (!Array.isArray(result)) return new this.model(result);

      return result.map(item => new this.model(item));
    }
  } catch (error) {
    return await exec.apply(this, arguments);
  }

  const result = await exec.apply(this, arguments);

  try {
    await redis.set(key, JSON.stringify(result), 'EX', 30 * 60);
  } finally {
    return result;
  }
};

const redis = new Redis({
  port: REDIS_PORT,
  host: REDIS_HOST,
  username: REDIS_USERNAME,
  password: REDIS_PASSWORD,
});

redis.connect(() => console.log('Redis connected successfully!'));

module.exports = redis;

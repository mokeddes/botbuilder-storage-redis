# State Storage for Bot Framework using Redis

This project provides a Redis storage mechanism for [Bot Framework-JS SDK V4.](https://github.com/Microsoft/botbuilder-js).

It allows you to store bot state in Redis, so that you can scale out your bot,
and be more resilient to bot server failures.

## Requirements

- [NodeJS](https://nodejs.org/en/) 10.x is a requirement to install dependencies,
  build and run tests.
- Redis database.

## Installation

```bash
npm i botbuilder-storage-redis
```

## Sample Usage

The storage depends on a redis client instance.

```JavaScript
const redis = require('redis');
const { RedisDbStorage } = require('botbuilder-storage-redis');
const builder = require('botbuilder');

const redisOptions = {
    prefix: 'bot-storage:'
};
const redisClient = redis.createClient(process.env.REDIS_URL, redisOptions);
// data expires in 2 hours after last update, set it to 0 for no limit.
const ttlInSeconds = 120;
const storage = new RedisDbStorage(redisClient, ttlInSeconds);

const connector = new builder.ChatConnector();
const bot = new builder.UniversalBot(connector);

// Configure bot to use the RedisStorage
bot.set('storage', storage);
```

## Contact

- Anis MOKEDDES <mokeddes.anis@gmail.com>

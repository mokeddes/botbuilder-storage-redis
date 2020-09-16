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

Similarly with [Botkit](https://github.com/howdyai/botkit):

```JavaScript
import redis from 'redis';
import { RedisDbStorage } from 'botbuilder-storage-redis';

// Redis config
const redisOptions = {
  prefix: 'bot-storage:',
};

const redisClient = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_URL, redisOptions);
const ttlInSeconds = 120;
const redisStorage = new RedisDbStorage(redisClient, ttlInSeconds);

// Botkit init
const controller = new Botkit({
  storage: redisStorage,
  adapter: fbAdapter,
  disable_console: false,
  webhook_uri: '/bot/web-messages',
  webserver_middlewares: [
    (req: Request, res: Response, next: NextFunction) => {
      console.info('Request >', req.url);
      next();
    },
  ],
});
```


## Contact

- Anis MOKEDDES <mokeddes.anis@gmail.com>

/* eslint-disable @typescript-eslint/explicit-member-accessibility */

/** *********************************************************************************
 *
 * botbuilder-storage-redis
 *
 ********************************************************************************** */

import { RedisClientType, RedisDefaultModules, RedisModules, RedisScripts } from 'redis';

import { Storage, StoreItems } from 'botbuilder';

export class RedisDbStorage implements Storage {
  private redis: RedisClientType<RedisDefaultModules & RedisModules, RedisScripts>;
  private readonly ttlInSeconds: number;

  constructor(
    client: RedisClientType<RedisDefaultModules & RedisModules, RedisScripts>,
    ttlInSeconds: number = 0
  ) {
    if (ttlInSeconds && ttlInSeconds < 0) {
      throw new Error('RedisDbStorage: ttlInSeconds must be 0 or greater');
    }
    if (!client) {
      throw new Error('RedisDbStorage: client must be provided');
    }

    this.ttlInSeconds = ttlInSeconds;
    this.redis = client;
  }

  public async read(stateKeys: string[]): Promise<StoreItems> {
    const data: StoreItems = {};

    if (!stateKeys || stateKeys.length === 0) {
      return data;
    }

    const allKeysValuesFromRedis = await Promise.all(
      stateKeys.map((key: string): Promise<string> => this.redis.get(key))
    );

    stateKeys.forEach((key: string, index: number): void => {
      const item = allKeysValuesFromRedis[index];
      if (item) {
        data[key] = JSON.parse(item);
      }
    });

    return data;
  }

  public async write(changes: StoreItems): Promise<void> {
    if (!changes || Object.keys(changes).length === 0) {
      return;
    }

    const allKeysValuesGivenToStore = Object.keys(changes);

    await Promise.all(
      allKeysValuesGivenToStore.map((key: string): Promise<string> => {
        const state = changes[key];
        if (this.ttlInSeconds > 0) {
          return this.redis.setEx(key, this.ttlInSeconds, JSON.stringify(state));
        }
        return this.redis.set(key, JSON.stringify(state));
      })
    );

    return;
  }

  public async delete(keys: string[]): Promise<void> {
    if (!keys || keys.length == 0) {
      return;
    }

    await Promise.all(keys.map((key: string): Promise<number> => this.redis.del(key)));

    return;
  }
}

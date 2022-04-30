/* eslint-disable @typescript-eslint/explicit-member-accessibility */

/** *********************************************************************************
 *
 * botbuilder-storage-redis
 *
 ********************************************************************************** */

import { RedisClientType } from 'redis';

import { Storage, StoreItems } from 'botbuilder';
import { promisify } from 'util';

export class RedisDbStorage implements Storage {
  private redis: RedisClientType;
  private readonly ttlInSeconds: number;
  private readonly getAsyncFromRedis: (key: string) => Promise<string>;
  private readonly setexAsyncFromRedis: (
    key: string,
    seconds: number,
    value: string
  ) => Promise<void>;
  private readonly delAsyncFromRedis: (key: string) => Promise<void>;

  constructor(client: RedisClientType, ttlInSeconds: number = 0) {
    if (ttlInSeconds < 0) {
      throw new Error('RedisDbStorage: ttlInSeconds must be 0 or greater');
    }
    this.ttlInSeconds = ttlInSeconds;
    this.redis = client;
    this.getAsyncFromRedis = promisify(client.get).bind(client);
    this.setexAsyncFromRedis = promisify(client.set).bind(client);

    this.delAsyncFromRedis = promisify(client.del).bind(client);
  }

  public async read(stateKeys: string[]): Promise<StoreItems> {
    const data: StoreItems = {};

    if (!stateKeys || stateKeys.length === 0) {
      return data;
    }

    const allKeysValuesFromRedis = await Promise.all(
      stateKeys.map((key: string): Promise<string> => this.getAsyncFromRedis(key))
    );

    stateKeys.forEach((key: string, index: number): void => {
      const item = allKeysValuesFromRedis[index];
      if (item) {
        data[key] = JSON.parse(item);
      }
    });

    return Promise.resolve(data);
  }

  public async write(changes: StoreItems): Promise<void> {
    if (!changes || Object.keys(changes).length === 0) {
      return;
    }

    const allKeysValuesGivenToStore = Object.keys(changes);

    await Promise.all(
      allKeysValuesGivenToStore.map((key: string): Promise<void> => {
        const state = changes[key];
        return this.setexAsyncFromRedis(key, this.ttlInSeconds, JSON.stringify(state));
      })
    );

    return Promise.resolve();
  }

  public async delete(keys: string[]): Promise<void> {
    if (!keys || keys.length == 0) {
      return;
    }

    await Promise.all(keys.map((key: string): Promise<void> => this.delAsyncFromRedis(key)));

    return Promise.resolve();
  }
}

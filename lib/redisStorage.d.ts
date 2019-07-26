/** *********************************************************************************
 *
 * botbuilder-storage-redis
 * Copyright 2019 Generali
 *
 ********************************************************************************** */
import { RedisClient } from 'redis';
import { Storage, StoreItems } from 'botbuilder';
export declare class RedisDbStorage implements Storage {
    private redis;
    private ttlInSeconds;
    private getAsyncFromRedis;
    private setAsyncFromRedis;
    private delAsyncFromRedis;
    constructor(client: RedisClient);
    read(stateKeys: string[]): Promise<StoreItems>;
    write(changes: StoreItems): Promise<void>;
    delete(keys: string[]): Promise<void>;
}

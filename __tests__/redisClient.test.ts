import { StoreItems } from 'botbuilder';
import { createClient } from 'redis';

import { RedisDbStorage } from '../src';

describe('RedisDbStorage without ttl', () => {
  const client = createClient();
  // Clear all instances and calls to constructor and all methods:
  let store: StoreItems;

  let storage: RedisDbStorage;

  beforeEach(() => {
    store = {};

    storage = new RedisDbStorage(client);

    client.setEx = jest
      .fn()
      .mockImplementation(
        async (key: string, ttlInSeconds: number, value: string): Promise<string> => {
          store[key] = value;
          return value;
        }
      );

    client.set = jest
      .fn()
      .mockImplementation(async (key: string, value: string): Promise<string> => {
        store[key] = value;
        return value;
      });

    client.get = jest.fn().mockImplementation(async (key: string): Promise<string> => {
      return store[key];
    });

    client.del = jest.fn().mockImplementation(async (key: string): Promise<string> => {
      delete store[key];
      return key;
    });
  });

  it('should be defined', () => {
    expect(RedisDbStorage).toBeDefined();
  });

  it('should be a function', () => {
    expect(typeof RedisDbStorage).toBe('function');
  });

  it('should throw an error if client is not provided', () => {
    expect(() => new RedisDbStorage(null)).toThrow('RedisDbStorage: client must be provided');
  });

  it('should validate functions', async () => {
    expect(storage).toBeDefined();
    expect(storage.read).toBeDefined();
    expect(storage.write).toBeDefined();
    expect(storage.delete).toBeDefined();
    expect(typeof storage.read).toBe('function');
    expect(typeof storage.write).toBe('function');
    expect(typeof storage.delete).toBe('function');
  });

  it('should return empty object after writing empty data', async () => {
    // When
    await storage.write({});
    const dataReaded = await storage.read([]);

    // Then
    expect(dataReaded).toEqual({});
  });

  it('should return valid state after deleting empty data', async () => {
    // Given
    const data = {
      key1: 'value1'
    };

    // When
    await storage.write(data);
    await storage.delete([]);
    const dataReaded = await storage.read(['key1']);

    // Then
    expect(dataReaded).toEqual({
      key1: 'value1'
    });
  });

  it('should save and return data', async () => {
    // Given
    const newData = {
      userData: { a: 'b', name: 'name-user' },
      privateConversationData: { c: 'd' },
      conversationData: { e: 'f' }
    };

    // When
    await storage.write(newData);
    const dataReaded = await storage.read(['userData', 'privateConversationData']);

    // Then
    expect({
      userData: { a: 'b', name: 'name-user' },
      privateConversationData: { c: 'd' }
    }).toEqual(dataReaded);
  });

  it('should delete saved data', async () => {
    // Given
    const newData = {
      userData: { a: 'b', name: 'name-user' },
      privateConversationData: { c: 'd' },
      conversationData: { e: 'f' }
    };

    // When
    await storage.write(newData);

    await storage.delete(['userData', 'privateConversationData']);
    const readNotDeletedData = await storage.read(['conversationData']);
    const readDeletedData = await storage.read(['userData', 'privateConversationData']);

    // then
    expect({ e: 'f' }).toEqual(readNotDeletedData['conversationData']);
    expect(readDeletedData).toEqual({});
  });
});

describe('RedisDbStorage with ttl', () => {
  const client = createClient();
  // Clear all instances and calls to constructor and all methods:
  let store: StoreItems;

  let storage: RedisDbStorage;

  beforeEach(() => {
    store = {};

    storage = new RedisDbStorage(client);

    client.set = jest
      .fn()
      .mockImplementation(async (key: string, value: string): Promise<string> => {
        store[key] = value;
        return value;
      });

    client.setEx = jest
      .fn()
      .mockImplementation(
        async (key: string, ttlInSeconds: number, value: string): Promise<string> => {
          store[key] = value;
          if (Number(ttlInSeconds)) {
            setTimeout(() => {
              delete store[key];
            }, ttlInSeconds * 1000);
          }
          return value;
        }
      );

    client.get = jest.fn().mockImplementation(async (key: string): Promise<string> => {
      return store[key];
    });

    client.del = jest.fn().mockImplementation(async (key: string): Promise<string> => {
      delete store[key];
      return key;
    });
  });

  it('should throw an error if ttlInSeconds is less than 0', () => {
    expect(() => new RedisDbStorage(null, -1)).toThrow(
      'RedisDbStorage: ttlInSeconds must be 0 or greater'
    );
  });

  it('should ignores invalid TTL save data and return', async () => {
    // Given
    const newData = {
      userData: { a: 'b', name: 'name-user' },
      privateConversationData: { c: 'd' },
      conversationData: { e: 'f' }
    };

    // When
    storage = new RedisDbStorage(client);

    await storage.write(newData);
    const dataReaded = await storage.read(['userData', 'privateConversationData']);

    // Then
    expect({
      userData: { a: 'b', name: 'name-user' },
      privateConversationData: { c: 'd' }
    }).toEqual(dataReaded);
  });

  it('should expires the data after TTL has passed', async () => {
    // Given
    const newData = {
      userData: { a: 'b', name: 'name-user' }
    };

    const TTL_SECONDS = 2;

    // When
    storage = new RedisDbStorage(client, TTL_SECONDS);

    await storage.write(newData);
    const dataReadedBeforeTTL = await storage.read(['userData']);

    setTimeout(async () => {
      const dataReadedAfterTTL = await storage.read(['userData']);

      // Then
      expect(dataReadedBeforeTTL).toEqual(newData);
      expect(dataReadedAfterTTL).toEqual({});
    }, TTL_SECONDS * 1000);
  });
});

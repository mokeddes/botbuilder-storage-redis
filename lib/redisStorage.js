"use strict";
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
class RedisDbStorage {
    constructor(client) {
        this.redis = client;
        this.getAsyncFromRedis = util_1.promisify(client.get).bind(client);
        this.setAsyncFromRedis = util_1.promisify(client.set).bind(client);
        this.delAsyncFromRedis = util_1.promisify(client.del).bind(client);
    }
    read(stateKeys) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = {};
            if (!stateKeys || stateKeys.length === 0) {
                return data;
            }
            yield Promise.all(stateKeys.map((key) => __awaiter(this, void 0, void 0, function* () {
                const result = yield this.getAsyncFromRedis(key);
                data[key] = JSON.parse(result || '{}');
                Promise.resolve();
            })));
            return Promise.resolve(data);
        });
    }
    write(changes) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!changes || Object.keys(changes).length === 0) {
                return;
            }
            yield Promise.all(Object.keys(changes).map((key) => __awaiter(this, void 0, void 0, function* () {
                const state = changes[key];
                yield this.setAsyncFromRedis(key, JSON.stringify(state));
                Promise.resolve();
            })));
        });
    }
    delete(keys) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!keys || keys.length == 0) {
                return;
            }
            yield Promise.all(keys.map((key) => __awaiter(this, void 0, void 0, function* () {
                yield this.delAsyncFromRedis(key);
                Promise.resolve();
            })));
        });
    }
}
exports.RedisDbStorage = RedisDbStorage;
//# sourceMappingURL=redisStorage.js.map
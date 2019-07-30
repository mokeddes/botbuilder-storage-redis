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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
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
        var stateKeys_1, stateKeys_1_1;
        var e_1, _a;
        return __awaiter(this, void 0, void 0, function* () {
            const data = {};
            if (!stateKeys || stateKeys.length === 0) {
                return data;
            }
            try {
                for (stateKeys_1 = __asyncValues(stateKeys); stateKeys_1_1 = yield stateKeys_1.next(), !stateKeys_1_1.done;) {
                    const key = stateKeys_1_1.value;
                    const result = yield this.getAsyncFromRedis(key);
                    data[key] = JSON.parse(result || '{}');
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (stateKeys_1_1 && !stateKeys_1_1.done && (_a = stateKeys_1.return)) yield _a.call(stateKeys_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return Promise.resolve(data);
        });
    }
    write(changes) {
        var e_2, _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!changes || Object.keys(changes).length === 0) {
                return;
            }
            try {
                for (var _b = __asyncValues(Object.keys(changes)), _c; _c = yield _b.next(), !_c.done;) {
                    const key = _c.value;
                    const state = changes[key];
                    this.setAsyncFromRedis(key, JSON.stringify(state));
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return Promise.resolve();
        });
    }
    delete(keys) {
        var keys_1, keys_1_1;
        var e_3, _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!keys || keys.length == 0) {
                return;
            }
            try {
                for (keys_1 = __asyncValues(keys); keys_1_1 = yield keys_1.next(), !keys_1_1.done;) {
                    const key = keys_1_1.value;
                    this.delAsyncFromRedis(key);
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (keys_1_1 && !keys_1_1.done && (_a = keys_1.return)) yield _a.call(keys_1);
                }
                finally { if (e_3) throw e_3.error; }
            }
            return Promise.resolve();
        });
    }
}
exports.RedisDbStorage = RedisDbStorage;
//# sourceMappingURL=redisStorage.js.map
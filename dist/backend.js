module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

const Fn = module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class RedisDb {

    constructor(moduleName) {
      this.moduleName = moduleName || ctx.module.info.relativeName;
    }

    // other module's cache
    module(moduleName) {
      return new (Fn(ctx))(moduleName);
    }

    _getKey(name) {
      return `${ctx.instance ? ctx.instance.id : 0}:${this.moduleName}:${name}`;
    }

    async get(name) {
      const redis = ctx.app.redis.get('cache');
      const key = this._getKey(name);
      const value = await redis.get(key);
      return value ? JSON.parse(value) : undefined;
    }

    async set(name, value, timeout) {
      const redis = ctx.app.redis.get('cache');
      const key = this._getKey(name);
      if (timeout) {
        await redis.set(key, JSON.stringify(value), 'PX', timeout);
      } else {
        await redis.set(key, JSON.stringify(value));
      }
    }

    async getset(name, value, timeout) {
      const redis = ctx.app.redis.get('cache');
      const key = this._getKey(name);
      let valuePrev;
      if (timeout) {
        const res = await redis.multi()
          .get(key)
          .set(key, JSON.stringify(value), 'PX', timeout)
          .exec();
        valuePrev = res[0][1];
      } else {
        const res = await redis.multi()
          .get(key)
          .set(key, JSON.stringify(value))
          .exec();
        valuePrev = res[0][1];
      }
      return valuePrev ? JSON.parse(valuePrev) : undefined;
    }

    async has(name) {
      const redis = ctx.app.redis.get('cache');
      const key = this._getKey(name);
      return await redis.exists(key) > 0;
    }

    async remove(name) {
      const redis = ctx.app.redis.get('cache');
      const key = this._getKey(name);
      await redis.del(key);
    }

  }

  return RedisDb;
};


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const services = __webpack_require__(2);
const config = __webpack_require__(5);
const locales = __webpack_require__(6);
const errors = __webpack_require__(8);
const middlewares = __webpack_require__(9);

// eslint-disable-next-line
module.exports = app => {

  const routes = __webpack_require__(15)(app);

  return {
    routes,
    services,
    config,
    locales,
    errors,
    middlewares,
  };

};


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

const version = __webpack_require__(3);
const db = __webpack_require__(4);

module.exports = {
  version,
  db,
};


/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = app => {

  class Version extends app.Service {

    async update(options) {
      if (options.version === 1) {
        // create table: aCache
        const sql = `
          CREATE TABLE aCache (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            module varchar(255) DEFAULT NULL,
            name varchar(255) DEFAULT NULL,
            value json DEFAULT NULL,
            timeout int(11) DEFAULT '0',
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.db.query(sql);
      }

      if (options.version === 2) {
        let sql;
        // delete
        sql = `
          delete from aCache
        `;
        await this.ctx.db.query(sql);
        // alter table: aCache
        sql = `
          ALTER TABLE aCache
            DROP COLUMN timeout,
            ADD COLUMN expired timestamp DEFAULT NULL
        `;
        await this.ctx.db.query(sql);
      }
    }

  }

  return Version;
};


/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = app => {

  class Db extends app.Service {

    async set({ module, name, value, timeout }) {
      const res = await this.ctx.cache._db.module(module)._set({ name, value, timeout, queue: false });
      return res;
    }

  }

  return Db;
};


/***/ }),
/* 5 */
/***/ (function(module, exports) {

// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // middlewares
  config.middlewares = {
    cachedb: {
      global: true,
    },
    cachemem: {
      global: true,
    },
    cacheredis: {
      global: true,
    },
  };

  // queues
  config.queues = {
    cacheDbSet: {
      path: 'db/set',
    },
  };

  // broadcasts
  config.broadcasts = {
    memRemove: {
      path: 'broadcast/memRemove',
    },
    memClear: {
      path: 'broadcast/memClear',
    },
  };

  // db
  config.db = {
    redis: true,
  };

  return config;
};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  'zh-cn': __webpack_require__(7),
};


/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = {
};


/***/ }),
/* 8 */
/***/ (function(module, exports) {

// error code should start from 1001
module.exports = {
};


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

const cachedb = __webpack_require__(10);
const cachemem = __webpack_require__(12);
const cacheredis = __webpack_require__(14);

module.exports = {
  cachedb,
  cachemem,
  cacheredis,
};


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

const dbFn = __webpack_require__(11);
const redisFn = __webpack_require__(0);
const CACHE = Symbol('CTX#__CACHE');
const CACHEDB = Symbol('CTX#__CACHEDB');

module.exports = (options, app) => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  return async function cachedb(ctx, next) {
    ctx.cache = ctx.cache || {};
    Object.defineProperty(ctx.cache, 'db', {
      get() {
        if (ctx.cache[CACHE] === undefined) {
          const config = ctx.config.module(moduleInfo.relativeName);
          if (config.db.redis) {
            ctx.cache[CACHE] = new (redisFn(ctx))();
          } else {
            ctx.cache[CACHE] = new (dbFn(ctx))();
          }
        }
        return ctx.cache[CACHE];
      },
    });
    Object.defineProperty(ctx.cache, '_db', {
      get() {
        if (ctx.cache[CACHEDB] === undefined) {
          ctx.cache[CACHEDB] = new (dbFn(ctx))();
        }
        return ctx.cache[CACHEDB];
      },
    });

    // next
    await next();
  };
};


/***/ }),
/* 11 */
/***/ (function(module, exports) {

const Fn = module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class CacheDb {

    constructor(moduleName) {
      this.moduleName = moduleName || ctx.module.info.relativeName;
    }

    // other module's cache
    module(moduleName) {
      return new (Fn(ctx))(moduleName);
    }

    async get(name) {
      const res = await this._has(name);
      return res ? JSON.parse(res.value) : undefined;
    }

    async set(name, value, timeout) {
      await this._set({ name, value, timeout, queue: true });
    }

    async getset(name, value, timeout) {
      const res = await this._set({ name, value, timeout, queue: true });
      return res ? JSON.parse(res.value) : undefined;
    }

    async _set({ name, value, timeout, queue }) {
      // second
      const second = timeout ? parseInt(timeout / 1000) : timeout;
      // expired
      const expired = second ? `TIMESTAMPADD(SECOND,${second},CURRENT_TIMESTAMP)` : 'null';
      const res = await ctx.db.get('aCache', {
        iid: ctx.instance ? ctx.instance.id : 0,
        module: this.moduleName,
        name,
      });
      if (res) {
        await ctx.db.query(`
          update aCache set value=?, expired=${expired}
            where id=?
          `, [ JSON.stringify(value), res.id ]);
      } else {
        if (queue) {
          await ctx.app.meta.queue.pushAsync({
            subdomain: ctx.subdomain,
            module: moduleInfo.relativeName,
            queueName: 'cacheDbSet',
            data: {
              module: this.moduleName,
              name,
              value,
              timeout,
            },
          });
        } else {
          await ctx.db.query(`
            insert into aCache(iid,module,name,value,expired) values(?,?,?,?,${expired})
            `, [ ctx.instance ? ctx.instance.id : 0, this.moduleName, name, JSON.stringify(value) ]);
        }
      }
      // return old value
      if (!res) return null;
      if (!res.expired || res.expired.getTime() > new Date().getTime()) return res;
      return null;
    }

    async has(name) {
      const res = await this._has(name);
      return !!res;
    }

    async _has(name) {
      const sql = 'select * from aCache where iid=? and module=? and name=? and (expired is null or expired>CURRENT_TIMESTAMP)';
      const res = await ctx.db.queryOne(sql, [ ctx.instance ? ctx.instance.id : 0, this.moduleName, name ]);
      return res;
    }

    async remove(name) {
      await ctx.db.delete('aCache', {
        iid: ctx.instance ? ctx.instance.id : 0,
        module: this.moduleName,
        name,
      });
    }

    async clear() {
      await ctx.db.delete('aCache', {
        iid: ctx.instance ? ctx.instance.id : 0,
        module: this.moduleName,
      });
    }

  }

  return CacheDb;
};


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

const memFn = __webpack_require__(13);
const CACHE = Symbol('CTX#__CACHE');

module.exports = () => {
  return async function cachemem(ctx, next) {
    ctx.cache = ctx.cache || {};
    Object.defineProperty(ctx.cache, 'mem', {
      get() {
        if (ctx.cache[CACHE] === undefined) {
          ctx.cache[CACHE] = new (memFn(ctx))();
        }
        return ctx.cache[CACHE];
      },
    });

    // next
    await next();
  };
};


/***/ }),
/* 13 */
/***/ (function(module, exports) {

const CACHEMEMORY = Symbol.for('APP#__CACHEMEMORY');

const Fn = module.exports = ctx => {

  class CacheMem {

    constructor(moduleName) {
      this.moduleName = moduleName || ctx.module.info.relativeName;
    }

    get memory() {
      return ctx.app.geto(CACHEMEMORY).geto(ctx.subdomain).geto(this.moduleName);
    }

    // other module's cache
    module(moduleName) {
      return new (Fn(ctx))(moduleName);
    }

    get(name) {
      const res = this.has(name);
      return res ? res.value : undefined;
    }

    set(name, value, timeout) {
      this.memory[name] = {
        value,
        timeout: timeout || 0,
        timestamp: new Date(),
      };
    }

    getset(name, value, timeout) {
      const valueOld = this.get(name);
      this.memory[name] = {
        value,
        timeout: timeout || 0,
        timestamp: new Date(),
      };
      return valueOld;
    }

    has(name) {
      const res = this.memory[name];
      if (!res) return null;
      return (res.timeout === 0 || (new Date() - res.timestamp) < res.timeout) ? res : null;
    }

    remove(name) {
      // remove this
      this._remove(name);
      // broadcast
      ctx.app.meta.broadcast.emit({
        subdomain: ctx.subdomain,
        module: 'a-cache',
        broadcastName: 'memRemove',
        data: { moduleName: this.moduleName, name },
      });
    }

    // by broadcast
    _remove(name) {
      delete this.memory[name];
    }

    clear() {
      // clear this
      this._clear();
      // broadcast
      ctx.app.meta.broadcast.emit({
        subdomain: ctx.subdomain,
        module: 'a-cache',
        broadcastName: 'memClear',
        data: { moduleName: this.moduleName },
      });
    }

    // by broadcast
    _clear() {
      ctx.app[CACHEMEMORY][ctx.subdomain][this.moduleName] = {};
    }

  }

  return CacheMem;
};


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

const redisFn = __webpack_require__(0);
const CACHE = Symbol('CTX#__CACHE');

module.exports = () => {
  return async function cachedb(ctx, next) {
    ctx.cache = ctx.cache || {};
    Object.defineProperty(ctx.cache, 'redis', {
      get() {
        if (ctx.cache[CACHE] === undefined) {
          ctx.cache[CACHE] = new (redisFn(ctx))();
        }
        return ctx.cache[CACHE];
      },
    });

    // next
    await next();
  };
};


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

const version = __webpack_require__(16);
const db = __webpack_require__(17);
const broadcast = __webpack_require__(18);

module.exports = app => {
  const routes = [
    { method: 'post', path: 'version/update', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'db/set', controller: db, middlewares: 'inner',
      meta: { auth: { enable: false } },
    },
    // broadcast
    { method: 'post', path: 'broadcast/memRemove', controller: broadcast, middlewares: 'inner', meta: { auth: { enable: false } } },
    { method: 'post', path: 'broadcast/memClear', controller: broadcast, middlewares: 'inner', meta: { auth: { enable: false } } },
  ];
  return routes;
};


/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = app => {
  class VersionController extends app.Controller {

    async update() {
      await this.service.version.update(this.ctx.request.body);
      this.ctx.success();
    }

  }
  return VersionController;
};


/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = app => {

  class DbController extends app.Controller {

    async set() {
      const res = await this.ctx.service.db.set(this.ctx.request.body);
      this.ctx.success(res);
    }

  }

  return DbController;
};


/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = app => {

  class BroadcastController extends app.Controller {

    async memRemove() {
      const { sameAsCaller, moduleName, name } = this.ctx.request.body;
      if (!sameAsCaller) {
        const moduleCache = this.ctx.cache.mem.module(moduleName);
        moduleCache._remove(name);
      }
      this.ctx.success();
    }

    async memClear() {
      const { sameAsCaller, moduleName } = this.ctx.request.body;
      if (!sameAsCaller) {
        const moduleCache = this.ctx.cache.mem.module(moduleName);
        moduleCache._clear();
      }
      this.ctx.success();
    }

  }

  return BroadcastController;

};


/***/ })
/******/ ]);
//# sourceMappingURL=backend.js.map
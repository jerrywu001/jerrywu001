import { v as vue_cjs_prod, s as serverRenderer, r as require$$0 } from './index.mjs';
import { find, html } from 'property-information';
import 'unenv/runtime/mock/proxy';
import 'stream';

var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
const entry$1 = (ctx) => Promise.resolve().then(function() {
  return bootstrap$1;
}).then((m) => m.default(ctx));
function flatHooks(configHooks, hooks = {}, parentName) {
  for (const key in configHooks) {
    const subHook = configHooks[key];
    const name = parentName ? `${parentName}:${key}` : key;
    if (typeof subHook === "object" && subHook !== null) {
      flatHooks(subHook, hooks, name);
    } else if (typeof subHook === "function") {
      hooks[name] = subHook;
    }
  }
  return hooks;
}
function serialCaller(hooks, args) {
  return hooks.reduce((promise, hookFn) => promise.then(() => hookFn.apply(void 0, args)), Promise.resolve(null));
}
function parallelCaller(hooks, args) {
  return Promise.all(hooks.map((hook) => hook.apply(void 0, args)));
}
class Hookable {
  constructor() {
    this._hooks = {};
    this._deprecatedHooks = {};
    this.hook = this.hook.bind(this);
    this.callHook = this.callHook.bind(this);
    this.callHookWith = this.callHookWith.bind(this);
  }
  hook(name, fn) {
    if (!name || typeof fn !== "function") {
      return () => {
      };
    }
    const originalName = name;
    let deprecatedHookObj;
    while (this._deprecatedHooks[name]) {
      const deprecatedHook = this._deprecatedHooks[name];
      if (typeof deprecatedHook === "string") {
        deprecatedHookObj = { to: deprecatedHook };
      } else {
        deprecatedHookObj = deprecatedHook;
      }
      name = deprecatedHookObj.to;
    }
    if (deprecatedHookObj) {
      if (!deprecatedHookObj.message) {
        console.warn(`${originalName} hook has been deprecated` + (deprecatedHookObj.to ? `, please use ${deprecatedHookObj.to}` : ""));
      } else {
        console.warn(deprecatedHookObj.message);
      }
    }
    this._hooks[name] = this._hooks[name] || [];
    this._hooks[name].push(fn);
    return () => {
      if (fn) {
        this.removeHook(name, fn);
        fn = null;
      }
    };
  }
  hookOnce(name, fn) {
    let _unreg;
    let _fn = (...args) => {
      _unreg();
      _unreg = null;
      _fn = null;
      return fn(...args);
    };
    _unreg = this.hook(name, _fn);
    return _unreg;
  }
  removeHook(name, fn) {
    if (this._hooks[name]) {
      const idx = this._hooks[name].indexOf(fn);
      if (idx !== -1) {
        this._hooks[name].splice(idx, 1);
      }
      if (this._hooks[name].length === 0) {
        delete this._hooks[name];
      }
    }
  }
  deprecateHook(name, deprecated) {
    this._deprecatedHooks[name] = deprecated;
  }
  deprecateHooks(deprecatedHooks) {
    Object.assign(this._deprecatedHooks, deprecatedHooks);
  }
  addHooks(configHooks) {
    const hooks = flatHooks(configHooks);
    const removeFns = Object.keys(hooks).map((key) => this.hook(key, hooks[key]));
    return () => {
      removeFns.splice(0, removeFns.length).forEach((unreg) => unreg());
    };
  }
  removeHooks(configHooks) {
    const hooks = flatHooks(configHooks);
    for (const key in hooks) {
      this.removeHook(key, hooks[key]);
    }
  }
  callHook(name, ...args) {
    return serialCaller(this._hooks[name] || [], args);
  }
  callHookParallel(name, ...args) {
    return parallelCaller(this._hooks[name] || [], args);
  }
  callHookWith(caller, name, ...args) {
    return caller(this._hooks[name] || [], args);
  }
}
function createHooks() {
  return new Hookable();
}
function createMock(name, overrides = {}) {
  const fn = function() {
  };
  fn.prototype.name = name;
  const props = {};
  return new Proxy(fn, {
    get(_target, prop) {
      if (prop === "caller") {
        return null;
      }
      if (prop === "__createMock__") {
        return createMock;
      }
      if (prop in overrides) {
        return overrides[prop];
      }
      return props[prop] = props[prop] || createMock(`${name}.${prop.toString()}`);
    },
    apply(_target, _this, _args) {
      return createMock(`${name}()`);
    },
    construct(_target, _args, _newT) {
      return createMock(`[${name}]`);
    },
    enumerate(_target) {
      return [];
    }
  });
}
const mockContext = createMock("mock");
function mock(warning) {
  console.warn(warning);
  return mockContext;
}
const unsupported = /* @__PURE__ */ new Set([
  "store",
  "spa",
  "fetchCounters"
]);
const todo = /* @__PURE__ */ new Set([
  "isHMR",
  "base",
  "payload",
  "from",
  "next",
  "error",
  "redirect",
  "redirected",
  "enablePreview",
  "$preview",
  "beforeNuxtRender",
  "beforeSerialize"
]);
const routerKeys = ["route", "params", "query"];
const staticFlags = {
  isClient: false,
  isServer: true,
  isDev: false,
  isStatic: void 0,
  target: "server",
  modern: false
};
const legacyPlugin = (nuxtApp) => {
  nuxtApp._legacyContext = new Proxy(nuxtApp, {
    get(nuxt, p) {
      if (unsupported.has(p)) {
        return mock(`Accessing ${p} is not supported in Nuxt 3.`);
      }
      if (todo.has(p)) {
        return mock(`Accessing ${p} is not yet supported in Nuxt 3.`);
      }
      if (routerKeys.includes(p)) {
        if (!("$router" in nuxtApp)) {
          return mock("vue-router is not being used in this project.");
        }
        switch (p) {
          case "route":
            return nuxt.$router.currentRoute.value;
          case "params":
          case "query":
            return nuxt.$router.currentRoute.value[p];
        }
      }
      if (p === "$config" || p === "env") {
        return useRuntimeConfig();
      }
      if (p in staticFlags) {
        return staticFlags[p];
      }
      if (p === "ssrContext") {
        return nuxt._legacyContext;
      }
      if (nuxt.ssrContext && p in nuxt.ssrContext) {
        return nuxt.ssrContext[p];
      }
      if (p === "nuxt") {
        return nuxt.payload;
      }
      if (p === "nuxtState") {
        return nuxt.payload.data;
      }
      if (p in nuxtApp.vueApp) {
        return nuxtApp.vueApp[p];
      }
      if (p in nuxtApp) {
        return nuxtApp[p];
      }
      return mock(`Accessing ${p} is not supported in Nuxt3.`);
    }
  });
};
const NuxtPluginIndicator = "__nuxt_plugin";
function createNuxtApp(options) {
  const nuxtApp = __spreadValues({
    provide: void 0,
    globalName: "nuxt",
    payload: vue_cjs_prod.reactive(__spreadValues({
      data: {},
      state: {},
      _errors: {}
    }, { serverRendered: true })),
    isHydrating: false,
    _asyncDataPromises: {}
  }, options);
  nuxtApp.hooks = createHooks();
  nuxtApp.hook = nuxtApp.hooks.hook;
  nuxtApp.callHook = nuxtApp.hooks.callHook;
  nuxtApp.provide = (name, value) => {
    const $name = "$" + name;
    defineGetter(nuxtApp, $name, value);
    defineGetter(nuxtApp.vueApp.config.globalProperties, $name, value);
  };
  defineGetter(nuxtApp.vueApp, "$nuxt", nuxtApp);
  defineGetter(nuxtApp.vueApp.config.globalProperties, "$nuxt", nuxtApp);
  if (nuxtApp.ssrContext) {
    nuxtApp.ssrContext.nuxt = nuxtApp;
  }
  {
    nuxtApp.ssrContext = nuxtApp.ssrContext || {};
    nuxtApp.ssrContext.payload = nuxtApp.payload;
  }
  {
    nuxtApp.provide("config", options.ssrContext.runtimeConfig.private);
    nuxtApp.payload.config = options.ssrContext.runtimeConfig.public;
  }
  return nuxtApp;
}
async function applyPlugin(nuxtApp, plugin) {
  if (typeof plugin !== "function") {
    return;
  }
  const { provide } = await callWithNuxt(nuxtApp, plugin, [nuxtApp]) || {};
  if (provide && typeof provide === "object") {
    for (const key in provide) {
      nuxtApp.provide(key, provide[key]);
    }
  }
}
async function applyPlugins(nuxtApp, plugins2) {
  for (const plugin of plugins2) {
    await applyPlugin(nuxtApp, plugin);
  }
}
function normalizePlugins(_plugins2) {
  let needsLegacyContext = false;
  const plugins2 = _plugins2.map((plugin) => {
    if (typeof plugin !== "function") {
      return () => {
      };
    }
    if (isLegacyPlugin(plugin)) {
      needsLegacyContext = true;
      return (nuxtApp) => plugin(nuxtApp._legacyContext, nuxtApp.provide);
    }
    return plugin;
  });
  if (needsLegacyContext) {
    plugins2.unshift(legacyPlugin);
  }
  return plugins2;
}
function defineNuxtPlugin(plugin) {
  plugin[NuxtPluginIndicator] = true;
  return plugin;
}
function isLegacyPlugin(plugin) {
  return !plugin[NuxtPluginIndicator];
}
let currentNuxtAppInstance;
const setNuxtAppInstance = (nuxt) => {
  currentNuxtAppInstance = nuxt;
};
function callWithNuxt(nuxt, setup, args) {
  setNuxtAppInstance(nuxt);
  const p = args ? setup(...args) : setup();
  {
    setNuxtAppInstance(null);
  }
  return p;
}
function useNuxtApp() {
  const vm = vue_cjs_prod.getCurrentInstance();
  if (!vm) {
    if (!currentNuxtAppInstance) {
      throw new Error("nuxt instance unavailable");
    }
    return currentNuxtAppInstance;
  }
  return vm.appContext.app.$nuxt;
}
function useRuntimeConfig() {
  return useNuxtApp().$config;
}
function defineGetter(obj, key, val) {
  Object.defineProperty(obj, key, { get: () => val });
}
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
var vueRouter_cjs_prod = {};
/*!
  * vue-router v4.0.13
  * (c) 2022 Eduardo San Martin Morote
  * @license MIT
  */
(function(exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  var vue = require$$0;
  const hasSymbol = typeof Symbol === "function" && typeof Symbol.toStringTag === "symbol";
  const PolySymbol = (name) => hasSymbol ? Symbol(name) : "_vr_" + name;
  const matchedRouteKey = /* @__PURE__ */ PolySymbol("rvlm");
  const viewDepthKey = /* @__PURE__ */ PolySymbol("rvd");
  const routerKey = /* @__PURE__ */ PolySymbol("r");
  const routeLocationKey = /* @__PURE__ */ PolySymbol("rl");
  const routerViewLocationKey = /* @__PURE__ */ PolySymbol("rvl");
  function isESModule(obj) {
    return obj.__esModule || hasSymbol && obj[Symbol.toStringTag] === "Module";
  }
  const assign = Object.assign;
  function applyToParams(fn, params) {
    const newParams = {};
    for (const key in params) {
      const value = params[key];
      newParams[key] = Array.isArray(value) ? value.map(fn) : fn(value);
    }
    return newParams;
  }
  const noop2 = () => {
  };
  const TRAILING_SLASH_RE2 = /\/$/;
  const removeTrailingSlash = (path) => path.replace(TRAILING_SLASH_RE2, "");
  function parseURL2(parseQuery3, location2, currentLocation = "/") {
    let path, query = {}, searchString = "", hash = "";
    const searchPos = location2.indexOf("?");
    const hashPos = location2.indexOf("#", searchPos > -1 ? searchPos : 0);
    if (searchPos > -1) {
      path = location2.slice(0, searchPos);
      searchString = location2.slice(searchPos + 1, hashPos > -1 ? hashPos : location2.length);
      query = parseQuery3(searchString);
    }
    if (hashPos > -1) {
      path = path || location2.slice(0, hashPos);
      hash = location2.slice(hashPos, location2.length);
    }
    path = resolveRelativePath(path != null ? path : location2, currentLocation);
    return {
      fullPath: path + (searchString && "?") + searchString + hash,
      path,
      query,
      hash
    };
  }
  function stringifyURL(stringifyQuery3, location2) {
    const query = location2.query ? stringifyQuery3(location2.query) : "";
    return location2.path + (query && "?") + query + (location2.hash || "");
  }
  function stripBase(pathname, base) {
    if (!base || !pathname.toLowerCase().startsWith(base.toLowerCase()))
      return pathname;
    return pathname.slice(base.length) || "/";
  }
  function isSameRouteLocation(stringifyQuery3, a, b) {
    const aLastIndex = a.matched.length - 1;
    const bLastIndex = b.matched.length - 1;
    return aLastIndex > -1 && aLastIndex === bLastIndex && isSameRouteRecord(a.matched[aLastIndex], b.matched[bLastIndex]) && isSameRouteLocationParams(a.params, b.params) && stringifyQuery3(a.query) === stringifyQuery3(b.query) && a.hash === b.hash;
  }
  function isSameRouteRecord(a, b) {
    return (a.aliasOf || a) === (b.aliasOf || b);
  }
  function isSameRouteLocationParams(a, b) {
    if (Object.keys(a).length !== Object.keys(b).length)
      return false;
    for (const key in a) {
      if (!isSameRouteLocationParamsValue(a[key], b[key]))
        return false;
    }
    return true;
  }
  function isSameRouteLocationParamsValue(a, b) {
    return Array.isArray(a) ? isEquivalentArray(a, b) : Array.isArray(b) ? isEquivalentArray(b, a) : a === b;
  }
  function isEquivalentArray(a, b) {
    return Array.isArray(b) ? a.length === b.length && a.every((value, i) => value === b[i]) : a.length === 1 && a[0] === b;
  }
  function resolveRelativePath(to, from) {
    if (to.startsWith("/"))
      return to;
    if (!to)
      return from;
    const fromSegments = from.split("/");
    const toSegments = to.split("/");
    let position = fromSegments.length - 1;
    let toPosition;
    let segment;
    for (toPosition = 0; toPosition < toSegments.length; toPosition++) {
      segment = toSegments[toPosition];
      if (position === 1 || segment === ".")
        continue;
      if (segment === "..")
        position--;
      else
        break;
    }
    return fromSegments.slice(0, position).join("/") + "/" + toSegments.slice(toPosition - (toPosition === toSegments.length ? 1 : 0)).join("/");
  }
  var NavigationType;
  (function(NavigationType2) {
    NavigationType2["pop"] = "pop";
    NavigationType2["push"] = "push";
  })(NavigationType || (NavigationType = {}));
  var NavigationDirection;
  (function(NavigationDirection2) {
    NavigationDirection2["back"] = "back";
    NavigationDirection2["forward"] = "forward";
    NavigationDirection2["unknown"] = "";
  })(NavigationDirection || (NavigationDirection = {}));
  const START = "";
  function normalizeBase(base) {
    if (!base) {
      {
        base = "/";
      }
    }
    if (base[0] !== "/" && base[0] !== "#")
      base = "/" + base;
    return removeTrailingSlash(base);
  }
  const BEFORE_HASH_RE = /^[^#]+#/;
  function createHref(base, location2) {
    return base.replace(BEFORE_HASH_RE, "#") + location2;
  }
  const computeScrollPosition = () => ({
    left: window.pageXOffset,
    top: window.pageYOffset
  });
  let createBaseLocation = () => location.protocol + "//" + location.host;
  function createCurrentLocation(base, location2) {
    const { pathname, search, hash } = location2;
    const hashPos = base.indexOf("#");
    if (hashPos > -1) {
      let slicePos = hash.includes(base.slice(hashPos)) ? base.slice(hashPos).length : 1;
      let pathFromHash = hash.slice(slicePos);
      if (pathFromHash[0] !== "/")
        pathFromHash = "/" + pathFromHash;
      return stripBase(pathFromHash, "");
    }
    const path = stripBase(pathname, base);
    return path + search + hash;
  }
  function useHistoryListeners(base, historyState, currentLocation, replace) {
    let listeners = [];
    let teardowns = [];
    let pauseState = null;
    const popStateHandler = ({ state }) => {
      const to = createCurrentLocation(base, location);
      const from = currentLocation.value;
      const fromState = historyState.value;
      let delta = 0;
      if (state) {
        currentLocation.value = to;
        historyState.value = state;
        if (pauseState && pauseState === from) {
          pauseState = null;
          return;
        }
        delta = fromState ? state.position - fromState.position : 0;
      } else {
        replace(to);
      }
      listeners.forEach((listener) => {
        listener(currentLocation.value, from, {
          delta,
          type: NavigationType.pop,
          direction: delta ? delta > 0 ? NavigationDirection.forward : NavigationDirection.back : NavigationDirection.unknown
        });
      });
    };
    function pauseListeners() {
      pauseState = currentLocation.value;
    }
    function listen(callback) {
      listeners.push(callback);
      const teardown = () => {
        const index2 = listeners.indexOf(callback);
        if (index2 > -1)
          listeners.splice(index2, 1);
      };
      teardowns.push(teardown);
      return teardown;
    }
    function beforeUnloadListener() {
      const { history: history2 } = window;
      if (!history2.state)
        return;
      history2.replaceState(assign({}, history2.state, { scroll: computeScrollPosition() }), "");
    }
    function destroy() {
      for (const teardown of teardowns)
        teardown();
      teardowns = [];
      window.removeEventListener("popstate", popStateHandler);
      window.removeEventListener("beforeunload", beforeUnloadListener);
    }
    window.addEventListener("popstate", popStateHandler);
    window.addEventListener("beforeunload", beforeUnloadListener);
    return {
      pauseListeners,
      listen,
      destroy
    };
  }
  function buildState(back, current, forward, replaced = false, computeScroll = false) {
    return {
      back,
      current,
      forward,
      replaced,
      position: window.history.length,
      scroll: computeScroll ? computeScrollPosition() : null
    };
  }
  function useHistoryStateNavigation(base) {
    const { history: history2, location: location2 } = window;
    const currentLocation = {
      value: createCurrentLocation(base, location2)
    };
    const historyState = { value: history2.state };
    if (!historyState.value) {
      changeLocation(currentLocation.value, {
        back: null,
        current: currentLocation.value,
        forward: null,
        position: history2.length - 1,
        replaced: true,
        scroll: null
      }, true);
    }
    function changeLocation(to, state, replace2) {
      const hashIndex = base.indexOf("#");
      const url = hashIndex > -1 ? (location2.host && document.querySelector("base") ? base : base.slice(hashIndex)) + to : createBaseLocation() + base + to;
      try {
        history2[replace2 ? "replaceState" : "pushState"](state, "", url);
        historyState.value = state;
      } catch (err) {
        {
          console.error(err);
        }
        location2[replace2 ? "replace" : "assign"](url);
      }
    }
    function replace(to, data) {
      const state = assign({}, history2.state, buildState(historyState.value.back, to, historyState.value.forward, true), data, { position: historyState.value.position });
      changeLocation(to, state, true);
      currentLocation.value = to;
    }
    function push(to, data) {
      const currentState = assign({}, historyState.value, history2.state, {
        forward: to,
        scroll: computeScrollPosition()
      });
      changeLocation(currentState.current, currentState, true);
      const state = assign({}, buildState(currentLocation.value, to, null), { position: currentState.position + 1 }, data);
      changeLocation(to, state, false);
      currentLocation.value = to;
    }
    return {
      location: currentLocation,
      state: historyState,
      push,
      replace
    };
  }
  function createWebHistory(base) {
    base = normalizeBase(base);
    const historyNavigation = useHistoryStateNavigation(base);
    const historyListeners = useHistoryListeners(base, historyNavigation.state, historyNavigation.location, historyNavigation.replace);
    function go(delta, triggerListeners = true) {
      if (!triggerListeners)
        historyListeners.pauseListeners();
      history.go(delta);
    }
    const routerHistory = assign({
      location: "",
      base,
      go,
      createHref: createHref.bind(null, base)
    }, historyNavigation, historyListeners);
    Object.defineProperty(routerHistory, "location", {
      enumerable: true,
      get: () => historyNavigation.location.value
    });
    Object.defineProperty(routerHistory, "state", {
      enumerable: true,
      get: () => historyNavigation.state.value
    });
    return routerHistory;
  }
  function createMemoryHistory(base = "") {
    let listeners = [];
    let queue = [START];
    let position = 0;
    base = normalizeBase(base);
    function setLocation(location2) {
      position++;
      if (position === queue.length) {
        queue.push(location2);
      } else {
        queue.splice(position);
        queue.push(location2);
      }
    }
    function triggerListeners(to, from, { direction, delta }) {
      const info = {
        direction,
        delta,
        type: NavigationType.pop
      };
      for (const callback of listeners) {
        callback(to, from, info);
      }
    }
    const routerHistory = {
      location: START,
      state: {},
      base,
      createHref: createHref.bind(null, base),
      replace(to) {
        queue.splice(position--, 1);
        setLocation(to);
      },
      push(to, data) {
        setLocation(to);
      },
      listen(callback) {
        listeners.push(callback);
        return () => {
          const index2 = listeners.indexOf(callback);
          if (index2 > -1)
            listeners.splice(index2, 1);
        };
      },
      destroy() {
        listeners = [];
        queue = [START];
        position = 0;
      },
      go(delta, shouldTrigger = true) {
        const from = this.location;
        const direction = delta < 0 ? NavigationDirection.back : NavigationDirection.forward;
        position = Math.max(0, Math.min(position + delta, queue.length - 1));
        if (shouldTrigger) {
          triggerListeners(this.location, from, {
            direction,
            delta
          });
        }
      }
    };
    Object.defineProperty(routerHistory, "location", {
      enumerable: true,
      get: () => queue[position]
    });
    return routerHistory;
  }
  function createWebHashHistory(base) {
    base = location.host ? base || location.pathname + location.search : "";
    if (!base.includes("#"))
      base += "#";
    return createWebHistory(base);
  }
  function isRouteLocation(route) {
    return typeof route === "string" || route && typeof route === "object";
  }
  function isRouteName(name) {
    return typeof name === "string" || typeof name === "symbol";
  }
  const START_LOCATION_NORMALIZED = {
    path: "/",
    name: void 0,
    params: {},
    query: {},
    hash: "",
    fullPath: "/",
    matched: [],
    meta: {},
    redirectedFrom: void 0
  };
  const NavigationFailureSymbol = /* @__PURE__ */ PolySymbol("nf");
  exports.NavigationFailureType = void 0;
  (function(NavigationFailureType) {
    NavigationFailureType[NavigationFailureType["aborted"] = 4] = "aborted";
    NavigationFailureType[NavigationFailureType["cancelled"] = 8] = "cancelled";
    NavigationFailureType[NavigationFailureType["duplicated"] = 16] = "duplicated";
  })(exports.NavigationFailureType || (exports.NavigationFailureType = {}));
  const ErrorTypeMessages = {
    [1]({ location: location2, currentLocation }) {
      return `No match for
 ${JSON.stringify(location2)}${currentLocation ? "\nwhile being at\n" + JSON.stringify(currentLocation) : ""}`;
    },
    [2]({ from, to }) {
      return `Redirected from "${from.fullPath}" to "${stringifyRoute(to)}" via a navigation guard.`;
    },
    [4]({ from, to }) {
      return `Navigation aborted from "${from.fullPath}" to "${to.fullPath}" via a navigation guard.`;
    },
    [8]({ from, to }) {
      return `Navigation cancelled from "${from.fullPath}" to "${to.fullPath}" with a new navigation.`;
    },
    [16]({ from, to }) {
      return `Avoided redundant navigation to current location: "${from.fullPath}".`;
    }
  };
  function createRouterError(type, params) {
    {
      return assign(new Error(ErrorTypeMessages[type](params)), {
        type,
        [NavigationFailureSymbol]: true
      }, params);
    }
  }
  function isNavigationFailure(error, type) {
    return error instanceof Error && NavigationFailureSymbol in error && (type == null || !!(error.type & type));
  }
  const propertiesToLog = ["params", "query", "hash"];
  function stringifyRoute(to) {
    if (typeof to === "string")
      return to;
    if ("path" in to)
      return to.path;
    const location2 = {};
    for (const key of propertiesToLog) {
      if (key in to)
        location2[key] = to[key];
    }
    return JSON.stringify(location2, null, 2);
  }
  const BASE_PARAM_PATTERN = "[^/]+?";
  const BASE_PATH_PARSER_OPTIONS = {
    sensitive: false,
    strict: false,
    start: true,
    end: true
  };
  const REGEX_CHARS_RE = /[.+*?^${}()[\]/\\]/g;
  function tokensToParser(segments, extraOptions) {
    const options = assign({}, BASE_PATH_PARSER_OPTIONS, extraOptions);
    const score = [];
    let pattern = options.start ? "^" : "";
    const keys = [];
    for (const segment of segments) {
      const segmentScores = segment.length ? [] : [90];
      if (options.strict && !segment.length)
        pattern += "/";
      for (let tokenIndex = 0; tokenIndex < segment.length; tokenIndex++) {
        const token = segment[tokenIndex];
        let subSegmentScore = 40 + (options.sensitive ? 0.25 : 0);
        if (token.type === 0) {
          if (!tokenIndex)
            pattern += "/";
          pattern += token.value.replace(REGEX_CHARS_RE, "\\$&");
          subSegmentScore += 40;
        } else if (token.type === 1) {
          const { value, repeatable, optional, regexp } = token;
          keys.push({
            name: value,
            repeatable,
            optional
          });
          const re2 = regexp ? regexp : BASE_PARAM_PATTERN;
          if (re2 !== BASE_PARAM_PATTERN) {
            subSegmentScore += 10;
            try {
              new RegExp(`(${re2})`);
            } catch (err) {
              throw new Error(`Invalid custom RegExp for param "${value}" (${re2}): ` + err.message);
            }
          }
          let subPattern = repeatable ? `((?:${re2})(?:/(?:${re2}))*)` : `(${re2})`;
          if (!tokenIndex)
            subPattern = optional && segment.length < 2 ? `(?:/${subPattern})` : "/" + subPattern;
          if (optional)
            subPattern += "?";
          pattern += subPattern;
          subSegmentScore += 20;
          if (optional)
            subSegmentScore += -8;
          if (repeatable)
            subSegmentScore += -20;
          if (re2 === ".*")
            subSegmentScore += -50;
        }
        segmentScores.push(subSegmentScore);
      }
      score.push(segmentScores);
    }
    if (options.strict && options.end) {
      const i = score.length - 1;
      score[i][score[i].length - 1] += 0.7000000000000001;
    }
    if (!options.strict)
      pattern += "/?";
    if (options.end)
      pattern += "$";
    else if (options.strict)
      pattern += "(?:/|$)";
    const re = new RegExp(pattern, options.sensitive ? "" : "i");
    function parse2(path) {
      const match = path.match(re);
      const params = {};
      if (!match)
        return null;
      for (let i = 1; i < match.length; i++) {
        const value = match[i] || "";
        const key = keys[i - 1];
        params[key.name] = value && key.repeatable ? value.split("/") : value;
      }
      return params;
    }
    function stringify(params) {
      let path = "";
      let avoidDuplicatedSlash = false;
      for (const segment of segments) {
        if (!avoidDuplicatedSlash || !path.endsWith("/"))
          path += "/";
        avoidDuplicatedSlash = false;
        for (const token of segment) {
          if (token.type === 0) {
            path += token.value;
          } else if (token.type === 1) {
            const { value, repeatable, optional } = token;
            const param = value in params ? params[value] : "";
            if (Array.isArray(param) && !repeatable)
              throw new Error(`Provided param "${value}" is an array but it is not repeatable (* or + modifiers)`);
            const text = Array.isArray(param) ? param.join("/") : param;
            if (!text) {
              if (optional) {
                if (segment.length < 2) {
                  if (path.endsWith("/"))
                    path = path.slice(0, -1);
                  else
                    avoidDuplicatedSlash = true;
                }
              } else
                throw new Error(`Missing required param "${value}"`);
            }
            path += text;
          }
        }
      }
      return path;
    }
    return {
      re,
      score,
      keys,
      parse: parse2,
      stringify
    };
  }
  function compareScoreArray(a, b) {
    let i = 0;
    while (i < a.length && i < b.length) {
      const diff = b[i] - a[i];
      if (diff)
        return diff;
      i++;
    }
    if (a.length < b.length) {
      return a.length === 1 && a[0] === 40 + 40 ? -1 : 1;
    } else if (a.length > b.length) {
      return b.length === 1 && b[0] === 40 + 40 ? 1 : -1;
    }
    return 0;
  }
  function comparePathParserScore(a, b) {
    let i = 0;
    const aScore = a.score;
    const bScore = b.score;
    while (i < aScore.length && i < bScore.length) {
      const comp = compareScoreArray(aScore[i], bScore[i]);
      if (comp)
        return comp;
      i++;
    }
    return bScore.length - aScore.length;
  }
  const ROOT_TOKEN = {
    type: 0,
    value: ""
  };
  const VALID_PARAM_RE = /[a-zA-Z0-9_]/;
  function tokenizePath(path) {
    if (!path)
      return [[]];
    if (path === "/")
      return [[ROOT_TOKEN]];
    if (!path.startsWith("/")) {
      throw new Error(`Invalid path "${path}"`);
    }
    function crash(message) {
      throw new Error(`ERR (${state})/"${buffer}": ${message}`);
    }
    let state = 0;
    let previousState = state;
    const tokens = [];
    let segment;
    function finalizeSegment() {
      if (segment)
        tokens.push(segment);
      segment = [];
    }
    let i = 0;
    let char;
    let buffer = "";
    let customRe = "";
    function consumeBuffer() {
      if (!buffer)
        return;
      if (state === 0) {
        segment.push({
          type: 0,
          value: buffer
        });
      } else if (state === 1 || state === 2 || state === 3) {
        if (segment.length > 1 && (char === "*" || char === "+"))
          crash(`A repeatable param (${buffer}) must be alone in its segment. eg: '/:ids+.`);
        segment.push({
          type: 1,
          value: buffer,
          regexp: customRe,
          repeatable: char === "*" || char === "+",
          optional: char === "*" || char === "?"
        });
      } else {
        crash("Invalid state to consume buffer");
      }
      buffer = "";
    }
    function addCharToBuffer() {
      buffer += char;
    }
    while (i < path.length) {
      char = path[i++];
      if (char === "\\" && state !== 2) {
        previousState = state;
        state = 4;
        continue;
      }
      switch (state) {
        case 0:
          if (char === "/") {
            if (buffer) {
              consumeBuffer();
            }
            finalizeSegment();
          } else if (char === ":") {
            consumeBuffer();
            state = 1;
          } else {
            addCharToBuffer();
          }
          break;
        case 4:
          addCharToBuffer();
          state = previousState;
          break;
        case 1:
          if (char === "(") {
            state = 2;
          } else if (VALID_PARAM_RE.test(char)) {
            addCharToBuffer();
          } else {
            consumeBuffer();
            state = 0;
            if (char !== "*" && char !== "?" && char !== "+")
              i--;
          }
          break;
        case 2:
          if (char === ")") {
            if (customRe[customRe.length - 1] == "\\")
              customRe = customRe.slice(0, -1) + char;
            else
              state = 3;
          } else {
            customRe += char;
          }
          break;
        case 3:
          consumeBuffer();
          state = 0;
          if (char !== "*" && char !== "?" && char !== "+")
            i--;
          customRe = "";
          break;
        default:
          crash("Unknown state");
          break;
      }
    }
    if (state === 2)
      crash(`Unfinished custom RegExp for param "${buffer}"`);
    consumeBuffer();
    finalizeSegment();
    return tokens;
  }
  function createRouteRecordMatcher(record, parent, options) {
    const parser = tokensToParser(tokenizePath(record.path), options);
    const matcher = assign(parser, {
      record,
      parent,
      children: [],
      alias: []
    });
    if (parent) {
      if (!matcher.record.aliasOf === !parent.record.aliasOf)
        parent.children.push(matcher);
    }
    return matcher;
  }
  function createRouterMatcher(routes2, globalOptions) {
    const matchers = [];
    const matcherMap = /* @__PURE__ */ new Map();
    globalOptions = mergeOptions({ strict: false, end: true, sensitive: false }, globalOptions);
    function getRecordMatcher(name) {
      return matcherMap.get(name);
    }
    function addRoute(record, parent, originalRecord) {
      const isRootAdd = !originalRecord;
      const mainNormalizedRecord = normalizeRouteRecord(record);
      mainNormalizedRecord.aliasOf = originalRecord && originalRecord.record;
      const options = mergeOptions(globalOptions, record);
      const normalizedRecords = [
        mainNormalizedRecord
      ];
      if ("alias" in record) {
        const aliases = typeof record.alias === "string" ? [record.alias] : record.alias;
        for (const alias of aliases) {
          normalizedRecords.push(assign({}, mainNormalizedRecord, {
            components: originalRecord ? originalRecord.record.components : mainNormalizedRecord.components,
            path: alias,
            aliasOf: originalRecord ? originalRecord.record : mainNormalizedRecord
          }));
        }
      }
      let matcher;
      let originalMatcher;
      for (const normalizedRecord of normalizedRecords) {
        const { path } = normalizedRecord;
        if (parent && path[0] !== "/") {
          const parentPath = parent.record.path;
          const connectingSlash = parentPath[parentPath.length - 1] === "/" ? "" : "/";
          normalizedRecord.path = parent.record.path + (path && connectingSlash + path);
        }
        matcher = createRouteRecordMatcher(normalizedRecord, parent, options);
        if (originalRecord) {
          originalRecord.alias.push(matcher);
        } else {
          originalMatcher = originalMatcher || matcher;
          if (originalMatcher !== matcher)
            originalMatcher.alias.push(matcher);
          if (isRootAdd && record.name && !isAliasRecord(matcher))
            removeRoute(record.name);
        }
        if ("children" in mainNormalizedRecord) {
          const children = mainNormalizedRecord.children;
          for (let i = 0; i < children.length; i++) {
            addRoute(children[i], matcher, originalRecord && originalRecord.children[i]);
          }
        }
        originalRecord = originalRecord || matcher;
        insertMatcher(matcher);
      }
      return originalMatcher ? () => {
        removeRoute(originalMatcher);
      } : noop2;
    }
    function removeRoute(matcherRef) {
      if (isRouteName(matcherRef)) {
        const matcher = matcherMap.get(matcherRef);
        if (matcher) {
          matcherMap.delete(matcherRef);
          matchers.splice(matchers.indexOf(matcher), 1);
          matcher.children.forEach(removeRoute);
          matcher.alias.forEach(removeRoute);
        }
      } else {
        const index2 = matchers.indexOf(matcherRef);
        if (index2 > -1) {
          matchers.splice(index2, 1);
          if (matcherRef.record.name)
            matcherMap.delete(matcherRef.record.name);
          matcherRef.children.forEach(removeRoute);
          matcherRef.alias.forEach(removeRoute);
        }
      }
    }
    function getRoutes() {
      return matchers;
    }
    function insertMatcher(matcher) {
      let i = 0;
      while (i < matchers.length && comparePathParserScore(matcher, matchers[i]) >= 0 && (matcher.record.path !== matchers[i].record.path || !isRecordChildOf(matcher, matchers[i])))
        i++;
      matchers.splice(i, 0, matcher);
      if (matcher.record.name && !isAliasRecord(matcher))
        matcherMap.set(matcher.record.name, matcher);
    }
    function resolve(location2, currentLocation) {
      let matcher;
      let params = {};
      let path;
      let name;
      if ("name" in location2 && location2.name) {
        matcher = matcherMap.get(location2.name);
        if (!matcher)
          throw createRouterError(1, {
            location: location2
          });
        name = matcher.record.name;
        params = assign(paramsFromLocation(currentLocation.params, matcher.keys.filter((k) => !k.optional).map((k) => k.name)), location2.params);
        path = matcher.stringify(params);
      } else if ("path" in location2) {
        path = location2.path;
        matcher = matchers.find((m) => m.re.test(path));
        if (matcher) {
          params = matcher.parse(path);
          name = matcher.record.name;
        }
      } else {
        matcher = currentLocation.name ? matcherMap.get(currentLocation.name) : matchers.find((m) => m.re.test(currentLocation.path));
        if (!matcher)
          throw createRouterError(1, {
            location: location2,
            currentLocation
          });
        name = matcher.record.name;
        params = assign({}, currentLocation.params, location2.params);
        path = matcher.stringify(params);
      }
      const matched = [];
      let parentMatcher = matcher;
      while (parentMatcher) {
        matched.unshift(parentMatcher.record);
        parentMatcher = parentMatcher.parent;
      }
      return {
        name,
        path,
        params,
        matched,
        meta: mergeMetaFields(matched)
      };
    }
    routes2.forEach((route) => addRoute(route));
    return { addRoute, resolve, removeRoute, getRoutes, getRecordMatcher };
  }
  function paramsFromLocation(params, keys) {
    const newParams = {};
    for (const key of keys) {
      if (key in params)
        newParams[key] = params[key];
    }
    return newParams;
  }
  function normalizeRouteRecord(record) {
    return {
      path: record.path,
      redirect: record.redirect,
      name: record.name,
      meta: record.meta || {},
      aliasOf: void 0,
      beforeEnter: record.beforeEnter,
      props: normalizeRecordProps(record),
      children: record.children || [],
      instances: {},
      leaveGuards: /* @__PURE__ */ new Set(),
      updateGuards: /* @__PURE__ */ new Set(),
      enterCallbacks: {},
      components: "components" in record ? record.components || {} : { default: record.component }
    };
  }
  function normalizeRecordProps(record) {
    const propsObject = {};
    const props = record.props || false;
    if ("component" in record) {
      propsObject.default = props;
    } else {
      for (const name in record.components)
        propsObject[name] = typeof props === "boolean" ? props : props[name];
    }
    return propsObject;
  }
  function isAliasRecord(record) {
    while (record) {
      if (record.record.aliasOf)
        return true;
      record = record.parent;
    }
    return false;
  }
  function mergeMetaFields(matched) {
    return matched.reduce((meta2, record) => assign(meta2, record.meta), {});
  }
  function mergeOptions(defaults, partialOptions) {
    const options = {};
    for (const key in defaults) {
      options[key] = key in partialOptions ? partialOptions[key] : defaults[key];
    }
    return options;
  }
  function isRecordChildOf(record, parent) {
    return parent.children.some((child) => child === record || isRecordChildOf(record, child));
  }
  const HASH_RE2 = /#/g;
  const AMPERSAND_RE2 = /&/g;
  const SLASH_RE = /\//g;
  const EQUAL_RE2 = /=/g;
  const IM_RE = /\?/g;
  const PLUS_RE2 = /\+/g;
  const ENC_BRACKET_OPEN_RE2 = /%5B/g;
  const ENC_BRACKET_CLOSE_RE2 = /%5D/g;
  const ENC_CARET_RE2 = /%5E/g;
  const ENC_BACKTICK_RE2 = /%60/g;
  const ENC_CURLY_OPEN_RE2 = /%7B/g;
  const ENC_PIPE_RE2 = /%7C/g;
  const ENC_CURLY_CLOSE_RE2 = /%7D/g;
  const ENC_SPACE_RE2 = /%20/g;
  function commonEncode(text) {
    return encodeURI("" + text).replace(ENC_PIPE_RE2, "|").replace(ENC_BRACKET_OPEN_RE2, "[").replace(ENC_BRACKET_CLOSE_RE2, "]");
  }
  function encodeHash(text) {
    return commonEncode(text).replace(ENC_CURLY_OPEN_RE2, "{").replace(ENC_CURLY_CLOSE_RE2, "}").replace(ENC_CARET_RE2, "^");
  }
  function encodeQueryValue2(text) {
    return commonEncode(text).replace(PLUS_RE2, "%2B").replace(ENC_SPACE_RE2, "+").replace(HASH_RE2, "%23").replace(AMPERSAND_RE2, "%26").replace(ENC_BACKTICK_RE2, "`").replace(ENC_CURLY_OPEN_RE2, "{").replace(ENC_CURLY_CLOSE_RE2, "}").replace(ENC_CARET_RE2, "^");
  }
  function encodeQueryKey2(text) {
    return encodeQueryValue2(text).replace(EQUAL_RE2, "%3D");
  }
  function encodePath(text) {
    return commonEncode(text).replace(HASH_RE2, "%23").replace(IM_RE, "%3F");
  }
  function encodeParam(text) {
    return text == null ? "" : encodePath(text).replace(SLASH_RE, "%2F");
  }
  function decode2(text) {
    try {
      return decodeURIComponent("" + text);
    } catch (err) {
    }
    return "" + text;
  }
  function parseQuery2(search) {
    const query = {};
    if (search === "" || search === "?")
      return query;
    const hasLeadingIM = search[0] === "?";
    const searchParams = (hasLeadingIM ? search.slice(1) : search).split("&");
    for (let i = 0; i < searchParams.length; ++i) {
      const searchParam = searchParams[i].replace(PLUS_RE2, " ");
      const eqPos = searchParam.indexOf("=");
      const key = decode2(eqPos < 0 ? searchParam : searchParam.slice(0, eqPos));
      const value = eqPos < 0 ? null : decode2(searchParam.slice(eqPos + 1));
      if (key in query) {
        let currentValue = query[key];
        if (!Array.isArray(currentValue)) {
          currentValue = query[key] = [currentValue];
        }
        currentValue.push(value);
      } else {
        query[key] = value;
      }
    }
    return query;
  }
  function stringifyQuery2(query) {
    let search = "";
    for (let key in query) {
      const value = query[key];
      key = encodeQueryKey2(key);
      if (value == null) {
        if (value !== void 0) {
          search += (search.length ? "&" : "") + key;
        }
        continue;
      }
      const values = Array.isArray(value) ? value.map((v) => v && encodeQueryValue2(v)) : [value && encodeQueryValue2(value)];
      values.forEach((value2) => {
        if (value2 !== void 0) {
          search += (search.length ? "&" : "") + key;
          if (value2 != null)
            search += "=" + value2;
        }
      });
    }
    return search;
  }
  function normalizeQuery(query) {
    const normalizedQuery = {};
    for (const key in query) {
      const value = query[key];
      if (value !== void 0) {
        normalizedQuery[key] = Array.isArray(value) ? value.map((v) => v == null ? null : "" + v) : value == null ? value : "" + value;
      }
    }
    return normalizedQuery;
  }
  function useCallbacks() {
    let handlers2 = [];
    function add(handler) {
      handlers2.push(handler);
      return () => {
        const i = handlers2.indexOf(handler);
        if (i > -1)
          handlers2.splice(i, 1);
      };
    }
    function reset() {
      handlers2 = [];
    }
    return {
      add,
      list: () => handlers2,
      reset
    };
  }
  function registerGuard(record, name, guard) {
    const removeFromList = () => {
      record[name].delete(guard);
    };
    vue.onUnmounted(removeFromList);
    vue.onDeactivated(removeFromList);
    vue.onActivated(() => {
      record[name].add(guard);
    });
    record[name].add(guard);
  }
  function onBeforeRouteLeave(leaveGuard) {
    const activeRecord = vue.inject(matchedRouteKey, {}).value;
    if (!activeRecord) {
      return;
    }
    registerGuard(activeRecord, "leaveGuards", leaveGuard);
  }
  function onBeforeRouteUpdate(updateGuard) {
    const activeRecord = vue.inject(matchedRouteKey, {}).value;
    if (!activeRecord) {
      return;
    }
    registerGuard(activeRecord, "updateGuards", updateGuard);
  }
  function guardToPromiseFn(guard, to, from, record, name) {
    const enterCallbackArray = record && (record.enterCallbacks[name] = record.enterCallbacks[name] || []);
    return () => new Promise((resolve, reject) => {
      const next = (valid) => {
        if (valid === false)
          reject(createRouterError(4, {
            from,
            to
          }));
        else if (valid instanceof Error) {
          reject(valid);
        } else if (isRouteLocation(valid)) {
          reject(createRouterError(2, {
            from: to,
            to: valid
          }));
        } else {
          if (enterCallbackArray && record.enterCallbacks[name] === enterCallbackArray && typeof valid === "function")
            enterCallbackArray.push(valid);
          resolve();
        }
      };
      const guardReturn = guard.call(record && record.instances[name], to, from, next);
      let guardCall = Promise.resolve(guardReturn);
      if (guard.length < 3)
        guardCall = guardCall.then(next);
      guardCall.catch((err) => reject(err));
    });
  }
  function extractComponentsGuards(matched, guardType, to, from) {
    const guards = [];
    for (const record of matched) {
      for (const name in record.components) {
        let rawComponent = record.components[name];
        if (guardType !== "beforeRouteEnter" && !record.instances[name])
          continue;
        if (isRouteComponent(rawComponent)) {
          const options = rawComponent.__vccOpts || rawComponent;
          const guard = options[guardType];
          guard && guards.push(guardToPromiseFn(guard, to, from, record, name));
        } else {
          let componentPromise = rawComponent();
          guards.push(() => componentPromise.then((resolved) => {
            if (!resolved)
              return Promise.reject(new Error(`Couldn't resolve component "${name}" at "${record.path}"`));
            const resolvedComponent = isESModule(resolved) ? resolved.default : resolved;
            record.components[name] = resolvedComponent;
            const options = resolvedComponent.__vccOpts || resolvedComponent;
            const guard = options[guardType];
            return guard && guardToPromiseFn(guard, to, from, record, name)();
          }));
        }
      }
    }
    return guards;
  }
  function isRouteComponent(component) {
    return typeof component === "object" || "displayName" in component || "props" in component || "__vccOpts" in component;
  }
  function useLink(props) {
    const router = vue.inject(routerKey);
    const currentRoute = vue.inject(routeLocationKey);
    const route = vue.computed(() => router.resolve(vue.unref(props.to)));
    const activeRecordIndex = vue.computed(() => {
      const { matched } = route.value;
      const { length } = matched;
      const routeMatched = matched[length - 1];
      const currentMatched = currentRoute.matched;
      if (!routeMatched || !currentMatched.length)
        return -1;
      const index2 = currentMatched.findIndex(isSameRouteRecord.bind(null, routeMatched));
      if (index2 > -1)
        return index2;
      const parentRecordPath = getOriginalPath(matched[length - 2]);
      return length > 1 && getOriginalPath(routeMatched) === parentRecordPath && currentMatched[currentMatched.length - 1].path !== parentRecordPath ? currentMatched.findIndex(isSameRouteRecord.bind(null, matched[length - 2])) : index2;
    });
    const isActive = vue.computed(() => activeRecordIndex.value > -1 && includesParams(currentRoute.params, route.value.params));
    const isExactActive = vue.computed(() => activeRecordIndex.value > -1 && activeRecordIndex.value === currentRoute.matched.length - 1 && isSameRouteLocationParams(currentRoute.params, route.value.params));
    function navigate(e = {}) {
      if (guardEvent(e)) {
        return router[vue.unref(props.replace) ? "replace" : "push"](vue.unref(props.to)).catch(noop2);
      }
      return Promise.resolve();
    }
    return {
      route,
      href: vue.computed(() => route.value.href),
      isActive,
      isExactActive,
      navigate
    };
  }
  const RouterLinkImpl = /* @__PURE__ */ vue.defineComponent({
    name: "RouterLink",
    props: {
      to: {
        type: [String, Object],
        required: true
      },
      replace: Boolean,
      activeClass: String,
      exactActiveClass: String,
      custom: Boolean,
      ariaCurrentValue: {
        type: String,
        default: "page"
      }
    },
    useLink,
    setup(props, { slots }) {
      const link = vue.reactive(useLink(props));
      const { options } = vue.inject(routerKey);
      const elClass = vue.computed(() => ({
        [getLinkClass(props.activeClass, options.linkActiveClass, "router-link-active")]: link.isActive,
        [getLinkClass(props.exactActiveClass, options.linkExactActiveClass, "router-link-exact-active")]: link.isExactActive
      }));
      return () => {
        const children = slots.default && slots.default(link);
        return props.custom ? children : vue.h("a", {
          "aria-current": link.isExactActive ? props.ariaCurrentValue : null,
          href: link.href,
          onClick: link.navigate,
          class: elClass.value
        }, children);
      };
    }
  });
  const RouterLink = RouterLinkImpl;
  function guardEvent(e) {
    if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey)
      return;
    if (e.defaultPrevented)
      return;
    if (e.button !== void 0 && e.button !== 0)
      return;
    if (e.currentTarget && e.currentTarget.getAttribute) {
      const target = e.currentTarget.getAttribute("target");
      if (/\b_blank\b/i.test(target))
        return;
    }
    if (e.preventDefault)
      e.preventDefault();
    return true;
  }
  function includesParams(outer, inner) {
    for (const key in inner) {
      const innerValue = inner[key];
      const outerValue = outer[key];
      if (typeof innerValue === "string") {
        if (innerValue !== outerValue)
          return false;
      } else {
        if (!Array.isArray(outerValue) || outerValue.length !== innerValue.length || innerValue.some((value, i) => value !== outerValue[i]))
          return false;
      }
    }
    return true;
  }
  function getOriginalPath(record) {
    return record ? record.aliasOf ? record.aliasOf.path : record.path : "";
  }
  const getLinkClass = (propClass, globalClass, defaultClass) => propClass != null ? propClass : globalClass != null ? globalClass : defaultClass;
  const RouterViewImpl = /* @__PURE__ */ vue.defineComponent({
    name: "RouterView",
    inheritAttrs: false,
    props: {
      name: {
        type: String,
        default: "default"
      },
      route: Object
    },
    setup(props, { attrs, slots }) {
      const injectedRoute = vue.inject(routerViewLocationKey);
      const routeToDisplay = vue.computed(() => props.route || injectedRoute.value);
      const depth = vue.inject(viewDepthKey, 0);
      const matchedRouteRef = vue.computed(() => routeToDisplay.value.matched[depth]);
      vue.provide(viewDepthKey, depth + 1);
      vue.provide(matchedRouteKey, matchedRouteRef);
      vue.provide(routerViewLocationKey, routeToDisplay);
      const viewRef = vue.ref();
      vue.watch(() => [viewRef.value, matchedRouteRef.value, props.name], ([instance, to, name], [oldInstance, from, oldName]) => {
        if (to) {
          to.instances[name] = instance;
          if (from && from !== to && instance && instance === oldInstance) {
            if (!to.leaveGuards.size) {
              to.leaveGuards = from.leaveGuards;
            }
            if (!to.updateGuards.size) {
              to.updateGuards = from.updateGuards;
            }
          }
        }
        if (instance && to && (!from || !isSameRouteRecord(to, from) || !oldInstance)) {
          (to.enterCallbacks[name] || []).forEach((callback) => callback(instance));
        }
      }, { flush: "post" });
      return () => {
        const route = routeToDisplay.value;
        const matchedRoute = matchedRouteRef.value;
        const ViewComponent = matchedRoute && matchedRoute.components[props.name];
        const currentName = props.name;
        if (!ViewComponent) {
          return normalizeSlot(slots.default, { Component: ViewComponent, route });
        }
        const routePropsOption = matchedRoute.props[props.name];
        const routeProps = routePropsOption ? routePropsOption === true ? route.params : typeof routePropsOption === "function" ? routePropsOption(route) : routePropsOption : null;
        const onVnodeUnmounted = (vnode) => {
          if (vnode.component.isUnmounted) {
            matchedRoute.instances[currentName] = null;
          }
        };
        const component = vue.h(ViewComponent, assign({}, routeProps, attrs, {
          onVnodeUnmounted,
          ref: viewRef
        }));
        return normalizeSlot(slots.default, { Component: component, route }) || component;
      };
    }
  });
  function normalizeSlot(slot, data) {
    if (!slot)
      return null;
    const slotContent = slot(data);
    return slotContent.length === 1 ? slotContent[0] : slotContent;
  }
  const RouterView = RouterViewImpl;
  function createRouter(options) {
    const matcher = createRouterMatcher(options.routes, options);
    const parseQuery$1 = options.parseQuery || parseQuery2;
    const stringifyQuery$1 = options.stringifyQuery || stringifyQuery2;
    const routerHistory = options.history;
    const beforeGuards = useCallbacks();
    const beforeResolveGuards = useCallbacks();
    const afterGuards = useCallbacks();
    const currentRoute = vue.shallowRef(START_LOCATION_NORMALIZED);
    let pendingLocation = START_LOCATION_NORMALIZED;
    const normalizeParams = applyToParams.bind(null, (paramValue) => "" + paramValue);
    const encodeParams = applyToParams.bind(null, encodeParam);
    const decodeParams = applyToParams.bind(null, decode2);
    function addRoute(parentOrRoute, route) {
      let parent;
      let record;
      if (isRouteName(parentOrRoute)) {
        parent = matcher.getRecordMatcher(parentOrRoute);
        record = route;
      } else {
        record = parentOrRoute;
      }
      return matcher.addRoute(record, parent);
    }
    function removeRoute(name) {
      const recordMatcher = matcher.getRecordMatcher(name);
      if (recordMatcher) {
        matcher.removeRoute(recordMatcher);
      }
    }
    function getRoutes() {
      return matcher.getRoutes().map((routeMatcher) => routeMatcher.record);
    }
    function hasRoute(name) {
      return !!matcher.getRecordMatcher(name);
    }
    function resolve(rawLocation, currentLocation) {
      currentLocation = assign({}, currentLocation || currentRoute.value);
      if (typeof rawLocation === "string") {
        const locationNormalized = parseURL2(parseQuery$1, rawLocation, currentLocation.path);
        const matchedRoute2 = matcher.resolve({ path: locationNormalized.path }, currentLocation);
        const href2 = routerHistory.createHref(locationNormalized.fullPath);
        return assign(locationNormalized, matchedRoute2, {
          params: decodeParams(matchedRoute2.params),
          hash: decode2(locationNormalized.hash),
          redirectedFrom: void 0,
          href: href2
        });
      }
      let matcherLocation;
      if ("path" in rawLocation) {
        matcherLocation = assign({}, rawLocation, {
          path: parseURL2(parseQuery$1, rawLocation.path, currentLocation.path).path
        });
      } else {
        const targetParams = assign({}, rawLocation.params);
        for (const key in targetParams) {
          if (targetParams[key] == null) {
            delete targetParams[key];
          }
        }
        matcherLocation = assign({}, rawLocation, {
          params: encodeParams(rawLocation.params)
        });
        currentLocation.params = encodeParams(currentLocation.params);
      }
      const matchedRoute = matcher.resolve(matcherLocation, currentLocation);
      const hash = rawLocation.hash || "";
      matchedRoute.params = normalizeParams(decodeParams(matchedRoute.params));
      const fullPath = stringifyURL(stringifyQuery$1, assign({}, rawLocation, {
        hash: encodeHash(hash),
        path: matchedRoute.path
      }));
      const href = routerHistory.createHref(fullPath);
      return assign({
        fullPath,
        hash,
        query: stringifyQuery$1 === stringifyQuery2 ? normalizeQuery(rawLocation.query) : rawLocation.query || {}
      }, matchedRoute, {
        redirectedFrom: void 0,
        href
      });
    }
    function locationAsObject(to) {
      return typeof to === "string" ? parseURL2(parseQuery$1, to, currentRoute.value.path) : assign({}, to);
    }
    function checkCanceledNavigation(to, from) {
      if (pendingLocation !== to) {
        return createRouterError(8, {
          from,
          to
        });
      }
    }
    function push(to) {
      return pushWithRedirect(to);
    }
    function replace(to) {
      return push(assign(locationAsObject(to), { replace: true }));
    }
    function handleRedirectRecord(to) {
      const lastMatched = to.matched[to.matched.length - 1];
      if (lastMatched && lastMatched.redirect) {
        const { redirect } = lastMatched;
        let newTargetLocation = typeof redirect === "function" ? redirect(to) : redirect;
        if (typeof newTargetLocation === "string") {
          newTargetLocation = newTargetLocation.includes("?") || newTargetLocation.includes("#") ? newTargetLocation = locationAsObject(newTargetLocation) : { path: newTargetLocation };
          newTargetLocation.params = {};
        }
        return assign({
          query: to.query,
          hash: to.hash,
          params: to.params
        }, newTargetLocation);
      }
    }
    function pushWithRedirect(to, redirectedFrom) {
      const targetLocation = pendingLocation = resolve(to);
      const from = currentRoute.value;
      const data = to.state;
      const force = to.force;
      const replace2 = to.replace === true;
      const shouldRedirect = handleRedirectRecord(targetLocation);
      if (shouldRedirect)
        return pushWithRedirect(assign(locationAsObject(shouldRedirect), {
          state: data,
          force,
          replace: replace2
        }), redirectedFrom || targetLocation);
      const toLocation = targetLocation;
      toLocation.redirectedFrom = redirectedFrom;
      let failure;
      if (!force && isSameRouteLocation(stringifyQuery$1, from, targetLocation)) {
        failure = createRouterError(16, { to: toLocation, from });
        handleScroll();
      }
      return (failure ? Promise.resolve(failure) : navigate(toLocation, from)).catch((error) => isNavigationFailure(error) ? isNavigationFailure(error, 2) ? error : markAsReady(error) : triggerError(error, toLocation, from)).then((failure2) => {
        if (failure2) {
          if (isNavigationFailure(failure2, 2)) {
            return pushWithRedirect(assign(locationAsObject(failure2.to), {
              state: data,
              force,
              replace: replace2
            }), redirectedFrom || toLocation);
          }
        } else {
          failure2 = finalizeNavigation(toLocation, from, true, replace2, data);
        }
        triggerAfterEach(toLocation, from, failure2);
        return failure2;
      });
    }
    function checkCanceledNavigationAndReject(to, from) {
      const error = checkCanceledNavigation(to, from);
      return error ? Promise.reject(error) : Promise.resolve();
    }
    function navigate(to, from) {
      let guards;
      const [leavingRecords, updatingRecords, enteringRecords] = extractChangingRecords(to, from);
      guards = extractComponentsGuards(leavingRecords.reverse(), "beforeRouteLeave", to, from);
      for (const record of leavingRecords) {
        record.leaveGuards.forEach((guard) => {
          guards.push(guardToPromiseFn(guard, to, from));
        });
      }
      const canceledNavigationCheck = checkCanceledNavigationAndReject.bind(null, to, from);
      guards.push(canceledNavigationCheck);
      return runGuardQueue(guards).then(() => {
        guards = [];
        for (const guard of beforeGuards.list()) {
          guards.push(guardToPromiseFn(guard, to, from));
        }
        guards.push(canceledNavigationCheck);
        return runGuardQueue(guards);
      }).then(() => {
        guards = extractComponentsGuards(updatingRecords, "beforeRouteUpdate", to, from);
        for (const record of updatingRecords) {
          record.updateGuards.forEach((guard) => {
            guards.push(guardToPromiseFn(guard, to, from));
          });
        }
        guards.push(canceledNavigationCheck);
        return runGuardQueue(guards);
      }).then(() => {
        guards = [];
        for (const record of to.matched) {
          if (record.beforeEnter && !from.matched.includes(record)) {
            if (Array.isArray(record.beforeEnter)) {
              for (const beforeEnter of record.beforeEnter)
                guards.push(guardToPromiseFn(beforeEnter, to, from));
            } else {
              guards.push(guardToPromiseFn(record.beforeEnter, to, from));
            }
          }
        }
        guards.push(canceledNavigationCheck);
        return runGuardQueue(guards);
      }).then(() => {
        to.matched.forEach((record) => record.enterCallbacks = {});
        guards = extractComponentsGuards(enteringRecords, "beforeRouteEnter", to, from);
        guards.push(canceledNavigationCheck);
        return runGuardQueue(guards);
      }).then(() => {
        guards = [];
        for (const guard of beforeResolveGuards.list()) {
          guards.push(guardToPromiseFn(guard, to, from));
        }
        guards.push(canceledNavigationCheck);
        return runGuardQueue(guards);
      }).catch((err) => isNavigationFailure(err, 8) ? err : Promise.reject(err));
    }
    function triggerAfterEach(to, from, failure) {
      for (const guard of afterGuards.list())
        guard(to, from, failure);
    }
    function finalizeNavigation(toLocation, from, isPush, replace2, data) {
      const error = checkCanceledNavigation(toLocation, from);
      if (error)
        return error;
      const isFirstNavigation = from === START_LOCATION_NORMALIZED;
      const state = {};
      if (isPush) {
        if (replace2 || isFirstNavigation)
          routerHistory.replace(toLocation.fullPath, assign({
            scroll: isFirstNavigation && state && state.scroll
          }, data));
        else
          routerHistory.push(toLocation.fullPath, data);
      }
      currentRoute.value = toLocation;
      handleScroll();
      markAsReady();
    }
    let removeHistoryListener;
    function setupListeners() {
      removeHistoryListener = routerHistory.listen((to, _from, info) => {
        const toLocation = resolve(to);
        const shouldRedirect = handleRedirectRecord(toLocation);
        if (shouldRedirect) {
          pushWithRedirect(assign(shouldRedirect, { replace: true }), toLocation).catch(noop2);
          return;
        }
        pendingLocation = toLocation;
        const from = currentRoute.value;
        navigate(toLocation, from).catch((error) => {
          if (isNavigationFailure(error, 4 | 8)) {
            return error;
          }
          if (isNavigationFailure(error, 2)) {
            pushWithRedirect(error.to, toLocation).then((failure) => {
              if (isNavigationFailure(failure, 4 | 16) && !info.delta && info.type === NavigationType.pop) {
                routerHistory.go(-1, false);
              }
            }).catch(noop2);
            return Promise.reject();
          }
          if (info.delta)
            routerHistory.go(-info.delta, false);
          return triggerError(error, toLocation, from);
        }).then((failure) => {
          failure = failure || finalizeNavigation(toLocation, from, false);
          if (failure) {
            if (info.delta) {
              routerHistory.go(-info.delta, false);
            } else if (info.type === NavigationType.pop && isNavigationFailure(failure, 4 | 16)) {
              routerHistory.go(-1, false);
            }
          }
          triggerAfterEach(toLocation, from, failure);
        }).catch(noop2);
      });
    }
    let readyHandlers = useCallbacks();
    let errorHandlers = useCallbacks();
    let ready;
    function triggerError(error, to, from) {
      markAsReady(error);
      const list = errorHandlers.list();
      if (list.length) {
        list.forEach((handler) => handler(error, to, from));
      } else {
        console.error(error);
      }
      return Promise.reject(error);
    }
    function isReady() {
      if (ready && currentRoute.value !== START_LOCATION_NORMALIZED)
        return Promise.resolve();
      return new Promise((resolve2, reject) => {
        readyHandlers.add([resolve2, reject]);
      });
    }
    function markAsReady(err) {
      if (!ready) {
        ready = !err;
        setupListeners();
        readyHandlers.list().forEach(([resolve2, reject]) => err ? reject(err) : resolve2());
        readyHandlers.reset();
      }
      return err;
    }
    function handleScroll(to, from, isPush, isFirstNavigation) {
      return Promise.resolve();
    }
    const go = (delta) => routerHistory.go(delta);
    const installedApps = /* @__PURE__ */ new Set();
    const router = {
      currentRoute,
      addRoute,
      removeRoute,
      hasRoute,
      getRoutes,
      resolve,
      options,
      push,
      replace,
      go,
      back: () => go(-1),
      forward: () => go(1),
      beforeEach: beforeGuards.add,
      beforeResolve: beforeResolveGuards.add,
      afterEach: afterGuards.add,
      onError: errorHandlers.add,
      isReady,
      install(app) {
        const router2 = this;
        app.component("RouterLink", RouterLink);
        app.component("RouterView", RouterView);
        app.config.globalProperties.$router = router2;
        Object.defineProperty(app.config.globalProperties, "$route", {
          enumerable: true,
          get: () => vue.unref(currentRoute)
        });
        const reactiveRoute = {};
        for (const key in START_LOCATION_NORMALIZED) {
          reactiveRoute[key] = vue.computed(() => currentRoute.value[key]);
        }
        app.provide(routerKey, router2);
        app.provide(routeLocationKey, vue.reactive(reactiveRoute));
        app.provide(routerViewLocationKey, currentRoute);
        const unmountApp = app.unmount;
        installedApps.add(app);
        app.unmount = function() {
          installedApps.delete(app);
          if (installedApps.size < 1) {
            pendingLocation = START_LOCATION_NORMALIZED;
            removeHistoryListener && removeHistoryListener();
            currentRoute.value = START_LOCATION_NORMALIZED;
            ready = false;
          }
          unmountApp();
        };
      }
    };
    return router;
  }
  function runGuardQueue(guards) {
    return guards.reduce((promise, guard) => promise.then(() => guard()), Promise.resolve());
  }
  function extractChangingRecords(to, from) {
    const leavingRecords = [];
    const updatingRecords = [];
    const enteringRecords = [];
    const len = Math.max(from.matched.length, to.matched.length);
    for (let i = 0; i < len; i++) {
      const recordFrom = from.matched[i];
      if (recordFrom) {
        if (to.matched.find((record) => isSameRouteRecord(record, recordFrom)))
          updatingRecords.push(recordFrom);
        else
          leavingRecords.push(recordFrom);
      }
      const recordTo = to.matched[i];
      if (recordTo) {
        if (!from.matched.find((record) => isSameRouteRecord(record, recordTo))) {
          enteringRecords.push(recordTo);
        }
      }
    }
    return [leavingRecords, updatingRecords, enteringRecords];
  }
  function useRouter() {
    return vue.inject(routerKey);
  }
  function useRoute2() {
    return vue.inject(routeLocationKey);
  }
  exports.RouterLink = RouterLink;
  exports.RouterView = RouterView;
  exports.START_LOCATION = START_LOCATION_NORMALIZED;
  exports.createMemoryHistory = createMemoryHistory;
  exports.createRouter = createRouter;
  exports.createRouterMatcher = createRouterMatcher;
  exports.createWebHashHistory = createWebHashHistory;
  exports.createWebHistory = createWebHistory;
  exports.isNavigationFailure = isNavigationFailure;
  exports.matchedRouteKey = matchedRouteKey;
  exports.onBeforeRouteLeave = onBeforeRouteLeave;
  exports.onBeforeRouteUpdate = onBeforeRouteUpdate;
  exports.parseQuery = parseQuery2;
  exports.routeLocationKey = routeLocationKey;
  exports.routerKey = routerKey;
  exports.routerViewLocationKey = routerViewLocationKey;
  exports.stringifyQuery = stringifyQuery2;
  exports.useLink = useLink;
  exports.useRoute = useRoute2;
  exports.useRouter = useRouter;
  exports.viewDepthKey = viewDepthKey;
})(vueRouter_cjs_prod);
const getDefault = () => null;
function useAsyncData(key, handler, options = {}) {
  var _a2, _b2, _c, _d;
  if (typeof key !== "string") {
    throw new TypeError("asyncData key must be a string");
  }
  if (typeof handler !== "function") {
    throw new TypeError("asyncData handler must be a function");
  }
  options = __spreadValues({ server: true, default: getDefault }, options);
  if (options.defer) {
    console.warn("[useAsyncData] `defer` has been renamed to `lazy`. Support for `defer` will be removed in RC.");
  }
  options.lazy = (_b2 = (_a2 = options.lazy) != null ? _a2 : options.defer) != null ? _b2 : false;
  const nuxt = useNuxtApp();
  const instance = vue_cjs_prod.getCurrentInstance();
  if (instance && !instance._nuxtOnBeforeMountCbs) {
    const cbs = instance._nuxtOnBeforeMountCbs = [];
    if (instance && false) {
      vue_cjs_prod.onBeforeMount(() => {
        cbs.forEach((cb) => {
          cb();
        });
        cbs.splice(0, cbs.length);
      });
      vue_cjs_prod.onUnmounted(() => cbs.splice(0, cbs.length));
    }
  }
  const asyncData = {
    data: vue_cjs_prod.ref((_c = nuxt.payload.data[key]) != null ? _c : options.default()),
    pending: vue_cjs_prod.ref(true),
    error: vue_cjs_prod.ref((_d = nuxt.payload._errors[key]) != null ? _d : null)
  };
  asyncData.refresh = (force) => {
    if (nuxt._asyncDataPromises[key] && !force) {
      return nuxt._asyncDataPromises[key];
    }
    asyncData.pending.value = true;
    nuxt._asyncDataPromises[key] = Promise.resolve(handler(nuxt)).then((result) => {
      if (options.transform) {
        result = options.transform(result);
      }
      if (options.pick) {
        result = pick(result, options.pick);
      }
      asyncData.data.value = result;
      asyncData.error.value = null;
    }).catch((error) => {
      asyncData.error.value = error;
      asyncData.data.value = options.default();
    }).finally(() => {
      asyncData.pending.value = false;
      nuxt.payload.data[key] = asyncData.data.value;
      if (asyncData.error.value) {
        nuxt.payload._errors[key] = true;
      }
      delete nuxt._asyncDataPromises[key];
    });
    return nuxt._asyncDataPromises[key];
  };
  const fetchOnServer = options.server !== false && nuxt.payload.serverRendered;
  if (fetchOnServer) {
    const promise = asyncData.refresh();
    vue_cjs_prod.onServerPrefetch(() => promise);
  }
  const asyncDataPromise = Promise.resolve(nuxt._asyncDataPromises[key]).then(() => asyncData);
  Object.assign(asyncDataPromise, asyncData);
  return asyncDataPromise;
}
function pick(obj, keys) {
  const newObj = {};
  for (const key of keys) {
    newObj[key] = obj[key];
  }
  return newObj;
}
const createBuffer = (val) => new TextEncoder().encode(val);
function murmurHashV3(key, seed = 0) {
  if (typeof key === "string") {
    key = createBuffer(key);
  }
  let remainder, bytes, h1, h1b, c1, c2, k1, i;
  remainder = key.length & 3;
  bytes = key.length - remainder;
  h1 = seed;
  c1 = 3432918353;
  c2 = 461845907;
  i = 0;
  while (i < bytes) {
    k1 = key[i] & 255 | (key[++i] & 255) << 8 | (key[++i] & 255) << 16 | (key[++i] & 255) << 24;
    ++i;
    k1 = (k1 & 65535) * c1 + (((k1 >>> 16) * c1 & 65535) << 16) & 4294967295;
    k1 = k1 << 15 | k1 >>> 17;
    k1 = (k1 & 65535) * c2 + (((k1 >>> 16) * c2 & 65535) << 16) & 4294967295;
    h1 ^= k1;
    h1 = h1 << 13 | h1 >>> 19;
    h1b = (h1 & 65535) * 5 + (((h1 >>> 16) * 5 & 65535) << 16) & 4294967295;
    h1 = (h1b & 65535) + 27492 + (((h1b >>> 16) + 58964 & 65535) << 16);
  }
  k1 = 0;
  switch (remainder) {
    case 3:
      k1 ^= (key[i + 2] & 255) << 16;
    case 2:
      k1 ^= (key[i + 1] & 255) << 8;
    case 1:
      k1 ^= key[i] & 255;
      k1 = (k1 & 65535) * c1 + (((k1 >>> 16) * c1 & 65535) << 16) & 4294967295;
      k1 = k1 << 15 | k1 >>> 17;
      k1 = (k1 & 65535) * c2 + (((k1 >>> 16) * c2 & 65535) << 16) & 4294967295;
      h1 ^= k1;
  }
  h1 ^= key.length;
  h1 ^= h1 >>> 16;
  h1 = (h1 & 65535) * 2246822507 + (((h1 >>> 16) * 2246822507 & 65535) << 16) & 4294967295;
  h1 ^= h1 >>> 13;
  h1 = (h1 & 65535) * 3266489909 + (((h1 >>> 16) * 3266489909 & 65535) << 16) & 4294967295;
  h1 ^= h1 >>> 16;
  return h1 >>> 0;
}
function useFetch(url, opts = {}) {
  if (!opts.key) {
    const keys = { u: url };
    if (opts.baseURL) {
      keys.b = opts.baseURL;
    }
    if (opts.method && opts.method.toLowerCase() !== "get") {
      keys.m = opts.method.toLowerCase();
    }
    if (opts.params) {
      keys.p = opts.params;
    }
    opts.key = generateKey(keys);
  }
  return useAsyncData(opts.key, () => $fetch(url, opts), opts);
}
function generateKey(keys) {
  return "$f" + murmurHashV3(JSON.stringify(keys));
}
const decode$1 = decodeURIComponent;
const encode$1 = encodeURIComponent;
const pairSplitRegExp = /; */;
const fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
function parse(str, options) {
  if (typeof str !== "string") {
    throw new TypeError("argument str must be a string");
  }
  let obj = {};
  let opt = options || {};
  let pairs = str.split(pairSplitRegExp);
  let dec = opt.decode || decode$1;
  for (let i = 0; i < pairs.length; i++) {
    let pair = pairs[i];
    let eq_idx = pair.indexOf("=");
    if (eq_idx < 0) {
      continue;
    }
    let key = pair.substr(0, eq_idx).trim();
    let val = pair.substr(++eq_idx, pair.length).trim();
    if (val[0] == '"') {
      val = val.slice(1, -1);
    }
    if (obj[key] == void 0) {
      obj[key] = tryDecode(val, dec);
    }
  }
  return obj;
}
function serialize(name, value, options) {
  let opt = options || {};
  let enc = opt.encode || encode$1;
  if (typeof enc !== "function") {
    throw new TypeError("option encode is invalid");
  }
  if (!fieldContentRegExp.test(name)) {
    throw new TypeError("argument name is invalid");
  }
  let encodedValue = enc(value);
  if (encodedValue && !fieldContentRegExp.test(encodedValue)) {
    throw new TypeError("argument val is invalid");
  }
  let str = name + "=" + encodedValue;
  if (opt.maxAge != null) {
    let maxAge = opt.maxAge - 0;
    if (isNaN(maxAge) || !isFinite(maxAge)) {
      throw new TypeError("option maxAge is invalid");
    }
    str += "; Max-Age=" + Math.floor(maxAge);
  }
  if (opt.domain) {
    if (!fieldContentRegExp.test(opt.domain)) {
      throw new TypeError("option domain is invalid");
    }
    str += "; Domain=" + opt.domain;
  }
  if (opt.path) {
    if (!fieldContentRegExp.test(opt.path)) {
      throw new TypeError("option path is invalid");
    }
    str += "; Path=" + opt.path;
  }
  if (opt.expires) {
    if (typeof opt.expires.toUTCString !== "function") {
      throw new TypeError("option expires is invalid");
    }
    str += "; Expires=" + opt.expires.toUTCString();
  }
  if (opt.httpOnly) {
    str += "; HttpOnly";
  }
  if (opt.secure) {
    str += "; Secure";
  }
  if (opt.sameSite) {
    let sameSite = typeof opt.sameSite === "string" ? opt.sameSite.toLowerCase() : opt.sameSite;
    switch (sameSite) {
      case true:
        str += "; SameSite=Strict";
        break;
      case "lax":
        str += "; SameSite=Lax";
        break;
      case "strict":
        str += "; SameSite=Strict";
        break;
      case "none":
        str += "; SameSite=None";
        break;
      default:
        throw new TypeError("option sameSite is invalid");
    }
  }
  return str;
}
function tryDecode(str, decode2) {
  try {
    return decode2(str);
  } catch (e) {
    return str;
  }
}
typeof setImmediate !== "undefined" ? setImmediate : (fn) => fn();
function appendHeader(res, name, value) {
  let current = res.getHeader(name);
  if (!current) {
    res.setHeader(name, value);
    return;
  }
  if (!Array.isArray(current)) {
    current = [current.toString()];
  }
  res.setHeader(name, current.concat(value));
}
class H3Error extends Error {
  constructor() {
    super(...arguments);
    this.statusCode = 500;
    this.statusMessage = "H3Error";
  }
}
function createError(input) {
  var _a2;
  if (input instanceof H3Error) {
    return input;
  }
  const err = new H3Error((_a2 = input.message) != null ? _a2 : input.statusMessage);
  if (input.statusCode) {
    err.statusCode = input.statusCode;
  }
  if (input.statusMessage) {
    err.statusMessage = input.statusMessage;
  }
  if (input.data) {
    err.data = input.data;
  }
  return err;
}
const suspectProtoRx = /"(?:_|\\u005[Ff])(?:_|\\u005[Ff])(?:p|\\u0070)(?:r|\\u0072)(?:o|\\u006[Ff])(?:t|\\u0074)(?:o|\\u006[Ff])(?:_|\\u005[Ff])(?:_|\\u005[Ff])"\s*:/;
const suspectConstructorRx = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
const JsonSigRx = /^["{[]|^-?[0-9][0-9.]{0,14}$/;
function jsonParseTransform(key, value) {
  if (key === "__proto__" || key === "constructor") {
    return;
  }
  return value;
}
function destr(val) {
  if (typeof val !== "string") {
    return val;
  }
  const _lval = val.toLowerCase();
  if (_lval === "true") {
    return true;
  }
  if (_lval === "false") {
    return false;
  }
  if (_lval === "null") {
    return null;
  }
  if (_lval === "nan") {
    return NaN;
  }
  if (_lval === "infinity") {
    return Infinity;
  }
  if (_lval === "undefined") {
    return void 0;
  }
  if (!JsonSigRx.test(val)) {
    return val;
  }
  try {
    if (suspectProtoRx.test(val) || suspectConstructorRx.test(val)) {
      return JSON.parse(val, jsonParseTransform);
    }
    return JSON.parse(val);
  } catch (_e) {
    return val;
  }
}
const CookieDefaults = {
  decode: (val) => destr(decodeURIComponent(val)),
  encode: (val) => encodeURIComponent(typeof val === "string" ? val : JSON.stringify(val))
};
function useCookie(name, _opts) {
  var _a2, _b2;
  const opts = __spreadValues(__spreadValues({}, CookieDefaults), _opts);
  const cookies = readRawCookies(opts);
  const cookie = vue_cjs_prod.ref((_b2 = cookies[name]) != null ? _b2 : (_a2 = opts.default) == null ? void 0 : _a2.call(opts));
  {
    const initialValue = cookie.value;
    const nuxtApp = useNuxtApp();
    nuxtApp.hooks.hookOnce("app:rendered", () => {
      if (cookie.value !== initialValue) {
        writeServerCookie(useSSRRes(nuxtApp), name, cookie.value, opts);
      }
    });
  }
  return cookie;
}
function useSSRReq(nuxtApp = useNuxtApp()) {
  var _a2;
  return (_a2 = nuxtApp.ssrContext) == null ? void 0 : _a2.req;
}
function useSSRRes(nuxtApp = useNuxtApp()) {
  var _a2;
  return (_a2 = nuxtApp.ssrContext) == null ? void 0 : _a2.res;
}
function readRawCookies(opts = {}) {
  {
    return parse(useSSRReq().headers.cookie || "", opts);
  }
}
function serializeCookie(name, value, opts = {}) {
  if (value === null || value === void 0) {
    return serialize(name, value, __spreadProps(__spreadValues({}, opts), { maxAge: -1 }));
  }
  return serialize(name, value, opts);
}
function writeServerCookie(res, name, value, opts = {}) {
  if (res) {
    appendHeader(res, "Set-Cookie", serializeCookie(name, value, opts));
  }
}
const useRoute = () => {
  return useNuxtApp()._route;
};
var shared_cjs_prod = {};
Object.defineProperty(shared_cjs_prod, "__esModule", { value: true });
function makeMap(str, expectsLowerCase) {
  const map = /* @__PURE__ */ Object.create(null);
  const list = str.split(",");
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase ? (val) => !!map[val.toLowerCase()] : (val) => !!map[val];
}
const PatchFlagNames = {
  [1]: `TEXT`,
  [2]: `CLASS`,
  [4]: `STYLE`,
  [8]: `PROPS`,
  [16]: `FULL_PROPS`,
  [32]: `HYDRATE_EVENTS`,
  [64]: `STABLE_FRAGMENT`,
  [128]: `KEYED_FRAGMENT`,
  [256]: `UNKEYED_FRAGMENT`,
  [512]: `NEED_PATCH`,
  [1024]: `DYNAMIC_SLOTS`,
  [2048]: `DEV_ROOT_FRAGMENT`,
  [-1]: `HOISTED`,
  [-2]: `BAIL`
};
const slotFlagsText = {
  [1]: "STABLE",
  [2]: "DYNAMIC",
  [3]: "FORWARDED"
};
const GLOBALS_WHITE_LISTED = "Infinity,undefined,NaN,isFinite,isNaN,parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,BigInt";
const isGloballyWhitelisted = /* @__PURE__ */ makeMap(GLOBALS_WHITE_LISTED);
const range = 2;
function generateCodeFrame(source, start = 0, end = source.length) {
  let lines = source.split(/(\r?\n)/);
  const newlineSequences = lines.filter((_, idx) => idx % 2 === 1);
  lines = lines.filter((_, idx) => idx % 2 === 0);
  let count = 0;
  const res = [];
  for (let i = 0; i < lines.length; i++) {
    count += lines[i].length + (newlineSequences[i] && newlineSequences[i].length || 0);
    if (count >= start) {
      for (let j = i - range; j <= i + range || end > count; j++) {
        if (j < 0 || j >= lines.length)
          continue;
        const line = j + 1;
        res.push(`${line}${" ".repeat(Math.max(3 - String(line).length, 0))}|  ${lines[j]}`);
        const lineLength = lines[j].length;
        const newLineSeqLength = newlineSequences[j] && newlineSequences[j].length || 0;
        if (j === i) {
          const pad = start - (count - (lineLength + newLineSeqLength));
          const length = Math.max(1, end > count ? lineLength - pad : end - start);
          res.push(`   |  ` + " ".repeat(pad) + "^".repeat(length));
        } else if (j > i) {
          if (end > count) {
            const length = Math.max(Math.min(end - count, lineLength), 1);
            res.push(`   |  ` + "^".repeat(length));
          }
          count += lineLength + newLineSeqLength;
        }
      }
      break;
    }
  }
  return res.join("\n");
}
const specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
const isSpecialBooleanAttr = /* @__PURE__ */ makeMap(specialBooleanAttrs);
const isBooleanAttr = /* @__PURE__ */ makeMap(specialBooleanAttrs + `,async,autofocus,autoplay,controls,default,defer,disabled,hidden,loop,open,required,reversed,scoped,seamless,checked,muted,multiple,selected`);
function includeBooleanAttr(value) {
  return !!value || value === "";
}
const unsafeAttrCharRE = /[>/="'\u0009\u000a\u000c\u0020]/;
const attrValidationCache = {};
function isSSRSafeAttrName(name) {
  if (attrValidationCache.hasOwnProperty(name)) {
    return attrValidationCache[name];
  }
  const isUnsafe = unsafeAttrCharRE.test(name);
  if (isUnsafe) {
    console.error(`unsafe attribute name: ${name}`);
  }
  return attrValidationCache[name] = !isUnsafe;
}
const propsToAttrMap = {
  acceptCharset: "accept-charset",
  className: "class",
  htmlFor: "for",
  httpEquiv: "http-equiv"
};
const isNoUnitNumericStyleProp = /* @__PURE__ */ makeMap(`animation-iteration-count,border-image-outset,border-image-slice,border-image-width,box-flex,box-flex-group,box-ordinal-group,column-count,columns,flex,flex-grow,flex-positive,flex-shrink,flex-negative,flex-order,grid-row,grid-row-end,grid-row-span,grid-row-start,grid-column,grid-column-end,grid-column-span,grid-column-start,font-weight,line-clamp,line-height,opacity,order,orphans,tab-size,widows,z-index,zoom,fill-opacity,flood-opacity,stop-opacity,stroke-dasharray,stroke-dashoffset,stroke-miterlimit,stroke-opacity,stroke-width`);
const isKnownHtmlAttr = /* @__PURE__ */ makeMap(`accept,accept-charset,accesskey,action,align,allow,alt,async,autocapitalize,autocomplete,autofocus,autoplay,background,bgcolor,border,buffered,capture,challenge,charset,checked,cite,class,code,codebase,color,cols,colspan,content,contenteditable,contextmenu,controls,coords,crossorigin,csp,data,datetime,decoding,default,defer,dir,dirname,disabled,download,draggable,dropzone,enctype,enterkeyhint,for,form,formaction,formenctype,formmethod,formnovalidate,formtarget,headers,height,hidden,high,href,hreflang,http-equiv,icon,id,importance,integrity,ismap,itemprop,keytype,kind,label,lang,language,loading,list,loop,low,manifest,max,maxlength,minlength,media,min,multiple,muted,name,novalidate,open,optimum,pattern,ping,placeholder,poster,preload,radiogroup,readonly,referrerpolicy,rel,required,reversed,rows,rowspan,sandbox,scope,scoped,selected,shape,size,sizes,slot,span,spellcheck,src,srcdoc,srclang,srcset,start,step,style,summary,tabindex,target,title,translate,type,usemap,value,width,wrap`);
const isKnownSvgAttr = /* @__PURE__ */ makeMap(`xmlns,accent-height,accumulate,additive,alignment-baseline,alphabetic,amplitude,arabic-form,ascent,attributeName,attributeType,azimuth,baseFrequency,baseline-shift,baseProfile,bbox,begin,bias,by,calcMode,cap-height,class,clip,clipPathUnits,clip-path,clip-rule,color,color-interpolation,color-interpolation-filters,color-profile,color-rendering,contentScriptType,contentStyleType,crossorigin,cursor,cx,cy,d,decelerate,descent,diffuseConstant,direction,display,divisor,dominant-baseline,dur,dx,dy,edgeMode,elevation,enable-background,end,exponent,fill,fill-opacity,fill-rule,filter,filterRes,filterUnits,flood-color,flood-opacity,font-family,font-size,font-size-adjust,font-stretch,font-style,font-variant,font-weight,format,from,fr,fx,fy,g1,g2,glyph-name,glyph-orientation-horizontal,glyph-orientation-vertical,glyphRef,gradientTransform,gradientUnits,hanging,height,href,hreflang,horiz-adv-x,horiz-origin-x,id,ideographic,image-rendering,in,in2,intercept,k,k1,k2,k3,k4,kernelMatrix,kernelUnitLength,kerning,keyPoints,keySplines,keyTimes,lang,lengthAdjust,letter-spacing,lighting-color,limitingConeAngle,local,marker-end,marker-mid,marker-start,markerHeight,markerUnits,markerWidth,mask,maskContentUnits,maskUnits,mathematical,max,media,method,min,mode,name,numOctaves,offset,opacity,operator,order,orient,orientation,origin,overflow,overline-position,overline-thickness,panose-1,paint-order,path,pathLength,patternContentUnits,patternTransform,patternUnits,ping,pointer-events,points,pointsAtX,pointsAtY,pointsAtZ,preserveAlpha,preserveAspectRatio,primitiveUnits,r,radius,referrerPolicy,refX,refY,rel,rendering-intent,repeatCount,repeatDur,requiredExtensions,requiredFeatures,restart,result,rotate,rx,ry,scale,seed,shape-rendering,slope,spacing,specularConstant,specularExponent,speed,spreadMethod,startOffset,stdDeviation,stemh,stemv,stitchTiles,stop-color,stop-opacity,strikethrough-position,strikethrough-thickness,string,stroke,stroke-dasharray,stroke-dashoffset,stroke-linecap,stroke-linejoin,stroke-miterlimit,stroke-opacity,stroke-width,style,surfaceScale,systemLanguage,tabindex,tableValues,target,targetX,targetY,text-anchor,text-decoration,text-rendering,textLength,to,transform,transform-origin,type,u1,u2,underline-position,underline-thickness,unicode,unicode-bidi,unicode-range,units-per-em,v-alphabetic,v-hanging,v-ideographic,v-mathematical,values,vector-effect,version,vert-adv-y,vert-origin-x,vert-origin-y,viewBox,viewTarget,visibility,width,widths,word-spacing,writing-mode,x,x-height,x1,x2,xChannelSelector,xlink:actuate,xlink:arcrole,xlink:href,xlink:role,xlink:show,xlink:title,xlink:type,xml:base,xml:lang,xml:space,y,y1,y2,yChannelSelector,z,zoomAndPan`);
function normalizeStyle(value) {
  if (isArray(value)) {
    const res = {};
    for (let i = 0; i < value.length; i++) {
      const item = value[i];
      const normalized = isString$1(item) ? parseStringStyle(item) : normalizeStyle(item);
      if (normalized) {
        for (const key in normalized) {
          res[key] = normalized[key];
        }
      }
    }
    return res;
  } else if (isString$1(value)) {
    return value;
  } else if (isObject(value)) {
    return value;
  }
}
const listDelimiterRE = /;(?![^(]*\))/g;
const propertyDelimiterRE = /:(.+)/;
function parseStringStyle(cssText) {
  const ret = {};
  cssText.split(listDelimiterRE).forEach((item) => {
    if (item) {
      const tmp = item.split(propertyDelimiterRE);
      tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return ret;
}
function stringifyStyle(styles) {
  let ret = "";
  if (!styles || isString$1(styles)) {
    return ret;
  }
  for (const key in styles) {
    const value = styles[key];
    const normalizedKey = key.startsWith(`--`) ? key : hyphenate(key);
    if (isString$1(value) || typeof value === "number" && isNoUnitNumericStyleProp(normalizedKey)) {
      ret += `${normalizedKey}:${value};`;
    }
  }
  return ret;
}
function normalizeClass(value) {
  let res = "";
  if (isString$1(value)) {
    res = value;
  } else if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      const normalized = normalizeClass(value[i]);
      if (normalized) {
        res += normalized + " ";
      }
    }
  } else if (isObject(value)) {
    for (const name in value) {
      if (value[name]) {
        res += name + " ";
      }
    }
  }
  return res.trim();
}
function normalizeProps(props) {
  if (!props)
    return null;
  let { class: klass, style } = props;
  if (klass && !isString$1(klass)) {
    props.class = normalizeClass(klass);
  }
  if (style) {
    props.style = normalizeStyle(style);
  }
  return props;
}
const HTML_TAGS = "html,body,base,head,link,meta,style,title,address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,nav,section,div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,ruby,s,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,output,progress,select,textarea,details,dialog,menu,summary,template,blockquote,iframe,tfoot";
const SVG_TAGS = "svg,animate,animateMotion,animateTransform,circle,clipPath,color-profile,defs,desc,discard,ellipse,feBlend,feColorMatrix,feComponentTransfer,feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,feDistanceLight,feDropShadow,feFlood,feFuncA,feFuncB,feFuncG,feFuncR,feGaussianBlur,feImage,feMerge,feMergeNode,feMorphology,feOffset,fePointLight,feSpecularLighting,feSpotLight,feTile,feTurbulence,filter,foreignObject,g,hatch,hatchpath,image,line,linearGradient,marker,mask,mesh,meshgradient,meshpatch,meshrow,metadata,mpath,path,pattern,polygon,polyline,radialGradient,rect,set,solidcolor,stop,switch,symbol,text,textPath,title,tspan,unknown,use,view";
const VOID_TAGS = "area,base,br,col,embed,hr,img,input,link,meta,param,source,track,wbr";
const isHTMLTag = /* @__PURE__ */ makeMap(HTML_TAGS);
const isSVGTag = /* @__PURE__ */ makeMap(SVG_TAGS);
const isVoidTag = /* @__PURE__ */ makeMap(VOID_TAGS);
const escapeRE = /["'&<>]/;
function escapeHtml(string) {
  const str = "" + string;
  const match = escapeRE.exec(str);
  if (!match) {
    return str;
  }
  let html2 = "";
  let escaped;
  let index2;
  let lastIndex = 0;
  for (index2 = match.index; index2 < str.length; index2++) {
    switch (str.charCodeAt(index2)) {
      case 34:
        escaped = "&quot;";
        break;
      case 38:
        escaped = "&amp;";
        break;
      case 39:
        escaped = "&#39;";
        break;
      case 60:
        escaped = "&lt;";
        break;
      case 62:
        escaped = "&gt;";
        break;
      default:
        continue;
    }
    if (lastIndex !== index2) {
      html2 += str.slice(lastIndex, index2);
    }
    lastIndex = index2 + 1;
    html2 += escaped;
  }
  return lastIndex !== index2 ? html2 + str.slice(lastIndex, index2) : html2;
}
const commentStripRE = /^-?>|<!--|-->|--!>|<!-$/g;
function escapeHtmlComment(src) {
  return src.replace(commentStripRE, "");
}
function looseCompareArrays(a, b) {
  if (a.length !== b.length)
    return false;
  let equal = true;
  for (let i = 0; equal && i < a.length; i++) {
    equal = looseEqual(a[i], b[i]);
  }
  return equal;
}
function looseEqual(a, b) {
  if (a === b)
    return true;
  let aValidType = isDate(a);
  let bValidType = isDate(b);
  if (aValidType || bValidType) {
    return aValidType && bValidType ? a.getTime() === b.getTime() : false;
  }
  aValidType = isArray(a);
  bValidType = isArray(b);
  if (aValidType || bValidType) {
    return aValidType && bValidType ? looseCompareArrays(a, b) : false;
  }
  aValidType = isObject(a);
  bValidType = isObject(b);
  if (aValidType || bValidType) {
    if (!aValidType || !bValidType) {
      return false;
    }
    const aKeysCount = Object.keys(a).length;
    const bKeysCount = Object.keys(b).length;
    if (aKeysCount !== bKeysCount) {
      return false;
    }
    for (const key in a) {
      const aHasKey = a.hasOwnProperty(key);
      const bHasKey = b.hasOwnProperty(key);
      if (aHasKey && !bHasKey || !aHasKey && bHasKey || !looseEqual(a[key], b[key])) {
        return false;
      }
    }
  }
  return String(a) === String(b);
}
function looseIndexOf(arr, val) {
  return arr.findIndex((item) => looseEqual(item, val));
}
const toDisplayString = (val) => {
  return isString$1(val) ? val : val == null ? "" : isArray(val) || isObject(val) && (val.toString === objectToString || !isFunction(val.toString)) ? JSON.stringify(val, replacer, 2) : String(val);
};
const replacer = (_key, val) => {
  if (val && val.__v_isRef) {
    return replacer(_key, val.value);
  } else if (isMap(val)) {
    return {
      [`Map(${val.size})`]: [...val.entries()].reduce((entries, [key, val2]) => {
        entries[`${key} =>`] = val2;
        return entries;
      }, {})
    };
  } else if (isSet(val)) {
    return {
      [`Set(${val.size})`]: [...val.values()]
    };
  } else if (isObject(val) && !isArray(val) && !isPlainObject(val)) {
    return String(val);
  }
  return val;
};
const EMPTY_OBJ = {};
const EMPTY_ARR = [];
const NOOP = () => {
};
const NO = () => false;
const onRE = /^on[^a-z]/;
const isOn = (key) => onRE.test(key);
const isModelListener = (key) => key.startsWith("onUpdate:");
const extend = Object.assign;
const remove = (arr, el) => {
  const i = arr.indexOf(el);
  if (i > -1) {
    arr.splice(i, 1);
  }
};
const hasOwnProperty = Object.prototype.hasOwnProperty;
const hasOwn = (val, key) => hasOwnProperty.call(val, key);
const isArray = Array.isArray;
const isMap = (val) => toTypeString(val) === "[object Map]";
const isSet = (val) => toTypeString(val) === "[object Set]";
const isDate = (val) => val instanceof Date;
const isFunction = (val) => typeof val === "function";
const isString$1 = (val) => typeof val === "string";
const isSymbol = (val) => typeof val === "symbol";
const isObject = (val) => val !== null && typeof val === "object";
const isPromise = (val) => {
  return isObject(val) && isFunction(val.then) && isFunction(val.catch);
};
const objectToString = Object.prototype.toString;
const toTypeString = (value) => objectToString.call(value);
const toRawType = (value) => {
  return toTypeString(value).slice(8, -1);
};
const isPlainObject = (val) => toTypeString(val) === "[object Object]";
const isIntegerKey = (key) => isString$1(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
const isReservedProp = /* @__PURE__ */ makeMap(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted");
const isBuiltInDirective = /* @__PURE__ */ makeMap("bind,cloak,else-if,else,for,html,if,model,on,once,pre,show,slot,text,memo");
const cacheStringFunction = (fn) => {
  const cache = /* @__PURE__ */ Object.create(null);
  return (str) => {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
};
const camelizeRE = /-(\w)/g;
const camelize = cacheStringFunction((str) => {
  return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : "");
});
const hyphenateRE = /\B([A-Z])/g;
const hyphenate = cacheStringFunction((str) => str.replace(hyphenateRE, "-$1").toLowerCase());
const capitalize = cacheStringFunction((str) => str.charAt(0).toUpperCase() + str.slice(1));
const toHandlerKey = cacheStringFunction((str) => str ? `on${capitalize(str)}` : ``);
const hasChanged = (value, oldValue) => !Object.is(value, oldValue);
const invokeArrayFns = (fns, arg) => {
  for (let i = 0; i < fns.length; i++) {
    fns[i](arg);
  }
};
const def = (obj, key, value) => {
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: false,
    value
  });
};
const toNumber = (val) => {
  const n = parseFloat(val);
  return isNaN(n) ? val : n;
};
let _globalThis$1;
const getGlobalThis = () => {
  return _globalThis$1 || (_globalThis$1 = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof commonjsGlobal !== "undefined" ? commonjsGlobal : {});
};
shared_cjs_prod.EMPTY_ARR = EMPTY_ARR;
shared_cjs_prod.EMPTY_OBJ = EMPTY_OBJ;
shared_cjs_prod.NO = NO;
shared_cjs_prod.NOOP = NOOP;
shared_cjs_prod.PatchFlagNames = PatchFlagNames;
shared_cjs_prod.camelize = camelize;
shared_cjs_prod.capitalize = capitalize;
shared_cjs_prod.def = def;
shared_cjs_prod.escapeHtml = escapeHtml;
shared_cjs_prod.escapeHtmlComment = escapeHtmlComment;
shared_cjs_prod.extend = extend;
shared_cjs_prod.generateCodeFrame = generateCodeFrame;
shared_cjs_prod.getGlobalThis = getGlobalThis;
shared_cjs_prod.hasChanged = hasChanged;
shared_cjs_prod.hasOwn = hasOwn;
shared_cjs_prod.hyphenate = hyphenate;
shared_cjs_prod.includeBooleanAttr = includeBooleanAttr;
shared_cjs_prod.invokeArrayFns = invokeArrayFns;
shared_cjs_prod.isArray = isArray;
shared_cjs_prod.isBooleanAttr = isBooleanAttr;
shared_cjs_prod.isBuiltInDirective = isBuiltInDirective;
shared_cjs_prod.isDate = isDate;
var isFunction_1 = shared_cjs_prod.isFunction = isFunction;
shared_cjs_prod.isGloballyWhitelisted = isGloballyWhitelisted;
shared_cjs_prod.isHTMLTag = isHTMLTag;
shared_cjs_prod.isIntegerKey = isIntegerKey;
shared_cjs_prod.isKnownHtmlAttr = isKnownHtmlAttr;
shared_cjs_prod.isKnownSvgAttr = isKnownSvgAttr;
shared_cjs_prod.isMap = isMap;
shared_cjs_prod.isModelListener = isModelListener;
shared_cjs_prod.isNoUnitNumericStyleProp = isNoUnitNumericStyleProp;
shared_cjs_prod.isObject = isObject;
shared_cjs_prod.isOn = isOn;
shared_cjs_prod.isPlainObject = isPlainObject;
shared_cjs_prod.isPromise = isPromise;
shared_cjs_prod.isReservedProp = isReservedProp;
shared_cjs_prod.isSSRSafeAttrName = isSSRSafeAttrName;
shared_cjs_prod.isSVGTag = isSVGTag;
shared_cjs_prod.isSet = isSet;
shared_cjs_prod.isSpecialBooleanAttr = isSpecialBooleanAttr;
shared_cjs_prod.isString = isString$1;
shared_cjs_prod.isSymbol = isSymbol;
shared_cjs_prod.isVoidTag = isVoidTag;
shared_cjs_prod.looseEqual = looseEqual;
shared_cjs_prod.looseIndexOf = looseIndexOf;
shared_cjs_prod.makeMap = makeMap;
shared_cjs_prod.normalizeClass = normalizeClass;
shared_cjs_prod.normalizeProps = normalizeProps;
shared_cjs_prod.normalizeStyle = normalizeStyle;
shared_cjs_prod.objectToString = objectToString;
shared_cjs_prod.parseStringStyle = parseStringStyle;
shared_cjs_prod.propsToAttrMap = propsToAttrMap;
shared_cjs_prod.remove = remove;
shared_cjs_prod.slotFlagsText = slotFlagsText;
shared_cjs_prod.stringifyStyle = stringifyStyle;
shared_cjs_prod.toDisplayString = toDisplayString;
shared_cjs_prod.toHandlerKey = toHandlerKey;
shared_cjs_prod.toNumber = toNumber;
shared_cjs_prod.toRawType = toRawType;
shared_cjs_prod.toTypeString = toTypeString;
function useMeta(meta2) {
  const resolvedMeta = isFunction_1(meta2) ? vue_cjs_prod.computed(meta2) : meta2;
  useNuxtApp()._useMeta(resolvedMeta);
}
const preload = defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.mixin({
    beforeCreate() {
      const { _registeredComponents } = this.$nuxt.ssrContext;
      const { __moduleIdentifier } = this.$options;
      _registeredComponents.add(__moduleIdentifier);
    }
  });
});
var __defProp2 = Object.defineProperty;
var __defProps2 = Object.defineProperties;
var __getOwnPropDescs2 = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols2 = Object.getOwnPropertySymbols;
var __hasOwnProp2 = Object.prototype.hasOwnProperty;
var __propIsEnum2 = Object.prototype.propertyIsEnumerable;
var __defNormalProp2 = (obj, key, value) => key in obj ? __defProp2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues2 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp2.call(b, prop))
      __defNormalProp2(a, prop, b[prop]);
  if (__getOwnPropSymbols2)
    for (var prop of __getOwnPropSymbols2(b)) {
      if (__propIsEnum2.call(b, prop))
        __defNormalProp2(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps2 = (a, b) => __defProps2(a, __getOwnPropDescs2(b));
var PROVIDE_KEY = `usehead`;
var HEAD_COUNT_KEY = `head:count`;
var HEAD_ATTRS_KEY = `data-head-attrs`;
var SELF_CLOSING_TAGS = ["meta", "link", "base"];
var createElement = (tag, attrs, document2) => {
  const el = document2.createElement(tag);
  for (const key of Object.keys(attrs)) {
    let value = attrs[key];
    if (key === "key" || value === false) {
      continue;
    }
    if (key === "children") {
      el.textContent = value;
    } else {
      el.setAttribute(key, value);
    }
  }
  return el;
};
var htmlEscape = (str) => str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
var stringifyAttrs = (attributes) => {
  const handledAttributes = [];
  for (let [key, value] of Object.entries(attributes)) {
    if (key === "children" || key === "key") {
      continue;
    }
    if (value === false || value == null) {
      continue;
    }
    let attribute = htmlEscape(key);
    if (value !== true) {
      attribute += `="${htmlEscape(String(value))}"`;
    }
    handledAttributes.push(attribute);
  }
  return handledAttributes.length > 0 ? " " + handledAttributes.join(" ") : "";
};
function isEqualNode(oldTag, newTag) {
  if (oldTag instanceof HTMLElement && newTag instanceof HTMLElement) {
    const nonce = newTag.getAttribute("nonce");
    if (nonce && !oldTag.getAttribute("nonce")) {
      const cloneTag = newTag.cloneNode(true);
      cloneTag.setAttribute("nonce", "");
      cloneTag.nonce = nonce;
      return nonce === oldTag.nonce && oldTag.isEqualNode(cloneTag);
    }
  }
  return oldTag.isEqualNode(newTag);
}
var getTagKey = (props) => {
  const names = ["key", "id", "name", "property"];
  for (const n of names) {
    const value = typeof props.getAttribute === "function" ? props.hasAttribute(n) ? props.getAttribute(n) : void 0 : props[n];
    if (value !== void 0) {
      return { name: n, value };
    }
  }
};
var acceptFields = [
  "title",
  "meta",
  "link",
  "base",
  "style",
  "script",
  "htmlAttrs",
  "bodyAttrs"
];
var headObjToTags = (obj) => {
  const tags = [];
  for (const key of Object.keys(obj)) {
    if (obj[key] == null)
      continue;
    if (key === "title") {
      tags.push({ tag: key, props: { children: obj[key] } });
    } else if (key === "base") {
      tags.push({ tag: key, props: __spreadValues2({ key: "default" }, obj[key]) });
    } else if (acceptFields.includes(key)) {
      const value = obj[key];
      if (Array.isArray(value)) {
        value.forEach((item) => {
          tags.push({ tag: key, props: item });
        });
      } else if (value) {
        tags.push({ tag: key, props: value });
      }
    }
  }
  return tags;
};
var setAttrs = (el, attrs) => {
  const existingAttrs = el.getAttribute(HEAD_ATTRS_KEY);
  if (existingAttrs) {
    for (const key of existingAttrs.split(",")) {
      if (!(key in attrs)) {
        el.removeAttribute(key);
      }
    }
  }
  const keys = [];
  for (const key in attrs) {
    const value = attrs[key];
    if (value == null)
      continue;
    if (value === false) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, value);
    }
    keys.push(key);
  }
  if (keys.length) {
    el.setAttribute(HEAD_ATTRS_KEY, keys.join(","));
  } else {
    el.removeAttribute(HEAD_ATTRS_KEY);
  }
};
var updateElements = (document2 = window.document, type, tags) => {
  var _a2;
  const head = document2.head;
  let headCountEl = head.querySelector(`meta[name="${HEAD_COUNT_KEY}"]`);
  const headCount = headCountEl ? Number(headCountEl.getAttribute("content")) : 0;
  const oldElements = [];
  if (headCountEl) {
    for (let i = 0, j = headCountEl.previousElementSibling; i < headCount; i++, j = (j == null ? void 0 : j.previousElementSibling) || null) {
      if (((_a2 = j == null ? void 0 : j.tagName) == null ? void 0 : _a2.toLowerCase()) === type) {
        oldElements.push(j);
      }
    }
  } else {
    headCountEl = document2.createElement("meta");
    headCountEl.setAttribute("name", HEAD_COUNT_KEY);
    headCountEl.setAttribute("content", "0");
    head.append(headCountEl);
  }
  let newElements = tags.map((tag) => createElement(tag.tag, tag.props, document2));
  newElements = newElements.filter((newEl) => {
    for (let i = 0; i < oldElements.length; i++) {
      const oldEl = oldElements[i];
      if (isEqualNode(oldEl, newEl)) {
        oldElements.splice(i, 1);
        return false;
      }
    }
    return true;
  });
  oldElements.forEach((t) => {
    var _a22;
    return (_a22 = t.parentNode) == null ? void 0 : _a22.removeChild(t);
  });
  newElements.forEach((t) => {
    head.insertBefore(t, headCountEl);
  });
  headCountEl.setAttribute("content", "" + (headCount - oldElements.length + newElements.length));
};
var createHead = () => {
  let allHeadObjs = [];
  const head = {
    install(app) {
      app.config.globalProperties.$head = head;
      app.provide(PROVIDE_KEY, head);
    },
    get headTags() {
      const deduped = [];
      allHeadObjs.forEach((objs) => {
        const tags = headObjToTags(objs.value);
        tags.forEach((tag) => {
          if (tag.tag === "meta" || tag.tag === "base" || tag.tag === "script") {
            const key = getTagKey(tag.props);
            if (key) {
              let index2 = -1;
              for (let i = 0; i < deduped.length; i++) {
                const prev = deduped[i];
                const prevValue = prev.props[key.name];
                const nextValue = tag.props[key.name];
                if (prev.tag === tag.tag && prevValue === nextValue) {
                  index2 = i;
                  break;
                }
              }
              if (index2 !== -1) {
                deduped.splice(index2, 1);
              }
            }
          }
          deduped.push(tag);
        });
      });
      return deduped;
    },
    addHeadObjs(objs) {
      allHeadObjs.push(objs);
    },
    removeHeadObjs(objs) {
      allHeadObjs = allHeadObjs.filter((_objs) => _objs !== objs);
    },
    updateDOM(document2 = window.document) {
      let title;
      let htmlAttrs = {};
      let bodyAttrs = {};
      const actualTags = {};
      for (const tag of head.headTags) {
        if (tag.tag === "title") {
          title = tag.props.children;
          continue;
        }
        if (tag.tag === "htmlAttrs") {
          Object.assign(htmlAttrs, tag.props);
          continue;
        }
        if (tag.tag === "bodyAttrs") {
          Object.assign(bodyAttrs, tag.props);
          continue;
        }
        actualTags[tag.tag] = actualTags[tag.tag] || [];
        actualTags[tag.tag].push(tag);
      }
      if (title !== void 0) {
        document2.title = title;
      }
      setAttrs(document2.documentElement, htmlAttrs);
      setAttrs(document2.body, bodyAttrs);
      for (const name of Object.keys(actualTags)) {
        updateElements(document2, name, actualTags[name]);
      }
    }
  };
  return head;
};
var tagToString = (tag) => {
  let attrs = stringifyAttrs(tag.props);
  if (SELF_CLOSING_TAGS.includes(tag.tag)) {
    return `<${tag.tag}${attrs}>`;
  }
  return `<${tag.tag}${attrs}>${tag.props.children || ""}</${tag.tag}>`;
};
var renderHeadToString = (head) => {
  const tags = [];
  let titleTag = "";
  let htmlAttrs = {};
  let bodyAttrs = {};
  for (const tag of head.headTags) {
    if (tag.tag === "title") {
      titleTag = tagToString(tag);
    } else if (tag.tag === "htmlAttrs") {
      Object.assign(htmlAttrs, tag.props);
    } else if (tag.tag === "bodyAttrs") {
      Object.assign(bodyAttrs, tag.props);
    } else {
      tags.push(tagToString(tag));
    }
  }
  tags.push(`<meta name="${HEAD_COUNT_KEY}" content="${tags.length}">`);
  return {
    get headTags() {
      return titleTag + tags.join("");
    },
    get htmlAttrs() {
      return stringifyAttrs(__spreadProps2(__spreadValues2({}, htmlAttrs), {
        [HEAD_ATTRS_KEY]: Object.keys(htmlAttrs).join(",")
      }));
    },
    get bodyAttrs() {
      return stringifyAttrs(__spreadProps2(__spreadValues2({}, bodyAttrs), {
        [HEAD_ATTRS_KEY]: Object.keys(bodyAttrs).join(",")
      }));
    }
  };
};
const vueuseHead_02f54cda = defineNuxtPlugin((nuxtApp) => {
  const head = createHead();
  nuxtApp.vueApp.use(head);
  nuxtApp.hooks.hookOnce("app:mounted", () => {
    vue_cjs_prod.watchEffect(() => {
      head.updateDOM();
    });
  });
  nuxtApp._useMeta = (meta2) => {
    const headObj = vue_cjs_prod.ref(meta2);
    head.addHeadObjs(headObj);
    {
      return;
    }
  };
  {
    nuxtApp.ssrContext.renderMeta = () => renderHeadToString(head);
  }
});
const removeUndefinedProps = (props) => Object.fromEntries(Object.entries(props).filter(([, value]) => value !== void 0));
const setupForUseMeta = (metaFactory, renderChild) => (props, ctx) => {
  useMeta(() => metaFactory(__spreadValues(__spreadValues({}, removeUndefinedProps(props)), ctx.attrs), ctx));
  return () => {
    var _a2, _b2;
    return renderChild ? (_b2 = (_a2 = ctx.slots).default) == null ? void 0 : _b2.call(_a2) : null;
  };
};
const globalProps = {
  accesskey: String,
  autocapitalize: String,
  autofocus: {
    type: Boolean,
    default: void 0
  },
  class: String,
  contenteditable: {
    type: Boolean,
    default: void 0
  },
  contextmenu: String,
  dir: String,
  draggable: {
    type: Boolean,
    default: void 0
  },
  enterkeyhint: String,
  exportparts: String,
  hidden: {
    type: Boolean,
    default: void 0
  },
  id: String,
  inputmode: String,
  is: String,
  itemid: String,
  itemprop: String,
  itemref: String,
  itemscope: String,
  itemtype: String,
  lang: String,
  nonce: String,
  part: String,
  slot: String,
  spellcheck: {
    type: Boolean,
    default: void 0
  },
  style: String,
  tabindex: String,
  title: String,
  translate: String
};
const Script = vue_cjs_prod.defineComponent({
  name: "Script",
  props: __spreadProps(__spreadValues({}, globalProps), {
    async: Boolean,
    crossorigin: {
      type: [Boolean, String],
      default: void 0
    },
    defer: Boolean,
    integrity: String,
    nomodule: Boolean,
    nonce: String,
    referrerpolicy: String,
    src: String,
    type: String,
    charset: String,
    language: String
  }),
  setup: setupForUseMeta((script) => ({
    script: [script]
  }))
});
const Link = vue_cjs_prod.defineComponent({
  name: "Link",
  props: __spreadProps(__spreadValues({}, globalProps), {
    as: String,
    crossorigin: String,
    disabled: Boolean,
    href: String,
    hreflang: String,
    imagesizes: String,
    imagesrcset: String,
    integrity: String,
    media: String,
    prefetch: {
      type: Boolean,
      default: void 0
    },
    referrerpolicy: String,
    rel: String,
    sizes: String,
    title: String,
    type: String,
    methods: String,
    target: String
  }),
  setup: setupForUseMeta((link) => ({
    link: [link]
  }))
});
const Base = vue_cjs_prod.defineComponent({
  name: "Base",
  props: __spreadProps(__spreadValues({}, globalProps), {
    href: String,
    target: String
  }),
  setup: setupForUseMeta((base) => ({
    base
  }))
});
const Title = vue_cjs_prod.defineComponent({
  name: "Title",
  setup: setupForUseMeta((_, { slots }) => {
    var _a2, _b2;
    const title = ((_b2 = (_a2 = slots.default()) == null ? void 0 : _a2[0]) == null ? void 0 : _b2.children) || null;
    return {
      title
    };
  })
});
const Meta = vue_cjs_prod.defineComponent({
  name: "Meta",
  props: __spreadProps(__spreadValues({}, globalProps), {
    charset: String,
    content: String,
    httpEquiv: String,
    key: String,
    name: String
  }),
  setup: setupForUseMeta((meta2) => ({
    meta: [meta2]
  }))
});
const Style = vue_cjs_prod.defineComponent({
  name: "Style",
  props: __spreadProps(__spreadValues({}, globalProps), {
    type: String,
    media: String,
    nonce: String,
    title: String,
    scoped: {
      type: Boolean,
      default: void 0
    }
  }),
  setup: setupForUseMeta((props, { slots }) => {
    var _a2, _b2, _c;
    const style = __spreadValues({}, props);
    const textContent = (_c = (_b2 = (_a2 = slots.default) == null ? void 0 : _a2.call(slots)) == null ? void 0 : _b2[0]) == null ? void 0 : _c.children;
    if (textContent) {
      style.children = textContent;
    }
    return {
      style: [style]
    };
  })
});
const Head = vue_cjs_prod.defineComponent({
  name: "Head",
  setup: (_props, ctx) => () => {
    var _a2, _b2;
    return (_b2 = (_a2 = ctx.slots).default) == null ? void 0 : _b2.call(_a2);
  }
});
const Html = vue_cjs_prod.defineComponent({
  name: "Html",
  props: __spreadProps(__spreadValues({}, globalProps), {
    manifest: String,
    version: String,
    xmlns: String
  }),
  setup: setupForUseMeta((htmlAttrs) => ({ htmlAttrs }), true)
});
const Body = vue_cjs_prod.defineComponent({
  name: "Body",
  props: globalProps,
  setup: setupForUseMeta((bodyAttrs) => ({ bodyAttrs }), true)
});
const Components = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Script,
  Link,
  Base,
  Title,
  Meta,
  Style,
  Head,
  Html,
  Body
}, Symbol.toStringTag, { value: "Module" }));
const metaConfig = { "globalMeta": { "meta": [{ "charset": "utf-8" }, { "name": "viewport", "content": "width=device-width, initial-scale=1" }], "link": [], "style": [], "script": [] }, "mixinKey": "created" };
const plugin_4e83f8ce = defineNuxtPlugin((nuxtApp) => {
  useMeta(metaConfig.globalMeta);
  nuxtApp.vueApp.mixin({
    [metaConfig.mixinKey]() {
      var _a2;
      const instance = vue_cjs_prod.getCurrentInstance();
      const options = (instance == null ? void 0 : instance.type) || ((_a2 = instance == null ? void 0 : instance.proxy) == null ? void 0 : _a2.$options);
      if (!options || !("head" in options)) {
        return;
      }
      const source = typeof options.head === "function" ? vue_cjs_prod.computed(() => options.head(nuxtApp)) : options.head;
      useMeta(source);
    }
  });
  for (const name in Components) {
    nuxtApp.vueApp.component(name, Components[name]);
  }
});
const interpolatePath = (route, match) => {
  return match.path.replace(/(:\w+)\([^)]+\)/g, "$1").replace(/(:\w+)[?+*]/g, "$1").replace(/:\w+/g, (r) => {
    var _a2;
    return ((_a2 = route.params[r.slice(1)]) == null ? void 0 : _a2.toString()) || "";
  });
};
const generateRouteKey = (override, routeProps) => {
  var _a2;
  const matchedRoute = routeProps.route.matched.find((m) => m.components.default === routeProps.Component.type);
  const source = (_a2 = override != null ? override : matchedRoute == null ? void 0 : matchedRoute.meta.key) != null ? _a2 : interpolatePath(routeProps.route, matchedRoute);
  return typeof source === "function" ? source(routeProps.route) : source;
};
const Fragment = {
  setup(_props, { slots }) {
    return () => slots.default();
  }
};
const wrapIf = (component, props, slots) => {
  return { default: () => props ? vue_cjs_prod.h(component, props === true ? {} : props, slots) : vue_cjs_prod.h(Fragment, {}, slots) };
};
const wrapInKeepAlive = (props, children) => {
  return { default: () => children };
};
const NuxtPage = vue_cjs_prod.defineComponent({
  name: "NuxtPage",
  props: {
    pageKey: {
      type: [Function, String],
      default: null
    }
  },
  setup(props) {
    const nuxtApp = useNuxtApp();
    return () => {
      return vue_cjs_prod.h(vueRouter_cjs_prod.RouterView, {}, {
        default: (routeProps) => {
          var _a2;
          return routeProps.Component && wrapIf(vue_cjs_prod.Transition, (_a2 = routeProps.route.meta.pageTransition) != null ? _a2 : defaultPageTransition, wrapInKeepAlive(routeProps.route.meta.keepalive, vue_cjs_prod.h(vue_cjs_prod.Suspense, {
            onPending: () => nuxtApp.callHook("page:start", routeProps.Component),
            onResolve: () => nuxtApp.callHook("page:finish", routeProps.Component)
          }, { default: () => vue_cjs_prod.h(routeProps.Component, { key: generateRouteKey(props.pageKey, routeProps) }) }))).default();
        }
      });
    };
  }
});
const defaultPageTransition = { name: "page", mode: "out-in" };
const layouts = {
  page: vue_cjs_prod.defineAsyncComponent({ suspensible: false, loader: () => Promise.resolve().then(function() {
    return page$1;
  }) })
};
const defaultLayoutTransition = { name: "layout", mode: "out-in" };
const NuxtLayout = vue_cjs_prod.defineComponent({
  props: {
    name: {
      type: [String, Boolean, Object],
      default: null
    }
  },
  setup(props, context) {
    const route = vueRouter_cjs_prod.useRoute();
    return () => {
      var _a2, _b2, _c;
      const layout = (_b2 = (_a2 = vue_cjs_prod.isRef(props.name) ? props.name.value : props.name) != null ? _a2 : route.meta.layout) != null ? _b2 : "default";
      const hasLayout = layout && layout in layouts;
      return wrapIf(vue_cjs_prod.Transition, hasLayout && ((_c = route.meta.layoutTransition) != null ? _c : defaultLayoutTransition), wrapIf(layouts[layout], hasLayout, context.slots)).default();
    };
  }
});
const _sfc_main$j = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __ssrInlineRender: true,
  setup(__props) {
    vue_cjs_prod.ref(13);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Html = vue_cjs_prod.resolveComponent("Html");
      const _component_Head = vue_cjs_prod.resolveComponent("Head");
      const _component_Title = vue_cjs_prod.resolveComponent("Title");
      _push(`<!--[-->`);
      _push(serverRenderer.exports.ssrRenderComponent(_component_Html, null, {
        default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer.exports.ssrRenderComponent(_component_Head, null, {
              default: vue_cjs_prod.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer.exports.ssrRenderComponent(_component_Title, null, {
                    default: vue_cjs_prod.withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`index`);
                      } else {
                        return [
                          vue_cjs_prod.createTextVNode("index")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    vue_cjs_prod.createVNode(_component_Title, null, {
                      default: vue_cjs_prod.withCtx(() => [
                        vue_cjs_prod.createTextVNode("index")
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              vue_cjs_prod.createVNode(_component_Head, null, {
                default: vue_cjs_prod.withCtx(() => [
                  vue_cjs_prod.createVNode(_component_Title, null, {
                    default: vue_cjs_prod.withCtx(() => [
                      vue_cjs_prod.createTextVNode("index")
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="bg-white-50 h-100vh p-6 font-montserrat"><div relative flex flex-col items-center justify-between space-y-12 shadow rounded-md bg-gray-100 hover:bg-gray-300 p-8><div flex items-center> Hover the icon: <a inline-block text-3xl ml-3 i-twemoji-grinning-face-with-smiling-eyes hover:i-twemoji-face-with-tears-of-joy></a></div><p class="text-left"> Nuxt offers a compelling solution and a great ecosystem to help you ship fullstack Vue apps that are performant and SEO friendly. The flexibility to choose between SSR and SSG is icing on the cake. </p><div class="flex w-full justify-between items-center"><a href="https://twitter.com/youyuxi" target="_blank" rel="noopener"><img loading="lazy" src="https://nuxtjs.org/img/home/testimonials/evan.png" alt="Evan You" width="48" height="48" class="h-12 w-12"></a><a href="https://twitter.com/youyuxi" target="_blank" rel="noopener" class="flex flex-1 pl-4 text-left flex-col"><span class="font-bold text-base">Evan You</span><span class="text-sm text-cloud">Creator of Vue.js </span></a><a i-carbon-logo-github text-3xl></a></div></div><div mt-20 text-center flex select-none all:transition-400><div ma><div text-5xl fw100 animate-bounce-alt animate-count-infinite animate-1s> unocss </div><div op30 text-lg fw200 m1> The instant on-demand Atomic CSS engine. </div><button bg-blue-400 hover:bg-blue-500 text-lg text-white font-light py-2 px-4 border-2 rounded border-blue-200> Button </button><div m2 flex justify-center text-2xl op30 hover:op80><a i-carbon-logo-github text-inherit></a></div></div></div><div absolute bottom-5 right-0 left-0 text-center op30 fw300> on-demand \xB7 instant \xB7 fully customizable </div></div><!--]-->`);
    };
  }
});
const _sfc_setup$j = _sfc_main$j.setup;
_sfc_main$j.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup$j ? _sfc_setup$j(props, ctx) : void 0;
};
const meta$1 = {
  layout: "page",
  key: "index",
  pageTransition: false,
  layoutTransition: false
};
function tryOnScopeDispose(fn) {
  if (vue_cjs_prod.getCurrentScope()) {
    vue_cjs_prod.onScopeDispose(fn);
    return true;
  }
  return false;
}
const isString = (val) => typeof val === "string";
const noop = () => {
};
function createFilterWrapper(filter, fn) {
  function wrapper(...args) {
    filter(() => fn.apply(this, args), { fn, thisArg: this, args });
  }
  return wrapper;
}
const bypassFilter = (invoke) => {
  return invoke();
};
var __getOwnPropSymbols$a = Object.getOwnPropertySymbols;
var __hasOwnProp$a = Object.prototype.hasOwnProperty;
var __propIsEnum$a = Object.prototype.propertyIsEnumerable;
var __objRest$5 = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$a.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$a)
    for (var prop of __getOwnPropSymbols$a(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$a.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
function watchWithFilter(source, cb, options = {}) {
  const _a2 = options, {
    eventFilter = bypassFilter
  } = _a2, watchOptions = __objRest$5(_a2, [
    "eventFilter"
  ]);
  return vue_cjs_prod.watch(source, createFilterWrapper(eventFilter, cb), watchOptions);
}
function tryOnBeforeUnmount(fn) {
  if (vue_cjs_prod.getCurrentInstance())
    vue_cjs_prod.onBeforeUnmount(fn);
}
function tryOnMounted(fn, sync = true) {
  if (vue_cjs_prod.getCurrentInstance())
    vue_cjs_prod.onMounted(fn);
  else if (sync)
    fn();
  else
    vue_cjs_prod.nextTick(fn);
}
function useToggle(initialValue = false) {
  if (vue_cjs_prod.isRef(initialValue)) {
    return (value) => {
      initialValue.value = typeof value === "boolean" ? value : !initialValue.value;
      return initialValue.value;
    };
  } else {
    const boolean = vue_cjs_prod.ref(initialValue);
    const toggle = (value) => {
      boolean.value = typeof value === "boolean" ? value : !boolean.value;
      return boolean.value;
    };
    return [boolean, toggle];
  }
}
const defaultWindow = void 0;
function useEventListener(...args) {
  let target;
  let event;
  let listener;
  let options;
  if (isString(args[0])) {
    [event, listener, options] = args;
    target = defaultWindow;
  } else {
    [target, event, listener, options] = args;
  }
  if (!target)
    return noop;
  let cleanup = noop;
  const stopWatch = vue_cjs_prod.watch(() => vue_cjs_prod.unref(target), (el) => {
    cleanup();
    if (!el)
      return;
    el.addEventListener(event, listener, options);
    cleanup = () => {
      el.removeEventListener(event, listener, options);
      cleanup = noop;
    };
  }, { immediate: true, flush: "post" });
  const stop = () => {
    stopWatch();
    cleanup();
  };
  tryOnScopeDispose(stop);
  return stop;
}
function useMediaQuery(query, options = {}) {
  const { window: window2 = defaultWindow } = options;
  let mediaQuery;
  const matches = vue_cjs_prod.ref(false);
  const update = () => {
    if (!window2)
      return;
    if (!mediaQuery)
      mediaQuery = window2.matchMedia(query);
    matches.value = mediaQuery.matches;
  };
  tryOnMounted(() => {
    update();
    if (!mediaQuery)
      return;
    if ("addEventListener" in mediaQuery)
      mediaQuery.addEventListener("change", update);
    else
      mediaQuery.addListener(update);
    tryOnScopeDispose(() => {
      if ("removeEventListener" in update)
        mediaQuery.removeEventListener("change", update);
      else
        mediaQuery.removeListener(update);
    });
  });
  return matches;
}
const _global = typeof globalThis !== "undefined" ? globalThis : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
const globalKey = "__vueuse_ssr_handlers__";
_global[globalKey] = _global[globalKey] || {};
const handlers = _global[globalKey];
function getSSRHandler(key, fallback) {
  return handlers[key] || fallback;
}
function setSSRHandler(key, fn) {
  handlers[key] = fn;
}
function guessSerializerType(rawInit) {
  return rawInit == null ? "any" : rawInit instanceof Set ? "set" : rawInit instanceof Map ? "map" : typeof rawInit === "boolean" ? "boolean" : typeof rawInit === "string" ? "string" : typeof rawInit === "object" ? "object" : Array.isArray(rawInit) ? "object" : !Number.isNaN(rawInit) ? "number" : "any";
}
const StorageSerializers = {
  boolean: {
    read: (v) => v === "true",
    write: (v) => String(v)
  },
  object: {
    read: (v) => JSON.parse(v),
    write: (v) => JSON.stringify(v)
  },
  number: {
    read: (v) => Number.parseFloat(v),
    write: (v) => String(v)
  },
  any: {
    read: (v) => v,
    write: (v) => String(v)
  },
  string: {
    read: (v) => v,
    write: (v) => String(v)
  },
  map: {
    read: (v) => new Map(JSON.parse(v)),
    write: (v) => JSON.stringify(Array.from(v.entries()))
  },
  set: {
    read: (v) => new Set(JSON.parse(v)),
    write: (v) => JSON.stringify(Array.from(v.entries()))
  }
};
function useStorage(key, initialValue, storage, options = {}) {
  var _a2;
  const {
    flush = "pre",
    deep = true,
    listenToStorageChanges = true,
    writeDefaults = true,
    shallow,
    window: window2 = defaultWindow,
    eventFilter,
    onError = (e) => {
      console.error(e);
    }
  } = options;
  const rawInit = vue_cjs_prod.unref(initialValue);
  const type = guessSerializerType(rawInit);
  const data = (shallow ? vue_cjs_prod.shallowRef : vue_cjs_prod.ref)(initialValue);
  const serializer = (_a2 = options.serializer) != null ? _a2 : StorageSerializers[type];
  if (!storage) {
    try {
      storage = getSSRHandler("getDefaultStorage", () => {
        var _a22;
        return (_a22 = defaultWindow) == null ? void 0 : _a22.localStorage;
      })();
    } catch (e) {
      onError(e);
    }
  }
  function read(event) {
    if (!storage || event && event.key !== key)
      return;
    try {
      const rawValue = event ? event.newValue : storage.getItem(key);
      if (rawValue == null) {
        data.value = rawInit;
        if (writeDefaults && rawInit !== null)
          storage.setItem(key, serializer.write(rawInit));
      } else if (typeof rawValue !== "string") {
        data.value = rawValue;
      } else {
        data.value = serializer.read(rawValue);
      }
    } catch (e) {
      onError(e);
    }
  }
  read();
  if (window2 && listenToStorageChanges)
    useEventListener(window2, "storage", (e) => setTimeout(() => read(e), 0));
  if (storage) {
    watchWithFilter(data, () => {
      try {
        if (data.value == null)
          storage.removeItem(key);
        else
          storage.setItem(key, serializer.write(data.value));
      } catch (e) {
        onError(e);
      }
    }, {
      flush,
      deep,
      eventFilter
    });
  }
  return data;
}
function usePreferredDark(options) {
  return useMediaQuery("(prefers-color-scheme: dark)", options);
}
var __defProp$f = Object.defineProperty;
var __getOwnPropSymbols$h = Object.getOwnPropertySymbols;
var __hasOwnProp$h = Object.prototype.hasOwnProperty;
var __propIsEnum$h = Object.prototype.propertyIsEnumerable;
var __defNormalProp$f = (obj, key, value) => key in obj ? __defProp$f(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$f = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$h.call(b, prop))
      __defNormalProp$f(a, prop, b[prop]);
  if (__getOwnPropSymbols$h)
    for (var prop of __getOwnPropSymbols$h(b)) {
      if (__propIsEnum$h.call(b, prop))
        __defNormalProp$f(a, prop, b[prop]);
    }
  return a;
};
function useColorMode(options = {}) {
  const {
    selector = "html",
    attribute = "class",
    window: window2 = defaultWindow,
    storage,
    storageKey = "vueuse-color-scheme",
    listenToStorageChanges = true,
    storageRef
  } = options;
  const modes = __spreadValues$f({
    auto: "",
    light: "light",
    dark: "dark"
  }, options.modes || {});
  const preferredDark = usePreferredDark({ window: window2 });
  const preferredMode = vue_cjs_prod.computed(() => preferredDark.value ? "dark" : "light");
  const store = storageRef || (storageKey == null ? vue_cjs_prod.ref("auto") : useStorage(storageKey, "auto", storage, { window: window2, listenToStorageChanges }));
  const state = vue_cjs_prod.computed({
    get() {
      return store.value === "auto" ? preferredMode.value : store.value;
    },
    set(v) {
      store.value = v;
    }
  });
  const updateHTMLAttrs = getSSRHandler("updateHTMLAttrs", (selector2, attribute2, value) => {
    const el = window2 == null ? void 0 : window2.document.querySelector(selector2);
    if (!el)
      return;
    if (attribute2 === "class") {
      const current = value.split(/\s/g);
      Object.values(modes).flatMap((i) => (i || "").split(/\s/g)).filter(Boolean).forEach((v) => {
        if (current.includes(v))
          el.classList.add(v);
        else
          el.classList.remove(v);
      });
    } else {
      el.setAttribute(attribute2, value);
    }
  });
  function defaultOnChanged(mode) {
    var _a2;
    updateHTMLAttrs(selector, attribute, (_a2 = modes[mode]) != null ? _a2 : mode);
  }
  function onChanged(mode) {
    if (options.onChanged)
      options.onChanged(mode, defaultOnChanged);
    else
      defaultOnChanged(mode);
  }
  vue_cjs_prod.watch(state, onChanged, { flush: "post", immediate: true });
  tryOnMounted(() => onChanged(state.value));
  return state;
}
var __defProp$e = Object.defineProperty;
var __defProps$8 = Object.defineProperties;
var __getOwnPropDescs$8 = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$g = Object.getOwnPropertySymbols;
var __hasOwnProp$g = Object.prototype.hasOwnProperty;
var __propIsEnum$g = Object.prototype.propertyIsEnumerable;
var __defNormalProp$e = (obj, key, value) => key in obj ? __defProp$e(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$e = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$g.call(b, prop))
      __defNormalProp$e(a, prop, b[prop]);
  if (__getOwnPropSymbols$g)
    for (var prop of __getOwnPropSymbols$g(b)) {
      if (__propIsEnum$g.call(b, prop))
        __defNormalProp$e(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$8 = (a, b) => __defProps$8(a, __getOwnPropDescs$8(b));
function useDark(options = {}) {
  const {
    valueDark = "dark",
    valueLight = "",
    window: window2 = defaultWindow
  } = options;
  const mode = useColorMode(__spreadProps$8(__spreadValues$e({}, options), {
    onChanged: (mode2, defaultHandler) => {
      var _a2;
      if (options.onChanged)
        (_a2 = options.onChanged) == null ? void 0 : _a2.call(options, mode2 === "dark");
      else
        defaultHandler(mode2);
    },
    modes: {
      dark: valueDark,
      light: valueLight
    }
  }));
  const preferredDark = usePreferredDark({ window: window2 });
  const isDark = vue_cjs_prod.computed({
    get() {
      return mode.value === "dark";
    },
    set(v) {
      if (v === preferredDark.value)
        mode.value = "auto";
      else
        mode.value = v ? "dark" : "light";
    }
  });
  return isDark;
}
var __defProp$3 = Object.defineProperty;
var __getOwnPropSymbols$3 = Object.getOwnPropertySymbols;
var __hasOwnProp$3 = Object.prototype.hasOwnProperty;
var __propIsEnum$3 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$3 = (obj, key, value) => key in obj ? __defProp$3(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$3 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$3.call(b, prop))
      __defNormalProp$3(a, prop, b[prop]);
  if (__getOwnPropSymbols$3)
    for (var prop of __getOwnPropSymbols$3(b)) {
      if (__propIsEnum$3.call(b, prop))
        __defNormalProp$3(a, prop, b[prop]);
    }
  return a;
};
const initialRect = {
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  height: 0,
  width: 0
};
__spreadValues$3({
  text: ""
}, initialRect);
const headHeight = 56;
function getHeadings() {
  return [
    ...document.querySelectorAll(".article h2"),
    ...document.querySelectorAll(".article h3"),
    ...document.querySelectorAll(".article h4")
  ];
}
function getScrollContainer() {
  return document.querySelector(".layout-container");
}
function autoHighlightArchor() {
  const container = getScrollContainer();
  const targets = document.querySelectorAll("h2, h3, h4");
  const tocLinks = document.querySelectorAll(".toc-link");
  const tocBtn = document.querySelector(".tocs-btn");
  const headBoxHeight = tocBtn.clientHeight + headHeight;
  for (const entry2 of targets) {
    const target = entry2;
    target.classList.remove("active");
    if (target.offsetTop < container.scrollTop + headBoxHeight + 90 && target.offsetTop > container.scrollTop + headBoxHeight) {
      tocLinks.forEach((dom) => {
        dom.classList.remove("active");
      });
      const links = document.querySelectorAll(`.toc-link[href="#${target.id}"]`);
      for (const v of links) {
        v.classList.add("active");
      }
      break;
    }
  }
}
function useArticleScroll() {
  function getTopIcon() {
    return document.querySelector("#back-2-top");
  }
  function doScroll() {
    const container = getScrollContainer();
    const topIcon = getTopIcon();
    const scrollTop = container.scrollTop;
    if (scrollTop > 200) {
      topIcon.style.display = "flex";
    } else {
      topIcon.style.display = "none";
    }
    autoHighlightArchor();
  }
  function onClick() {
    const container = getScrollContainer();
    container.scrollTo({ top: 0, behavior: "smooth" });
  }
  function hideTocs(e) {
    const tocs = document.querySelector(".tocs-sm");
    if (tocs) {
      const classList = tocs.classList;
      const isOpen = classList.contains("h-auto");
      if (isOpen && !tocs.contains(e.target)) {
        tocs.classList.remove("h-auto");
        tocs.classList.add("h-10");
      }
    }
  }
  tryOnMounted(() => {
    const container = getScrollContainer();
    const topIcon = getTopIcon();
    topIcon.addEventListener("click", onClick, false);
    container.addEventListener("scroll", doScroll, false);
    document.body.addEventListener("click", hideTocs, false);
  });
  tryOnBeforeUnmount(() => {
    const container = getScrollContainer();
    const topIcon = getTopIcon();
    topIcon.removeEventListener("click", onClick, false);
    container.removeEventListener("scroll", doScroll, false);
    document.body.removeEventListener("click", hideTocs, false);
  });
  return {};
}
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$i = {
  props: {},
  onMounted() {
    console.log(111111111);
  }
};
function _sfc_ssrRender$3(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_NuxtLink = vue_cjs_prod.resolveComponent("NuxtLink");
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(_attrs)}><ul class="py-4 px-4 lg:pt-0"><li><h5 class="transition duration-100 font-bold py-2">Code style</h5><ul class="mb-2"><li>`);
  _push(serverRenderer.exports.ssrRenderComponent(_component_NuxtLink, {
    to: "/posts/code-styles/less-code-style",
    class: "transition duration-100 relative inline-flex items-center justify-between pl-3 py-1 border-l border-gray-100 dark:border-dark-400 text-sm text-gray-700 dark:text-gray-400 hover:text-primary hover:dark:text-primary"
  }, {
    default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` less `);
      } else {
        return [
          vue_cjs_prod.createTextVNode(" less ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li><li>`);
  _push(serverRenderer.exports.ssrRenderComponent(_component_NuxtLink, {
    to: "/posts/code-styles/html-style-guide",
    class: "transition duration-100 relative inline-flex items-center justify-between pl-3 py-1 border-l border-gray-100 dark:border-dark-400 text-sm text-gray-700 dark:text-gray-400 hover:text-primary hover:dark:text-primary"
  }, {
    default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` html `);
      } else {
        return [
          vue_cjs_prod.createTextVNode(" html ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li><li>`);
  _push(serverRenderer.exports.ssrRenderComponent(_component_NuxtLink, {
    to: "/posts/code-styles/airbnb-javascript-style-guide",
    class: "transition duration-100 relative inline-flex items-center justify-between pl-3 py-1 border-l border-gray-100 dark:border-dark-400 text-sm text-gray-700 dark:text-gray-400 hover:text-primary hover:dark:text-primary"
  }, {
    default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` javascript `);
      } else {
        return [
          vue_cjs_prod.createTextVNode(" javascript ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li><li>`);
  _push(serverRenderer.exports.ssrRenderComponent(_component_NuxtLink, {
    to: "/posts/code-styles/es-next-style-guide",
    class: "transition duration-100 relative inline-flex items-center justify-between pl-3 py-1 border-l border-gray-100 dark:border-dark-400 text-sm text-gray-700 dark:text-gray-400 hover:text-primary hover:dark:text-primary"
  }, {
    default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` esnext `);
      } else {
        return [
          vue_cjs_prod.createTextVNode(" esnext ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li></ul></li><li><h5 class="transition duration-100 font-bold py-2">React</h5><ul class="mb-2"><li>`);
  _push(serverRenderer.exports.ssrRenderComponent(_component_NuxtLink, {
    to: "/posts/react/about-react",
    class: "transition duration-100 relative inline-flex items-center justify-between pl-3 py-1 border-l border-gray-100 dark:border-dark-400 text-sm text-gray-700 dark:text-gray-400 hover:text-primary hover:dark:text-primary"
  }, {
    default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` \u5173\u4E8EReact\u76846\u70B9\u5EFA\u8BAE `);
      } else {
        return [
          vue_cjs_prod.createTextVNode(" \u5173\u4E8EReact\u76846\u70B9\u5EFA\u8BAE ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li><li>`);
  _push(serverRenderer.exports.ssrRenderComponent(_component_NuxtLink, {
    to: "/posts/react/react-resource-debug",
    class: "transition duration-100 relative inline-flex items-center justify-between pl-3 py-1 border-l border-gray-100 dark:border-dark-400 text-sm text-gray-700 dark:text-gray-400 hover:text-primary hover:dark:text-primary"
  }, {
    default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` React\u6E90\u7801\u8C03\u8BD5\u73AF\u5883\u642D\u5EFA `);
      } else {
        return [
          vue_cjs_prod.createTextVNode(" React\u6E90\u7801\u8C03\u8BD5\u73AF\u5883\u642D\u5EFA ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li></ul></li><li><h5 class="transition duration-100 font-bold py-2">Vue</h5><ul class="mb-2"><li>`);
  _push(serverRenderer.exports.ssrRenderComponent(_component_NuxtLink, {
    to: "/posts/vue/test",
    class: "transition duration-100 relative inline-flex items-center justify-between pl-3 py-1 border-l border-gray-100 dark:border-dark-400 text-sm text-gray-700 dark:text-gray-400 hover:text-primary hover:dark:text-primary"
  }, {
    default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` vue test `);
      } else {
        return [
          vue_cjs_prod.createTextVNode(" vue test ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li><li>`);
  _push(serverRenderer.exports.ssrRenderComponent(_component_NuxtLink, {
    to: "/posts/vue/full",
    class: "transition duration-100 relative inline-flex items-center justify-between pl-3 py-1 border-l border-gray-100 dark:border-dark-400 text-sm text-gray-700 dark:text-gray-400 hover:text-primary hover:dark:text-primary"
  }, {
    default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` full usage `);
      } else {
        return [
          vue_cjs_prod.createTextVNode(" full usage ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li><li>`);
  _push(serverRenderer.exports.ssrRenderComponent(_component_NuxtLink, {
    to: "/posts/vue/uuu",
    class: "transition duration-100 relative inline-flex items-center justify-between pl-3 py-1 border-l border-gray-100 dark:border-dark-400 text-sm text-gray-700 dark:text-gray-400 hover:text-primary hover:dark:text-primary"
  }, {
    default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` uuu `);
      } else {
        return [
          vue_cjs_prod.createTextVNode(" uuu ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li></ul></li></ul></div>`);
}
const _sfc_setup$i = _sfc_main$i.setup;
_sfc_main$i.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Categories.vue");
  return _sfc_setup$i ? _sfc_setup$i(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main$i, [["ssrRender", _sfc_ssrRender$3]]);
const _sfc_main$h = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __ssrInlineRender: true,
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  emits: ["close"],
  setup(__props, { emit }) {
    const props = __props;
    const loaded = vue_cjs_prod.ref(false);
    tryOnMounted(() => {
      loaded.value = true;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_categories = __nuxt_component_0;
      _push(`<aside${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({ class: "sidebar fixed z-50 lg:z-0 lg:left-0 lg:top-$header-height xl:left-$sidebar-ml-xl" }, _attrs))}><div class="h-full pointer-events-none"><div style="${serverRenderer.exports.ssrRenderStyle(props.visible ? null : { display: "none" })}" class="fixed top-0 left-0 z-0 w-full h-full bg-gray-200 pointer-events-auto backdrop-filter backdrop-blur-sm dark:bg-dark-800 dark:bg-opacity-80 bg-opacity-50 lg:hidden"></div><div class="${serverRenderer.exports.ssrRenderClass([`${__props.visible ? "-translate-x-0" : "-translate-x-full"}`, "fixed top-0 left-0 w-$sidebar-width h-full pointer-events-auto transform lg:transform-none transition-transform duration-200 ease-linear lg:sticky"])}"><div class="w-full h-full bg-white dark:bg-[#001e26]"><div class="sticky h-full overflow-y-auto d-scrollbar">`);
      _push(serverRenderer.exports.ssrRenderComponent(_component_categories, null, null, _parent));
      _push(`</div></div></div></div></aside>`);
    };
  }
});
const _sfc_setup$h = _sfc_main$h.setup;
_sfc_main$h.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Sidebar.vue");
  return _sfc_setup$h ? _sfc_setup$h(props, ctx) : void 0;
};
const _sfc_main$g = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const showSidebar = vue_cjs_prod.ref(false);
    const route = useRoute();
    const category = route.params.category;
    const postname = route.params.postname;
    const { data } = ([__temp, __restore] = vue_cjs_prod.withAsyncContext(() => useFetch(`/api/post?category=${category}&postname=${postname}`)), __temp = await __temp, __restore(), __temp);
    const title = vue_cjs_prod.computed(() => {
      var _a2;
      return ((_a2 = data.value.meta) == null ? void 0 : _a2.title) || "blog";
    });
    if (data.value.code === 404) {
      window.location.href = "/404";
    }
    useArticleScroll();
    return (_ctx, _push, _parent, _attrs) => {
      var _a2, _b2, _c;
      const _component_Html = vue_cjs_prod.resolveComponent("Html");
      const _component_Head = vue_cjs_prod.resolveComponent("Head");
      const _component_Title = vue_cjs_prod.resolveComponent("Title");
      const _component_header_nav = vue_cjs_prod.resolveComponent("header-nav");
      const _component_table_of_contents = vue_cjs_prod.resolveComponent("table-of-contents");
      const _component_article_content = vue_cjs_prod.resolveComponent("article-content");
      _push(`<!--[-->`);
      _push(serverRenderer.exports.ssrRenderComponent(_component_Html, null, {
        default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer.exports.ssrRenderComponent(_component_Head, null, {
              default: vue_cjs_prod.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer.exports.ssrRenderComponent(_component_Title, null, {
                    default: vue_cjs_prod.withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`${serverRenderer.exports.ssrInterpolate(vue_cjs_prod.unref(title))}`);
                      } else {
                        return [
                          vue_cjs_prod.createTextVNode(vue_cjs_prod.toDisplayString(vue_cjs_prod.unref(title)), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    vue_cjs_prod.createVNode(_component_Title, null, {
                      default: vue_cjs_prod.withCtx(() => [
                        vue_cjs_prod.createTextVNode(vue_cjs_prod.toDisplayString(vue_cjs_prod.unref(title)), 1)
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              vue_cjs_prod.createVNode(_component_Head, null, {
                default: vue_cjs_prod.withCtx(() => [
                  vue_cjs_prod.createVNode(_component_Title, null, {
                    default: vue_cjs_prod.withCtx(() => [
                      vue_cjs_prod.createTextVNode(vue_cjs_prod.toDisplayString(vue_cjs_prod.unref(title)), 1)
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer.exports.ssrRenderComponent(_component_header_nav, null, null, _parent));
      _push(serverRenderer.exports.ssrRenderComponent(_sfc_main$h, { visible: showSidebar.value }, null, _parent));
      _push(`<article class="article">`);
      _push(serverRenderer.exports.ssrRenderComponent(_component_table_of_contents, {
        class: "tocs-sm xl:hidden lg:ml-$sidebar-width lg:w-$tocs-width-lg",
        children: (_a2 = vue_cjs_prod.unref(data)) == null ? void 0 : _a2.tocs
      }, null, _parent));
      _push(`<div class="lg:ml-$sidebar-width">`);
      _push(serverRenderer.exports.ssrRenderComponent(_component_article_content, {
        class: "xl:mr-$tocs-width",
        children: (_b2 = vue_cjs_prod.unref(data)) == null ? void 0 : _b2.children
      }, null, _parent));
      _push(serverRenderer.exports.ssrRenderComponent(_component_table_of_contents, {
        class: "xl:h-$tocs-height-xl xl:w-$tocs-width xl:fixed xl:left-$tocs-ml-xl xl:top-$header-height <xl:hidden",
        children: (_c = vue_cjs_prod.unref(data)) == null ? void 0 : _c.tocs,
        "is-pc": true
      }, null, _parent));
      _push(`</div><div id="back-2-top" class="fixed z-50 bottom-2 right-2 w-10 h-10 bg-black-500/50 rounded-full items-center justify-center hidden dark:bg-white/90"><span class="i-carbon-back-to-top block !w-4 h-4 bg-white dark:bg-black/90"></span></div></article><!--]-->`);
    };
  }
});
const _sfc_setup$g = _sfc_main$g.setup;
_sfc_main$g.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/posts/[category]/[postname].vue");
  return _sfc_setup$g ? _sfc_setup$g(props, ctx) : void 0;
};
const meta = {
  layout: "page",
  pageTransition: false,
  layoutTransition: false,
  key: (route2) => route2.fullPath
};
const routes = [
  {
    name: "index",
    path: "/",
    file: "D:/personal/code-resource/vue/nuxt3-app/pages/index.vue",
    children: [],
    meta: meta$1,
    component: () => Promise.resolve().then(function() {
      return index;
    })
  },
  {
    name: "posts-category-postname",
    path: "/posts/:category/:postname",
    file: "D:/personal/code-resource/vue/nuxt3-app/pages/posts/[category]/[postname].vue",
    children: [],
    meta,
    component: () => Promise.resolve().then(function() {
      return _postname_;
    })
  }
];
const globalMiddleware = [];
const namedMiddleware = {};
const router_1d650411 = defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component("NuxtPage", NuxtPage);
  nuxtApp.vueApp.component("NuxtLayout", NuxtLayout);
  nuxtApp.vueApp.component("NuxtLink", vueRouter_cjs_prod.RouterLink);
  nuxtApp.vueApp.component("NuxtNestedPage", NuxtPage);
  nuxtApp.vueApp.component("NuxtChild", NuxtPage);
  const { baseURL } = useRuntimeConfig().app;
  const routerHistory = vueRouter_cjs_prod.createMemoryHistory(baseURL);
  const router = vueRouter_cjs_prod.createRouter({
    history: routerHistory,
    routes
  });
  nuxtApp.vueApp.use(router);
  const previousRoute = vue_cjs_prod.shallowRef(router.currentRoute.value);
  router.afterEach((_to, from) => {
    previousRoute.value = from;
  });
  Object.defineProperty(nuxtApp.vueApp.config.globalProperties, "previousRoute", {
    get: () => previousRoute.value
  });
  const route = {};
  for (const key in router.currentRoute.value) {
    route[key] = vue_cjs_prod.computed(() => router.currentRoute.value[key]);
  }
  nuxtApp._route = vue_cjs_prod.reactive(route);
  nuxtApp._middleware = nuxtApp._middleware || {
    global: [],
    named: {}
  };
  router.beforeEach(async (to, from) => {
    var _a2;
    to.meta = vue_cjs_prod.reactive(to.meta);
    nuxtApp._processingMiddleware = true;
    const middlewareEntries = /* @__PURE__ */ new Set([...globalMiddleware, ...nuxtApp._middleware.global]);
    for (const component of to.matched) {
      const componentMiddleware = component.meta.middleware;
      if (!componentMiddleware) {
        continue;
      }
      if (Array.isArray(componentMiddleware)) {
        for (const entry2 of componentMiddleware) {
          middlewareEntries.add(entry2);
        }
      } else {
        middlewareEntries.add(componentMiddleware);
      }
    }
    for (const entry2 of middlewareEntries) {
      const middleware = typeof entry2 === "string" ? nuxtApp._middleware.named[entry2] || await ((_a2 = namedMiddleware[entry2]) == null ? void 0 : _a2.call(namedMiddleware).then((r) => r.default || r)) : entry2;
      const result = await callWithNuxt(nuxtApp, middleware, [to, from]);
      {
        if (result === false || result instanceof Error) {
          const error = result || createError({
            statusMessage: `Route navigation aborted: ${nuxtApp.ssrContext.url}`
          });
          nuxtApp.ssrContext.error = error;
          throw error;
        }
      }
      if (result || result === false) {
        return result;
      }
    }
  });
  router.afterEach(() => {
    delete nuxtApp._processingMiddleware;
  });
  nuxtApp.hook("app:created", async () => {
    {
      router.push(nuxtApp.ssrContext.url);
      router.afterEach((to) => {
        if (to.fullPath !== nuxtApp.ssrContext.url) {
          nuxtApp.ssrContext.res.setHeader("Location", to.fullPath);
          nuxtApp.ssrContext.res.statusCode = 301;
          nuxtApp.ssrContext.res.end();
        }
      });
    }
    try {
      await router.isReady();
      const is404 = router.currentRoute.value.matched.length === 0;
      if (is404) {
        throw createError({
          statusCode: 404,
          statusMessage: `Page not found: ${nuxtApp.ssrContext.url}`
        });
      }
    } catch (error) {
      nuxtApp.ssrContext.error = error;
    }
  });
  return { provide: { router } };
});
const unocss_6f8c5398 = () => {
};
setSSRHandler("getDefaultStorage", () => {
  const cookieMap = /* @__PURE__ */ new Map();
  const get = (key) => {
    if (!cookieMap.get(key))
      cookieMap.set(key, useCookie(key, { maxAge: 2147483646 }));
    return cookieMap.get(key);
  };
  return {
    getItem: (key) => get(key).value,
    setItem: (key, value) => get(key).value = value,
    removeItem: (key) => get(key).value = void 0
  };
});
{
  setSSRHandler("updateHTMLAttrs", (selector, attr, value) => {
    if (selector === "html") {
      useMeta({
        htmlAttrs: {
          [attr]: value
        }
      });
    } else if (selector === "body") {
      useMeta({
        bodyAttrs: {
          [attr]: value
        }
      });
    } else {
      throw new Error(`Unsupported meta selector "${selector}" in SSR`);
    }
  });
}
const ssrPlugin_65e25c60 = () => {
};
const markdownHotload_9c63e28e = defineNuxtPlugin((nuxtApp) => {
});
const HASH_RE = /#/g;
const AMPERSAND_RE = /&/g;
const EQUAL_RE = /=/g;
const PLUS_RE = /\+/g;
const ENC_BRACKET_OPEN_RE = /%5B/gi;
const ENC_BRACKET_CLOSE_RE = /%5D/gi;
const ENC_CARET_RE = /%5E/gi;
const ENC_BACKTICK_RE = /%60/gi;
const ENC_CURLY_OPEN_RE = /%7B/gi;
const ENC_PIPE_RE = /%7C/gi;
const ENC_CURLY_CLOSE_RE = /%7D/gi;
const ENC_SPACE_RE = /%20/gi;
function encode(text) {
  return encodeURI("" + text).replace(ENC_PIPE_RE, "|").replace(ENC_BRACKET_OPEN_RE, "[").replace(ENC_BRACKET_CLOSE_RE, "]");
}
function encodeQueryValue(text) {
  return encode(text).replace(PLUS_RE, "%2B").replace(ENC_SPACE_RE, "+").replace(HASH_RE, "%23").replace(AMPERSAND_RE, "%26").replace(ENC_BACKTICK_RE, "`").replace(ENC_CURLY_OPEN_RE, "{").replace(ENC_CURLY_CLOSE_RE, "}").replace(ENC_CARET_RE, "^");
}
function encodeQueryKey(text) {
  return encodeQueryValue(text).replace(EQUAL_RE, "%3D");
}
function decode(text = "") {
  try {
    return decodeURIComponent("" + text);
  } catch (_err) {
    return "" + text;
  }
}
function decodeQueryValue(text) {
  return decode(text.replace(PLUS_RE, " "));
}
function parseQuery(paramsStr = "") {
  const obj = {};
  if (paramsStr[0] === "?") {
    paramsStr = paramsStr.substr(1);
  }
  for (const param of paramsStr.split("&")) {
    const s = param.match(/([^=]+)=?(.*)/) || [];
    if (s.length < 2) {
      continue;
    }
    const key = decode(s[1]);
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = decodeQueryValue(s[2] || "");
    if (obj[key]) {
      if (Array.isArray(obj[key])) {
        obj[key].push(value);
      } else {
        obj[key] = [obj[key], value];
      }
    } else {
      obj[key] = value;
    }
  }
  return obj;
}
function encodeQueryItem(key, val) {
  if (!val) {
    return encodeQueryKey(key);
  }
  if (Array.isArray(val)) {
    return val.map((_val) => `${encodeQueryKey(key)}=${encodeQueryValue(_val)}`).join("&");
  }
  return `${encodeQueryKey(key)}=${encodeQueryValue(val)}`;
}
function stringifyQuery(query) {
  return Object.keys(query).map((k) => encodeQueryItem(k, query[k])).join("&");
}
function hasProtocol(inputStr, acceptProtocolRelative = false) {
  return /^\w+:\/\/.+/.test(inputStr) || acceptProtocolRelative && /^\/\/[^/]+/.test(inputStr);
}
const TRAILING_SLASH_RE = /\/$|\/\?/;
function hasTrailingSlash(input = "", queryParams = false) {
  if (!queryParams) {
    return input.endsWith("/");
  }
  return TRAILING_SLASH_RE.test(input);
}
function withoutTrailingSlash(input = "", queryParams = false) {
  if (!queryParams) {
    return (hasTrailingSlash(input) ? input.slice(0, -1) : input) || "/";
  }
  if (!hasTrailingSlash(input, true)) {
    return input || "/";
  }
  const [s0, ...s] = input.split("?");
  return (s0.slice(0, -1) || "/") + (s.length ? `?${s.join("?")}` : "");
}
function withTrailingSlash(input = "", queryParams = false) {
  if (!queryParams) {
    return input.endsWith("/") ? input : input + "/";
  }
  if (hasTrailingSlash(input, true)) {
    return input || "/";
  }
  const [s0, ...s] = input.split("?");
  return s0 + "/" + (s.length ? `?${s.join("?")}` : "");
}
function hasLeadingSlash(input = "") {
  return input.startsWith("/");
}
function withoutLeadingSlash(input = "") {
  return (hasLeadingSlash(input) ? input.substr(1) : input) || "/";
}
function withBase(input, base) {
  if (isEmptyURL(base)) {
    return input;
  }
  const _base = withoutTrailingSlash(base);
  if (input.startsWith(_base)) {
    return input;
  }
  return joinURL(_base, input);
}
function withQuery(input, query) {
  const parsed = parseURL(input);
  const mergedQuery = __spreadValues(__spreadValues({}, parseQuery(parsed.search)), query);
  parsed.search = stringifyQuery(mergedQuery);
  return stringifyParsedURL(parsed);
}
function isEmptyURL(url) {
  return !url || url === "/";
}
function isNonEmptyURL(url) {
  return url && url !== "/";
}
function joinURL(base, ...input) {
  let url = base || "";
  for (const i of input.filter(isNonEmptyURL)) {
    url = url ? withTrailingSlash(url) + withoutLeadingSlash(i) : i;
  }
  return url;
}
function parseURL(input = "", defaultProto) {
  if (!hasProtocol(input, true)) {
    return defaultProto ? parseURL(defaultProto + input) : parsePath(input);
  }
  const [protocol = "", auth, hostAndPath] = (input.replace(/\\/g, "/").match(/([^:/]+:)?\/\/([^/@]+@)?(.*)/) || []).splice(1);
  const [host = "", path = ""] = (hostAndPath.match(/([^/?#]*)(.*)?/) || []).splice(1);
  const { pathname, search, hash } = parsePath(path);
  return {
    protocol,
    auth: auth ? auth.substr(0, auth.length - 1) : "",
    host,
    pathname,
    search,
    hash
  };
}
function parsePath(input = "") {
  const [pathname = "", search = "", hash = ""] = (input.match(/([^#?]*)(\?[^#]*)?(#.*)?/) || []).splice(1);
  return {
    pathname,
    search,
    hash
  };
}
function stringifyParsedURL(parsed) {
  const fullpath = parsed.pathname + (parsed.search ? (parsed.search.startsWith("?") ? "" : "?") + parsed.search : "") + parsed.hash;
  if (!parsed.protocol) {
    return fullpath;
  }
  return parsed.protocol + "//" + (parsed.auth ? parsed.auth + "@" : "") + parsed.host + fullpath;
}
class FetchError extends Error {
  constructor() {
    super(...arguments);
    this.name = "FetchError";
  }
}
function createFetchError(request, error, response) {
  let message = "";
  if (request && response) {
    message = `${response.status} ${response.statusText} (${request.toString()})`;
  }
  if (error) {
    message = `${error.message} (${message})`;
  }
  const fetchError = new FetchError(message);
  Object.defineProperty(fetchError, "request", { get() {
    return request;
  } });
  Object.defineProperty(fetchError, "response", { get() {
    return response;
  } });
  Object.defineProperty(fetchError, "data", { get() {
    return response && response._data;
  } });
  return fetchError;
}
const payloadMethods = new Set(Object.freeze(["PATCH", "POST", "PUT", "DELETE"]));
function isPayloadMethod(method = "GET") {
  return payloadMethods.has(method.toUpperCase());
}
function isJSONSerializable(val) {
  if (val === void 0) {
    return false;
  }
  const t = typeof val;
  if (t === "string" || t === "number" || t === "boolean" || t === null) {
    return true;
  }
  if (t !== "object") {
    return false;
  }
  if (Array.isArray(val)) {
    return true;
  }
  return val.constructor && val.constructor.name === "Object" || typeof val.toJSON === "function";
}
const textTypes = /* @__PURE__ */ new Set([
  "image/svg",
  "application/xml",
  "application/xhtml",
  "application/html"
]);
const jsonTypes = /* @__PURE__ */ new Set(["application/json", "application/ld+json"]);
function detectResponseType(_contentType = "") {
  if (!_contentType) {
    return "json";
  }
  const contentType = _contentType.split(";").shift();
  if (jsonTypes.has(contentType)) {
    return "json";
  }
  if (textTypes.has(contentType) || contentType.startsWith("text/")) {
    return "text";
  }
  return "blob";
}
const retryStatusCodes = /* @__PURE__ */ new Set([
  408,
  409,
  425,
  429,
  500,
  502,
  503,
  504
]);
function createFetch(globalOptions) {
  const { fetch: fetch2, Headers: Headers2 } = globalOptions;
  function onError(ctx) {
    if (ctx.options.retry !== false) {
      const retries = typeof ctx.options.retry === "number" ? ctx.options.retry : isPayloadMethod(ctx.options.method) ? 0 : 1;
      const responseCode = ctx.response && ctx.response.status || 500;
      if (retries > 0 && retryStatusCodes.has(responseCode)) {
        return $fetchRaw(ctx.request, __spreadProps(__spreadValues({}, ctx.options), {
          retry: retries - 1
        }));
      }
    }
    const err = createFetchError(ctx.request, ctx.error, ctx.response);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(err, $fetchRaw);
    }
    throw err;
  }
  const $fetchRaw = async function $fetchRaw2(_request, _opts = {}) {
    const ctx = {
      request: _request,
      options: __spreadValues(__spreadValues({}, globalOptions.defaults), _opts),
      response: void 0,
      error: void 0
    };
    if (ctx.options.onRequest) {
      await ctx.options.onRequest(ctx);
    }
    if (typeof ctx.request === "string") {
      if (ctx.options.baseURL) {
        ctx.request = withBase(ctx.request, ctx.options.baseURL);
      }
      if (ctx.options.params) {
        ctx.request = withQuery(ctx.request, ctx.options.params);
      }
      if (ctx.options.body && isPayloadMethod(ctx.options.method)) {
        if (isJSONSerializable(ctx.options.body)) {
          ctx.options.body = JSON.stringify(ctx.options.body);
          ctx.options.headers = new Headers2(ctx.options.headers);
          if (!ctx.options.headers.has("content-type")) {
            ctx.options.headers.set("content-type", "application/json");
          }
          if (!ctx.options.headers.has("accept")) {
            ctx.options.headers.set("accept", "application/json");
          }
        }
      }
    }
    ctx.response = await fetch2(ctx.request, ctx.options).catch(async (error) => {
      ctx.error = error;
      if (ctx.options.onRequestError) {
        await ctx.options.onRequestError(ctx);
      }
      return onError(ctx);
    });
    const responseType = (ctx.options.parseResponse ? "json" : ctx.options.responseType) || detectResponseType(ctx.response.headers.get("content-type") || "");
    if (responseType === "json") {
      const data = await ctx.response.text();
      const parseFn = ctx.options.parseResponse || destr;
      ctx.response._data = parseFn(data);
    } else {
      ctx.response._data = await ctx.response[responseType]();
    }
    if (ctx.options.onResponse) {
      await ctx.options.onResponse(ctx);
    }
    if (!ctx.response.ok) {
      if (ctx.options.onResponseError) {
        await ctx.options.onResponseError(ctx);
      }
    }
    return ctx.response.ok ? ctx.response : onError(ctx);
  };
  const $fetch2 = function $fetch22(request, opts) {
    return $fetchRaw(request, opts).then((r) => r._data);
  };
  $fetch2.raw = $fetchRaw;
  $fetch2.create = (defaultOptions = {}) => createFetch(__spreadProps(__spreadValues({}, globalOptions), {
    defaults: __spreadValues(__spreadValues({}, globalOptions.defaults), defaultOptions)
  }));
  return $fetch2;
}
const _globalThis = function() {
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }
  if (typeof self !== "undefined") {
    return self;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  throw new Error("unable to locate global object");
}();
const fetch = _globalThis.fetch || (() => Promise.reject(new Error("[ohmyfetch] global.fetch is not supported!")));
const Headers = _globalThis.Headers;
const $fetch$1 = createFetch({ fetch, Headers });
if (!globalThis.$fetch) {
  globalThis.$fetch = $fetch$1;
}
const nitroClient_1cf1e2f0 = () => {
};
const components = {};
function components_515c5644(nuxtApp) {
  for (const name in components) {
    nuxtApp.vueApp.component(name, components[name]);
    nuxtApp.vueApp.component("Lazy" + name, components[name]);
  }
}
const _plugins = [
  preload,
  vueuseHead_02f54cda,
  plugin_4e83f8ce,
  router_1d650411,
  unocss_6f8c5398,
  ssrPlugin_65e25c60,
  markdownHotload_9c63e28e,
  nitroClient_1cf1e2f0,
  components_515c5644
];
const _sfc_main$f = {
  setup() {
    const nuxtApp = useNuxtApp();
    nuxtApp.hooks.callHookWith((hooks) => hooks.map((hook) => hook()), "vue:setup");
    return {
      onResolve: () => nuxtApp.callHook("app:suspense:resolve")
    };
  }
};
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_App = vue_cjs_prod.resolveComponent("App");
  serverRenderer.exports.ssrRenderSuspense(_push, {
    default: () => {
      _push(serverRenderer.exports.ssrRenderComponent(_component_App, null, null, _parent));
    },
    _: 1
  });
}
const _sfc_setup$f = _sfc_main$f.setup;
_sfc_main$f.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt3/dist/app/components/nuxt-root.vue");
  return _sfc_setup$f ? _sfc_setup$f(props, ctx) : void 0;
};
const RootComponent = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["ssrRender", _sfc_ssrRender$2]]);
const _sfc_main$e = {};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs) {
  const _component_NuxtLayout = vue_cjs_prod.resolveComponent("NuxtLayout");
  const _component_NuxtPage = vue_cjs_prod.resolveComponent("NuxtPage");
  _push(serverRenderer.exports.ssrRenderComponent(_component_NuxtLayout, _attrs, {
    default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(serverRenderer.exports.ssrRenderComponent(_component_NuxtPage, null, null, _parent2, _scopeId));
      } else {
        return [
          vue_cjs_prod.createVNode(_component_NuxtPage)
        ];
      }
    }),
    _: 1
  }, _parent));
}
const _sfc_setup$e = _sfc_main$e.setup;
_sfc_main$e.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt3/dist/pages/runtime/app.vue");
  return _sfc_setup$e ? _sfc_setup$e(props, ctx) : void 0;
};
const AppComponent = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["ssrRender", _sfc_ssrRender$1]]);
let entry;
const plugins = normalizePlugins(_plugins);
{
  entry = async function createNuxtAppServer(ssrContext = {}) {
    const vueApp = vue_cjs_prod.createApp(RootComponent);
    vueApp.component("App", AppComponent);
    const nuxt = createNuxtApp({ vueApp, ssrContext });
    await applyPlugins(nuxt, plugins);
    await nuxt.hooks.callHook("app:created", vueApp);
    return vueApp;
  };
}
const bootstrap = (ctx) => entry(ctx);
const bootstrap$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  "default": bootstrap
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$d = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_Body = vue_cjs_prod.resolveComponent("Body");
  _push(serverRenderer.exports.ssrRenderComponent(_component_Body, vue_cjs_prod.mergeProps({ class: "d-body-bg d-body-text-color text-root min-w-base antialiased tracking-semitight min-w-xs" }, _attrs), {
    default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<div class="layout-container relative d-scrollbar" font-montserrat text-sm overflow-x-hidden xl:text-base data-v-6efde7ab${_scopeId}>`);
        serverRenderer.exports.ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
        _push2(`</div>`);
      } else {
        return [
          vue_cjs_prod.createVNode("div", {
            class: "layout-container relative d-scrollbar",
            "font-montserrat": "",
            "text-sm": "",
            "overflow-x-hidden": "",
            "xl:text-base": ""
          }, [
            vue_cjs_prod.renderSlot(_ctx.$slots, "default", {}, void 0, true)
          ])
        ];
      }
    }),
    _: 3
  }, _parent));
}
const _sfc_setup$d = _sfc_main$d.setup;
_sfc_main$d.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/page.vue");
  return _sfc_setup$d ? _sfc_setup$d(props, ctx) : void 0;
};
const page = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-6efde7ab"]]);
const page$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  "default": page
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$c = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __ssrInlineRender: true,
  setup(__props) {
    vue_cjs_prod.ref(13);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Html = vue_cjs_prod.resolveComponent("Html");
      const _component_Head = vue_cjs_prod.resolveComponent("Head");
      const _component_Title = vue_cjs_prod.resolveComponent("Title");
      _push(`<!--[-->`);
      _push(serverRenderer.exports.ssrRenderComponent(_component_Html, null, {
        default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer.exports.ssrRenderComponent(_component_Head, null, {
              default: vue_cjs_prod.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer.exports.ssrRenderComponent(_component_Title, null, {
                    default: vue_cjs_prod.withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`index`);
                      } else {
                        return [
                          vue_cjs_prod.createTextVNode("index")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    vue_cjs_prod.createVNode(_component_Title, null, {
                      default: vue_cjs_prod.withCtx(() => [
                        vue_cjs_prod.createTextVNode("index")
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              vue_cjs_prod.createVNode(_component_Head, null, {
                default: vue_cjs_prod.withCtx(() => [
                  vue_cjs_prod.createVNode(_component_Title, null, {
                    default: vue_cjs_prod.withCtx(() => [
                      vue_cjs_prod.createTextVNode("index")
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="bg-white-50 h-100vh p-6 font-montserrat"><div relative flex flex-col items-center justify-between space-y-12 shadow rounded-md bg-gray-100 hover:bg-gray-300 p-8><div flex items-center> Hover the icon: <a inline-block text-3xl ml-3 i-twemoji-grinning-face-with-smiling-eyes hover:i-twemoji-face-with-tears-of-joy></a></div><p class="text-left"> Nuxt offers a compelling solution and a great ecosystem to help you ship fullstack Vue apps that are performant and SEO friendly. The flexibility to choose between SSR and SSG is icing on the cake. </p><div class="flex w-full justify-between items-center"><a href="https://twitter.com/youyuxi" target="_blank" rel="noopener"><img loading="lazy" src="https://nuxtjs.org/img/home/testimonials/evan.png" alt="Evan You" width="48" height="48" class="h-12 w-12"></a><a href="https://twitter.com/youyuxi" target="_blank" rel="noopener" class="flex flex-1 pl-4 text-left flex-col"><span class="font-bold text-base">Evan You</span><span class="text-sm text-cloud">Creator of Vue.js </span></a><a i-carbon-logo-github text-3xl></a></div></div><div mt-20 text-center flex select-none all:transition-400><div ma><div text-5xl fw100 animate-bounce-alt animate-count-infinite animate-1s> unocss </div><div op30 text-lg fw200 m1> The instant on-demand Atomic CSS engine. </div><button bg-blue-400 hover:bg-blue-500 text-lg text-white font-light py-2 px-4 border-2 rounded border-blue-200> Button </button><div m2 flex justify-center text-2xl op30 hover:op80><a i-carbon-logo-github text-inherit></a></div></div></div><div absolute bottom-5 right-0 left-0 text-center op30 fw300> on-demand \xB7 instant \xB7 fully customizable </div></div><!--]-->`);
    };
  }
});
const _sfc_setup$c = _sfc_main$c.setup;
_sfc_main$c.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup$c ? _sfc_setup$c(props, ctx) : void 0;
};
const index = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  "default": _sfc_main$c
}, Symbol.toStringTag, { value: "Module" }));
function useTheme() {
  const isDark = useDark();
  const toggleDark = useToggle(isDark);
  return {
    toggleDark
  };
}
const _sfc_main$b = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __ssrInlineRender: true,
  emits: ["toggle-sidebar"],
  setup(__props, { emit }) {
    useTheme();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = vue_cjs_prod.resolveComponent("NuxtLink");
      _push(`<div${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({ class: "header-box px-4 flex items-center justify-between top-0 w-full z-50 sticky bg-white/95 h-$header-height dark:bg-[#001e26]/95" }, _attrs))}><div class="flex"><span class="cursor-pointer lg:hidden mr-2 !w-6 !h-6 block text-gray-600 i-carbon-list hover:opacity-80 dark:text-[#92adad]"></span>`);
      _push(serverRenderer.exports.ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "text-base"
      }, {
        default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`\u524D\u7AEF\u535A\u6587`);
          } else {
            return [
              vue_cjs_prod.createTextVNode("\u524D\u7AEF\u535A\u6587")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="flex"><a class="cursor-pointer mx-2 !w-6 !h-6 block text-gray-600 i-carbon-logo-github hover:opacity-80 dark:text-[#92adad]" href="https://github.com/jerrywu001/jerrywu001" target="_blank"></a><span class="cursor-pointer mx-2 !w-6 !h-6 block text-gray-600 i-ph-sun-fill hover:opacity-80 dark:i-ph-moon-fill dark:text-[#92adad]"></span></div></div>`);
    };
  }
});
const _sfc_setup$b = _sfc_main$b.setup;
_sfc_main$b.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/HeaderNav.vue");
  return _sfc_setup$b ? _sfc_setup$b(props, ctx) : void 0;
};
const _sfc_main$a = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __ssrInlineRender: true,
  props: {
    children: {
      type: Array,
      default() {
        return [];
      }
    },
    isPc: {
      type: Boolean,
      default: false
    }
  },
  setup(__props) {
    const props = __props;
    const toc = vue_cjs_prod.ref(null);
    const tocs = vue_cjs_prod.computed(() => props.children || []);
    function scrollToHeading(event, { autoClose = false, archor: id }) {
      const currentArchor = window.location.hash;
      if (event) {
        event.preventDefault();
      }
      if (id !== currentArchor || !autoClose) {
        window.history.replaceState({}, "", id);
        setTimeout(() => {
          const tocs2 = !props.isPc ? toc.value : toc.value.querySelector(".tocs-btn");
          const container = getScrollContainer();
          const escapedId = id.replace(/\./g, "\\.").replace("#", "");
          const archor = document.getElementById(decodeURIComponent(escapedId));
          const offset = archor.offsetTop - tocs2.clientHeight - headHeight - 30;
          if (autoClose && !props.isPc) {
            tocs2.classList.remove("h-auto");
            tocs2.classList.add("h-10");
          }
          container.scrollTo({ top: offset });
          autoHighlightArchor();
        });
      }
    }
    function doHeadScroll(e) {
      e.preventDefault();
      if (e.target.href) {
        const archor = "#" + e.target.href.split("#").pop();
        scrollToHeading(void 0, { archor, autoClose: true });
      }
    }
    tryOnMounted(() => {
    });
    tryOnBeforeUnmount(() => {
      const headings = getHeadings();
      headings.forEach((heading) => {
        heading.removeEventListener("click", doHeadScroll, false);
      });
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({
        style: vue_cjs_prod.unref(tocs).length > 0 ? null : { display: "none" },
        ref_key: "toc",
        ref: toc,
        class: ["tocs overflow-hidden sticky bg-white/95 z-10 top-$header-height left-0 flex-none w-full text-xs lg:left-60 px-4 sm:px-6 dark:bg-[#001e26]/95", `${__props.isPc ? "h-auto" : "h-10"}`]
      }, _attrs))} data-v-c335368c><a class="${serverRenderer.exports.ssrRenderClass([[
        !__props.isPc ? "border-dashed border-b border-b-gray-900/30 " : "",
        __props.isPc ? "h-auto" : "h-10"
      ], "relative tocs-btn cursor-pointer hover:text-opacity-60 hover:no-underline z-10 flex items-center w-full text-xs font-semibold text-gray-900 focus:outline-none dark:text-gray-100 dark:border-b-white/30"])}" data-v-c335368c> IN THIS ARTICLE <a style="${serverRenderer.exports.ssrRenderStyle(!__props.isPc ? null : { display: "none" })}" class="text-sm text-black/80 mr-1 i-carbon-chevron-right dark:text-white/80" data-v-c335368c></a></a><div class="flex-col justify-between overflow-y-auto sticky pb-2" data-v-c335368c><div class="${serverRenderer.exports.ssrRenderClass([`${!__props.isPc ? "max-h-[50vh]" : "h-$tocs-height-xl"}`, "overflow-x-hidden overflow-y-auto d-scrollbar"])}" data-v-c335368c><ol class="table-of-contents" data-v-c335368c><!--[-->`);
      serverRenderer.exports.ssrRenderList(vue_cjs_prod.unref(tocs), (item) => {
        _push(`<li data-v-c335368c><a${serverRenderer.exports.ssrRenderAttr("href", item.archor)} class="${serverRenderer.exports.ssrRenderClass(item.class)}" data-v-c335368c>${serverRenderer.exports.ssrInterpolate(item.label)}</a>`);
        if (item.children && item.children.length > 0) {
          _push(`<ol class="table-of-contents font-medium" data-v-c335368c><!--[-->`);
          serverRenderer.exports.ssrRenderList(item.children, (child) => {
            _push(`<li data-v-c335368c><a${serverRenderer.exports.ssrRenderAttr("href", child.archor)} class="${serverRenderer.exports.ssrRenderClass(child.class)}" data-v-c335368c>${serverRenderer.exports.ssrInterpolate(child.label)}</a>`);
            if (child.children && child.children.length > 0) {
              _push(`<ol class="table-of-contents font-medium" data-v-c335368c><!--[-->`);
              serverRenderer.exports.ssrRenderList(child.children, (h4) => {
                _push(`<li data-v-c335368c><a${serverRenderer.exports.ssrRenderAttr("href", h4.archor)} class="${serverRenderer.exports.ssrRenderClass(h4.class)}" data-v-c335368c>${serverRenderer.exports.ssrInterpolate(h4.label)}</a></li>`);
              });
              _push(`<!--]--></ol>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</li>`);
          });
          _push(`<!--]--></ol>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</li>`);
      });
      _push(`<!--]--></ol></div></div></div>`);
    };
  }
});
const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/TableOfContents.vue");
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["__scopeId", "data-v-c335368c"]]);
const _sfc_main$9 = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __ssrInlineRender: true,
  props: {
    icon: {
      type: String,
      default: ""
    },
    type: {
      type: String,
      default: "info",
      validator(value) {
        return ["info", "success", "warning", "danger"].includes(value);
      }
    }
  },
  setup(__props) {
    const props = __props;
    const iconName = vue_cjs_prod.computed(() => props.icon !== "none" ? props.icon || {
      info: "\u{1F4A1}",
      success: "\u2705",
      warning: "\u{1F6A7}",
      danger: "\u{1F6A8}"
    }[props.type] : "");
    const isSvgIconStr = vue_cjs_prod.computed(() => iconName.value && iconName.value.includes("i-"));
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({
        class: ["p-4 mt-2 mb-2 rounded-lg alert text-sm leading-relaxed", [__props.type]]
      }, _attrs))}><div class="flex items-start">`);
      if (vue_cjs_prod.unref(iconName)) {
        _push(`<!--[-->`);
        if (vue_cjs_prod.unref(isSvgIconStr)) {
          _push(`<span class="inline-flex mr-2 w-5 h-5 justify-center items-center"><span class="${serverRenderer.exports.ssrRenderClass([vue_cjs_prod.unref(iconName), "h-6 w-6"])}"></span></span>`);
        } else {
          _push(`<span class="inline-flex mr-2 w-5 h-5 justify-center items-center text-1.2rem">${serverRenderer.exports.ssrInterpolate(vue_cjs_prod.unref(iconName))}</span>`);
        }
        _push(`<!--]-->`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex-grow alert-content"><p>`);
      serverRenderer.exports.ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</p></div></div></div>`);
    };
  }
});
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Alert.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const _sfc_main$8 = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __ssrInlineRender: true,
  props: {
    to: {
      type: String,
      required: true
    }
  },
  setup(__props) {
    const props = __props;
    const outLink = vue_cjs_prod.computed(() => props.to.includes("//"));
    const linkAttrs = vue_cjs_prod.computed(() => ({
      target: outLink.value ? "_blank" : void 0
    }));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = vue_cjs_prod.resolveComponent("NuxtLink");
      if (!vue_cjs_prod.unref(outLink)) {
        _push(serverRenderer.exports.ssrRenderComponent(_component_NuxtLink, vue_cjs_prod.mergeProps({ to: __props.to }, _attrs), {
          default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              serverRenderer.exports.ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
              serverRenderer.exports.ssrRenderSlot(_ctx.$slots, "nuxt-link", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                vue_cjs_prod.renderSlot(_ctx.$slots, "default"),
                vue_cjs_prod.renderSlot(_ctx.$slots, "nuxt-link")
              ];
            }
          }),
          _: 3
        }, _parent));
      } else {
        _push(`<a${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({ href: __props.to }, vue_cjs_prod.unref(linkAttrs), _attrs))}>`);
        serverRenderer.exports.ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
        serverRenderer.exports.ssrRenderSlot(_ctx.$slots, "href", {}, null, _push, _parent);
        _push(`</a>`);
      }
    };
  }
});
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Link.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const _sfc_main$7 = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __ssrInlineRender: true,
  props: {
    href: {
      type: String,
      default: ""
    },
    size: {
      type: String,
      default: "medium"
    },
    bold: {
      type: Boolean,
      default: false
    }
  },
  setup(__props) {
    const props = __props;
    const outLink = vue_cjs_prod.computed(() => props.href.includes("//"));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Link = _sfc_main$8;
      _push(serverRenderer.exports.ssrRenderComponent(_component_Link, vue_cjs_prod.mergeProps({
        class: ["button-link", [__props.size, __props.bold ? "font-semibold" : "font-medium"]],
        to: __props.href
      }, _attrs), {
        href: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (vue_cjs_prod.unref(outLink)) {
              _push2(`<svg class="w-4 h-4 ml-2" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor" data-v-2853d7a4${_scopeId}><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" data-v-2853d7a4${_scopeId}></path></svg>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              vue_cjs_prod.unref(outLink) ? (vue_cjs_prod.openBlock(), vue_cjs_prod.createBlock("svg", {
                key: 0,
                class: "w-4 h-4 ml-2",
                fill: "none",
                "stroke-linecap": "round",
                "stroke-linejoin": "round",
                "stroke-width": "2",
                viewBox: "0 0 24 24",
                stroke: "currentColor"
              }, [
                vue_cjs_prod.createVNode("path", { d: "M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" })
              ])) : vue_cjs_prod.createCommentVNode("", true)
            ];
          }
        }),
        default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            serverRenderer.exports.ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              vue_cjs_prod.renderSlot(_ctx.$slots, "default", {}, void 0, true)
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ButtonLink.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const ButtonLink = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["__scopeId", "data-v-2853d7a4"]]);
const _sfc_main$6 = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __ssrInlineRender: true,
  setup(__props) {
    vue_cjs_prod.ref(null);
    const codeRef = vue_cjs_prod.ref(null);
    const slots = vue_cjs_prod.useSlots();
    const activeTabIndex = vue_cjs_prod.ref(0);
    const slotBoxs = vue_cjs_prod.computed(() => slots.default().filter((v) => v.type === "div"));
    const tabs = getTabs();
    function getTabs() {
      const list = [];
      for (const box of slotBoxs.value) {
        const children = box.children || [];
        const dom = children.find((v) => v.props && v.props.class && v.props.class.includes("filename"));
        if (dom && dom.children && dom.children[0]) {
          list.push(dom.children[0]);
        }
      }
      return list;
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({
        ref_key: "codeRef",
        ref: codeRef,
        class: "code-group"
      }, _attrs))}><div class="relative text-white rounded-t-lg d-code-group-header-bg"><div class="relative z-0 px-2"><!--[-->`);
      serverRenderer.exports.ssrRenderList(vue_cjs_prod.unref(tabs), (label, i) => {
        _push(`<button class="${serverRenderer.exports.ssrRenderClass([[
          activeTabIndex.value === i ? "active text-gray-800 dark:text-white" : "d-prose-code-filename-text"
        ], "relative px-3 py-1.5 xs:py-3 my-1.5 xs:my-0 text-sm font-medium tracking-tight focus:outline-none"])}">${serverRenderer.exports.ssrInterpolate(label)}</button>`);
      });
      _push(`<!--]--></div></div><p>`);
      serverRenderer.exports.ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</p></div>`);
    };
  }
});
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/CodeGroup.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const _sfc_main$5 = {
  name: "Markdown",
  functional: true,
  props: {
    use: {
      type: [String, Object, Function, Array],
      default: "default"
    }
  },
  render: (ctx) => {
    const slot = ctx.use || "default";
    let node = null;
    if (Array.isArray(slot)) {
      node = slot;
    }
    if (typeof slot === "function") {
      node = slot();
    }
    if (typeof slot === "string") {
      return [slot];
    }
    return node;
  }
};
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Markdown.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const TAGS_MAP = {
  h1: ["h1", "prose-h1"],
  h2: ["h2", "prose-h2"],
  h3: ["h3", "prose-h3"],
  h4: ["h4", "prose-h4"],
  h5: ["h5", "prose-h5"],
  h6: ["h6", "prose-h6"],
  hr: ["hr", "prose-hr"],
  p: ["p", "prose-paragraph"],
  ul: ["ul", "prose-ul"],
  ol: ["ol", "prose-ol"],
  blockquote: ["blockquote", "prose-blockquote"],
  img: ["img", "prose-img"],
  a: ["a", "prose-a"],
  code: ["code", "prose-code-inline"]
};
const expandTags = (_tags) => _tags.flatMap((t) => TAGS_MAP[t]);
const TEXT_TAGS = expandTags([
  "p",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "li"
]);
function isTag(vnode, tag) {
  var _a2, _b2;
  return (vnode == null ? void 0 : vnode.tag) === tag || ((_a2 = vnode == null ? void 0 : vnode.componentOptions) == null ? void 0 : _a2.tag) === tag || ((_b2 = vnode == null ? void 0 : vnode.asyncMeta) == null ? void 0 : _b2.tag) === tag;
}
function nodeChildren(node) {
  var _a2, _b2;
  return node.children || ((_a2 = node == null ? void 0 : node.componentOptions) == null ? void 0 : _a2.children) || ((_b2 = node == null ? void 0 : node.asyncMeta) == null ? void 0 : _b2.children);
}
function nodeTextContent(node) {
  if (!node)
    return "";
  if (Array.isArray(node)) {
    return node.map(nodeTextContent).join("");
  }
  if (node.type === "text") {
    return node.value;
  }
  if (node.text) {
    return node.text;
  }
  const children = nodeChildren(node);
  if (Array.isArray(children)) {
    return children.map(nodeTextContent).join("");
  }
  return "";
}
function unwrap(vnode, tags = ["p"]) {
  if (Array.isArray(vnode)) {
    return vnode.flatMap((node) => unwrap(node, tags));
  }
  tags = expandTags(tags);
  let result = vnode;
  if (tags.some((tag) => isTag(vnode, tag))) {
    result = nodeChildren(vnode) || vnode;
    if (TEXT_TAGS.some((tag) => isTag(vnode, tag))) {
      result = [result];
    }
  }
  return result;
}
function flatUnwrap(vnodes, tags = ["p"]) {
  const result = [];
  const list = (Array.isArray(vnodes) ? vnodes : [vnodes]).flatMap((vnode) => unwrap(vnode, tags)).flatMap((vnode) => unwrap(vnode, tags)).filter((vnode) => !vnode.text || !!vnode.text.trim());
  list.forEach((v) => {
    if (typeof v !== "string" || typeof v === "string" && !!v.trim()) {
      result.push(v);
    }
  });
  return result.filter(Boolean);
}
const _sfc_main$4 = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __ssrInlineRender: true,
  props: {
    items: {
      type: Array,
      default: () => []
    },
    icon: {
      type: String,
      default: ""
    },
    type: {
      type: String,
      default: "primary",
      validator(value) {
        return ["primary", "info", "success", "warning", "danger"].includes(value);
      }
    }
  },
  setup(__props) {
    const props = __props;
    const textContent = vue_cjs_prod.ref("");
    const slots = vue_cjs_prod.useSlots();
    const iconName = vue_cjs_prod.computed(() => props.icon !== "none" ? props.icon || {
      primary: "i-carbon-align-box-middle-center",
      info: "i-carbon-information",
      success: "i-carbon-checkmark-outline",
      warning: "i-carbon-tropical-warning",
      danger: "i-carbon-warning-alt"
    }[props.type] : "");
    const isSvgIconStr = vue_cjs_prod.computed(() => iconName.value && iconName.value.includes("i-"));
    const listItems = vue_cjs_prod.computed(() => {
      return flatUnwrap(slots.default(), ["p", "ul", "li"]);
    });
    vue_cjs_prod.onUpdated(() => {
      textContent.value = nodeTextContent(slots.default);
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Markdown = _sfc_main$5;
      _push(`<div${serverRenderer.exports.ssrRenderAttrs(_attrs)}><!--[-->`);
      serverRenderer.exports.ssrRenderList(vue_cjs_prod.unref(listItems), (item, i) => {
        _push(`<div class="mt-3 flex items-center">`);
        if (vue_cjs_prod.unref(iconName)) {
          _push(`<!--[-->`);
          if (vue_cjs_prod.unref(isSvgIconStr)) {
            _push(`<span class="${serverRenderer.exports.ssrRenderClass([`list-${__props.type}`, "mt-px mr-2 flex items-center"])}"><span class="${serverRenderer.exports.ssrRenderClass([vue_cjs_prod.unref(iconName), "h-6 w-6"])}"></span></span>`);
          } else {
            _push(`<span class="${serverRenderer.exports.ssrRenderClass([`list-${__props.type}`, "mt-px mr-2"])}"><span class="h-10 w-10">${serverRenderer.exports.ssrInterpolate(vue_cjs_prod.unref(iconName))}</span></span>`);
          }
          _push(`<!--]-->`);
        } else {
          _push(`<!---->`);
        }
        _push(`<span>`);
        _push(serverRenderer.exports.ssrRenderComponent(_component_Markdown, { use: item }, null, _parent));
        _push(`</span></div>`);
      });
      _push(`<!--]--></div>`);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/List.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const _sfc_main$3 = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __ssrInlineRender: true,
  props: {
    id: {
      type: String,
      default: ""
    }
  },
  setup(__props) {
    const props = __props;
    vue_cjs_prod.useSlots();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({ "mt-2": "" }, _attrs))}><iframe${serverRenderer.exports.ssrRenderAttr("src", `https://www.youtube.com/embed/${props.id}`)} width="560" height="377" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen class="w-full">
      {{ slots.default() }}
    </iframe></div>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/youtube.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __ssrInlineRender: true,
  props: {
    href: {
      type: String,
      default: ""
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({ "mt-2": "" }, _attrs))}><iframe${serverRenderer.exports.ssrRenderAttr("src", __props.href)} sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin" class="w-full h-full min-h-[500px] overflow-hidden"></iframe></div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/embed.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __ssrInlineRender: true,
  props: {
    title: {
      type: String,
      default: ""
    }
  },
  setup(__props) {
    const props = __props;
    const visible = vue_cjs_prod.ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({ class: "panel" }, _attrs))} data-v-2e490c24><div data-v-2e490c24><div class="toggle-link flex items-center justify-start cursor-pointer"${serverRenderer.exports.ssrRenderAttr("title", visible.value ? "\u6536\u8D77" : "\u5C55\u5F00")} data-v-2e490c24><a class="${serverRenderer.exports.ssrRenderClass([[
        visible.value ? "i-carbon-chevron-down" : "i-carbon-chevron-right"
      ], "text-sm text-black/80 mr-1"])}" data-v-2e490c24></a><span data-v-2e490c24>${serverRenderer.exports.ssrInterpolate(props.title)}</span></div></div><div class="${serverRenderer.exports.ssrRenderClass([[visible.value ? "visible" : "hidden"], "panel-content"])}" data-v-2e490c24><div data-v-2e490c24><p class="!m-0 leading-none" data-v-2e490c24>`);
      serverRenderer.exports.ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</p></div></div></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/panel.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const panel = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-2e490c24"]]);
const __nuxt_component_2 = {
  props: {
    children: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  setup(props, ctx) {
    return () => {
      const children = props.children;
      const childList = children.map((node) => processNode(node));
      return vue_cjs_prod.h("div", {
        class: "article-scroll-box px-4 sm:px-6 mt-2 xl:mt-0"
      }, childList);
    };
  }
};
const rootKeys = ["class-name", "class", "className", "style"];
const rxOn = /^@|^v-on:/;
const rxBind = /^:|^v-bind:/;
const rxModel = /^v-model/;
const nativeInputs = ["select", "textarea", "input"];
function evalInContext(code, context) {
  return new Function("with(this) { return (" + code + ") }").call(context);
}
function propsToData(node, doc = {}) {
  const { tag, props } = node;
  return Object.keys(props).reduce(function(data, key) {
    const k = key.replace(/.*:/, "");
    let obj = rootKeys.includes(k) ? data : data.attrs;
    const value = props[key];
    const { attribute } = find(html, key);
    const native = nativeInputs.includes(tag);
    if (rxModel.test(key) && value in doc && !native) {
      const mods = key.replace(rxModel, "").split(".").filter((d) => d).reduce((d, k2) => (d[k2] = true, d), {});
      const field = "value";
      const event = mods.lazy ? "change" : "input";
      const processor = mods.number ? (d) => +d : mods.trim ? (d) => d.trim() : (d) => d;
      obj[field] = evalInContext(value, doc);
      data.on = data.on || {};
      data.on[event] = (e) => doc[value] = processor(e);
    } else if (key === "v-bind") {
      const val = value in doc ? doc[value] : evalInContext(value, doc);
      obj = Object.assign(obj, val);
    } else if (rxOn.test(key)) {
      key = key.replace(rxOn, "");
      data.on = data.on || {};
      data.on[key] = evalInContext(value, doc);
    } else if (rxBind.test(key)) {
      key = key.replace(rxBind, "");
      obj[key] = value in doc ? doc[value] : evalInContext(value, doc);
    } else if (Array.isArray(value)) {
      obj[attribute] = value.join(" ");
    } else {
      obj[attribute] = value;
    }
    return data;
  }, { attrs: {} });
}
function slotsToData(node) {
  const data = {};
  const children = node.children || [];
  children.forEach((child) => {
    if (!isTemplate(child) || isDefaultTemplate(child)) {
      return;
    }
    const template = child;
    const name = getSlotName(template);
    const vDomTree = template.content.map((tmplNode) => processNode(tmplNode));
    data[name] = function() {
      return vDomTree;
    };
  });
  return data;
}
function processNode(node = {}) {
  if (node.type === "text") {
    return node.value;
  }
  resolveTag(node);
  const slots = slotsToData(node);
  const propData = propsToData(node);
  const data = Object.assign({}, propData);
  const hasSlots = Object.keys(slots).length > 0;
  const children = [];
  for (const child of node.children) {
    if (isTemplate(child) && !isDefaultTemplate(child)) {
      continue;
    }
    const processQueue = isDefaultTemplate(child) ? child.content : [child];
    children.push(...processQueue.map((node2) => processNode(node2)));
  }
  const attrs = __spreadValues({}, data.attrs);
  delete data.attrs;
  const props = __spreadValues(__spreadValues({}, data), attrs);
  const childList = hasSlots ? __spreadValues({}, slots) : children.length > 0 ? children : null;
  return vue_cjs_prod.h(node.tag, props, childList);
}
const DEFAULT_SLOT = "default";
function isDefaultTemplate(node) {
  return isTemplate(node) && getSlotName(node) === DEFAULT_SLOT;
}
function isTemplate(node) {
  return node.tag === "template";
}
function getSlotName(node) {
  let name = "";
  for (const propName of Object.keys(node.props)) {
    if (!propName.startsWith("#") && !propName.startsWith("v-slot:")) {
      continue;
    }
    name = propName.split(/[:#]/, 2)[1];
    break;
  }
  return name || DEFAULT_SLOT;
}
function resolveTag(node) {
  if (typeof node.tag === "string") {
    const tag = node.tag.replace(/-/g, "").toLowerCase();
    switch (tag) {
      case "panel":
        node.tag = vue_cjs_prod.markRaw(panel);
        break;
      case "alert":
        node.tag = vue_cjs_prod.markRaw(_sfc_main$9);
        break;
      case "list":
        node.tag = vue_cjs_prod.markRaw(_sfc_main$4);
        break;
      case "youtube":
        node.tag = vue_cjs_prod.markRaw(_sfc_main$3);
        break;
      case "embed":
        node.tag = vue_cjs_prod.markRaw(_sfc_main$2);
        break;
      case "buttonlink":
        node.tag = vue_cjs_prod.markRaw(ButtonLink);
        break;
      case "codegroup":
        node.tag = vue_cjs_prod.markRaw(_sfc_main$6);
        break;
    }
  }
}
const _sfc_main = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const showSidebar = vue_cjs_prod.ref(false);
    const route = useRoute();
    const category = route.params.category;
    const postname = route.params.postname;
    const { data } = ([__temp, __restore] = vue_cjs_prod.withAsyncContext(() => useFetch(`/api/post?category=${category}&postname=${postname}`)), __temp = await __temp, __restore(), __temp);
    const title = vue_cjs_prod.computed(() => {
      var _a2;
      return ((_a2 = data.value.meta) == null ? void 0 : _a2.title) || "blog";
    });
    if (data.value.code === 404) {
      window.location.href = "/404";
    }
    useArticleScroll();
    return (_ctx, _push, _parent, _attrs) => {
      var _a2, _b2, _c;
      const _component_Html = vue_cjs_prod.resolveComponent("Html");
      const _component_Head = vue_cjs_prod.resolveComponent("Head");
      const _component_Title = vue_cjs_prod.resolveComponent("Title");
      const _component_header_nav = _sfc_main$b;
      const _component_table_of_contents = __nuxt_component_1;
      const _component_article_content = __nuxt_component_2;
      _push(`<!--[-->`);
      _push(serverRenderer.exports.ssrRenderComponent(_component_Html, null, {
        default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer.exports.ssrRenderComponent(_component_Head, null, {
              default: vue_cjs_prod.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer.exports.ssrRenderComponent(_component_Title, null, {
                    default: vue_cjs_prod.withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`${serverRenderer.exports.ssrInterpolate(vue_cjs_prod.unref(title))}`);
                      } else {
                        return [
                          vue_cjs_prod.createTextVNode(vue_cjs_prod.toDisplayString(vue_cjs_prod.unref(title)), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    vue_cjs_prod.createVNode(_component_Title, null, {
                      default: vue_cjs_prod.withCtx(() => [
                        vue_cjs_prod.createTextVNode(vue_cjs_prod.toDisplayString(vue_cjs_prod.unref(title)), 1)
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              vue_cjs_prod.createVNode(_component_Head, null, {
                default: vue_cjs_prod.withCtx(() => [
                  vue_cjs_prod.createVNode(_component_Title, null, {
                    default: vue_cjs_prod.withCtx(() => [
                      vue_cjs_prod.createTextVNode(vue_cjs_prod.toDisplayString(vue_cjs_prod.unref(title)), 1)
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer.exports.ssrRenderComponent(_component_header_nav, null, null, _parent));
      _push(serverRenderer.exports.ssrRenderComponent(_sfc_main$h, { visible: showSidebar.value }, null, _parent));
      _push(`<article class="article">`);
      _push(serverRenderer.exports.ssrRenderComponent(_component_table_of_contents, {
        class: "tocs-sm xl:hidden lg:ml-$sidebar-width lg:w-$tocs-width-lg",
        children: (_a2 = vue_cjs_prod.unref(data)) == null ? void 0 : _a2.tocs
      }, null, _parent));
      _push(`<div class="lg:ml-$sidebar-width">`);
      _push(serverRenderer.exports.ssrRenderComponent(_component_article_content, {
        class: "xl:mr-$tocs-width",
        children: (_b2 = vue_cjs_prod.unref(data)) == null ? void 0 : _b2.children
      }, null, _parent));
      _push(serverRenderer.exports.ssrRenderComponent(_component_table_of_contents, {
        class: "xl:h-$tocs-height-xl xl:w-$tocs-width xl:fixed xl:left-$tocs-ml-xl xl:top-$header-height <xl:hidden",
        children: (_c = vue_cjs_prod.unref(data)) == null ? void 0 : _c.tocs,
        "is-pc": true
      }, null, _parent));
      _push(`</div><div id="back-2-top" class="fixed z-50 bottom-2 right-2 w-10 h-10 bg-black-500/50 rounded-full items-center justify-center hidden dark:bg-white/90"><span class="i-carbon-back-to-top block !w-4 h-4 bg-white dark:bg-black/90"></span></div></article><!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/posts/[category]/[postname].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _postname_ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  "default": _sfc_main
}, Symbol.toStringTag, { value: "Module" }));

export { entry$1 as default };

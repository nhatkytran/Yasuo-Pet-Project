// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (modules, entry, mainEntry, parcelRequireName, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      var res = localRequire.resolve(x);
      return res === false ? {} : newRequire(res);
    }

    function resolve(x) {
      var id = modules[name][1][x];
      return id != null ? id : x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  Object.defineProperty(newRequire, 'root', {
    get: function () {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"3LtEY":[function(require,module,exports) {
"use strict";
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SECURE = false;
var HMR_ENV_HASH = "d6ea1d42532a7575";
module.bundle.HMR_BUNDLE_ID = "8f78820c94085ce0";
function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}
function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}
function _createForOfIteratorHelper(o, allowArrayLike) {
    var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
    if (!it) {
        if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
            if (it) o = it;
            var i = 0;
            var F = function F() {};
            return {
                s: F,
                n: function n() {
                    if (i >= o.length) return {
                        done: true
                    };
                    return {
                        done: false,
                        value: o[i++]
                    };
                },
                e: function e(_e) {
                    throw _e;
                },
                f: F
            };
        }
        throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    var normalCompletion = true, didErr = false, err;
    return {
        s: function s() {
            it = it.call(o);
        },
        n: function n() {
            var step = it.next();
            normalCompletion = step.done;
            return step;
        },
        e: function e(_e2) {
            didErr = true;
            err = _e2;
        },
        f: function f() {
            try {
                if (!normalCompletion && it.return != null) it.return();
            } finally{
                if (didErr) throw err;
            }
        }
    };
}
function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
/* global HMR_HOST, HMR_PORT, HMR_ENV_HASH, HMR_SECURE */ /*::
import type {
  HMRAsset,
  HMRMessage,
} from '@parcel/reporter-dev-server/src/HMRServer.js';
interface ParcelRequire {
  (string): mixed;
  cache: {|[string]: ParcelModule|};
  hotData: mixed;
  Module: any;
  parent: ?ParcelRequire;
  isParcelRequire: true;
  modules: {|[string]: [Function, {|[string]: string|}]|};
  HMR_BUNDLE_ID: string;
  root: ParcelRequire;
}
interface ParcelModule {
  hot: {|
    data: mixed,
    accept(cb: (Function) => void): void,
    dispose(cb: (mixed) => void): void,
    // accept(deps: Array<string> | string, cb: (Function) => void): void,
    // decline(): void,
    _acceptCallbacks: Array<(Function) => void>,
    _disposeCallbacks: Array<(mixed) => void>,
  |};
}
declare var module: {bundle: ParcelRequire, ...};
declare var HMR_HOST: string;
declare var HMR_PORT: string;
declare var HMR_ENV_HASH: string;
declare var HMR_SECURE: boolean;
*/ var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
    OldModule.call(this, moduleName);
    this.hot = {
        data: module.bundle.hotData,
        _acceptCallbacks: [],
        _disposeCallbacks: [],
        accept: function accept(fn) {
            this._acceptCallbacks.push(fn || function() {});
        },
        dispose: function dispose(fn) {
            this._disposeCallbacks.push(fn);
        }
    };
    module.bundle.hotData = undefined;
}
module.bundle.Module = Module;
var checkedAssets, acceptedAssets, assetsToAccept /*: Array<[ParcelRequire, string]> */ ;
function getHostname() {
    return HMR_HOST || (location.protocol.indexOf('http') === 0 ? location.hostname : 'localhost');
}
function getPort() {
    return HMR_PORT || location.port;
} // eslint-disable-next-line no-redeclare
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
    var hostname = getHostname();
    var port = getPort();
    var protocol = HMR_SECURE || location.protocol == 'https:' && !/localhost|127.0.0.1|0.0.0.0/.test(hostname) ? 'wss' : 'ws';
    var ws = new WebSocket(protocol + '://' + hostname + (port ? ':' + port : '') + '/'); // $FlowFixMe
    ws.onmessage = function(event) {
        checkedAssets = {} /*: {|[string]: boolean|} */ ;
        acceptedAssets = {} /*: {|[string]: boolean|} */ ;
        assetsToAccept = [];
        var data = JSON.parse(event.data);
        if (data.type === 'update') {
            // Remove error overlay if there is one
            if (typeof document !== 'undefined') removeErrorOverlay();
            var assets = data.assets.filter(function(asset) {
                return asset.envHash === HMR_ENV_HASH;
            }); // Handle HMR Update
            var handled = assets.every(function(asset) {
                return asset.type === 'css' || asset.type === 'js' && hmrAcceptCheck(module.bundle.root, asset.id, asset.depsByBundle);
            });
            if (handled) {
                console.clear();
                assets.forEach(function(asset) {
                    hmrApply(module.bundle.root, asset);
                });
                for(var i = 0; i < assetsToAccept.length; i++){
                    var id = assetsToAccept[i][1];
                    if (!acceptedAssets[id]) hmrAcceptRun(assetsToAccept[i][0], id);
                }
            } else window.location.reload();
        }
        if (data.type === 'error') {
            // Log parcel errors to console
            var _iterator = _createForOfIteratorHelper(data.diagnostics.ansi), _step;
            try {
                for(_iterator.s(); !(_step = _iterator.n()).done;){
                    var ansiDiagnostic = _step.value;
                    var stack = ansiDiagnostic.codeframe ? ansiDiagnostic.codeframe : ansiDiagnostic.stack;
                    console.error('🚨 [parcel]: ' + ansiDiagnostic.message + '\n' + stack + '\n\n' + ansiDiagnostic.hints.join('\n'));
                }
            } catch (err) {
                _iterator.e(err);
            } finally{
                _iterator.f();
            }
            if (typeof document !== 'undefined') {
                // Render the fancy html overlay
                removeErrorOverlay();
                var overlay = createErrorOverlay(data.diagnostics.html); // $FlowFixMe
                document.body.appendChild(overlay);
            }
        }
    };
    ws.onerror = function(e) {
        console.error(e.message);
    };
    ws.onclose = function() {
        console.warn('[parcel] 🚨 Connection to the HMR server was lost');
    };
}
function removeErrorOverlay() {
    var overlay = document.getElementById(OVERLAY_ID);
    if (overlay) {
        overlay.remove();
        console.log('[parcel] ✨ Error resolved');
    }
}
function createErrorOverlay(diagnostics) {
    var overlay = document.createElement('div');
    overlay.id = OVERLAY_ID;
    var errorHTML = '<div style="background: black; opacity: 0.85; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; font-family: Menlo, Consolas, monospace; z-index: 9999;">';
    var _iterator2 = _createForOfIteratorHelper(diagnostics), _step2;
    try {
        for(_iterator2.s(); !(_step2 = _iterator2.n()).done;){
            var diagnostic = _step2.value;
            var stack = diagnostic.codeframe ? diagnostic.codeframe : diagnostic.stack;
            errorHTML += "\n      <div>\n        <div style=\"font-size: 18px; font-weight: bold; margin-top: 20px;\">\n          \uD83D\uDEA8 ".concat(diagnostic.message, "\n        </div>\n        <pre>").concat(stack, "</pre>\n        <div>\n          ").concat(diagnostic.hints.map(function(hint) {
                return '<div>💡 ' + hint + '</div>';
            }).join(''), "\n        </div>\n        ").concat(diagnostic.documentation ? "<div>\uD83D\uDCDD <a style=\"color: violet\" href=\"".concat(diagnostic.documentation, "\" target=\"_blank\">Learn more</a></div>") : '', "\n      </div>\n    ");
        }
    } catch (err) {
        _iterator2.e(err);
    } finally{
        _iterator2.f();
    }
    errorHTML += '</div>';
    overlay.innerHTML = errorHTML;
    return overlay;
}
function getParents(bundle, id) /*: Array<[ParcelRequire, string]> */ {
    var modules = bundle.modules;
    if (!modules) return [];
    var parents = [];
    var k, d, dep;
    for(k in modules)for(d in modules[k][1]){
        dep = modules[k][1][d];
        if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) parents.push([
            bundle,
            k
        ]);
    }
    if (bundle.parent) parents = parents.concat(getParents(bundle.parent, id));
    return parents;
}
function updateLink(link) {
    var newLink = link.cloneNode();
    newLink.onload = function() {
        if (link.parentNode !== null) // $FlowFixMe
        link.parentNode.removeChild(link);
    };
    newLink.setAttribute('href', link.getAttribute('href').split('?')[0] + '?' + Date.now()); // $FlowFixMe
    link.parentNode.insertBefore(newLink, link.nextSibling);
}
var cssTimeout = null;
function reloadCSS() {
    if (cssTimeout) return;
    cssTimeout = setTimeout(function() {
        var links = document.querySelectorAll('link[rel="stylesheet"]');
        for(var i = 0; i < links.length; i++){
            // $FlowFixMe[incompatible-type]
            var href = links[i].getAttribute('href');
            var hostname = getHostname();
            var servedFromHMRServer = hostname === 'localhost' ? new RegExp('^(https?:\\/\\/(0.0.0.0|127.0.0.1)|localhost):' + getPort()).test(href) : href.indexOf(hostname + ':' + getPort());
            var absolute = /^https?:\/\//i.test(href) && href.indexOf(window.location.origin) !== 0 && !servedFromHMRServer;
            if (!absolute) updateLink(links[i]);
        }
        cssTimeout = null;
    }, 50);
}
function hmrApply(bundle, asset) {
    var modules = bundle.modules;
    if (!modules) return;
    if (asset.type === 'css') reloadCSS();
    else if (asset.type === 'js') {
        var deps = asset.depsByBundle[bundle.HMR_BUNDLE_ID];
        if (deps) {
            if (modules[asset.id]) {
                // Remove dependencies that are removed and will become orphaned.
                // This is necessary so that if the asset is added back again, the cache is gone, and we prevent a full page reload.
                var oldDeps = modules[asset.id][1];
                for(var dep in oldDeps)if (!deps[dep] || deps[dep] !== oldDeps[dep]) {
                    var id = oldDeps[dep];
                    var parents = getParents(module.bundle.root, id);
                    if (parents.length === 1) hmrDelete(module.bundle.root, id);
                }
            }
            var fn = new Function('require', 'module', 'exports', asset.output);
            modules[asset.id] = [
                fn,
                deps
            ];
        } else if (bundle.parent) hmrApply(bundle.parent, asset);
    }
}
function hmrDelete(bundle, id1) {
    var modules = bundle.modules;
    if (!modules) return;
    if (modules[id1]) {
        // Collect dependencies that will become orphaned when this module is deleted.
        var deps = modules[id1][1];
        var orphans = [];
        for(var dep in deps){
            var parents = getParents(module.bundle.root, deps[dep]);
            if (parents.length === 1) orphans.push(deps[dep]);
        } // Delete the module. This must be done before deleting dependencies in case of circular dependencies.
        delete modules[id1];
        delete bundle.cache[id1]; // Now delete the orphans.
        orphans.forEach(function(id) {
            hmrDelete(module.bundle.root, id);
        });
    } else if (bundle.parent) hmrDelete(bundle.parent, id1);
}
function hmrAcceptCheck(bundle, id, depsByBundle) {
    if (hmrAcceptCheckOne(bundle, id, depsByBundle)) return true;
     // Traverse parents breadth first. All possible ancestries must accept the HMR update, or we'll reload.
    var parents = getParents(module.bundle.root, id);
    var accepted = false;
    while(parents.length > 0){
        var v = parents.shift();
        var a = hmrAcceptCheckOne(v[0], v[1], null);
        if (a) // If this parent accepts, stop traversing upward, but still consider siblings.
        accepted = true;
        else {
            // Otherwise, queue the parents in the next level upward.
            var p = getParents(module.bundle.root, v[1]);
            if (p.length === 0) {
                // If there are no parents, then we've reached an entry without accepting. Reload.
                accepted = false;
                break;
            }
            parents.push.apply(parents, _toConsumableArray(p));
        }
    }
    return accepted;
}
function hmrAcceptCheckOne(bundle, id, depsByBundle) {
    var modules = bundle.modules;
    if (!modules) return;
    if (depsByBundle && !depsByBundle[bundle.HMR_BUNDLE_ID]) {
        // If we reached the root bundle without finding where the asset should go,
        // there's nothing to do. Mark as "accepted" so we don't reload the page.
        if (!bundle.parent) return true;
        return hmrAcceptCheck(bundle.parent, id, depsByBundle);
    }
    if (checkedAssets[id]) return true;
    checkedAssets[id] = true;
    var cached = bundle.cache[id];
    assetsToAccept.push([
        bundle,
        id
    ]);
    if (!cached || cached.hot && cached.hot._acceptCallbacks.length) return true;
}
function hmrAcceptRun(bundle, id) {
    var cached = bundle.cache[id];
    bundle.hotData = {};
    if (cached && cached.hot) cached.hot.data = bundle.hotData;
    if (cached && cached.hot && cached.hot._disposeCallbacks.length) cached.hot._disposeCallbacks.forEach(function(cb) {
        cb(bundle.hotData);
    });
    delete bundle.cache[id];
    bundle(id);
    cached = bundle.cache[id];
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) cached.hot._acceptCallbacks.forEach(function(cb) {
        var assetsToAlsoAccept = cb(function() {
            return getParents(module.bundle.root, id);
        });
        if (assetsToAlsoAccept && assetsToAccept.length) // $FlowFixMe[method-unbinding]
        assetsToAccept.push.apply(assetsToAccept, assetsToAlsoAccept);
    });
    acceptedAssets[id] = true;
}

},{}],"hfCYj":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
var _modelJs = require("./model.js");
var _subWebViewJs = require("./views/subWebView.js");
var _subWebViewJsDefault = parcelHelpers.interopDefault(_subWebViewJs);
var _mainHeaderViewJs = require("./views/mainHeaderView.js");
var _mainHeaderViewJsDefault = parcelHelpers.interopDefault(_mainHeaderViewJs);
var _allGamesViewJs = require("./views/allGamesView.js");
var _allGamesViewJsDefault = parcelHelpers.interopDefault(_allGamesViewJs);
var _exploreGamesViewJs = require("./views/exploreGamesView.js");
var _exploreGamesViewJsDefault = parcelHelpers.interopDefault(_exploreGamesViewJs);
var _universeViewJs = require("./views/universeView.js");
var _universeViewJsDefault = parcelHelpers.interopDefault(_universeViewJs);
var _universeMobileViewJs = require("./views/universeMobileView.js");
var _universeMobileViewJsDefault = parcelHelpers.interopDefault(_universeMobileViewJs);
var _languagesViewJs = require("./views/languagesView.js");
var _languagesViewJsDefault = parcelHelpers.interopDefault(_languagesViewJs);
var _abilitiesViewJs = require("./views/abilitiesView.js");
var _abilitiesViewJsDefault = parcelHelpers.interopDefault(_abilitiesViewJs);
var _skinsViewLeftJs = require("./views/skinsView/skinsViewLeft.js");
var _skinsViewLeftJsDefault = parcelHelpers.interopDefault(_skinsViewLeftJs);
var _skinsViewRightJs = require("./views/skinsView/skinsViewRight.js");
var _skinsViewRightJsDefault = parcelHelpers.interopDefault(_skinsViewRightJs);
var _scrollViewJs = require("./views/scrollView.js");
var _scrollViewJsDefault = parcelHelpers.interopDefault(_scrollViewJs);
var _autoScrollViewJs = require("./views/autoScrollView.js");
var _autoScrollViewJsDefault = parcelHelpers.interopDefault(_autoScrollViewJs);
var _mainToastViewJs = require("./views/Toast/mainToastView.js");
var _mainToastViewJsDefault = parcelHelpers.interopDefault(_mainToastViewJs);
// Sub website
const controlVideo = function(...videos) {
    videos.forEach((video)=>video.play()
    );
};
const controlStar = function() {
    _subWebViewJsDefault.default.addBackgroundStar();
};
// Main header
const controlMainHeader = function(isSticky) {
    _mainHeaderViewJsDefault.default.handleSticky(isSticky ? 'add' : 'remove');
};
// All games
const controlAllGames = function(action) {
    action === 'open' && _allGamesViewJsDefault.default.handleOpen();
    action === 'close' && _allGamesViewJsDefault.default.handleClose();
};
const controlAllGamesFunction = function([hovered, event]) {
    _allGamesViewJsDefault.default.handleHover(hovered, event, _modelJs.state.allGamesHover);
};
const controlAllGamesFunctionMobile = function(item) {
    _allGamesViewJsDefault.default.handleFunctionMobile(item);
};
// Explore games
const controlExploreGames = function(action) {
    action === 'open' && _exploreGamesViewJsDefault.default.handleOpen();
    action === 'close' && _exploreGamesViewJsDefault.default.handleClose();
};
// Universe
const controlUniverse = function() {
    _universeViewJsDefault.default.toggleUniverse();
};
const controlUniverseSurprise = function() {
    _universeViewJsDefault.default.closeUniverseSurprise();
};
// Universe mobile
const controlMobileMenu = function(action) {
    action === 'open' && _universeMobileViewJsDefault.default.openMenu();
    action === 'close' && _universeMobileViewJsDefault.default.closeMenu();
};
const controlMobileUniverse = function() {
    _universeMobileViewJsDefault.default.handleUniverse();
};
// Languages
const controlLanguages = function(id) {
    _languagesViewJsDefault.default.handleLanguages(id, _modelJs.state.storyLanguages[id]);
};
const controlSeeMore = function() {
    _languagesViewJsDefault.default.handleSeeMore();
};
// Abilities
const controlAbilities = function(skill) {
    _abilitiesViewJsDefault.default.handleSkill(skill, _modelJs.state.skillsDetail);
};
// Skins
const controlSlides = function(action) {
    action === 'right' && _skinsViewRightJsDefault.default.handleGoRight(_modelJs.state.nameSkins);
    action === 'left' && _skinsViewLeftJsDefault.default.handleGoLeft(_modelJs.state.nameSkins);
};
// Scroll
const handleInformationScroll = function(state) {
    _scrollViewJsDefault.default.handleInformationScroll(state ? 'add' : 'remove');
};
const handleAbilitiesScroll = function(state) {
    _scrollViewJsDefault.default.handleAbilitiesScroll(state ? 'add' : 'remove');
};
const handleSkinsScroll = function(state) {
    if (state) _scrollViewJsDefault.default.handleSkinsScroll();
};
// Auto scroll
const controlAutoScroll = function(id) {
    _autoScrollViewJsDefault.default.handleAutoScroll(id);
};
// Scroll to top
const controlScrollToTop = function() {
    _autoScrollViewJsDefault.default.handleScrollToTop();
};
// Toast
const controlToast = function(type) {
    _mainToastViewJsDefault.default.handleToast(_modelJs.state.toasts, type);
};
const controlClearToast = function(target) {
    _mainToastViewJsDefault.default.handleClearToast(target);
};
const controlObserveToasts = function(type) {
    _mainToastViewJsDefault.default.handleToast(_modelJs.state.toasts, type);
};
const init = function() {
    // Sub website
    // if (window.innerWidth >= 640) {
    //   // Play video
    //   subWebView.addHandlerPlay(controlVideo);
    //   // Star background
    //   subWebView.addHandlerStop(controlStar);
    // } else {
    //   // Star background on mobile device
    //   subWebView.addBackgroundStar();
    // }
    // Main header
    _mainHeaderViewJsDefault.default.addHandlerObserver(controlMainHeader);
    // All games
    _allGamesViewJsDefault.default.addHandlerOpen(controlAllGames);
    _allGamesViewJsDefault.default.addHandlerClose(controlAllGames);
    _allGamesViewJsDefault.default.addHandlerFunction(controlAllGamesFunction);
    _allGamesViewJsDefault.default.addHandlerFunctionMobile(controlAllGamesFunctionMobile);
    // Explore games
    _exploreGamesViewJsDefault.default.addHandlerOpen(controlExploreGames);
    _exploreGamesViewJsDefault.default.addHandlerClose(controlExploreGames);
    // Universe
    _universeViewJsDefault.default.addHandlerUniverse(controlUniverse);
    _universeViewJsDefault.default.addHandlerUniverseCloseSurprise(controlUniverseSurprise);
    // Universe mobile
    _universeMobileViewJsDefault.default.addHandlerOpenMenu(controlMobileMenu);
    _universeMobileViewJsDefault.default.addHandlerUniverse(controlMobileUniverse);
    _universeMobileViewJsDefault.default.addHandlerCloseMenu(controlMobileMenu);
    // Languages
    _languagesViewJsDefault.default.addHandlerChooseLanguage(controlLanguages);
    _languagesViewJsDefault.default.addHandlerSeeMore(controlSeeMore);
    // Abilities
    _abilitiesViewJsDefault.default.addHandlerSkill(controlAbilities);
    // Skins
    _skinsViewRightJsDefault.default.addHandlerGoRight(controlSlides);
    _skinsViewLeftJsDefault.default.addHandlerGoLeft(controlSlides);
    // Scroll
    _scrollViewJsDefault.default.addHandlerInformationScroll(handleInformationScroll);
    _scrollViewJsDefault.default.addHandlerAbilitiesScroll(handleAbilitiesScroll);
    _scrollViewJsDefault.default.addHandlerSkinsScroll(handleSkinsScroll);
    // Auto scroll
    _autoScrollViewJsDefault.default.addHandlerAutoScroll(controlAutoScroll);
    // Scroll to top
    _autoScrollViewJsDefault.default.addHandlerScrollToTop(controlScrollToTop);
    // Toast
    _mainToastViewJsDefault.default.addToastHandler(controlToast);
    _mainToastViewJsDefault.default.addClearToastHandler(controlClearToast);
    _mainToastViewJsDefault.default.addObserverToastHandler(controlObserveToasts);
    // Toast // Side section
    // Button, link,... that lead to no where
    // Unpdate later
    _mainToastViewJsDefault.default.playForFree(controlToast);
    _mainToastViewJsDefault.default.mainHeaderButton(controlToast);
    _mainToastViewJsDefault.default.championButton(controlToast);
    _mainToastViewJsDefault.default.exploreSkinsButton(controlToast);
    _mainToastViewJsDefault.default.downloadButtons(controlToast);
    _mainToastViewJsDefault.default.footer2(controlToast);
    _mainToastViewJsDefault.default.footer3Social(controlToast);
    _mainToastViewJsDefault.default.footer3Privacy(controlToast);
    _mainToastViewJsDefault.default.allGamesLeft(controlToast);
    _mainToastViewJsDefault.default.allGamesRight(controlToast);
    _mainToastViewJsDefault.default.exploreGames(controlToast);
};
init();

},{"./model.js":"Py0LO","./views/subWebView.js":"1uGik","./views/mainHeaderView.js":"bgKpn","./views/allGamesView.js":"4zrqM","./views/exploreGamesView.js":"9mOnB","./views/universeView.js":"dQwHV","./views/universeMobileView.js":"8xIbS","./views/languagesView.js":"6QDqd","./views/abilitiesView.js":"dNymv","./views/skinsView/skinsViewLeft.js":"5Mhh4","./views/skinsView/skinsViewRight.js":"36jT7","./views/scrollView.js":"cZKfd","./views/autoScrollView.js":"gSyVI","./views/Toast/mainToastView.js":"7a8dx","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"Py0LO":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "state", ()=>state
);
var _allGamesStateJs = require("./state/allGamesState.js");
var _languagesStoryStateJs = require("./state/languagesStoryState.js");
var _abilitiesStateJs = require("./state/abilitiesState.js");
var _skinsStateJs = require("./state/skinsState.js");
var _mainToastStateJs = require("./state/Toast/mainToastState.js");
const state = {
    storyLanguages: _languagesStoryStateJs.storyLanguages,
    allGamesHover: {
        hoverMarkupBackground: _allGamesStateJs.hoverMarkupBackground,
        hoverMarkupQuote: _allGamesStateJs.hoverMarkupQuote,
        hoverMarkupSEO: _allGamesStateJs.hoverMarkupSEO
    },
    skillsDetail: _abilitiesStateJs.skillsDetail,
    nameSkins: _skinsStateJs.nameSkins,
    toasts: _mainToastStateJs.toasts
};

},{"./state/allGamesState.js":"iBr7p","./state/languagesStoryState.js":"dMfZg","./state/abilitiesState.js":"8Tipg","./state/skinsState.js":"5hMzJ","./state/Toast/mainToastState.js":"lTvoB","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"iBr7p":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "hoverMarkupBackground", ()=>hoverMarkupBackground
);
parcelHelpers.export(exports, "hoverMarkupQuote", ()=>hoverMarkupQuote
);
parcelHelpers.export(exports, "hoverMarkupSEO", ()=>hoverMarkupSEO
);
const hoverMarkupBackground = [
    'background-image: radial-gradient(160.43% 179.54% at 100.43% 100%, rgb(17, 113, 200) 0%, rgb(10, 10, 10) 70%);',
    'background-image: radial-gradient(160.43% 179.54% at 100.43% 100%, rgb(80, 104, 125) 0%, rgb(10, 10, 10) 70%);',
    'background-image: radial-gradient(160.43% 179.54% at 100.43% 100%, rgb(67, 37, 87) 0%, rgb(10, 10, 10) 70%);',
    'background-image: radial-gradient(160.43% 179.54% at 100.43% 100%, rgb(139, 121, 229) 0%, rgb(10, 10, 10) 70%);',
    'background-image: radial-gradient(160.43% 179.54% at 100.43% 100%, rgb(84, 163, 227) 0%, rgb(10, 10, 10) 70%);',
    'background-image: radial-gradient(160.43% 179.54% at 100.43% 100%, rgb(160, 193, 236) 0%, rgb(10, 10, 10) 70%);',
    'background-image: radial-gradient(160.43% 179.54% at 100.43% 100%, rgb(172, 76, 84) 0%, rgb(10, 10, 10) 70%);',
    'background-image: radial-gradient(160.43% 179.54% at 100.43% 100%, rgb(116, 193, 175) 0%, rgb(10, 10, 10) 70%);',
    'background-image: radial-gradient(160.43% 179.54% at 100.43% 100%, rgb(173, 110, 137) 0%, rgb(10, 10, 10) 70%);',
    'background-image: radial-gradient(160.43% 179.54% at 100.43% 100%, rgb(66, 88, 166) 0%, rgb(10, 10, 10) 70%);',
    'background-image: radial-gradient(160.43% 179.54% at 100.43% 100%, rgb(48, 76, 64) 0%, rgb(10, 10, 10) 70%);',
    'background-image: radial-gradient(160.43% 179.54% at 100.43% 100%, rgb(90, 190, 205) 0%, rgb(10, 10, 10) 70%);',
    'background-image: radial-gradient(160.43% 179.54% at 100.43% 100%, rgb(147, 34, 28) 0%, rgb(10, 10, 10) 70%);',
    'background-image: radial-gradient(160.43% 179.54% at 100.43% 100%, rgb(43, 61, 109) 0%, rgb(10, 10, 10) 70%);',
    'background-image: radial-gradient(160.43% 179.54% at 100.43% 100%, rgb(35, 83, 87) 0%, rgb(10, 10, 10) 70%);',
    'background-image: radial-gradient(160.43% 179.54% at 100.43% 100%, rgb(121, 49, 123) 0%, rgb(10, 10, 10) 70%);',
    'background-image: radial-gradient(160.43% 179.54% at 100.43% 100%, rgb(212, 190, 179) 0%, rgb(10, 10, 10) 70%);',
    'background-image: radial-gradient(160.43% 179.54% at 100.43% 100%, rgb(0, 61, 90) 0%, rgb(10, 10, 10) 70%);',
    'background-image: radial-gradient(160.43% 179.54% at 100.43% 100%, rgb(252, 63, 67) 0%, rgb(10, 10, 10) 70%);',
    'background-image: radial-gradient(160.43% 179.54% at 100.43% 100%, rgb(234, 0, 40) 0%, rgb(10, 10, 10) 70%);', 
];
const hoverMarkupQuote = [
    "Earn in-game rewards and learn more about Riot's games",
    'Face off in the ultimate 5v5 battle arena',
    'Style on your enemies in this 5v5 tactical shooter',
    'A TEAM-BUILDING BATTLE OF WITS',
    'Master every moment in this strategy card game',
    'LEAGUE OF LEGENDS, NOW ON MOBILE',
    'Riot Forge Presents Hextech Mayhem',
    'RISE AGAINST RUIN IN THIS TURN BASED RPG',
    'EXPLORE ZAUN AS EKKO IN THIS ACTION PLATFORMER',
    'A Song Lives Forever',
    'PUBLISHER OF COMPLETABLE EXPERIENCES FROM THE LEAGUE UNIVERSE',
    '',
    '',
    'AN ANIMATED SERIES ON NETFLIX FROM THE WORLD OF LEAGUE OF LEGENDS',
    'THE DEFINITIVE SOURCE FOR THE WORLD OF LEAGUE OF LEGENDS',
    'MUSIC HAS A NEW HOME',
    'UNLEASH PLAY',
    'THE OFFICIAL HOME OF RIOT GAMES MERCH',
    'YOUR MOBILE COMPANION FOR ALL THINGS RIOT GAMES',
    'FROM TECH TO TILT, WE ARE HERE TO HELP YOU', 
];
const hoverMarkupSEO = [
    'ARCANE',
    'LEAGUE OF LEGENDS',
    'VALORANT',
    'TEAMFIGHT TACTICS',
    'LEGENDS OF RUNETERRA',
    'LOL: WILD RIFT',
    'HEXTECH MAYHEM',
    'RUINED KING',
    'CONV/RGENCE',
    'SONG OF NUNU',
    'RIOT FORGE GAMES',
    'LOL ESPORTS',
    'VALORANT ESPORTS',
    'ARCANE',
    'UNIVERSE',
    'RIOT GAMES MUSIC',
    'RIOT GAMES',
    'RIOT MERCH',
    'RIOT MOBILE',
    'RIOT SUPPORT', 
];

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"gkKU3":[function(require,module,exports) {
exports.interopDefault = function(a) {
    return a && a.__esModule ? a : {
        default: a
    };
};
exports.defineInteropFlag = function(a) {
    Object.defineProperty(a, '__esModule', {
        value: true
    });
};
exports.exportAll = function(source, dest) {
    Object.keys(source).forEach(function(key) {
        if (key === 'default' || key === '__esModule' || dest.hasOwnProperty(key)) return;
        Object.defineProperty(dest, key, {
            enumerable: true,
            get: function() {
                return source[key];
            }
        });
    });
    return dest;
};
exports.export = function(dest, destName, get) {
    Object.defineProperty(dest, destName, {
        enumerable: true,
        get: get
    });
};

},{}],"dMfZg":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "storyLanguages", ()=>storyLanguages
);
const storyLanguages = [
    "An Ionian of deep resolve, Yasuo is an agile swordsman who wields the air itself against his enemies. As a proud young man, he was falsely accused of murdering his master—unable to prove his innocence, he was forced to slay his own brother in self defense. Even after his master's true killer was revealed, Yasuo still could not forgive himself for all he had done, and now wanders his homeland with only the wind to guide his blade.",
    'Um Ioniano de profunda determinação, Yasuo é um espadachim ágil que empunha o próprio ar contra seus inimigos. Como um jovem orgulhoso, ele foi falsamente acusado de assassinar seu mestre - incapaz de provar sua inocência, ele foi forçado a matar seu próprio irmão em legítima defesa. Mesmo depois que o verdadeiro assassino de seu mestre foi revelado, Yasuo ainda não conseguiu se perdoar por tudo o que havia feito, e agora vagueia pátria com apenas o vento para guiar sua lâmina.',
    'Ионийец глубокой решимости, Ясуо — ловкий фехтовальщик, владеющий сам воздух против своих врагов. Как гордый юноша, он был ложно обвинен в убийстве своего хозяина — не в состоянии доказать свою невиновности, он был вынужден убить своего брата в целях самообороны. Даже после того, как истинный убийца его хозяина был раскрыт, Ясуо все еще не мог простить себе всего содеянного и теперь бродит родине, где только ветер направляет ero клинок.',
    'En jonisk med djup beslutsamhet, Yasuo är en smidig svärdsman som använder luften själv mot sina fiender. Som en stolt ung man var han det falskt anklagad för att ha mördat sin herre - oförmögen att bevisa sin oskuld tvingades han döda sin egen bror i självförsvar. Även efter att hans mästares sanna mördare avslöjades, Yasuo fortfarande kunde inte förlåta sig själv för allt han gjort, och nu vandrar hans hemland med bara vinden att styra hans blad.',
    'Yasuo ist ein Ionier von tiefer Entschlossenheit und ein agiler Schwertkämpfer, der schwingt die Luft selbst gegen seine Feinde. Als stolzer junger Mann war er es fälschlich beschuldigt, seinen Meister ermordet zu haben – unfähig, seinen zu beweisen Unschuld war er gezwungen, seinen eigenen Bruder zur Selbstverteidigung zu töten. Selbst nachdem der wahre Mörder seines Meisters enthüllt wurde, ist Yasuo immer noch konnte sich selbst nicht verzeihen, was er getan hatte, und wandert nun umher Heimat mit nur dem Wind, um seine Klinge zu führen.',
    '深い決意を持ったイオニアン、安雄は機敏な剣士であり、彼の敵に対する空気自体。誇り高き青年として、彼は彼の主人を殺害したとして誤って告発された—彼を証明することができない無実、彼は自己防衛で彼自身の兄弟を殺すことを余儀なくされました。師匠の真の殺し屋が明かされた後も、安雄はまだ彼がしたことすべてを許すことができず、今は彼をさまよっている彼の刃を導く風だけの故郷。', 
];

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"8Tipg":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "skillsDetail", ()=>skillsDetail
);
const skillsDetail = [
    {
        button: 'PASSIVE',
        name: 'WAY OF THE WANDERER',
        desc: "Yasuo's Critical Strike Chance is increased. Additionally, Yasuo builds toward a shield whenever he is moving. The shield triggers when he takes damage from a champion or monster."
    },
    {
        button: 'Q',
        name: 'STEEL TEMPEST',
        desc: 'Thrusts forward, damaging all enemies in a line. On hit, grants a stack of Gathering Storm for a few seconds. At 2 stacks, Steel Tempest fires a whirlwind that knocks Airborne. Steel Tempest is treated as a basic attack and scales with all the same things.'
    },
    {
        button: 'W',
        name: 'WIND WALL',
        desc: 'Creates a moving wall that blocks all enemy projectiles for 4 seconds.'
    },
    {
        button: 'E',
        name: 'SWEEPING BLADE',
        desc: "Dashes through target enemy, dealing magic damage. Each cast increases your next dash's base Damage, up to a max amount. Cannot be re-cast on the same enemy for a few seconds. If Steel Tempest is cast while dashing, it will strike as a circle."
    },
    {
        button: 'R',
        name: 'LAST BREATH',
        desc: "Blinks to an Airborne enemy champion, dealing physical damage and holding all Airborne enemies in the area in the air. Grants maximum Flow but resets all stacks of Gathering Storm. For a moderate time afterwards, Yasuo's critical strikes gain significant Bonus Armor Penetration."
    }, 
];

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"5hMzJ":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "nameSkins", ()=>nameSkins
);
const nameSkins = [
    'YASUO',
    'HIGH NOON YASUO',
    'PROJECT: YASUO',
    'BLOOD MOON YASUO',
    'NIGHTBRINGER YASUO',
    'ODYSSEY YASUO',
    'BATTLE BOSS YASUO',
    'TRUE DAMAGE YASUO',
    'TRUE DAMAGE YASUO PRESTIGE EDITION',
    'SPIRIT BLOSSOM YASUO',
    'TRUTH DRAGON YASUO',
    'DREAM DRAGON YASUO', 
];

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"lTvoB":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "toasts", ()=>toasts
);
const toasts = {
    welcome: {
        type: 'welcome',
        title: 'Welcome!',
        content: 'My first project. Have fun exploring things.'
    },
    information: {
        type: 'toast-information',
        title: 'Information',
        content: 'Some facts about Yasuo - The wanderer.'
    },
    abilities: {
        type: 'toast-abilities',
        title: 'Abilities',
        content: 'Find the soul - Feel the wind - Chase the dream.'
    },
    skins: {
        type: 'toast-skins',
        title: 'Skins',
        content: "Look doesn't matter? Huh, what a shame!"
    },
    ruined: {
        type: 'toast-ruined',
        title: 'Ruined-King',
        content: 'Save the world? Who am I?'
    },
    gallery: {
        type: 'toast-gallery',
        title: 'Moments',
        content: 'Do things that make you happy.'
    },
    oopsie: {
        type: 'toast-oopsie',
        title: 'Oopsie!!!',
        content: "Sorry! I haven't added any function yet."
    }
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"1uGik":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _configJs = require("../config.js");
class SubWebView {
    _parentElement = _configJs.$('.container');
    smallVideo = _configJs.$('.trailer__bg-small-video');
    bigVideo = _configJs.$('.trailer__bg-big-video');
    addHandlerPlay(handler) {
        setTimeout(()=>{
            handler(this.smallVideo, this.bigVideo);
        }, 3000);
    }
    addHandlerStop(handler) {
        this.smallVideo.addEventListener('ended', function() {
            handler();
        });
    }
    addBackgroundStar() {
        this._parentElement.insertAdjacentHTML('beforeend', this._starMarkup());
    }
    _starMarkup() {
        return `
      <div id="stars"></div>
    `;
    }
}
exports.default = new SubWebView();

},{"../config.js":"4Wc5b","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"4Wc5b":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "$", ()=>$
);
parcelHelpers.export(exports, "$$", ()=>$$
);
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"bgKpn":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _configJs = require("../config.js");
class MainHeaderView {
    _parentElement = _configJs.$('.main-header__cover');
    _rootObserved = _configJs.$('.container');
    handleSticky(action) {
        action === 'add' && this._parentElement.classList.add('sticky');
        action === 'remove' && this._parentElement.classList.remove('sticky');
    }
    _observerCallback(entries, _, handler) {
        handler(!entries[0].isIntersecting);
    }
    _observerCallbackMiddleware(handler) {
        return (state, observer)=>{
            this._observerCallback(state, observer, handler);
        };
    }
    _observerOptions() {
        return {
            root: null,
            threshold: 0
        };
    }
    addHandlerObserver(handler) {
        const observer = new IntersectionObserver(this._observerCallbackMiddleware(handler), this._observerOptions);
        observer.observe(this._rootObserved);
    }
}
exports.default = new MainHeaderView();

},{"../config.js":"4Wc5b","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"4zrqM":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _configJs = require("../config.js");
class AllGamesView {
    _parentElement = _configJs.$('.sb-ag');
    _openButton = _configJs.$('.main-header__riot-logo');
    _overlay = _configJs.$('.sb-ag-container');
    _closeButton = _configJs.$('.sb-ag-header__close');
    _allGamesItems = _configJs.$$('.sb-ag-body__left-link');
    _agMainPoster = _configJs.$('.sb-ag-body__right');
    _hovered;
    _timeout;
    constructor(){
        this._allGamesItems.forEach((item, index)=>{
            item.setAttribute('data-agi-id', `ag__img--${index + 1}`);
        });
    }
    // Open & Close
    handleOpen() {
        this._overlay.classList.add('show');
    }
    addHandlerOpen(handler) {
        this._openButton.addEventListener('click', function() {
            handler('open');
        });
    }
    handleClose() {
        this._parentElement.classList.add('close-special');
        setTimeout(()=>{
            this._parentElement.classList.remove('close-special');
            this._overlay.classList.remove('show');
        }, 250);
        _configJs.$$('.sb-ag-body__left-title').forEach((item)=>{
            item.parentElement.classList.remove('show');
        });
    }
    addHandlerClose(handler) {
        this._closeButton.addEventListener('click', function() {
            handler('close');
        });
        this._overlay.addEventListener('click', function(event) {
            if (!event.target.closest('.sb-ag')) handler('close');
        });
    }
    // Function
    _generateMarkup(img, state) {
        // 14: From "Universe with index 14, poster use text instead of png or svg"
        // [1, 7, 9, 10, 13] => png
        const index = +img?.slice(img.length - 2, img.length).replace('-', '') - 1;
        return `
      <div class="sb-ag-body__right--hover">
        <div class="sb-ag-body__right--hover-frame"></div>
        <div class="ag__hover-content" style="${state.hoverMarkupBackground[index]}">
          <div class="ag__hover-content--child">
            <div class="ag__hover-imgs-cover">
              ${index >= 14 || `<img
                    class="ag__hover-imgs"
                    src="./src/img/nav-ag/${img}s.${[
            1,
            7,
            9,
            10,
            13
        ].indexOf(index + 1) !== -1 ? 'png' : 'svg'}"
                    alt="${state.hoverMarkupSEO[index]}"
                  />`}
              
              <span class="ag__hover-imgs--text ${index < 14 ? 'hide' : ''}">${state.hoverMarkupSEO[index]}</span>
            </div>
            <p class="ag__hover-text">
              ${state.hoverMarkupQuote[index]}
            </p>
            <div class="ag__hover-icon ${index === 0 || index === 8 || index >= 10 ? 'hide' : ''}">
              <svg
                width="8"
                height="8"
                class="ag__hover-icon--1 ${index > 0 && index < 5 || index === 6 || index === 7 || index === 9 ? 'show' : ''}"
                viewBox="0 0 10 10"
              >
                <title>platform_windows_transp</title>
                <path
                  d="M0 1.416L4.087.86l.002 3.929-4.084.023L0 1.416zm4.085 3.827l.003 3.933-4.085-.56V5.218l4.082.026zM4.58.79L9.998 0v4.741l-5.418.042V.79zM10 5.279L9.998 10 4.58 9.238l-.008-3.966L10 5.28z"
                ></path>
              </svg>
              <svg
                width="8"
                height="8"
                class="ag__hover-icon--2 ${index > 2 && index < 7 ? 'show' : ''}"
                viewBox="0 0 7 10"
              >
                <title>platform_phone_transp</title>
                <path
                  d="M2.5 8.125a.624.624 0 101.249.001.624.624 0 00-1.249 0zM0 .938v8.125C0 9.58.42 10 .938 10h4.375c.517 0 .937-.42.937-.937V.938A.938.938 0 005.312 0H.938A.938.938 0 000 .938zm.938 8.007v-7.89c0-.065.052-.117.117-.117h4.14c.065 0 .117.052.117.117v7.89a.118.118 0 01-.117.118h-4.14a.118.118 0 01-.117-.118z"
                ></path>
              </svg>
              <svg
                width="8"
                height="8"
                class="ag__hover-icon--3 ${index === 6 || index === 7 || index === 9 ? 'show' : ''}"
                viewBox="0 0 11 10"
              >
                <title>platform_switch_transp</title>
                <path
                  d="M3.015.033a2.584 2.584 0 00-2.05 1.884c-.09.35-.097.555-.086 3.27.006 2.492.008 2.55.05 2.742.23 1.038.966 1.777 2.014 2.021.137.031.31.038 1.43.044 1.16.008 1.28.006 1.311-.025.031-.031.033-.43.033-4.961 0-3.358-.006-4.94-.02-4.97C5.676.003 5.64 0 4.427.003c-.985.002-1.281.008-1.412.03zM4.89 5.002v4.195l-.842-.01c-.777-.009-.86-.013-1.015-.052a1.756 1.756 0 01-1.3-1.355c-.046-.209-.046-5.36-.002-5.565A1.778 1.778 0 012.802.933c.273-.11.4-.122 1.286-.124l.801-.002v4.195z"
                  fill="#7E7E7E"
                ></path>
                <path
                  d="M3.193 2.074c-.13.025-.329.124-.434.217-.218.188-.325.456-.309.77a.651.651 0 00.085.34c.097.2.244.348.445.447a.643.643 0 00.354.083c.164.006.222 0 .332-.037.449-.152.72-.588.643-1.036a.951.951 0 00-1.116-.784z"
                  fill="#7E7E7E"
                ></path>
                <path
                  d="M6.726.015c-.009.006-.015 2.25-.015 4.987 0 4.516.002 4.974.033 4.986.056.02 1.663.013 1.862-.008a2.585 2.585 0 002.14-1.729c.131-.39.127-.286.127-3.261 0-2.375-.004-2.729-.033-2.88A2.57 2.57 0 008.732.03C8.587.005 8.363 0 7.642 0c-.496 0-.91.005-.916.014zm2.21 4.51c.324.084.589.33.697.645.068.195.066.48-.002.659a1.022 1.022 0 01-.694.641 1.02 1.02 0 01-1.22-.691 1.187 1.187 0 01.009-.584 1.005 1.005 0 011.21-.67z"
                ></path>
              </svg>
            </div>
          </div>
        </div>
        <img
          class="ag__hover-img"
          src="./src/img/nav-ag/${img}.jpeg"
          alt="${state.hoverMarkupSEO[index]}"
        />
      </div>
    `;
    }
    handleHover(hovered, event, state) {
        if (hovered) {
            clearTimeout(this._timeout);
            _configJs.$('.sb-ag-body__right--hover')?.remove();
            const img = event.target.closest('.sb-ag-body__left-link').dataset.agiId;
            this._agMainPoster.classList.add('hide');
            this._agMainPoster.insertAdjacentHTML('afterbegin', this._generateMarkup(img, state));
        } else this._timeout = setTimeout(()=>{
            _configJs.$('.sb-ag-body__right--hover')?.remove();
            this._agMainPoster.classList.remove('hide');
        }, 200);
    }
    _checkHover(event) {
        return [
            event.target.closest('.sb-ag-body__left-link') ? true : false,
            event, 
        ];
    }
    addHandlerFunction(handler) {
        this._overlay.addEventListener('mousemove', (event)=>{
            if (window.innerWidth > 1040) handler(this._checkHover(event));
        });
    }
    // Function mobile
    handleFunctionMobile(item) {
        if (item) item.parentElement.classList.toggle('show');
    }
    addHandlerFunctionMobile(handler) {
        _configJs.$('.sb-ag-body__left').addEventListener('click', function(event) {
            handler(event.target.closest('.sb-ag-body__left-title'));
        });
    }
}
exports.default = new AllGamesView();

},{"../config.js":"4Wc5b","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"9mOnB":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _configJs = require("../config.js");
class ExploreGamesView {
    _openButton = _configJs.$('.main-header__games');
    _overlay = _configJs.$('.explore-games-container');
    _exploreGames = _configJs.$('.explore-games');
    _exploreGamesHeader = _configJs.$('.explore-games__header');
    _exploreGamesPoster = _configJs.$$('.explore-games__body-poster');
    _closeButton = _configJs.$('.explore-games__header-more-close');
    handleOpen() {
        this._overlay.classList.add('show');
        this._exploreGames.classList.add('show');
        setTimeout(()=>{
            // Class 'show' help create animation for '_exploreGames
            this._exploreGames.classList.remove('show');
            this._exploreGamesHeader.classList.add('show');
        }, 200);
        setTimeout(()=>{
            this._exploreGamesPoster.forEach((poster, index)=>{
                setTimeout(function() {
                    poster.classList.add('show');
                }, (index + 1) * 100);
            });
        }, 400);
    }
    addHandlerOpen(handler) {
        this._openButton.addEventListener('click', function() {
            handler('open');
        });
    }
    handleClose() {
        this._exploreGames.classList.add('close-special');
        this._exploreGamesHeader.classList.remove('show');
        this._exploreGamesPoster.forEach((poster)=>{
            poster.classList.remove('show');
        });
        setTimeout(()=>{
            this._exploreGames.classList.remove('close-special');
            this._overlay.classList.remove('show');
        }, 300);
    }
    addHandlerClose(handler) {
        this._closeButton.addEventListener('click', function() {
            handler('close');
        });
        this._overlay.addEventListener('click', function(event) {
            if (event.target.closest('.explore-games')) return;
            handler('close');
        });
    }
}
exports.default = new ExploreGamesView();

},{"../config.js":"4Wc5b","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"dQwHV":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _configJs = require("../config.js");
class UniverseView {
    _parentElement = _configJs.$('.find-more');
    _universe = _configJs.$('.universe .list-1__link');
    _universeX = _configJs.$('.universe-x');
    _list = _configJs.$('.list-2');
    _listItems = _configJs.$$('.list-2__item');
    constructor(){
        this._parentElement.querySelector('.main-header-about__link').addEventListener('click', function(event) {
            event.preventDefault();
        });
    }
    toggleUniverse() {
        this._universeX.classList.toggle('universe-icon');
        this._list.classList.toggle('open');
        for (let item of this._listItems)item.classList.toggle('open');
    }
    addHandlerUniverse(handler) {
        this._universe.addEventListener('click', function(event) {
            event.preventDefault();
            handler();
        });
    }
    closeUniverseSurprise() {
        this._universeX.classList.remove('universe-icon');
        this._list.classList.remove('open');
        for (let item of this._listItems)item.classList.remove('open');
    }
    addHandlerUniverseCloseSurprise(handler) {
        this._parentElement.addEventListener('mouseleave', handler);
    }
}
exports.default = new UniverseView();

},{"../config.js":"4Wc5b","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"8xIbS":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _configJs = require("../config.js");
class UniverseMobileView {
    _openButton = _configJs.$('.mh-menu');
    _menu = _configJs.$('.mh-table');
    _overlay = _configJs.$('.mh-table__cover');
    _universe = _configJs.$('.universe-mobile');
    _universeX = _configJs.$('.mh-table__universe-x');
    _list = _configJs.$('.universe-mobile__more');
    _universeClose = _configJs.$('.mh-table__header-close');
    openMenu() {
        this._overlay.classList.remove('hide');
        this._menu.classList.add('show');
    }
    addHandlerOpenMenu(handler) {
        this._openButton.addEventListener('click', function() {
            handler('open');
        });
    }
    handleUniverse() {
        this._list.classList.toggle('show');
        this._universeX.classList.toggle('universe-x');
    }
    addHandlerUniverse(handler) {
        this._universe.addEventListener('click', function(event) {
            event.preventDefault();
            handler();
        });
    }
    closeMenu() {
        this._menu.classList.remove('show');
        this._overlay.classList.add('hide');
        this._list.classList.remove('show');
        this._universeX.classList.remove('universe-x');
    }
    addHandlerCloseMenu(handler) {
        this._universeClose.addEventListener('click', function() {
            handler('close');
        });
        this._overlay.addEventListener('click', function(event) {
            if (event.target.closest('.mh-table')) return;
            handler('close');
        });
    }
}
exports.default = new UniverseMobileView();

},{"../config.js":"4Wc5b","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"6QDqd":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _configJs = require("../config.js");
class LanguagesView {
    _parentElement = _configJs.$('.languages-list');
    _languages = _configJs.$$('.languages-language');
    _paragraphContainer = _configJs.$('.information-yasuo__about-story');
    _storyButton = _configJs.$('.information-yasuo__about-story--see-more');
    _storyDots = _configJs.$('.information-yasuo__about-story--dots');
    _render(paragraph) {
        this._paragraphContainer.removeChild(this._paragraphContainer.firstElementChild);
        this._paragraphContainer.insertAdjacentHTML('afterbegin', this._generateMarkup(paragraph));
    }
    _generateMarkup(paragraph) {
        return `
      <span>${paragraph}</span>
    `;
    }
    _handleChecked(id) {
        this._languages.forEach((item, index)=>{
            if (index === id) item.classList.add('checked');
            else item.classList.remove('checked');
        });
    }
    handleLanguages(id, paragraph) {
        this._handleChecked(id);
        this._render(paragraph);
    }
    addHandlerChooseLanguage(handler) {
        this._parentElement.addEventListener('click', function(event) {
            const link = event.target.closest('.languages-link');
            if (link) handler(+link.dataset.language);
        });
    }
    handleSeeMore() {
        this._storyButton.classList.add('hide');
        this._storyDots.classList.add('hide');
    }
    addHandlerSeeMore(handler) {
        this._storyButton.addEventListener('click', function() {
            handler();
        });
    }
}
exports.default = new LanguagesView();

},{"../config.js":"4Wc5b","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"dNymv":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _configJs = require("../config.js");
class AbilitiesView {
    _parentElement = _configJs.$('.ab__skills');
    _skills = _configJs.$$('.ab__skills-skill');
    _skillCircle = _configJs.$('.ab__skills-progress-circle');
    _skillDesc = _configJs.$('.ab__skills-desc');
    _videoContainer = _configJs.$('.abilities__content-body-video');
    constructor(){
        this._skills.forEach((skill, index)=>skill.setAttribute('data-skill-number', index)
        );
    }
    _generateMarkupDesc(index, skillsDetail) {
        const skill = skillsDetail[index];
        return `
    <div class="ab__skills-desc-s">
      <p class="ab__skills-desc-s-small">${skill.button}</p>
      <h1 class="ab__skills-desc-s-big">${skill.name}</h1>
      <p class="ab__skills-desc-s-medium">
        ${skill.desc}
      </p>
    </div>
  `;
    }
    _generateMarkupVideo(index) {
        return `
    <video class="abilities__content-body-video-s" muted>
      <source src="./src/img/Skills/${index}.mp4" type="video/mp4" />
      <source src="./src/img/Skills/${index}.webm" type="video/webm" />
      Your browser does not support video!
    </video>
  `;
    }
    handleSkill(skill1, skillsDetail) {
        // Handle outline / border
        this._skills.forEach((skill)=>{
            skill.classList.remove('active');
        });
        skill1.classList.add('active');
        // Handle progress
        const skillIndex = +skill1.dataset.skillNumber;
        this._skillCircle.style.left = `${4.1 + skillIndex * 9.6}rem`;
        this._skillCircle.classList.add('active');
        setTimeout(()=>this._skillCircle.classList.remove('active')
        , 1000);
        // Handle description
        this._skillDesc.classList.remove('active');
        this._skillDesc.innerHTML = '';
        this._skillDesc.insertAdjacentHTML('afterbegin', this._generateMarkupDesc(skillIndex, skillsDetail));
        setTimeout(()=>this._skillDesc.classList.add('active')
        , 300);
        // Handle video
        const video = _configJs.$('.abilities__content-body-video-s');
        this._videoContainer.removeChild(video);
        this._videoContainer.insertAdjacentHTML('beforeend', this._generateMarkupVideo(skillIndex));
        const videoAdded = _configJs.$('.abilities__content-body-video-s');
        videoAdded.play();
    }
    addHandlerSkill(handler) {
        this._parentElement.addEventListener('click', function(event) {
            const skill = event.target.closest('.ab__skills-skill');
            if (skill) handler(skill);
        });
    }
}
exports.default = new AbilitiesView();

},{"../config.js":"4Wc5b","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"5Mhh4":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _configJs = require("../../config.js");
var _skinsViewJs = require("../skinsView.js");
var _skinsViewJsDefault = parcelHelpers.interopDefault(_skinsViewJs);
class SkinsViewLeft extends _skinsViewJsDefault.default {
    _leftButton = _configJs.$('.skins-btn__left');
    _leftMobileButton = _configJs.$('.skins_overlay__mobile--left');
    handleGoLeft(nameSkins) {
        // Remove first slide then Add last slide //
        // PC
        const slidersContainer = _configJs.$('.skins_images');
        slidersContainer.removeChild(slidersContainer.lastElementChild);
        slidersContainer.insertAdjacentHTML('afterbegin', this._generateMarkup(this._nextLeft));
        // Mobile
        const slidersContainerMobile = _configJs.$('.skins_images-mobile');
        slidersContainerMobile.removeChild(slidersContainerMobile.lastElementChild);
        slidersContainerMobile.insertAdjacentHTML('afterbegin', this._generateMarkupMobile(this._nextLeft));
        // Move //
        // PC // Mobile
        const sliders = _configJs.$$('.skins_images__slider');
        const slidersMobile = _configJs.$$('.skins_images-mobile__slider');
        [
            sliders,
            slidersMobile
        ].forEach((slider)=>{
            slider.forEach((item, index)=>{
                item.style.transform = `translateX(${(index - 2) * 100}%)`;
            });
        });
        this._logo.classList.add('dingdong');
        setTimeout(()=>{
            this._logo.classList.remove('dingdong');
        }, 400);
        // Keep track
        this._nextLeft--;
        this._nextRight--;
        if (this._nextLeft < 0) this._nextLeft = 11;
        if (this._nextRight < 0) this._nextRight = 11;
        // Set name for and order for skin
        this._handleNameOrdered(nameSkins);
    }
    addHandlerGoLeft(handler) {
        [
            this._leftButton,
            this._leftMobileButton
        ].forEach((button)=>{
            button.addEventListener('click', ()=>{
                handler('left');
            });
        });
    }
}
exports.default = new SkinsViewLeft();

},{"../../config.js":"4Wc5b","../skinsView.js":"e517P","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"e517P":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _configJs = require("../config.js");
class SkinsView {
    _logo = _configJs.$('.skins_container__header-logo');
    _currentSkins = 0;
    _nextRight = 3;
    _nextLeft = 9;
    // PC
    _sliders = _configJs.$$('.skins_images__slider');
    _nameSkinsContainer = _configJs.$('.skins_overlay__about-who');
    _orderedSkinContainer = _configJs.$('.skin-ordered-number');
    _orderedNumber = 1;
    // Mobile
    _slidersMobile = _configJs.$$('.skins_images-mobile__slider');
    _nameSkinsContainerMobile = _configJs.$('.skins_overlay__mobile-name-container');
    constructor(){
        const skinsDefaultPosition = function(element) {
            element.forEach((item, index)=>{
                item.style.transform = `translateX(${(index - 2) * 100}%)`;
            });
        };
        // PC
        skinsDefaultPosition(this._sliders);
        // Mobile
        skinsDefaultPosition(this._slidersMobile);
    }
    _generateMarkup(index) {
        return `
      <div
        class="skins_images__slider"
        style="background-image: url('../../src/img/Skins/${index}.jpeg'); transform: translateX(0)"
      ></div>
    `;
    }
    _generateMarkupMobile(index) {
        return `
      <div
        class="skins_images-mobile__slider"
        style="background-image: url('../../src/img/Skins/${index}s.jpg')"
      ></div>
    `;
    }
    _handleNameOrdered(nameSkins) {
        // console.log(newSliders[2].getAttribute('style'));
        // background-image: url("../../src/img/Skins/1.jpeg"); transform: translateX(0%);
        // console.log(newSliders[2].getAttribute('style').split(' ')[1]);
        // url('../../src/img/Skins/1.jpeg');
        // console.log(newSliders[2].getAttribute('style').split(' ')[1].slice(25, 27));
        // 1;
        const newSliders = _configJs.$$('.skins_images__slider');
        const currentSkins = Number(newSliders[2].getAttribute('style').split(' ')[1].slice(25, 27).replace('.', ''));
        // Name
        this._nameSkinsContainer.innerHTML = '';
        this._nameSkinsContainer.insertAdjacentHTML('afterbegin', `<h1 class="skins_overlay__about-who-name">${nameSkins[currentSkins]}</h1>`);
        // Ordered
        const orderedNumber = currentSkins + 1;
        this._orderedSkinContainer.textContent = orderedNumber;
        // Name on mobile
        this._nameSkinsContainerMobile.innerHTML = '';
        this._nameSkinsContainerMobile.insertAdjacentHTML('afterbegin', `<h1 class="skins_overlay__mobile-name">${nameSkins[currentSkins]}</h1>`);
    }
}
exports.default = SkinsView;

},{"../config.js":"4Wc5b","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"36jT7":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _configJs = require("../../config.js");
var _skinsViewJs = require("../skinsView.js");
var _skinsViewJsDefault = parcelHelpers.interopDefault(_skinsViewJs);
class SkinsViewRight extends _skinsViewJsDefault.default {
    _rightButton = _configJs.$('.skins-btn__right');
    _rightMobileButton = _configJs.$('.skins_overlay__mobile--right');
    // constructor() {
    //   setInterval(() => {
    //     this._rightButton.click();
    //   }, 3000);
    // }
    handleGoRight(nameSkins) {
        // Remove first slide then Add last slide //
        // PC
        const slidersContainer = _configJs.$('.skins_images');
        slidersContainer.removeChild(slidersContainer.firstElementChild);
        slidersContainer.insertAdjacentHTML('beforeend', this._generateMarkup(this._nextRight));
        // Mobile
        const slidersContainerMobile = _configJs.$('.skins_images-mobile');
        slidersContainerMobile.removeChild(slidersContainerMobile.firstElementChild);
        slidersContainerMobile.insertAdjacentHTML('beforeend', this._generateMarkupMobile(this._nextRight));
        // Move //
        // PC // Mobile
        const sliders = _configJs.$$('.skins_images__slider');
        const slidersMobile = _configJs.$$('.skins_images-mobile__slider');
        [
            sliders,
            slidersMobile
        ].forEach((slider)=>slider.forEach((item, index)=>{
                item.style.transform = `translateX(${(index - 2) * 100}%)`;
            })
        );
        this._logo.classList.add('dingdong');
        setTimeout(()=>{
            this._logo.classList.remove('dingdong');
        }, 400);
        // Keep track
        this._nextRight++;
        this._nextLeft++;
        if (this._nextRight > 11) this._nextRight = 0;
        if (this._nextLeft > 11) this._nextLeft = 0;
        // Set name for and order for skin
        this._handleNameOrdered(nameSkins);
    }
    addHandlerGoRight(handler) {
        [
            this._rightButton,
            this._rightMobileButton
        ].forEach((button)=>{
            button.addEventListener('click', function() {
                handler('right');
            });
        });
    }
}
exports.default = new SkinsViewRight();

},{"../../config.js":"4Wc5b","../skinsView.js":"e517P","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"cZKfd":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _configJs = require("../config.js");
class ScrollView {
    // Information
    _informationObserved = _configJs.$('.information');
    _informationUnForfiven = _configJs.$('.information-yasuo__name-unforgiven');
    _informationYasuo = _configJs.$('.information-yasuo__name-yasuo');
    // Abilities
    _abilitiesObserved = _configJs.$('.abilities');
    _abilitiesTitle = _configJs.$('.abilities__content-header');
    // Skins
    _skinsObserved = _configJs.$('.skins');
    _skinsTitle = _configJs.$('.skins_container__header-title');
    // General //
    _observerFunction(handler, observed, callback, threshold) {
        new IntersectionObserver(callback.bind(null, handler), {
            root: null,
            threshold: threshold
        }).observe(observed);
    }
    // Information
    handleInformationScroll(action) {
        this._informationUnForfiven.classList[action]('scroll');
        setTimeout(()=>{
            this._informationYasuo.classList[action]('scroll');
        }, 400);
    }
    _informationCallback(handler, entries, _) {
        handler(entries[0].isIntersecting);
    }
    addHandlerInformationScroll(handler) {
        this._observerFunction(handler, this._informationObserved, this._informationCallback, 0.4);
    }
    // Abilities
    handleAbilitiesScroll(action) {
        this._abilitiesTitle.classList[action]('scroll');
    }
    _abilitiesCallback(handler, entries, _) {
        handler(entries[0].isIntersecting);
    }
    addHandlerAbilitiesScroll(handler) {
        this._observerFunction(handler, this._abilitiesObserved, this._abilitiesCallback, 0.1);
    }
    // Skins
    handleSkinsScroll(state) {
        this._skinsTitle.classList.add('scroll');
        setTimeout(()=>{
            this._skinsTitle.classList.remove('scroll');
        }, 400);
    }
    _skinsCallback(handler, entries, _) {
        handler(entries[0].isIntersecting);
    }
    addHandlerSkinsScroll(handler) {
        this._observerFunction(handler, this._skinsObserved, this._skinsCallback, 0.15);
    }
}
exports.default = new ScrollView();

},{"../config.js":"4Wc5b","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"gSyVI":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _configJs = require("../config.js");
var _smoothScrollSafariJs = require("../useful/smoothScrollSafari.js");
class AutoScrollView {
    _parentElement = _configJs.$('.main-header-about__list');
    _top = _configJs.$('.container');
    _scrollToTop = _configJs.$('.main-header__lol-symbol-link');
    _informationSection = _configJs.$('#information');
    _abilitiesSection = _configJs.$('#abilities');
    _skinsSection = _configJs.$('#skins');
    _ruinedSection = _configJs.$('#ruined');
    _gallerySection = _configJs.$('#gallery');
    _all = [
        this._informationSection,
        this._abilitiesSection,
        this._skinsSection,
        this._ruinedSection,
        this._gallerySection, 
    ];
    handleAutoScroll(id) {
        this._all[id].scrollIntoView({
            behavior: 'smooth'
        });
    }
    addHandlerAutoScroll(handler) {
        this._parentElement.addEventListener('click', function(event) {
            const target = event.target.closest('.scroll-auto');
            if (target) {
                event.preventDefault();
                handler(Number.parseInt(target.dataset.id));
            }
        });
    }
    handleScrollToTop() {
        this._top.scrollIntoView({
            behavior: 'smooth'
        });
    }
    addHandlerScrollToTop(handler) {
        this._scrollToTop.addEventListener('click', function(event) {
            event.preventDefault();
            handler();
        });
    }
}
exports.default = new AutoScrollView();

},{"../config.js":"4Wc5b","../useful/smoothScrollSafari.js":"bzzTD","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"bzzTD":[function(require,module,exports) {
// Smooth behavior supports Safari
!function() {
    function o1() {
        var o2 = window, t1 = document;
        if (!('scrollBehavior' in t1.documentElement.style && !0 !== o2.__forceSmoothScrollPolyfill__)) {
            var l1, e1 = o2.HTMLElement || o2.Element, r1 = 468, i = {
                scroll: o2.scroll || o2.scrollTo,
                scrollBy: o2.scrollBy,
                elementScroll: e1.prototype.scroll || n1,
                scrollIntoView: e1.prototype.scrollIntoView
            }, s = o2.performance && o2.performance.now ? o2.performance.now.bind(o2.performance) : Date.now, c = (l1 = o2.navigator.userAgent, new RegExp([
                'MSIE ',
                'Trident/',
                'Edge/'
            ].join('|')).test(l1) ? 1 : 0);
            o2.scroll = o2.scrollTo = function() {
                void 0 !== arguments[0] && (!0 !== f1(arguments[0]) ? h1.call(o2, t1.body, void 0 !== arguments[0].left ? ~~arguments[0].left : o2.scrollX || o2.pageXOffset, void 0 !== arguments[0].top ? ~~arguments[0].top : o2.scrollY || o2.pageYOffset) : i.scroll.call(o2, void 0 !== arguments[0].left ? arguments[0].left : 'object' != typeof arguments[0] ? arguments[0] : o2.scrollX || o2.pageXOffset, void 0 !== arguments[0].top ? arguments[0].top : void 0 !== arguments[1] ? arguments[1] : o2.scrollY || o2.pageYOffset));
            }, o2.scrollBy = function() {
                void 0 !== arguments[0] && (f1(arguments[0]) ? i.scrollBy.call(o2, void 0 !== arguments[0].left ? arguments[0].left : 'object' != typeof arguments[0] ? arguments[0] : 0, void 0 !== arguments[0].top ? arguments[0].top : void 0 !== arguments[1] ? arguments[1] : 0) : h1.call(o2, t1.body, ~~arguments[0].left + (o2.scrollX || o2.pageXOffset), ~~arguments[0].top + (o2.scrollY || o2.pageYOffset)));
            }, e1.prototype.scroll = e1.prototype.scrollTo = function() {
                if (void 0 !== arguments[0]) {
                    if (!0 !== f1(arguments[0])) {
                        var o = arguments[0].left, t = arguments[0].top;
                        h1.call(this, this, void 0 === o ? this.scrollLeft : ~~o, void 0 === t ? this.scrollTop : ~~t);
                    } else {
                        if ('number' == typeof arguments[0] && void 0 === arguments[1]) throw new SyntaxError('Value could not be converted');
                        i.elementScroll.call(this, void 0 !== arguments[0].left ? ~~arguments[0].left : 'object' != typeof arguments[0] ? ~~arguments[0] : this.scrollLeft, void 0 !== arguments[0].top ? ~~arguments[0].top : void 0 !== arguments[1] ? ~~arguments[1] : this.scrollTop);
                    }
                }
            }, e1.prototype.scrollBy = function() {
                void 0 !== arguments[0] && (!0 !== f1(arguments[0]) ? this.scroll({
                    left: ~~arguments[0].left + this.scrollLeft,
                    top: ~~arguments[0].top + this.scrollTop,
                    behavior: arguments[0].behavior
                }) : i.elementScroll.call(this, void 0 !== arguments[0].left ? ~~arguments[0].left + this.scrollLeft : ~~arguments[0] + this.scrollLeft, void 0 !== arguments[0].top ? ~~arguments[0].top + this.scrollTop : ~~arguments[1] + this.scrollTop));
            }, e1.prototype.scrollIntoView = function() {
                if (!0 !== f1(arguments[0])) {
                    var l3 = function(o) {
                        for(; o !== t1.body && !1 === (e = p1(l = o, 'Y') && a1(l, 'Y'), r = p1(l, 'X') && a1(l, 'X'), e || r);)o = o.parentNode || o.host;
                        var l, e, r;
                        return o;
                    }(this), e3 = l3.getBoundingClientRect(), r3 = this.getBoundingClientRect();
                    l3 !== t1.body ? (h1.call(this, l3, l3.scrollLeft + r3.left - e3.left, l3.scrollTop + r3.top - e3.top), 'fixed' !== o2.getComputedStyle(l3).position && o2.scrollBy({
                        left: e3.left,
                        top: e3.top,
                        behavior: 'smooth'
                    })) : o2.scrollBy({
                        left: r3.left,
                        top: r3.top,
                        behavior: 'smooth'
                    });
                } else i.scrollIntoView.call(this, void 0 === arguments[0] || arguments[0]);
            };
        }
        function n1(o, t) {
            this.scrollLeft = o, this.scrollTop = t;
        }
        function f1(o) {
            if (null === o || 'object' != typeof o || void 0 === o.behavior || 'auto' === o.behavior || 'instant' === o.behavior) return !0;
            if ('object' == typeof o && 'smooth' === o.behavior) return !1;
            throw new TypeError('behavior member of ScrollOptions ' + o.behavior + ' is not a valid value for enumeration ScrollBehavior.');
        }
        function p1(o, t) {
            return 'Y' === t ? o.clientHeight + c < o.scrollHeight : 'X' === t ? o.clientWidth + c < o.scrollWidth : void 0;
        }
        function a1(t, l) {
            var e = o2.getComputedStyle(t, null)['overflow' + l];
            return 'auto' === e || 'scroll' === e;
        }
        function d(t) {
            var l, e, i, c, n = (s() - t.startTime) / r1;
            c = n = n > 1 ? 1 : n, l = 0.5 * (1 - Math.cos(Math.PI * c)), e = t.startX + (t.x - t.startX) * l, i = t.startY + (t.y - t.startY) * l, t.method.call(t.scrollable, e, i), e === t.x && i === t.y || o2.requestAnimationFrame(d.bind(o2, t));
        }
        function h1(l, e, r) {
            var c, f, p, a, h = s();
            l === t1.body ? (c = o2, f = o2.scrollX || o2.pageXOffset, p = o2.scrollY || o2.pageYOffset, a = i.scroll) : (c = l, f = l.scrollLeft, p = l.scrollTop, a = n1), d({
                scrollable: c,
                method: a,
                startTime: h,
                startX: f,
                startY: p,
                x: e,
                y: r
            });
        }
    }
    module.exports = {
        polyfill: o1
    };
}();

},{}],"7a8dx":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _configJs = require("../../config.js");
class MainToastView {
    _parentElement = _configJs.$('#toast');
    _sectionToasts = _configJs.$$('.section');
    _timeClearToast = 5000;
    _generateMarkup({ type , title , content  }) {
        return `
      <div class="toast">
        <div class="toast-overlay ${type}"></div>
        <div class="toast-content">
          <div class="toast-content__left ${type}"></div>
          <div class="toast-content__center">
            <h1 class="toast-content__center-title">${title}</h1>
            <p class="toast-content__center-content">
              ${content}
            </p>
          </div>
          <div class="toast-content__right">
            <svg
              class="toast-content__right-icon ${type}"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path
                d="M5.293 6.707l5.293 5.293-5.293 5.293c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0l5.293-5.293 5.293 5.293c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-5.293-5.293 5.293-5.293c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-5.293 5.293-5.293-5.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414z"
              ></path>
            </svg>
          </div>
        </div>
      </div>
    `;
    }
    _render(data, type) {
        this._parentElement.insertAdjacentHTML('beforeend', this._generateMarkup(data[type]));
    }
    // Help toasts place reasonably
    _reRender() {
        _configJs.$$('.toast').forEach((item, index)=>{
            item.style.transform = `translateY(${index * 9.4}rem)`;
        });
    }
    _autoClear() {
        setTimeout(()=>{
            if (this._parentElement.firstElementChild) {
                this._parentElement.removeChild(this._parentElement.firstElementChild);
                this._reRender();
            }
        }, this._timeClearToast);
    }
    _clear(element) {
        this._parentElement.removeChild(element);
    }
    handleToast(data, type) {
        this._render(data, type);
        this._reRender();
        this._autoClear();
    }
    handleClearToast(target) {
        this._clear(target);
        this._reRender();
    }
    addClearToastHandler(handler) {
        _configJs.$('#toast').addEventListener('click', function(event) {
            if (!event.target.closest('.toast-content__right-icon')) return;
            handler(event.target.closest('.toast'));
        });
    }
    // Apply //
    // Initial load
    addToastHandler(handler) {
        window.addEventListener('load', function() {
            handler('welcome');
        });
    }
    // class 'section' is observed
    _sectionToastsCallback = function(handler, entries, observer) {
        const [entry] = entries;
        if (entry.isIntersecting) {
            handler(entry.target.dataset.section);
            observer.unobserve(entry.target);
        }
    };
    addObserverToastHandler(handler) {
        const observer = new IntersectionObserver(this._sectionToastsCallback.bind(null, handler), {
            root: null,
            threshold: 0.5
        });
        this._sectionToasts.forEach((item)=>{
            observer.observe(item);
        });
    }
    // Have no function //
    // This new section will be improved later
    // 1. Play for free button (Explore game)
    playForFree(handler) {
        _configJs.$('.trailer__content-button').addEventListener('click', function() {
            handler('oopsie');
        });
    }
    mainHeaderButton(handler) {
        _configJs.$('.main-header__play').addEventListener('click', function(event) {
            if (!event.target.closest('.main-header__play-sign')) return;
            handler('oopsie');
        });
    }
    championButton(handler) {
        _configJs.$('.champion-list').addEventListener('click', function() {
            handler('oopsie');
        });
    }
    exploreSkinsButton(handler) {
        _configJs.$('.skins_overlay__about-explore-btn').addEventListener('click', function() {
            handler('oopsie');
        });
    }
    downloadButtons(handler) {
        _configJs.$('.footer__1-content--3').addEventListener('click', function(event) {
            if (!event.target.closest('.footer__1-content--3-icon')) return;
            handler('oopsie');
        });
    }
    footer2(handler) {
        _configJs.$('.footer__2').addEventListener('click', function(event) {
            if (event.target.closest('.footer__2-content-link')) {
                event.preventDefault();
                handler('oopsie');
            }
        });
    }
    footer3Social(handler) {
        _configJs.$('.footer__3-social').addEventListener('click', function(event) {
            if (event.target.closest('.footer__3-social-link')) {
                event.preventDefault();
                handler('oopsie');
            }
        });
    }
    footer3Privacy(handler) {
        _configJs.$('.footer__3-privacy').addEventListener('click', function(event) {
            if (event.target.closest('.footer__3-privacy-link')) {
                event.preventDefault();
                handler('oopsie');
            }
        });
    }
    allGamesLeft(handler) {
        _configJs.$('.sb-ag-body__left').addEventListener('click', function(event) {
            if (event.target.closest('.sb-ag-body__left-link')) {
                event.preventDefault();
                handler('oopsie');
            }
        });
    }
    allGamesRight(handler) {
        _configJs.$('.sb-ag-body__right').addEventListener('click', function(event) {
            if (event.target.closest('.sb-ag-body__right-cover')) handler('oopsie');
        });
    }
    exploreGames(handler) {
        _configJs.$('.explore-games__body').addEventListener('click', function(event) {
            if (event.target.closest('.egbl-poster')) {
                event.preventDefault();
                handler('oopsie');
            }
        });
    }
}
exports.default = new MainToastView();

},{"../../config.js":"4Wc5b","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}]},["3LtEY","hfCYj"], "hfCYj", "parcelRequire7b33")

//# sourceMappingURL=index.94085ce0.js.map

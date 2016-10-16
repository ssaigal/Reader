/*!
 * @overview RSVP - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/tildeio/rsvp.js/master/LICENSE
 * @version   3.2.1
 */
"use strict";
(function() {
    function a(a) {
        return "function" == typeof a || "object" == typeof a && null !== a
    }

    function b(a) {
        return "function" == typeof a
    }

    function c(a) {
        return "object" == typeof a && null !== a
    }

    function d() {}

    function e(a, b) {
        for (var c = 0, d = a.length; d > c; c++)
            if (a[c] === b) return c;
        return -1
    }

    function f(a) {
        var b = a._promiseCallbacks;
        return b || (b = a._promiseCallbacks = {}), b
    }

    function g(a, b) {
        return "onerror" === a ? void wb.on("error", b) : 2 !== arguments.length ? wb[a] : void(wb[a] = b)
    }

    function h() {
        setTimeout(function() {
            for (var a, b = 0; b < xb.length; b++) {
                a = xb[b];
                var c = a.payload;
                c.guid = c.key + c.id, c.childGuid = c.key + c.childId, c.error && (c.stack = c.error.stack), wb.trigger(a.name, a.payload)
            }
            xb.length = 0
        }, 50)
    }

    function i(a, b, c) {
        1 === xb.push({
            name: a,
            payload: {
                key: b._guidKey,
                id: b._id,
                eventName: a,
                detail: b._result,
                childId: c && c._id,
                label: b._label,
                timeStamp: tb(),
                error: wb["instrument-with-stack"] ? new Error(b._label) : null
            }
        }) && h()
    }

    function j(a, b, c) {
        var d = this,
            e = d._state;
        if (e === Jb && !a || e === Kb && !b) return wb.instrument && yb("chained", d, d), d;
        d._onError = null;
        var f = new d.constructor(u, c),
            g = d._result;
        if (wb.instrument && yb("chained", d, f), e) {
            var h = arguments[e - 1];
            wb.async(function() {
                I(e, f, h, g)
            })
        } else E(d, f, a, b);
        return f
    }

    function k(a, b) {
        var c = this;
        if (a && "object" == typeof a && a.constructor === c) return a;
        var d = new c(u, b);
        return A(d, a), d
    }

    function l(a, b, c) {
        return a === Jb ? {
            state: "fulfilled",
            value: c
        } : {
            state: "rejected",
            reason: c
        }
    }

    function m(a, b, c, d) {
        this._instanceConstructor = a, this.promise = new a(u, d), this._abortOnReject = c, this._validateInput(b) ? (this._input = b, this.length = b.length,
            this._remaining = b.length, this._init(), 0 === this.length ? C(this.promise, this._result) : (this.length = this.length || 0, this._enumerate(),
        0 === this._remaining && C(this.promise, this._result))) : D(this.promise, this._validationError())
    }

    function n(a, b) {
        return new Bb(this, a, !0, b).promise
    }

    function o(a, b) {
        function c(a) {
            A(f, a)
        }

        function d(a) {
            D(f, a)
        }
        var e = this,
            f = new e(u, b);
        if (!sb(a)) return D(f, new TypeError("You must pass an array to race.")), f;
        for (var g = a.length, h = 0; f._state === Ib && g > h; h++) E(e.resolve(a[h]), void 0, c, d);
        return f
    }

    function p(a, b) {
        var c = this,
            d = new c(u, b);
        return D(d, a), d
    }

    function q() {
        throw new TypeError("You must pass a resolver function as the first argument to the promise constructor")
    }

    function r() {
        throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.")
    }

    function s(a, b) {
        this._id = Gb++, this._label = b, this._state = void 0, this._result = void 0, this._subscribers = [], wb.instrument && yb("created", this), u !==
        a && ("function" != typeof a && q(), this instanceof s ? J(this, a) : r())
    }

    function t() {
        return new TypeError("A promises callback cannot return that same promise.")
    }

    function u() {}

    function v(a) {
        try {
            return a.then
        } catch (b) {
            return Lb.error = b, Lb
        }
    }

    function w(a, b, c, d) {
        try {
            a.call(b, c, d)
        } catch (e) {
            return e
        }
    }

    function x(a, b, c) {
        wb.async(function(a) {
            var d = !1,
                e = w(c, b, function(c) {
                    d || (d = !0, b !== c ? A(a, c, void 0) : C(a, c))
                }, function(b) {
                    d || (d = !0, D(a, b))
                }, "Settle: " + (a._label || " unknown promise"));
            !d && e && (d = !0, D(a, e))
        }, a)
    }

    function y(a, b) {
        b._state === Jb ? C(a, b._result) : b._state === Kb ? (b._onError = null, D(a, b._result)) : E(b, void 0, function(c) {
            b !== c ? A(a, c, void 0) : C(a, c)
        }, function(b) {
            D(a, b)
        })
    }

    function z(a, c, d) {
        c.constructor === a.constructor && d === zb && constructor.resolve === Ab ? y(a, c) : d === Lb ? D(a, Lb.error) : void 0 === d ? C(a, c) : b(d) ? x(
            a, c, d) : C(a, c)
    }

    function A(b, c) {
        b === c ? C(b, c) : a(c) ? z(b, c, v(c)) : C(b, c)
    }

    function B(a) {
        a._onError && a._onError(a._result), F(a)
    }

    function C(a, b) {
        a._state === Ib && (a._result = b, a._state = Jb, 0 === a._subscribers.length ? wb.instrument && yb("fulfilled", a) : wb.async(F, a))
    }

    function D(a, b) {
        a._state === Ib && (a._state = Kb, a._result = b, wb.async(B, a))
    }

    function E(a, b, c, d) {
        var e = a._subscribers,
            f = e.length;
        a._onError = null, e[f] = b, e[f + Jb] = c, e[f + Kb] = d, 0 === f && a._state && wb.async(F, a)
    }

    function F(a) {
        var b = a._subscribers,
            c = a._state;
        if (wb.instrument && yb(c === Jb ? "fulfilled" : "rejected", a), 0 !== b.length) {
            for (var d, e, f = a._result, g = 0; g < b.length; g += 3) d = b[g], e = b[g + c], d ? I(c, d, e, f) : e(f);
            a._subscribers.length = 0
        }
    }

    function G() {
        this.error = null
    }

    function H(a, b) {
        try {
            return a(b)
        } catch (c) {
            return Mb.error = c, Mb
        }
    }

    function I(a, c, d, e) {
        var f, g, h, i, j = b(d);
        if (j) {
            if (f = H(d, e), f === Mb ? (i = !0, g = f.error, f = null) : h = !0, c === f) return void D(c, t())
        } else f = e, h = !0;
        c._state !== Ib || (j && h ? A(c, f) : i ? D(c, g) : a === Jb ? C(c, f) : a === Kb && D(c, f))
    }

    function J(a, b) {
        var c = !1;
        try {
            b(function(b) {
                c || (c = !0, A(a, b))
            }, function(b) {
                c || (c = !0, D(a, b))
            })
        } catch (d) {
            D(a, d)
        }
    }

    function K(a, b, c) {
        this._superConstructor(a, b, !1, c)
    }

    function L(a, b) {
        return new K(Hb, a, b).promise
    }

    function M(a, b) {
        return Hb.all(a, b)
    }

    function N(a, b) {
        Yb[Rb] = a, Yb[Rb + 1] = b, Rb += 2, 2 === Rb && Ob()
    }

    function O() {
        var a = process.nextTick,
            b = process.versions.node.match(/^(?:(\d+)\.)?(?:(\d+)\.)?(\*|\d+)$/);
        return Array.isArray(b) && "0" === b[1] && "10" === b[2] && (a = setImmediate),
            function() {
                a(T)
            }
    }

    function P() {
        return function() {
            Nb(T)
        }
    }

    function Q() {
        var a = 0,
            b = new Vb(T),
            c = document.createTextNode("");
        return b.observe(c, {
            characterData: !0
        }),
            function() {
                c.data = a = ++a % 2
            }
    }

    function R() {
        var a = new MessageChannel;
        return a.port1.onmessage = T,
            function() {
                a.port2.postMessage(0)
            }
    }

    function S() {
        return function() {
            setTimeout(T, 1)
        }
    }

    function T() {
        for (var a = 0; Rb > a; a += 2) {
            var b = Yb[a],
                c = Yb[a + 1];
            b(c), Yb[a] = void 0, Yb[a + 1] = void 0
        }
        Rb = 0
    }

    function U() {
        try {
            var a = require,
                b = a("vertx");
            return Nb = b.runOnLoop || b.runOnContext, P()
        } catch (c) {
            return S()
        }
    }

    function V(a) {
        var b = {};
        return b.promise = new Hb(function(a, c) {
            b.resolve = a, b.reject = c
        }, a), b
    }

    function W(a, c, d) {
        return Hb.all(a, d).then(function(a) {
            if (!b(c)) throw new TypeError("You must pass a function as filter's second argument.");
            for (var e = a.length, f = new Array(e), g = 0; e > g; g++) f[g] = c(a[g]);
            return Hb.all(f, d).then(function(b) {
                for (var c = new Array(e), d = 0, f = 0; e > f; f++) b[f] && (c[d] = a[f], d++);
                return c.length = d, c
            })
        })
    }

    function X(a, b, c) {
        this._superConstructor(a, b, !0, c)
    }

    function Y(a, b, c) {
        this._superConstructor(a, b, !1, c)
    }

    function Z(a, b) {
        return new Y(Hb, a, b).promise
    }

    function $(a, b) {
        return new _b(Hb, a, b).promise
    }

    function _(a, c, d) {
        return Hb.all(a, d).then(function(a) {
            if (!b(c)) throw new TypeError("You must pass a function as map's second argument.");
            for (var e = a.length, f = new Array(e), g = 0; e > g; g++) f[g] = c(a[g]);
            return Hb.all(f, d)
        })
    }

    function ab() {
        this.value = void 0
    }

    function bb(a) {
        try {
            return a.then
        } catch (b) {
            return ec.value = b, ec
        }
    }

    function cb(a, b, c) {
        try {
            a.apply(b, c)
        } catch (d) {
            return ec.value = d, ec
        }
    }

    function db(a, b) {
        for (var c, d, e = {}, f = a.length, g = new Array(f), h = 0; f > h; h++) g[h] = a[h];
        for (d = 0; d < b.length; d++) c = b[d], e[c] = g[d + 1];
        return e
    }

    function eb(a) {
        for (var b = a.length, c = new Array(b - 1), d = 1; b > d; d++) c[d - 1] = a[d];
        return c
    }

    function fb(a, b) {
        return {
            then: function(c, d) {
                return a.call(b, c, d)
            }
        }
    }

    function gb(a, b) {
        var c = function() {
            for (var c, d = this, e = arguments.length, f = new Array(e + 1), g = !1, h = 0; e > h; ++h) {
                if (c = arguments[h], !g) {
                    if (g = jb(c), g === fc) {
                        var i = new Hb(u);
                        return D(i, fc.value), i
                    }
                    g && g !== !0 && (c = fb(g, c))
                }
                f[h] = c
            }
            var j = new Hb(u);
            return f[e] = function(a, c) {
                a ? D(j, a) : void 0 === b ? A(j, c) : b === !0 ? A(j, eb(arguments)) : sb(b) ? A(j, db(arguments, b)) : A(j, c)
            }, g ? ib(j, f, a, d) : hb(j, f, a, d)
        };
        return c.__proto__ = a, c
    }

    function hb(a, b, c, d) {
        var e = cb(c, d, b);
        return e === ec && D(a, e.value), a
    }

    function ib(a, b, c, d) {
        return Hb.all(b).then(function(b) {
            var e = cb(c, d, b);
            return e === ec && D(a, e.value), a
        })
    }

    function jb(a) {
        return a && "object" == typeof a ? a.constructor === Hb ? !0 : bb(a) : !1
    }

    function kb(a, b) {
        return Hb.race(a, b)
    }

    function lb(a, b) {
        return Hb.reject(a, b)
    }

    function mb(a, b) {
        return Hb.resolve(a, b)
    }

    function nb(a) {
        throw setTimeout(function() {
            throw a
        }), a
    }

    function ob(a, b) {
        wb.async(a, b)
    }

    function pb() {
        wb.on.apply(wb, arguments)
    }

    function qb() {
        wb.off.apply(wb, arguments)
    }
    var rb;
    rb = Array.isArray ? Array.isArray : function(a) {
        return "[object Array]" === Object.prototype.toString.call(a)
    };
    var sb = rb,
        tb = Date.now || function() {
                return (new Date).getTime()
            },
        ub = Object.create || function(a) {
                if (arguments.length > 1) throw new Error("Second argument not supported");
                if ("object" != typeof a) throw new TypeError("Argument must be an object");
                return d.prototype = a, new d
            },
        vb = {
            mixin: function(a) {
                return a.on = this.on, a.off = this.off, a.trigger = this.trigger, a._promiseCallbacks = void 0, a
            },
            on: function(a, b) {
                if ("function" != typeof b) throw new TypeError("Callback must be a function");
                var c, d = f(this);
                c = d[a], c || (c = d[a] = []), -1 === e(c, b) && c.push(b)
            },
            off: function(a, b) {
                var c, d, g = f(this);
                return b ? (c = g[a], d = e(c, b), void(-1 !== d && c.splice(d, 1))) : void(g[a] = [])
            },
            trigger: function(a, b, c) {
                var d, e, g = f(this);
                if (d = g[a])
                    for (var h = 0; h < d.length; h++)(e = d[h])(b, c)
            }
        },
        wb = {
            instrument: !1
        };
    vb.mixin(wb);
    var xb = [],
        yb = i,
        zb = j,
        Ab = k,
        Bb = m;
    m.prototype._validateInput = function(a) {
        return sb(a)
    }, m.prototype._validationError = function() {
        return new Error("Array Methods must be provided an Array")
    }, m.prototype._init = function() {
        this._result = new Array(this.length)
    }, m.prototype._enumerate = function() {
        for (var a = this.length, b = this.promise, c = this._input, d = 0; b._state === Ib && a > d; d++) this._eachEntry(c[d], d)
    }, m.prototype._settleMaybeThenable = function(a, b) {
        var c = this._instanceConstructor,
            d = c.resolve;
        if (d === Ab) {
            var e = v(a);
            if (e === zb && a._state !== Ib) a._onError = null, this._settledAt(a._state, b, a._result);
            else if ("function" != typeof e) this._remaining--, this._result[b] = this._makeResult(Jb, b, a);
            else if (c === Hb) {
                var f = new c(u);
                z(f, a, e), this._willSettleAt(f, b)
            } else this._willSettleAt(new c(function(b) {
                b(a)
            }), b)
        } else this._willSettleAt(d(a), b)
    }, m.prototype._eachEntry = function(a, b) {
        c(a) ? this._settleMaybeThenable(a, b) : (this._remaining--, this._result[b] = this._makeResult(Jb, b, a))
    }, m.prototype._settledAt = function(a, b, c) {
        var d = this.promise;
        d._state === Ib && (this._remaining--, this._abortOnReject && a === Kb ? D(d, c) : this._result[b] = this._makeResult(a, b, c)), 0 === this._remaining &&
        C(d, this._result)
    }, m.prototype._makeResult = function(a, b, c) {
        return c
    }, m.prototype._willSettleAt = function(a, b) {
        var c = this;
        E(a, void 0, function(a) {
            c._settledAt(Jb, b, a)
        }, function(a) {
            c._settledAt(Kb, b, a)
        })
    };
    var Cb = n,
        Db = o,
        Eb = p,
        Fb = "rsvp_" + tb() + "-",
        Gb = 0,
        Hb = s;
    s.cast = Ab, s.all = Cb, s.race = Db, s.resolve = Ab, s.reject = Eb, s.prototype = {
        constructor: s,
        _guidKey: Fb,
        _onError: function(a) {
            var b = this;
            wb.after(function() {
                b._onError && wb.trigger("error", a, b._label)
            })
        },
        then: zb,
        "catch": function(a, b) {
            return this.then(void 0, a, b)
        },
        "finally": function(a, b) {
            var c = this,
                d = c.constructor;
            return c.then(function(b) {
                return d.resolve(a()).then(function() {
                    return b
                })
            }, function(b) {
                return d.resolve(a()).then(function() {
                    return d.reject(b)
                })
            }, b)
        }
    };
    var Ib = void 0,
        Jb = 1,
        Kb = 2,
        Lb = new G,
        Mb = new G;
    K.prototype = ub(Bb.prototype), K.prototype._superConstructor = Bb, K.prototype._makeResult = l, K.prototype._validationError = function() {
        return new Error("allSettled must be called with an array")
    };
    var Nb, Ob, Pb = L,
        Qb = M,
        Rb = 0,
        Sb = ({}.toString, N),
        Tb = "undefined" != typeof window ? window : void 0,
        Ub = Tb || {},
        Vb = Ub.MutationObserver || Ub.WebKitMutationObserver,
        Wb = "undefined" == typeof self && "undefined" != typeof process && "[object process]" === {}.toString.call(process),
        Xb = "undefined" != typeof Uint8ClampedArray && "undefined" != typeof importScripts && "undefined" != typeof MessageChannel,
        Yb = new Array(1e3);
    Ob = Wb ? O() : Vb ? Q() : Xb ? R() : void 0 === Tb && "function" == typeof require ? U() : S();
    var Zb = V,
        $b = W,
        _b = X;
    X.prototype = ub(Bb.prototype), X.prototype._superConstructor = Bb, X.prototype._init = function() {
        this._result = {}
    }, X.prototype._validateInput = function(a) {
        return a && "object" == typeof a
    }, X.prototype._validationError = function() {
        return new Error("Promise.hash must be called with an object")
    }, X.prototype._enumerate = function() {
        var a = this,
            b = a.promise,
            c = a._input,
            d = [];
        for (var e in c) b._state === Ib && Object.prototype.hasOwnProperty.call(c, e) && d.push({
            position: e,
            entry: c[e]
        });
        var f = d.length;
        a._remaining = f;
        for (var g, h = 0; b._state === Ib && f > h; h++) g = d[h], a._eachEntry(g.entry, g.position)
    }, Y.prototype = ub(_b.prototype), Y.prototype._superConstructor = Bb, Y.prototype._makeResult = l, Y.prototype._validationError = function() {
        return new Error("hashSettled must be called with an object")
    };
    var ac, bc = Z,
        cc = $,
        dc = _,
        ec = new ab,
        fc = new ab,
        gc = gb;
    if ("object" == typeof self) ac = self;
    else {
        if ("object" != typeof global) throw new Error("no global: `self` or `global` found");
        ac = global
    }
    var hc = ac,
        ic = kb,
        jc = lb,
        kc = mb,
        lc = nb;
    wb.async = Sb, wb.after = function(a) {
        setTimeout(a, 0)
    };
    if ("undefined" != typeof window && "object" == typeof window.__PROMISE_INSTRUMENTATION__) {
        var mc = window.__PROMISE_INSTRUMENTATION__;
        g("instrument", !0);
        for (var nc in mc) mc.hasOwnProperty(nc) && pb(nc, mc[nc])
    }
    var oc = {
        race: ic,
        Promise: Hb,
        allSettled: Pb,
        hash: cc,
        hashSettled: bc,
        denodeify: gc,
        on: pb,
        off: qb,
        map: dc,
        filter: $b,
        resolve: kc,
        reject: jc,
        all: Qb,
        rethrow: lc,
        defer: Zb,
        EventTarget: vb,
        configure: g,
        async: ob
    };
    "function" == typeof define && define.amd ? define(function() {
        return oc
    }) : "undefined" != typeof module && module.exports ? module.exports = oc : "undefined" != typeof hc && (hc.RSVP = oc)
}).call(this);
var EPUBJS = EPUBJS || {};
EPUBJS.VERSION = "0.2.14", EPUBJS.plugins = EPUBJS.plugins || {}, EPUBJS.filePath = EPUBJS.filePath || "/epubjs/", EPUBJS.Render = {},
    function(a) {
        var b = (a.ePub || {}, a.ePub = function() {
            var a, b;
            return "undefined" != typeof arguments[0] && ("string" == typeof arguments[0] || arguments[0] instanceof ArrayBuffer) && (a = arguments[0],
                arguments[1] && "object" == typeof arguments[1] ? (b = arguments[1], b.bookPath = a) : b = {
                    bookPath: a
                }), !arguments[0] || "object" != typeof arguments[0] || arguments[0] instanceof ArrayBuffer || (b = arguments[0]), new EPUBJS.Book(
                b)
        });
        "function" == typeof define && define.amd ? define(["rsvp", "jszip", "localforage"], function() {
            return b
        }) : "undefined" != typeof module && module.exports && (global.RSVP = require("rsvp"), global.JSZip = require("jszip"), global.localForage =
            require("localforage"), module.exports = b)
    }(window), EPUBJS.Book = function(a) {
    this.settings = EPUBJS.core.defaults(a || {}, {
        bookPath: void 0,
        bookKey: void 0,
        packageUrl: void 0,
        storage: !1,
        fromStorage: !1,
        saved: !1,
        online: !0,
        contained: !1,
        width: void 0,
        height: void 0,
        layoutOveride: void 0,
        orientation: void 0,
        minSpreadWidth: 768,
        gap: "auto",
        version: 1,
        restore: !1,
        reload: !1,
        "goto": !1,
        styles: {},
        headTags: {},
        withCredentials: !1,
        render_method: "Iframe"
    }), this.settings.EPUBJSVERSION = EPUBJS.VERSION, this.spinePos = 0, this.stored = !1, this.online = this.settings.online || navigator.onLine, this
        .networkListeners(), this.ready = {
        manifest: new RSVP.defer,
        spine: new RSVP.defer,
        metadata: new RSVP.defer,
        cover: new RSVP.defer,
        toc: new RSVP.defer,
        pageList: new RSVP.defer
    }, this.readyPromises = [this.ready.manifest.promise, this.ready.spine.promise, this.ready.metadata.promise, this.ready.cover.promise, this.ready.toc
        .promise
    ], this.pageList = [], this.pagination = new EPUBJS.Pagination, this.pageListReady = this.ready.pageList.promise, this.ready.all = RSVP.all(this.readyPromises),
        this.ready.all.then(this._ready.bind(this)), this.isRendered = !1, this._q = EPUBJS.core.queue(this), this._rendering = !1, this._displayQ = EPUBJS
        .core.queue(this), this._moving = !1, this._gotoQ = EPUBJS.core.queue(this), this.renderer = new EPUBJS.Renderer(this.settings.render_method), this
        .renderer.setMinSpreadWidth(this.settings.minSpreadWidth), this.renderer.setGap(this.settings.gap), this.listenToRenderer(this.renderer), this.defer_opened =
        new RSVP.defer, this.opened = this.defer_opened.promise, this.store = !1, this.settings.storage !== !1 && this.fromStorage(!0), ("string" == typeof this
        .settings.bookPath || this.settings.bookPath instanceof ArrayBuffer) && this.open(this.settings.bookPath, this.settings.reload), window.addEventListener(
        "beforeunload", this.unload.bind(this), !1)
}, EPUBJS.Book.prototype.open = function(a, b) {
    var c, d = this,
        e = new RSVP.defer;
    return this.settings.bookPath = a, this.settings.contained || this.isContained(a) ? (this.settings.contained = this.contained = !0, this.bookUrl = "",
        c = this.unarchive(a).then(function() {
            return d.loadPackage()
        })) : (this.bookUrl = this.urlFrom(a), c = this.loadPackage()), c.then(this.settings.restore && !b && localStorage ? function(a) {
        var b = d.packageIdentifier(a),
            c = d.restore(b);
        c || d.unpack(a), e.resolve(), d.defer_opened.resolve()
    } : function(a) {
        d.unpack(a), e.resolve(), d.defer_opened.resolve()
    }), this._registerReplacements(this.renderer), e.promise
}, EPUBJS.Book.prototype.loadPackage = function(a) {
    var b, c = this,
        d = new EPUBJS.Parser,
        e = a || "META-INF/container.xml";
    return b = this.settings.packageUrl ? c.loadXml(c.settings.packageUrl) : c.loadXml(c.bookUrl + e).then(function(a) {
        return d.container(a)
    }).then(function(a) {
        return c.settings.contentsPath = c.bookUrl + a.basePath, c.settings.packageUrl = c.bookUrl + a.packagePath, c.settings.encoding = a.encoding,
            c.loadXml(c.settings.packageUrl)
    }), b.catch(function() {
        console.error("Could not load book at: " + e), c.trigger("book:loadFailed", e)
    }), b
}, EPUBJS.Book.prototype.packageIdentifier = function(a) {
    var b = new EPUBJS.Parser;
    return b.identifier(a)
}, EPUBJS.Book.prototype.unpack = function(a) {
    var b = this,
        c = new EPUBJS.Parser;
    b.contents = c.packageContents(a, b.settings.contentsPath), b.manifest = b.contents.manifest, b.spine = b.contents.spine, b.spineIndexByURL = b.contents
        .spineIndexByURL, b.metadata = b.contents.metadata, b.settings.bookKey || (b.settings.bookKey = b.generateBookKey(b.metadata.identifier)), b.globalLayoutProperties =
        b.parseLayoutProperties(b.metadata), b.contents.coverPath && (b.cover = b.contents.cover = b.settings.contentsPath + b.contents.coverPath), b.spineNodeIndex =
        b.contents.spineNodeIndex, b.ready.manifest.resolve(b.contents.manifest), b.ready.spine.resolve(b.contents.spine), b.ready.metadata.resolve(b.contents
        .metadata), b.ready.cover.resolve(b.contents.cover), b.locations = new EPUBJS.Locations(b.spine, b.store, b.settings.withCredentials), b.contents
        .navPath ? (b.settings.navUrl = b.settings.contentsPath + b.contents.navPath, b.loadXml(b.settings.navUrl).then(function(a) {
        return c.nav(a, b.spineIndexByURL, b.spine)
    }).then(function(a) {
        b.toc = b.contents.toc = a, b.ready.toc.resolve(b.contents.toc)
    }, function() {
        b.ready.toc.resolve(!1)
    }), b.loadXml(b.settings.navUrl).then(function(a) {
        return c.pageList(a, b.spineIndexByURL, b.spine)
    }).then(function(a) {
        var c = new EPUBJS.EpubCFI,
            d = 0;
        0 !== a.length && (b.pageList = b.contents.pageList = a, b.pageList.forEach(function(a) {
            a.cfi || (d += 1, c.generateCfiFromHref(a.href, b).then(function(c) {
                a.cfi = c, a.packageUrl = b.settings.packageUrl, d -= 1, 0 === d && (b.pagination.process(b.pageList),
                    b.ready.pageList.resolve(b.pageList))
            }))
        }), d || (b.pagination.process(b.pageList), b.ready.pageList.resolve(b.pageList)))
    }, function() {
        b.ready.pageList.resolve([])
    })) : b.contents.tocPath ? (b.settings.tocUrl = b.settings.contentsPath + b.contents.tocPath, b.loadXml(b.settings.tocUrl).then(function(a) {
        return c.toc(a, b.spineIndexByURL, b.spine)
    }, function(a) {
        console.error(a)
    }).then(function(a) {
        b.toc = b.contents.toc = a, b.ready.toc.resolve(b.contents.toc)
    }, function() {
        b.ready.toc.resolve(!1)
    })) : b.ready.toc.resolve(!1)
}, EPUBJS.Book.prototype.createHiddenRender = function(a, b, c) {
    var d, e, f = this.element.getBoundingClientRect(),
        g = b || this.settings.width || f.width,
        h = c || this.settings.height || f.height;
    return a.setMinSpreadWidth(this.settings.minSpreadWidth), a.setGap(this.settings.gap), this._registerReplacements(a), this.settings.forceSingle && a.forceSingle(!
        0), d = document.createElement("div"), d.style.visibility = "hidden", d.style.overflow = "hidden", d.style.width = "0", d.style.height = "0",
        this.element.appendChild(d), e = document.createElement("div"), e.style.visibility = "hidden", e.style.overflow = "hidden", e.style.width = g +
        "px", e.style.height = h + "px", d.appendChild(e), a.initialize(e, this.settings.width, this.settings.height), d
}, EPUBJS.Book.prototype.generatePageList = function(a, b, c) {
    {
        var d = [],
            e = new EPUBJS.Renderer(this.settings.render_method, !1),
            f = this.createHiddenRender(e, a, b),
            g = new RSVP.defer,
            h = -1,
            i = this.spine.length,
            j = 0,
            k = function(a) {
                var b, g = h + 1,
                    l = a || new RSVP.defer;
                if (g >= i) l.resolve();
                else {
                    if (c && c.cancelled) return e.remove(), this.element.removeChild(f), void l.reject(new Error("User cancelled"));
                    h = g, b = new EPUBJS.Chapter(this.spine[h], this.store), e.displayChapter(b, this.globalLayoutProperties).then(function() {
                        e.pageMap.forEach(function(a) {
                            j += 1, d.push({
                                cfi: a.start,
                                page: j
                            })
                        }), e.pageMap.length % 2 > 0 && e.spreads && (j += 1, d.push({
                            cfi: e.pageMap[e.pageMap.length - 1].end,
                            page: j
                        })), setTimeout(function() {
                            k(l)
                        }, 1)
                    })
                }
                return l.promise
            }.bind(this);
        k().then(function() {
            e.remove(), this.element.removeChild(f), g.resolve(d)
        }.bind(this), function(a) {
            g.reject(a)
        })
    }
    return g.promise
}, EPUBJS.Book.prototype.generatePagination = function(a, b, c) {
    var d = this,
        e = new RSVP.defer;
    return this.ready.spine.promise.then(function() {
        d.generatePageList(a, b, c).then(function(a) {
            d.pageList = d.contents.pageList = a, d.pagination.process(a), d.ready.pageList.resolve(d.pageList), e.resolve(d.pageList)
        }, function(a) {
            e.reject(a)
        })
    }), e.promise
}, EPUBJS.Book.prototype.loadPagination = function(a) {
    var b;
    return b = "string" == typeof a ? JSON.parse(a) : a, b && b.length && (this.pageList = b, this.pagination.process(this.pageList), this.ready.pageList.resolve(
        this.pageList)), this.pageList
}, EPUBJS.Book.prototype.getPageList = function() {
    return this.ready.pageList.promise
}, EPUBJS.Book.prototype.getMetadata = function() {
    return this.ready.metadata.promise
}, EPUBJS.Book.prototype.getToc = function() {
    return this.ready.toc.promise
}, EPUBJS.Book.prototype.networkListeners = function() {
    var a = this;
    window.addEventListener("offline", function() {
        a.online = !1, a.settings.storage && a.fromStorage(!0), a.trigger("book:offline")
    }, !1), window.addEventListener("online", function() {
        a.online = !0, a.settings.storage && a.fromStorage(!1), a.trigger("book:online")
    }, !1)
}, EPUBJS.Book.prototype.listenToRenderer = function(a) {
    var b = this;
    a.Events.forEach(function(c) {
        a.on(c, function(a) {
            b.trigger(c, a)
        })
    }), a.on("renderer:visibleRangeChanged", function(a) {
        var b, c, d, e = [];
        this.pageList.length > 0 && (b = this.pagination.pageFromCfi(a.start), d = this.pagination.percentageFromPage(b), e.push(b), a.end && (c =
            this.pagination.pageFromCfi(a.end), e.push(c)), this.trigger("book:pageChanged", {
            anchorPage: b,
            percentage: d,
            pageRange: e
        }))
    }.bind(this)), a.on("render:loaded", this.loadChange.bind(this))
}, EPUBJS.Book.prototype.loadChange = function(a) {
    var b, c, d = EPUBJS.core.uri(a),
        e = EPUBJS.core.uri(this.currentChapter.absolute);
    d.path != e.path ? (console.warn("Miss Match", d.path, this.currentChapter.absolute), b = this.spineIndexByURL[d.filename], c = new EPUBJS.Chapter(this
        .spine[b], this.store), this.currentChapter = c, this.renderer.currentChapter = c, this.renderer.afterLoad(this.renderer.render.docEl),
        this.renderer.beforeDisplay(function() {
            this.renderer.afterDisplay()
        }.bind(this))) : this._rendering || this.renderer.reformat()
}, EPUBJS.Book.prototype.unlistenToRenderer = function(a) {
    a.Events.forEach(function(b) {
        a.off(b)
    })
}, EPUBJS.Book.prototype.coverUrl = function() {
    var a = this.ready.cover.promise.then(function() {
        return this.settings.fromStorage ? this.store.getUrl(this.contents.cover) : this.settings.contained ? this.zip.getUrl(this.contents.cover) :
            this.contents.cover
    }.bind(this));
    return a.then(function(a) {
        this.cover = a
    }.bind(this)), a
}, EPUBJS.Book.prototype.loadXml = function(a) {
    return this.settings.fromStorage ? this.store.getXml(a, this.settings.encoding) : this.settings.contained ? this.zip.getXml(a, this.settings.encoding) :
        EPUBJS.core.request(a, "xml", this.settings.withCredentials)
}, EPUBJS.Book.prototype.urlFrom = function(a) {
    var b, c = EPUBJS.core.uri(a),
        d = c.protocol,
        e = "/" == c.path[0],
        f = window.location,
        g = f.origin || f.protocol + "//" + f.host,
        h = document.getElementsByTagName("base");
    return h.length && (b = h[0].href), c.protocol ? c.origin + c.path : !d && e ? (b || g) + c.path : d || e ? void 0 : EPUBJS.core.resolveUrl(b || f.pathname,
        c.path)
}, EPUBJS.Book.prototype.unarchive = function(a) {
    return this.zip = new EPUBJS.Unarchiver, this.store = this.zip, this.zip.open(a)
}, EPUBJS.Book.prototype.isContained = function(a) {
    if (a instanceof ArrayBuffer) return !0;
    var b = EPUBJS.core.uri(a);
    return !b.extension || "epub" != b.extension && "zip" != b.extension ? !1 : !0
}, EPUBJS.Book.prototype.isSaved = function(a) {
    var b;
    return localStorage ? (b = localStorage.getItem(a), localStorage && null !== b ? !0 : !1) : !1
}, EPUBJS.Book.prototype.generateBookKey = function(a) {
    return "epubjs:" + EPUBJS.VERSION + ":" + window.location.host + ":" + a
}, EPUBJS.Book.prototype.saveContents = function() {
    return localStorage ? void localStorage.setItem(this.settings.bookKey, JSON.stringify(this.contents)) : !1
}, EPUBJS.Book.prototype.removeSavedContents = function() {
    return localStorage ? void localStorage.removeItem(this.settings.bookKey) : !1
}, EPUBJS.Book.prototype.renderTo = function(a) {
    var b, c = this;
    if (EPUBJS.core.isElement(a)) this.element = a;
    else {
        if ("string" != typeof a) return void console.error("Not an Element");
        this.element = EPUBJS.core.getEl(a)
    }
    return b = this.opened.then(function() {
        return c.renderer.initialize(c.element, c.settings.width, c.settings.height), c.metadata.direction && c.renderer.setDirection(c.metadata.direction),
            c._rendered(), c.startDisplay()
    })
}, EPUBJS.Book.prototype.startDisplay = function() {
    var a;
    return a = this.settings.goto ? this.goto(this.settings.goto) : this.settings.previousLocationCfi ? this.gotoCfi(this.settings.previousLocationCfi) :
        this.displayChapter(this.spinePos)
}, EPUBJS.Book.prototype.restore = function(a) {
    var b, c = this,
        d = ["manifest", "spine", "metadata", "cover", "toc", "spineNodeIndex", "spineIndexByURL", "globalLayoutProperties"],
        e = !1,
        f = this.generateBookKey(a),
        g = localStorage.getItem(f),
        h = d.length;
    if (this.settings.clearSaved && (e = !0), !e && "undefined" != g && null !== g)
        for (c.contents = JSON.parse(g), b = 0; h > b; b++) {
            var i = d[b];
            if (!c.contents[i]) {
                e = !0;
                break
            }
            c[i] = c.contents[i]
        }
    return !e && g && this.contents && this.settings.contentsPath ? (this.settings.bookKey = f, this.ready.manifest.resolve(this.manifest), this.ready.spine
        .resolve(this.spine), this.ready.metadata.resolve(this.metadata), this.ready.cover.resolve(this.cover), this.ready.toc.resolve(this.toc), !0) :
        !1
}, EPUBJS.Book.prototype.displayChapter = function(a, b, c) {
    var d, e, f, g, h = this,
        i = c || new RSVP.defer;
    return this.isRendered ? this._rendering || this.renderer._moving ? (this._displayQ.enqueue("displayChapter", [a, b, i]), i.promise) : (EPUBJS.core.isNumber(
        a) ? f = a : (e = new EPUBJS.EpubCFI(a), f = e.spinePos), (0 > f || f >= this.spine.length) && (console.warn("Not A Valid Location"), f = 0,
        b = !1, e = !1), g = new EPUBJS.Chapter(this.spine[f], this.store), this._rendering = !0, this._needsAssetReplacement() && g.registerHook(
        "beforeChapterRender", [EPUBJS.replace.head, EPUBJS.replace.resources, EPUBJS.replace.svg], !0), h.currentChapter = g, d = h.renderer.displayChapter(
        g, this.globalLayoutProperties), e ? h.renderer.gotoCfi(e) : b && h.renderer.lastPage(), d.then(function() {
        h.spinePos = f, i.resolve(h.renderer), h.settings.fromStorage === !1 && h.settings.contained === !1 && h.preloadNextChapter(), h._rendering = !
            1, h._displayQ.dequeue(), 0 === h._displayQ.length() && h._gotoQ.dequeue()
    }, function(a) {
        console.error("Could not load Chapter: " + g.absolute, a), h.trigger("book:chapterLoadFailed", g.absolute), h._rendering = !1, i.reject(
            a)
    }), i.promise) : (this._q.enqueue("displayChapter", arguments), i.reject({
        message: "Rendering",
        stack: (new Error).stack
    }), i.promise)
}, EPUBJS.Book.prototype.nextPage = function(a) {
    var a = a || new RSVP.defer;
    if (!this.isRendered) return this._q.enqueue("nextPage", [a]), a.promise;
    var b = this.renderer.nextPage();
    return b ? (a.resolve(!0), a.promise) : this.nextChapter(a)
}, EPUBJS.Book.prototype.prevPage = function(a) {
    var a = a || new RSVP.defer;
    if (!this.isRendered) return this._q.enqueue("prevPage", [a]), a.promise;
    var b = this.renderer.prevPage();
    return b ? (a.resolve(!0), a.promise) : this.prevChapter(a)
}, EPUBJS.Book.prototype.nextChapter = function(a) {
    var a = a || new RSVP.defer;
    if (this.spinePos < this.spine.length - 1) {
        for (var b = this.spinePos + 1; this.spine[b] && this.spine[b].linear && "no" == this.spine[b].linear;) b++;
        if (b < this.spine.length) return this.displayChapter(b, !1, a)
    }
    return this.trigger("book:atEnd"), a.resolve(!0), a.promise
}, EPUBJS.Book.prototype.prevChapter = function(a) {
    var a = a || new RSVP.defer;
    if (this.spinePos > 0) {
        for (var b = this.spinePos - 1; this.spine[b] && this.spine[b].linear && "no" == this.spine[b].linear;) b--;
        if (b >= 0) return this.displayChapter(b, !0, a)
    }
    return this.trigger("book:atStart"), a.resolve(!0), a.promise
}, EPUBJS.Book.prototype.getCurrentLocationCfi = function() {
    return this.isRendered ? this.renderer.currentLocationCfi : !1
}, EPUBJS.Book.prototype.goto = function(a) {
    return 0 === a.indexOf("epubcfi(") ? this.gotoCfi(a) : a.indexOf("%") === a.length - 1 ? this.gotoPercentage(parseInt(a.substring(0, a.length - 1)) /
        100) : "number" == typeof a || isNaN(a) === !1 ? this.gotoPage(a) : this.gotoHref(a)
}, EPUBJS.Book.prototype.gotoCfi = function(a, b) {
    var c, d, e, f, g, h = b || new RSVP.defer;
    return this.isRendered ? this._moving || this._rendering ? (console.warn("Renderer is moving"), this._gotoQ.enqueue("gotoCfi", [a, h]), !1) : (c = new EPUBJS
        .EpubCFI(a), d = c.spinePos, -1 == d ? !1 : (e = this.spine[d], f = h.promise, this._moving = !0, this.currentChapter && this.spinePos === d ?
        (this.renderer.gotoCfi(c), this._moving = !1, h.resolve(this.renderer.currentLocationCfi)) : (e && -1 != d || (d = 0, e = this.spine[d]), g =
        this.displayChapter(a), g.then(function(a) {
        this._moving = !1, h.resolve(a.currentLocationCfi)
    }.bind(this), function() {
        this._moving = !1
    }.bind(this))), f.then(function() {
        this._gotoQ.dequeue()
    }.bind(this)), f)) : (console.warn("Not yet Rendered"), this.settings.previousLocationCfi = a, !1)
}, EPUBJS.Book.prototype.gotoHref = function(a, b) {
    var c, d, e, f, g, h = b || new RSVP.defer;
    return this.isRendered ? this._moving || this._rendering ? (this._gotoQ.enqueue("gotoHref", [a, h]), !1) : (c = a.split("#"), d = c[0], e = c[1] || !1,
        f = -1 == d.search("://") ? d.replace(EPUBJS.core.uri(this.settings.contentsPath).path, "") : d.replace(this.settings.contentsPath, ""), g =
        this.spineIndexByURL[f], d || (g = this.currentChapter ? this.currentChapter.spinePos : 0), "number" != typeof g ? !1 : this.currentChapter &&
    g == this.currentChapter.spinePos ? (e ? this.renderer.section(e) : this.renderer.firstPage(), h.resolve(this.renderer.currentLocationCfi), h.promise
        .then(function() {
            this._gotoQ.dequeue()
        }.bind(this)), h.promise) : this.displayChapter(g).then(function() {
        e && this.renderer.section(e), h.resolve(this.renderer.currentLocationCfi)
    }.bind(this))) : (this.settings.goto = a, !1)
}, EPUBJS.Book.prototype.gotoPage = function(a) {
    var b = this.pagination.cfiFromPage(a);
    return this.gotoCfi(b)
}, EPUBJS.Book.prototype.gotoPercentage = function(a) {
    var b = this.pagination.pageFromPercentage(a);
    return this.gotoPage(b)
}, EPUBJS.Book.prototype.preloadNextChapter = function() {
    var a, b = this.spinePos + 1;
    return b >= this.spine.length ? !1 : (a = new EPUBJS.Chapter(this.spine[b]), void(a && EPUBJS.core.request(a.absolute)))
}, EPUBJS.Book.prototype.storeOffline = function() {
    var a = this,
        b = EPUBJS.core.values(this.manifest);
    return this.store.put(b).then(function() {
        a.settings.stored = !0, a.trigger("book:stored")
    })
}, EPUBJS.Book.prototype.availableOffline = function() {
    return this.settings.stored > 0 ? !0 : !1
}, EPUBJS.Book.prototype.toStorage = function() {
    var a = this.settings.bookKey;
    this.store.isStored(a).then(function(b) {
        return b === !0 ? (this.settings.stored = !0, !0) : this.storeOffline().then(function() {
            this.store.token(a, !0)
        }.bind(this))
    }.bind(this))
}, EPUBJS.Book.prototype.fromStorage = function(a) {
    [EPUBJS.replace.head, EPUBJS.replace.resources, EPUBJS.replace.svg];
    this.contained || this.settings.contained || (this.online && this.opened.then(this.toStorage.bind(this)), this.store && this.settings.fromStorage && a ===
    !1 ? (this.settings.fromStorage = !1, this.store.off("offline"), this.store = !1) : this.settings.fromStorage || (this.store = new EPUBJS.Storage(
        this.settings.credentials), this.store.on("offline", function(a) {
        a ? (this.offline = !0, this.settings.fromStorage = !0, this.trigger("book:offline")) : (this.offline = !1, this.settings.fromStorage = !
            1, this.trigger("book:online"))
    }.bind(this))))
}, EPUBJS.Book.prototype.setStyle = function(a, b, c) {
    var d = ["color", "background", "background-color"];
    return this.isRendered ? (this.settings.styles[a] = b, this.renderer.setStyle(a, b, c), void(-1 === d.indexOf(a) && this.renderer.reformat())) : this._q
        .enqueue("setStyle", arguments)
}, EPUBJS.Book.prototype.removeStyle = function(a) {
    return this.isRendered ? (this.renderer.removeStyle(a), this.renderer.reformat(), void delete this.settings.styles[a]) : this._q.enqueue("removeStyle",
        arguments)
}, EPUBJS.Book.prototype.addHeadTag = function(a, b) {
    return this.isRendered ? void(this.settings.headTags[a] = b) : this._q.enqueue("addHeadTag", arguments)
}, EPUBJS.Book.prototype.useSpreads = function(a) {
    console.warn("useSpreads is deprecated, use forceSingle or set a layoutOveride instead"), this.forceSingle(a === !1 ? !0 : !1)
}, EPUBJS.Book.prototype.forceSingle = function(a) {
    var b = "undefined" == typeof a ? !0 : a;
    this.renderer.forceSingle(b), this.settings.forceSingle = b, this.isRendered && this.renderer.reformat()
}, EPUBJS.Book.prototype.setMinSpreadWidth = function(a) {
    this.settings.minSpreadWidth = a, this.isRendered && (this.renderer.setMinSpreadWidth(this.settings.minSpreadWidth), this.renderer.reformat())
}, EPUBJS.Book.prototype.setGap = function(a) {
    this.settings.gap = a, this.isRendered && (this.renderer.setGap(this.settings.gap), this.renderer.reformat())
}, EPUBJS.Book.prototype.chapter = function(a) {
    var b, c, d = this.spineIndexByURL[a];
    return d && (b = this.spine[d], c = new EPUBJS.Chapter(b, this.store, this.settings.withCredentials), c.load()), c
}, EPUBJS.Book.prototype.unload = function() {
    this.settings.restore && localStorage && this.saveContents(), this.unlistenToRenderer(this.renderer), this.trigger("book:unload")
}, EPUBJS.Book.prototype.destroy = function() {
    window.removeEventListener("beforeunload", this.unload), this.currentChapter && this.currentChapter.unload(), this.unload(), this.renderer && this.renderer
        .remove()
}, EPUBJS.Book.prototype._ready = function() {
    this.trigger("book:ready")
}, EPUBJS.Book.prototype._rendered = function() {
    this.isRendered = !0, this.trigger("book:rendered"), this._q.flush()
}, EPUBJS.Book.prototype.applyStyles = function(a, b) {
    a.applyStyles(this.settings.styles), b()
}, EPUBJS.Book.prototype.applyHeadTags = function(a, b) {
    a.applyHeadTags(this.settings.headTags), b()
}, EPUBJS.Book.prototype._registerReplacements = function(a) {
    a.registerHook("beforeChapterDisplay", this.applyStyles.bind(this, a), !0), a.registerHook("beforeChapterDisplay", this.applyHeadTags.bind(this, a), !0),
        a.registerHook("beforeChapterDisplay", EPUBJS.replace.hrefs.bind(this), !0)
}, EPUBJS.Book.prototype._needsAssetReplacement = function() {
    return this.settings.fromStorage ? !0 : this.settings.contained ? !0 : !1
}, EPUBJS.Book.prototype.parseLayoutProperties = function(a) {
    var b = this.settings.layoutOveride && this.settings.layoutOveride.layout || a.layout || "reflowable",
        c = this.settings.layoutOveride && this.settings.layoutOveride.spread || a.spread || "auto",
        d = this.settings.layoutOveride && this.settings.layoutOveride.orientation || a.orientation || "auto";
    return {
        layout: b,
        spread: c,
        orientation: d
    }
}, RSVP.EventTarget.mixin(EPUBJS.Book.prototype), RSVP.on("error", function(a) {
    console.error(a)
}), EPUBJS.Chapter = function(a, b, c) {
    this.href = a.href, this.absolute = a.url, this.id = a.id, this.spinePos = a.index, this.cfiBase = a.cfiBase, this.properties = a.properties, this.manifestProperties =
        a.manifestProperties, this.linear = a.linear, this.pages = 1, this.store = b, this.credentials = c, this.epubcfi = new EPUBJS.EpubCFI, this.deferred =
        new RSVP.defer, this.loaded = this.deferred.promise, EPUBJS.Hooks.mixin(this), this.getHooks("beforeChapterRender"), this.caches = {}
}, EPUBJS.Chapter.prototype.load = function(a, b) {
    var c, d = a || this.store,
        e = b || this.credentials;
    return c = d ? d.getXml(this.absolute) : EPUBJS.core.request(this.absolute, !1, e), c.then(function(a) {
        try {
            this.setDocument(a), this.deferred.resolve(this)
        } catch (b) {
            this.deferred.reject({
                message: this.absolute + " -> " + b.message,
                stack: (new Error).stack
            })
        }
    }.bind(this)), c
}, EPUBJS.Chapter.prototype.render = function() {
    return this.load().then(function(a) {
        var b = a.querySelector("head"),
            c = a.createElement("base");
        return c.setAttribute("href", this.absolute), b.insertBefore(c, b.firstChild), this.contents = a, new RSVP.Promise(function(b) {
            this.triggerHooks("beforeChapterRender", function() {
                b(a)
            }.bind(this), this)
        }.bind(this))
    }.bind(this)).then(function(a) {
        var b = new XMLSerializer,
            c = b.serializeToString(a);
        return c
    }.bind(this))
}, EPUBJS.Chapter.prototype.url = function(a) {
    var b, c = new RSVP.defer,
        d = a || this.store,
        e = this;
    return d ? this.tempUrl ? (b = this.tempUrl, c.resolve(b)) : d.getUrl(this.absolute).then(function(a) {
        e.tempUrl = a, c.resolve(a)
    }) : (b = this.absolute, c.resolve(b)), c.promise
}, EPUBJS.Chapter.prototype.setPages = function(a) {
    this.pages = a
}, EPUBJS.Chapter.prototype.getPages = function() {
    return this.pages
}, EPUBJS.Chapter.prototype.getID = function() {
    return this.ID
}, EPUBJS.Chapter.prototype.unload = function(a) {
    this.document = null, this.tempUrl && a && (a.revokeUrl(this.tempUrl), this.tempUrl = !1)
}, EPUBJS.Chapter.prototype.setDocument = function(a) {
    this.document = a, this.contents = a.documentElement, !this.document.evaluate && document.evaluate && (this.document.evaluate = document.evaluate)
}, EPUBJS.Chapter.prototype.cfiFromRange = function(a) {
    var b, c, d, e, f, g;
    if (this.document) {
        if ("undefined" != typeof document.evaluate) {
            if (c = EPUBJS.core.getElementXPath(a.startContainer), d = EPUBJS.core.getElementXPath(a.endContainer), e = this.document.evaluate(c, this.document,
                    EPUBJS.core.nsResolver, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue, a.collapsed || (f = this.document.evaluate(d, this.document,
                    EPUBJS.core.nsResolver, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue), b = this.document.createRange(), e) try {
                b.setStart(e, a.startOffset), !a.collapsed && f && b.setEnd(f, a.endOffset)
            } catch (h) {
                console.log("missed"), e = !1
            }
            e || (console.log("not found, try fuzzy match"), cleanStartTextContent = EPUBJS.core.cleanStringForXpath(a.startContainer.textContent), c =
                "//text()[contains(.," + cleanStartTextContent + ")]", e = this.document.evaluate(c, this.document, EPUBJS.core.nsResolver, XPathResult
                .FIRST_ORDERED_NODE_TYPE, null).singleNodeValue, e && (b.setStart(e, a.startOffset), a.collapsed || (g = EPUBJS.core.cleanStringForXpath(
                a.endContainer.textContent), d = "//text()[contains(.," + g + ")]", f = this.document.evaluate(d, this.document, EPUBJS.core
                .nsResolver, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue, f && b.setEnd(f, a.endOffset))))
        } else b = a;
        return this.epubcfi.generateCfiFromRange(b, this.cfiBase)
    }
}, EPUBJS.Chapter.prototype.find = function(a) {
    var b = this,
        c = [],
        d = a.toLowerCase(),
        e = function(a) {
            for (var e, f, g, h = a.textContent.toLowerCase(), i = b.document.createRange(), j = -1, k = 150; - 1 != f;) f = h.indexOf(d, j + 1), -1 != f &&
            (i = b.document.createRange(), i.setStart(a, f), i.setEnd(a, f + d.length), e = b.cfiFromRange(i), a.textContent.length < k ? g = a.textContent :
                (g = a.textContent.substring(f - k / 2, f + k / 2), g = "..." + g + "..."), c.push({
                cfi: e,
                excerpt: g
            })), j = f
        };
    return this.textSprint(this.document, function(a) {
        e(a)
    }), c
}, EPUBJS.Chapter.prototype.textSprint = function(a, b) {
    for (var c, d = document.createTreeWalker(a, NodeFilter.SHOW_TEXT, {
        acceptNode: function(a) {
            return a.data && !/^\s*$/.test(a.data) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
        }
    }, !1); c = d.nextNode();) b(c)
}, EPUBJS.Chapter.prototype.replace = function(a, b, c, d) {
    var e = this.contents.querySelectorAll(a),
        f = Array.prototype.slice.call(e),
        g = f.length;
    return 0 === g ? void c(!1) : void f.forEach(function(a) {
        var e = !1,
            f = function(a, b) {
                e === !1 && (g--, d && d(a, b, g), 0 >= g && c && c(!0), e = !0)
            };
        b(a, f)
    }.bind(this))
}, EPUBJS.Chapter.prototype.replaceWithStored = function(a, b, c, d) {
    var e, f = {},
        g = this.store,
        h = this.caches[a],
        i = EPUBJS.core.uri(this.absolute),
        j = i.base,
        k = b,
        l = 5,
        m = function(a, b) {
            f[b] = a
        },
        n = function() {
            d && d(), EPUBJS.core.values(e).forEach(function(a) {
                g.revokeUrl(a)
            }), h = f
        };
    g && (h || (h = {}), e = EPUBJS.core.clone(h), this.replace(a, function(b, d) {
        var h = b.getAttribute(k),
            i = EPUBJS.core.resolveUrl(j, h),
            m = function(c) {
                var e;
                b.onload = function() {
                    clearTimeout(e), d(c, i)
                }, b.onerror = function(a) {
                    clearTimeout(e), d(c, i), console.error(a)
                }, "svg image" == a && b.setAttribute("externalResourcesRequired", "true"), "link[href]" == a && "stylesheet" !== b.getAttribute(
                    "rel") ? d(c, i) : e = setTimeout(function() {
                    d(c, i)
                }, l), c && b.setAttribute(k, c)
            };
        i in e ? (m(e[i]), f[i] = e[i], delete e[i]) : c(g, i, m, b)
    }, n, m))
};
var EPUBJS = EPUBJS || {};
EPUBJS.core = {}, EPUBJS.core.getEl = function(a) {
    return document.getElementById(a)
}, EPUBJS.core.getEls = function(a) {
    return document.getElementsByClassName(a)
}, EPUBJS.core.request = function(a, b, c) {
    var d, e = window.URL,
        f = e ? "blob" : "arraybuffer",
        g = new RSVP.defer,
        h = new XMLHttpRequest,
        i = XMLHttpRequest.prototype,
        j = function() {
            var a;
            this.readyState == this.DONE && (200 !== this.status && 0 !== this.status || !this.response ? g.reject({
                message: this.response,
                stack: (new Error).stack
            }) : (a = "xml" == b ? this.responseXML ? this.responseXML : (new DOMParser).parseFromString(this.response, "application/xml") :
                "xhtml" == b ? this.responseXML ? this.responseXML : (new DOMParser).parseFromString(this.response, "application/xhtml+xml") :
                    "html" == b ? this.responseXML ? this.responseXML : (new DOMParser).parseFromString(this.response, "text/html") : "json" == b ?
                        JSON.parse(this.response) : "blob" == b ? e ? this.response : new Blob([this.response]) : this.response, g.resolve(a)))
        };
    return "overrideMimeType" in i || Object.defineProperty(i, "overrideMimeType", {
        value: function() {}
    }), h.onreadystatechange = j, h.open("GET", a, !0), c && (h.withCredentials = !0), b || (d = EPUBJS.core.uri(a), b = d.extension, b = {
            htm: "html"
        }[b] || b), "blob" == b && (h.responseType = f), "json" == b && h.setRequestHeader("Accept", "application/json"), "xml" == b && (h.responseType =
        "document", h.overrideMimeType("text/xml")), "xhtml" == b && (h.responseType = "document"), "html" == b && (h.responseType = "document"),
    "binary" == b && (h.responseType = "arraybuffer"), h.send(), g.promise
}, EPUBJS.core.toArray = function(a) {
    var b = [];
    for (var c in a) {
        var d;
        a.hasOwnProperty(c) && (d = a[c], d.ident = c, b.push(d))
    }
    return b
}, EPUBJS.core.uri = function(a) {
    var b, c, d, e = {
            protocol: "",
            host: "",
            path: "",
            origin: "",
            directory: "",
            base: "",
            filename: "",
            extension: "",
            fragment: "",
            href: a
        },
        f = a.indexOf("blob:"),
        g = a.indexOf("://"),
        h = a.indexOf("?"),
        i = a.indexOf("#");
    return 0 === f ? (e.protocol = "blob", e.base = a.indexOf(0, i), e) : (-1 != i && (e.fragment = a.slice(i + 1), a = a.slice(0, i)), -1 != h && (e.search =
        a.slice(h + 1), a = a.slice(0, h), href = a), -1 != g ? (e.protocol = a.slice(0, g), b = a.slice(g + 3), d = b.indexOf("/"), -1 === d ? (e.host =
        e.path, e.path = "") : (e.host = b.slice(0, d), e.path = b.slice(d)), e.origin = e.protocol + "://" + e.host, e.directory = EPUBJS.core
        .folder(e.path), e.base = e.origin + e.directory) : (e.path = a, e.directory = EPUBJS.core.folder(a), e.base = e.directory), e.filename = a
        .replace(e.base, ""), c = e.filename.lastIndexOf("."), -1 != c && (e.extension = e.filename.slice(c + 1)), e)
}, EPUBJS.core.folder = function(a) {
    var b = a.lastIndexOf("/");
    if (-1 == b) var c = "";
    return c = a.slice(0, b + 1)
}, EPUBJS.core.dataURLToBlob = function(a) {
    var b, c, d, e, f, g = ";base64,";
    if (-1 == a.indexOf(g)) return b = a.split(","), c = b[0].split(":")[1], d = b[1], new Blob([d], {
        type: c
    });
    b = a.split(g), c = b[0].split(":")[1], d = window.atob(b[1]), e = d.length, f = new Uint8Array(e);
    for (var h = 0; e > h; ++h) f[h] = d.charCodeAt(h);
    return new Blob([f], {
        type: c
    })
}, EPUBJS.core.addScript = function(a, b, c) {
    var d, e;
    e = !1, d = document.createElement("script"), d.type = "text/javascript", d.async = !1, d.src = a, d.onload = d.onreadystatechange = function() {
        e || this.readyState && "complete" != this.readyState || (e = !0, b && b())
    }, c = c || document.body, c.appendChild(d)
}, EPUBJS.core.addScripts = function(a, b, c) {
    var d = a.length,
        e = 0,
        f = function() {
            e++, d == e ? b && b() : EPUBJS.core.addScript(a[e], f, c)
        };
    EPUBJS.core.addScript(a[e], f, c)
}, EPUBJS.core.addCss = function(a, b, c) {
    var d, e;
    e = !1, d = document.createElement("link"), d.type = "text/css", d.rel = "stylesheet", d.href = a, d.onload = d.onreadystatechange = function() {
        e || this.readyState && "complete" != this.readyState || (e = !0, b && b())
    }, c = c || document.body, c.appendChild(d)
}, EPUBJS.core.prefixed = function(a) {
    var b = ["Webkit", "Moz", "O", "ms"],
        c = a[0].toUpperCase() + a.slice(1),
        d = b.length;
    if ("undefined" != typeof document.documentElement.style[a]) return a;
    for (var e = 0; d > e; e++)
        if ("undefined" != typeof document.documentElement.style[b[e] + c]) return b[e] + c;
    return a
}, EPUBJS.core.resolveUrl = function(a, b) {
    var c, d, e = [],
        f = EPUBJS.core.uri(b),
        g = a.split("/");
    return f.host ? b : (g.pop(), d = b.split("/"), d.forEach(function(a) {
        ".." === a ? g.pop() : e.push(a)
    }), c = g.concat(e), c.join("/"))
}, EPUBJS.core.uuid = function() {
    var a = (new Date).getTime(),
        b = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(b) {
            var c = (a + 16 * Math.random()) % 16 | 0;
            return a = Math.floor(a / 16), ("x" == b ? c : 7 & c | 8).toString(16)
        });
    return b
}, EPUBJS.core.insert = function(a, b, c) {
    var d = EPUBJS.core.locationOf(a, b, c);
    return b.splice(d, 0, a), d
}, EPUBJS.core.locationOf = function(a, b, c, d, e) {
    var f, g = d || 0,
        h = e || b.length,
        i = parseInt(g + (h - g) / 2);
    return c || (c = function(a, b) {
        return a > b ? 1 : b > a ? -1 : (a = b) ? 0 : void 0
    }), 0 >= h - g ? i : (f = c(b[i], a), h - g === 1 ? f > 0 ? i : i + 1 : 0 === f ? i : -1 === f ? EPUBJS.core.locationOf(a, b, c, i, h) : EPUBJS.core
        .locationOf(a, b, c, g, i))
}, EPUBJS.core.indexOfSorted = function(a, b, c, d, e) {
    var f, g = d || 0,
        h = e || b.length,
        i = parseInt(g + (h - g) / 2);
    return c || (c = function(a, b) {
        return a > b ? 1 : b > a ? -1 : (a = b) ? 0 : void 0
    }), 0 >= h - g ? -1 : (f = c(b[i], a), h - g === 1 ? 0 === f ? i : -1 : 0 === f ? i : -1 === f ? EPUBJS.core.indexOfSorted(a, b, c, i, h) : EPUBJS.core
        .indexOfSorted(a, b, c, g, i))
}, EPUBJS.core.queue = function(a) {
    var b = [],
        c = a,
        d = function(a, c, d) {
            return b.push({
                funcName: a,
                args: c,
                context: d
            }), b
        },
        e = function() {
            var a;
            b.length && (a = b.shift(), c[a.funcName].apply(a.context || c, a.args))
        },
        f = function() {
            for (; b.length;) e()
        },
        g = function() {
            b = []
        },
        h = function() {
            return b.length
        };
    return {
        enqueue: d,
        dequeue: e,
        flush: f,
        clear: g,
        length: h
    }
}, EPUBJS.core.getElementXPath = function(a) {
    return a && a.id ? '//*[@id="' + a.id + '"]' : EPUBJS.core.getElementTreeXPath(a)
}, EPUBJS.core.getElementTreeXPath = function(a) {
    var b, c, d, e, f = [],
        g = "http://www.w3.org/1999/xhtml" === a.ownerDocument.documentElement.getAttribute("xmlns");
    for (a.nodeType === Node.TEXT_NODE && (b = EPUBJS.core.indexOfTextNode(a) + 1, f.push("text()[" + b + "]"), a = a.parentNode); a && 1 == a.nodeType; a =
        a.parentNode) {
        b = 0;
        for (var h = a.previousSibling; h; h = h.previousSibling) h.nodeType != Node.DOCUMENT_TYPE_NODE && h.nodeName == a.nodeName && ++b;
        c = a.nodeName.toLowerCase(), d = g ? "xhtml:" + c : c, e = b ? "[" + (b + 1) + "]" : "", f.splice(0, 0, d + e)
    }
    return f.length ? "./" + f.join("/") : null
}, EPUBJS.core.nsResolver = function(a) {
    var b = {
        xhtml: "http://www.w3.org/1999/xhtml",
        epub: "http://www.idpf.org/2007/ops"
    };
    return b[a] || null
}, EPUBJS.core.cleanStringForXpath = function(a) {
    var b = a.match(/[^'"]+|['"]/g);
    return b = b.map(function(a) {
        return "'" === a ? '"\'"' : '"' === a ? "'\"'" : "'" + a + "'"
    }), "concat(''," + b.join(",") + ")"
}, EPUBJS.core.indexOfTextNode = function(a) {
    for (var b, c = a.parentNode, d = c.childNodes, e = -1, f = 0; f < d.length && (b = d[f], b.nodeType === Node.TEXT_NODE && e++, b != a); f++);
    return e
}, EPUBJS.core.defaults = function(a) {
    for (var b = 1, c = arguments.length; c > b; b++) {
        var d = arguments[b];
        for (var e in d) void 0 === a[e] && (a[e] = d[e])
    }
    return a
}, EPUBJS.core.extend = function(a) {
    var b = [].slice.call(arguments, 1);
    return b.forEach(function(b) {
        b && Object.getOwnPropertyNames(b).forEach(function(c) {
            Object.defineProperty(a, c, Object.getOwnPropertyDescriptor(b, c))
        })
    }), a
}, EPUBJS.core.clone = function(a) {
    return EPUBJS.core.isArray(a) ? a.slice() : EPUBJS.core.extend({}, a)
}, EPUBJS.core.isElement = function(a) {
    return !(!a || 1 != a.nodeType)
}, EPUBJS.core.isNumber = function(a) {
    return !isNaN(parseFloat(a)) && isFinite(a)
}, EPUBJS.core.isString = function(a) {
    return "string" == typeof a || a instanceof String
}, EPUBJS.core.isArray = Array.isArray || function(a) {
        return "[object Array]" === Object.prototype.toString.call(a)
    }, EPUBJS.core.values = function(a) {
    var b, c, d, e = -1;
    if (!a) return [];
    for (b = Object.keys(a), c = b.length, d = Array(c); ++e < c;) d[e] = a[b[e]];
    return d
}, EPUBJS.EpubCFI = function(a) {
    return a ? this.parse(a) : void 0
}, EPUBJS.EpubCFI.prototype.generateChapterComponent = function(a, b, c) {
    var d = parseInt(b),
        e = a + 1,
        f = "/" + e + "/";
    return f += 2 * (d + 1), c && (f += "[" + c + "]"), f
}, EPUBJS.EpubCFI.prototype.generatePathComponent = function(a) {
    var b = [];
    return a.forEach(function(a) {
        var c = "";
        c += 2 * (a.index + 1), a.id && (c += "[" + a.id + "]"), b.push(c)
    }), b.join("/")
}, EPUBJS.EpubCFI.prototype.generateCfiFromElement = function(a, b) {
    var c = this.pathTo(a),
        d = this.generatePathComponent(c);
    return d.length ? "epubcfi(" + b + "!" + d + "/1:0)" : "epubcfi(" + b + "!/4/)"
}, EPUBJS.EpubCFI.prototype.pathTo = function(a) {
    for (var b, c = []; a && null !== a.parentNode && 9 != a.parentNode.nodeType;) b = a.parentNode.children, c.unshift({
        id: a.id,
        tagName: a.tagName,
        index: b ? Array.prototype.indexOf.call(b, a) : 0
    }), a = a.parentNode;
    return c
}, EPUBJS.EpubCFI.prototype.getChapterComponent = function(a) {
    var b = a.split("!");
    return b[0]
}, EPUBJS.EpubCFI.prototype.getPathComponent = function(a) {
    var b = a.split("!"),
        c = b[1] ? b[1].split(":") : "";
    return c[0]
}, EPUBJS.EpubCFI.prototype.getCharecterOffsetComponent = EPUBJS.EpubCFI.prototype.getCharacterOffsetComponent = function(a) {
    var b = a.split(":");
    return b[1] || ""
}, EPUBJS.EpubCFI.prototype.parse = function(a) {
    var b, c, d, e, f, g, h, i, j, k = {},
        l = function(a) {
            var b, c, d, e;
            return b = "element", c = parseInt(a) / 2 - 1, d = a.match(/\[(.*)\]/), d && d[1] && (e = d[1]), {
                type: b,
                index: c,
                id: e || !1
            }
        };
    return "string" != typeof a ? {
        spinePos: -1
    } : (k.str = a, 0 === a.indexOf("epubcfi(") && ")" === a[a.length - 1] && (a = a.slice(8, a.length - 1)), c = this.getChapterComponent(a), d = this
            .getPathComponent(a) || "", e = this.getCharacterOffsetComponent(a), c && (b = c.split("/")[2] || "") ? (k.spinePos = parseInt(b) / 2 - 1 || 0,
        g = b.match(/\[(.*)\]/), k.spineId = g ? g[1] : !1, -1 != d.indexOf(",") && console.warn("CFI Ranges are not supported"), h = d.split("/"),
        i = h.pop(), k.steps = [], h.forEach(function(a) {
        var b;
        a && (b = l(a), k.steps.push(b))
    }), j = parseInt(i), isNaN(j) || k.steps.push(j % 2 === 0 ? l(i) : {
        type: "text",
        index: (j - 1) / 2
    }), f = e.match(/\[(.*)\]/), f && f[1] ? (k.characterOffset = parseInt(e.split("[")[0]), k.textLocationAssertion = f[1]) : k.characterOffset =
        parseInt(e), k) : {
        spinePos: -1
    })
}, EPUBJS.EpubCFI.prototype.addMarker = function(a, b, c) {
    var d, e, f, g, h = b || document,
        i = c || this.createMarker(h);
    return "string" == typeof a && (a = this.parse(a)), e = a.steps[a.steps.length - 1], -1 === a.spinePos ? !1 : (d = this.findParent(a, h)) ? (e &&
    "text" === e.type ? (f = d.childNodes[e.index], a.characterOffset ? (g = f.splitText(a.characterOffset), i.classList.add("EPUBJS-CFI-SPLIT"), d
        .insertBefore(i, g)) : d.insertBefore(i, f)) : d.insertBefore(i, d.firstChild), i) : !1
}, EPUBJS.EpubCFI.prototype.createMarker = function(a) {
    var b = a || document,
        c = b.createElement("span");
    return c.id = "EPUBJS-CFI-MARKER:" + EPUBJS.core.uuid(), c.classList.add("EPUBJS-CFI-MARKER"), c
}, EPUBJS.EpubCFI.prototype.removeMarker = function(a, b) {
    a.classList.contains("EPUBJS-CFI-SPLIT") ? (nextSib = a.nextSibling, prevSib = a.previousSibling, nextSib && prevSib && 3 === nextSib.nodeType && 3 ===
    prevSib.nodeType && (prevSib.textContent += nextSib.textContent, a.parentNode.removeChild(nextSib)), a.parentNode.removeChild(a)) : a.classList
        .contains("EPUBJS-CFI-MARKER") && a.parentNode.removeChild(a)
}, EPUBJS.EpubCFI.prototype.findParent = function(a, b) {
    var c, d, e, f = b || document,
        g = f.getElementsByTagName("html")[0],
        h = Array.prototype.slice.call(g.children);
    if ("string" == typeof a && (a = this.parse(a)), d = a.steps.slice(0), !d.length) return f.getElementsByTagName("body")[0];
    for (; d && d.length > 0;) {
        if (c = d.shift(), "text" === c.type ? (e = g.childNodes[c.index], g = e.parentNode || g) : g = c.id ? f.getElementById(c.id) : h[c.index], !g ||
            "undefined" == typeof g) return console.error("No Element For", c, a.str), !1;
        h = Array.prototype.slice.call(g.children)
    }
    return g
}, EPUBJS.EpubCFI.prototype.compare = function(a, b) {
    if ("string" == typeof a && (a = new EPUBJS.EpubCFI(a)), "string" == typeof b && (b = new EPUBJS.EpubCFI(b)), a.spinePos > b.spinePos) return 1;
    if (a.spinePos < b.spinePos) return -1;
    for (var c = 0; c < a.steps.length; c++) {
        if (!b.steps[c]) return 1;
        if (a.steps[c].index > b.steps[c].index) return 1;
        if (a.steps[c].index < b.steps[c].index) return -1
    }
    return a.steps.length < b.steps.length ? -1 : a.characterOffset > b.characterOffset ? 1 : a.characterOffset < b.characterOffset ? -1 : 0
}, EPUBJS.EpubCFI.prototype.generateCfiFromHref = function(a, b) {
    var c, d, e = EPUBJS.core.uri(a),
        f = e.path,
        g = e.fragment,
        h = b.spineIndexByURL[f],
        i = new RSVP.defer,
        j = new EPUBJS.EpubCFI;
    return "undefined" != typeof h && (d = b.spine[h], c = b.loadXml(d.url), c.then(function(a) {
        var b, c = a.getElementById(g);
        b = j.generateCfiFromElement(c, d.cfiBase), i.resolve(b)
    })), i.promise
}, EPUBJS.EpubCFI.prototype.generateCfiFromTextNode = function(a, b, c) {
    var d = a.parentNode,
        e = this.pathTo(d),
        f = this.generatePathComponent(e),
        g = 1 + 2 * Array.prototype.indexOf.call(d.childNodes, a);
    return "epubcfi(" + c + "!" + f + "/" + g + ":" + (b || 0) + ")"
}, EPUBJS.EpubCFI.prototype.generateCfiFromRangeAnchor = function(a, b) {
    var c = a.anchorNode,
        d = a.anchorOffset;
    return this.generateCfiFromTextNode(c, d, b)
}, EPUBJS.EpubCFI.prototype.generateCfiFromRange = function(a, b) {
    var c, d, e, f, g, h, i, j, k, l, m, n;
    if (c = a.startContainer, 3 === c.nodeType) d = c.parentNode, h = 1 + 2 * EPUBJS.core.indexOfTextNode(c), e = this.pathTo(d);
    else {
        if (a.collapsed) return this.generateCfiFromElement(c, b);
        e = this.pathTo(c)
    }
    return f = this.generatePathComponent(e), g = a.startOffset, a.collapsed ? "epubcfi(" + b + "!" + f + "/" + h + ":" + g + ")" : (i = a.endContainer, 3 ===
    i.nodeType ? (j = i.parentNode, n = 1 + 2 * EPUBJS.core.indexOfTextNode(i), k = this.pathTo(j)) : k = this.pathTo(i), l = this.generatePathComponent(
        k), m = a.endOffset, l = l.replace(f, ""), l.length && (l += "/"), "epubcfi(" + b + "!" + f + "/" + h + ":" + g + "," + l + n + ":" + m +
    ")")
}, EPUBJS.EpubCFI.prototype.generateXpathFromSteps = function(a) {
    var b = [".", "*"];
    return a.forEach(function(a) {
        var c = a.index + 1;
        b.push(a.id ? "*[position()=" + c + " and @id='" + a.id + "']" : "text" === a.type ? "text()[" + c + "]" : "*[" + c + "]")
    }), b.join("/")
}, EPUBJS.EpubCFI.prototype.generateQueryFromSteps = function(a) {
    var b = ["html"];
    return a.forEach(function(a) {
        var c = a.index + 1;
        a.id ? b.push("#" + a.id) : "text" === a.type || b.push("*:nth-child(" + c + ")")
    }), b.join(">")
}, EPUBJS.EpubCFI.prototype.generateRangeFromCfi = function(a, b) {
    var c, d, e, f, g, h, i = b || document,
        j = i.createRange();
    return "string" == typeof a && (a = this.parse(a)), -1 === a.spinePos ? !1 : (c = a.steps[a.steps.length - 1], "undefined" != typeof document.evaluate ?
        (d = this.generateXpathFromSteps(a.steps), e = i.evaluate(d, i, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue) : (g = this.generateQueryFromSteps(
        a.steps), h = i.querySelector(g), h && "text" == c.type && (e = h.childNodes[c.index])), e ? (e && a.characterOffset >= 0 ? (f = e.length,
        a.characterOffset < f ? (j.setStart(e, a.characterOffset), j.setEnd(e, f)) : (console.debug("offset greater than length:", a.characterOffset,
            f), j.setStart(e, f - 1), j.setEnd(e, f))) : e && j.selectNode(e), j) : null)
}, EPUBJS.EpubCFI.prototype.isCfiString = function(a) {
    return "string" == typeof a && 0 === a.indexOf("epubcfi(") ? !0 : !1
}, EPUBJS.Events = function(a, b) {
    return this.events = {}, this.el = b ? b : document.createElement("div"), a.createEvent = this.createEvent, a.tell = this.tell, a.listen = this.listen,
        a.deafen = this.deafen, a.listenUntil = this.listenUntil, this
}, EPUBJS.Events.prototype.createEvent = function(a) {
    var b = new CustomEvent(a);
    return this.events[a] = b, b
}, EPUBJS.Events.prototype.tell = function(a, b) {
    var c;
    this.events[a] ? c = this.events[a] : (console.warn("No event:", a, "defined yet, creating."), c = this.createEvent(a)), b && (c.msg = b), this.el.dispatchEvent(
        c)
}, EPUBJS.Events.prototype.listen = function(a, b, c) {
    return this.events[a] ? void(c ? this.el.addEventListener(a, b.bind(c), !1) : this.el.addEventListener(a, b, !1)) : (console.warn("No event:", a,
        "defined yet, creating."), void this.createEvent(a))
}, EPUBJS.Events.prototype.deafen = function(a, b) {
    this.el.removeEventListener(a, b, !1)
}, EPUBJS.Events.prototype.listenUntil = function(a, b, c, d) {
    function e() {
        this.deafen(a, c), this.deafen(b, e)
    }
    this.listen(a, c, d), this.listen(b, e, this)
}, EPUBJS.hooks = {}, EPUBJS.Hooks = function() {
    function a() {}
    return a.prototype.getHooks = function() {
        var a;
        this.hooks = {}, Array.prototype.slice.call(arguments).forEach(function(a) {
            this.hooks[a] = []
        }, this);
        for (var b in this.hooks) a = EPUBJS.core.values(EPUBJS.hooks[b]), a.forEach(function(a) {
            this.registerHook(b, a)
        }, this)
    }, a.prototype.registerHook = function(a, b, c) {
        "undefined" != typeof this.hooks[a] ? "function" == typeof b ? c ? this.hooks[a].unshift(b) : this.hooks[a].push(b) : Array.isArray(b) && b.forEach(
            function(b) {
                c ? this.hooks[a].unshift(b) : this.hooks[a].push(b)
            }, this) : (this.hooks[a] = [b], "function" == typeof b ? this.hooks[a] = [b] : Array.isArray(b) && (this.hooks[a] = [], b.forEach(
            function(b) {
                this.hooks[a].push(b)
            }, this)))
    }, a.prototype.removeHook = function(a, b) {
        var c;
        "undefined" != typeof this.hooks[a] && ("function" == typeof b ? (c = this.hooks[a].indexOf(b), c > -1 && this.hooks[a].splice(c, 1)) : Array.isArray(
            b) && b.forEach(function(b) {
            c = this.hooks[a].indexOf(b), c > -1 && this.hooks[a].splice(c, 1)
        }, this))
    }, a.prototype.triggerHooks = function(a, b, c) {
        function d() {
            f--, 0 >= f && b && b()
        }
        var e, f;
        return "undefined" == typeof this.hooks[a] ? !1 : (e = this.hooks[a], f = e.length, 0 === f && b && b(), void e.forEach(function(a) {
            a(d, c)
        }))
    }, {
        register: function(a) {
            if (void 0 === EPUBJS.hooks[a] && (EPUBJS.hooks[a] = {}), "object" != typeof EPUBJS.hooks[a]) throw "Already registered: " + a;
            return EPUBJS.hooks[a]
        },
        mixin: function(b) {
            for (var c in a.prototype) b[c] = a.prototype[c]
        }
    }
}(), EPUBJS.Layout = EPUBJS.Layout || {}, EPUBJS.Layout.isFixedLayout = function(a) {
    var b = a.querySelector("[name=viewport]");
    if (!b || !b.hasAttribute("content")) return !1;
    var c = b.getAttribute("content");
    return /,/.test(c)
}, EPUBJS.Layout.Reflowable = function() {
    this.documentElement = null, this.spreadWidth = null
}, EPUBJS.Layout.Reflowable.prototype.format = function(a, b, c, d) {
    var e = EPUBJS.core.prefixed("columnAxis"),
        f = EPUBJS.core.prefixed("columnGap"),
        g = EPUBJS.core.prefixed("columnWidth"),
        h = EPUBJS.core.prefixed("columnFill"),
        i = Math.floor(b),
        j = Math.floor(i / 8),
        k = d >= 0 ? d : j % 2 === 0 ? j : j - 1;
    return this.documentElement = a, this.spreadWidth = i + k, a.style.overflow = "hidden", a.style.width = i + "px", a.style.height = c + "px", a.style[e] =
        "horizontal", a.style[h] = "auto", a.style[g] = i + "px", a.style[f] = k + "px", this.colWidth = i, this.gap = k, {
        pageWidth: this.spreadWidth,
        pageHeight: c
    }
}, EPUBJS.Layout.Reflowable.prototype.calculatePages = function() {
    var a, b;
    return this.documentElement.style.width = "auto", a = this.documentElement.scrollWidth, b = Math.ceil(a / this.spreadWidth), {
        displayedPages: b,
        pageCount: b
    }
}, EPUBJS.Layout.ReflowableSpreads = function() {
    this.documentElement = null, this.spreadWidth = null
}, EPUBJS.Layout.ReflowableSpreads.prototype.format = function(a, b, c, d) {
    var e = EPUBJS.core.prefixed("columnAxis"),
        f = EPUBJS.core.prefixed("columnGap"),
        g = EPUBJS.core.prefixed("columnWidth"),
        h = EPUBJS.core.prefixed("columnFill"),
        i = 2,
        j = Math.floor(b),
        k = j % 2 === 0 ? j : j - 1,
        l = Math.floor(k / 8),
        m = d >= 0 ? d : l % 2 === 0 ? l : l - 1,
        n = Math.floor((k - m) / i);
    return this.documentElement = a, this.spreadWidth = (n + m) * i, a.style.overflow = "hidden", a.style.width = k + "px", a.style.height = c + "px", a.style[
        e] = "horizontal", a.style[h] = "auto", a.style[f] = m + "px", a.style[g] = n + "px", this.colWidth = n, this.gap = m, {
        pageWidth: this.spreadWidth,
        pageHeight: c
    }
}, EPUBJS.Layout.ReflowableSpreads.prototype.calculatePages = function() {
    var a = this.documentElement.scrollWidth,
        b = Math.ceil(a / this.spreadWidth);
    return this.documentElement.style.width = b * this.spreadWidth - this.gap + "px", {
        displayedPages: b,
        pageCount: 2 * b
    }
}, EPUBJS.Layout.Fixed = function() {
    this.documentElement = null
}, EPUBJS.Layout.Fixed.prototype.format = function(a, b, c) {
    var d, e, f, g, h = EPUBJS.core.prefixed("columnWidth"),
        i = EPUBJS.core.prefixed("transform"),
        j = EPUBJS.core.prefixed("transformOrigin"),
        k = a.querySelector("[name=viewport]");
    this.documentElement = a, k && k.hasAttribute("content") && (d = k.getAttribute("content"), e = d.split(","), e[0] && (f = e[0].replace("width=", "")),
    e[1] && (g = e[1].replace("height=", "")));
    var l = b / f,
        m = c / g,
        n = m > l ? l : m;
    return a.style.position = "absolute", a.style.top = "50%", a.style.left = "50%", a.style[i] = "scale(" + n + ") translate(-50%, -50%)", a.style[j] =
        "0px 0px 0px", a.style.width = f + "px" || "auto", a.style.height = g + "px" || "auto", a.style[h] = "auto", a.style.overflow = "auto", this.colWidth =
        f, this.gap = 0, {
        pageWidth: f,
        pageHeight: g
    }
}, EPUBJS.Layout.Fixed.prototype.calculatePages = function() {
    return {
        displayedPages: 1,
        pageCount: 1
    }
}, EPUBJS.Locations = function(a, b, c) {
    this.spine = a, this.store = b, this.credentials = c, this.epubcfi = new EPUBJS.EpubCFI, this._locations = [], this.total = 0, this.break = 150, this._current =
        0
}, EPUBJS.Locations.prototype.generate = function(a) {
    var b, c = new RSVP.defer,
        d = -1,
        e = this.spine.length,
        f = function(a) {
            var b, c = d + 1,
                g = a || new RSVP.defer;
            return c >= e ? g.resolve() : (d = c, b = new EPUBJS.Chapter(this.spine[d], this.store, this.credentials), this.process(b).then(function() {
                setTimeout(function() {
                    f(g)
                }, 1)
            })), g.promise
        }.bind(this);
    return "number" == typeof a && (this.break = a), b = f().then(function() {
        this.total = this._locations.length - 1, this._currentCfi && (this.currentLocation = this._currentCfi), c.resolve(this._locations)
    }.bind(this)), c.promise
}, EPUBJS.Locations.prototype.process = function(a) {
    return a.load().then(function(b) {
        var c, d, e, f = b,
            g = f.documentElement.querySelector("body"),
            h = 0;
        this.sprint(g, function(b) {
            var g, i = b.length,
                j = 0;
            for (0 === h && (c = f.createRange(), c.setStart(b, 0)), g = this.break-h, g > i && (h += i, j = i); i > j;) h = this.break, j +=
                this.break, j >= i ? h = i - (j - this.break) : (c.setEnd(b, j), e = a.cfiFromRange(c), this._locations.push(e), h = 0, j +=
                1, c = f.createRange(), c.setStart(b, j));
            d = b
        }.bind(this)), c && (c.setEnd(d, d.length), e = a.cfiFromRange(c), this._locations.push(e), h = 0)
    }.bind(this))
}, EPUBJS.Locations.prototype.sprint = function(a, b) {
    for (var c, d = document.createTreeWalker(a, NodeFilter.SHOW_TEXT, null, !1); c = d.nextNode();) b(c)
}, EPUBJS.Locations.prototype.locationFromCfi = function(a) {
    return 0 === this._locations.length ? -1 : EPUBJS.core.locationOf(a, this._locations, this.epubcfi.compare)
}, EPUBJS.Locations.prototype.percentageFromCfi = function(a) {
    var b = this.locationFromCfi(a);
    return this.percentageFromLocation(b)
}, EPUBJS.Locations.prototype.percentageFromLocation = function(a) {
    return a && this.total ? a / this.total : 0
}, EPUBJS.Locations.prototype.cfiFromLocation = function(a) {
    var b = -1;
    return "number" != typeof a && (a = parseInt(a)), a >= 0 && a < this._locations.length && (b = this._locations[a]), b
}, EPUBJS.Locations.prototype.cfiFromPercentage = function(a) {
    var b = a > 1 ? a / 100 : a,
        c = Math.ceil(this.total * b);
    return this.cfiFromLocation(c)
}, EPUBJS.Locations.prototype.load = function(a) {
    return this._locations = JSON.parse(a), this.total = this._locations.length - 1, this._locations
}, EPUBJS.Locations.prototype.save = function() {
    return JSON.stringify(this._locations)
}, EPUBJS.Locations.prototype.getCurrent = function() {
    return this._current
}, EPUBJS.Locations.prototype.setCurrent = function(a) {
    var b;
    if ("string" == typeof a) this._currentCfi = a;
    else {
        if ("number" != typeof a) return;
        this._current = a
    }
    0 !== this._locations.length && ("string" == typeof a ? (b = this.locationFromCfi(a), this._current = b) : b = a, this.trigger("changed", {
        percentage: this.percentageFromLocation(b)
    }))
}, Object.defineProperty(EPUBJS.Locations.prototype, "currentLocation", {
    get: function() {
        return this._current
    },
    set: function(a) {
        this.setCurrent(a)
    }
}), RSVP.EventTarget.mixin(EPUBJS.Locations.prototype), EPUBJS.Pagination = function(a) {
    this.pages = [], this.locations = [], this.epubcfi = new EPUBJS.EpubCFI, a && a.length && this.process(a)
}, EPUBJS.Pagination.prototype.process = function(a) {
    a.forEach(function(a) {
        this.pages.push(a.page), this.locations.push(a.cfi)
    }, this), this.pageList = a, this.firstPage = parseInt(this.pages[0]), this.lastPage = parseInt(this.pages[this.pages.length - 1]), this.totalPages =
        this.lastPage - this.firstPage
}, EPUBJS.Pagination.prototype.pageFromCfi = function(a) {
    var b = -1;
    if (0 === this.locations.length) return -1;
    var c = EPUBJS.core.indexOfSorted(a, this.locations, this.epubcfi.compare);
    return -1 != c ? b = this.pages[c] : (c = EPUBJS.core.locationOf(a, this.locations, this.epubcfi.compare), b = c - 1 >= 0 ? this.pages[c - 1] : this.pages[
        0], void 0 !== b || (b = -1)), b
}, EPUBJS.Pagination.prototype.cfiFromPage = function(a) {
    var b = -1;
    "number" != typeof a && (a = parseInt(a));
    var c = this.pages.indexOf(a);
    return -1 != c && (b = this.locations[c]), b
}, EPUBJS.Pagination.prototype.pageFromPercentage = function(a) {
    var b = Math.round(this.totalPages * a);
    return b
}, EPUBJS.Pagination.prototype.percentageFromPage = function(a) {
    var b = (a - this.firstPage) / this.totalPages;
    return Math.round(1e3 * b) / 1e3
}, EPUBJS.Pagination.prototype.percentageFromCfi = function(a) {
    var b = this.pageFromCfi(a),
        c = this.percentageFromPage(b);
    return c
}, EPUBJS.Parser = function(a) {
    this.baseUrl = a || ""
}, EPUBJS.Parser.prototype.container = function(a) {
    var b, c, d, e;
    return a ? (b = a.querySelector("rootfile")) ? (c = b.getAttribute("full-path"), d = EPUBJS.core.uri(c).directory, e = a.xmlEncoding, {
        packagePath: c,
        basePath: d,
        encoding: e
    }) : void console.error("No RootFile Found") : void console.error("Container File Not Found")
}, EPUBJS.Parser.prototype.identifier = function(a) {
    var b;
    return a ? (b = a.querySelector("metadata"), b ? this.getElementText(b, "identifier") : void console.error("No Metadata Found")) : void console.error(
        "Package File Not Found")
}, EPUBJS.Parser.prototype.packageContents = function(a, b) {
    var c, d, e, f, g, h, i, j, k, l, m, n = this;
    return b && (this.baseUrl = b), a ? (c = a.querySelector("metadata")) ? (d = a.querySelector("manifest")) ? (e = a.querySelector("spine")) ? (f = n.manifest(
        d), g = n.findNavPath(d), h = n.findTocPath(d, e), i = n.findCoverPath(a), j = Array.prototype.indexOf.call(e.parentNode.childNodes, e), k =
        n.spine(e, f), l = {}, k.forEach(function(a) {
        l[a.href] = a.index
    }), m = n.metadata(c), m.direction = e.getAttribute("page-progression-direction"), {
        metadata: m,
        spine: k,
        manifest: f,
        navPath: g,
        tocPath: h,
        coverPath: i,
        spineNodeIndex: j,
        spineIndexByURL: l
    }) : void console.error("No Spine Found") : void console.error("No Manifest Found") : void console.error("No Metadata Found") : void console.error(
        "Package File Not Found")
}, EPUBJS.Parser.prototype.findNavPath = function(a) {
    var b = a.querySelector("item[properties$='nav'], item[properties^='nav '], item[properties*=' nav ']");
    return b ? b.getAttribute("href") : !1
}, EPUBJS.Parser.prototype.findTocPath = function(a, b) {
    var c, d = a.querySelector("item[media-type='application/x-dtbncx+xml']");
    return d || (c = b.getAttribute("toc"), c && (d = a.querySelector("item[id='" + c + "']"))), d ? d.getAttribute("href") : !1
}, EPUBJS.Parser.prototype.metadata = function(a) {
    var b = {},
        c = this;
    return b.bookTitle = c.getElementText(a, "title"), b.creator = c.getElementText(a, "creator"), b.description = c.getElementText(a, "description"), b.pubdate =
        c.getElementText(a, "date"), b.publisher = c.getElementText(a, "publisher"), b.identifier = c.getElementText(a, "identifier"), b.language = c.getElementText(
        a, "language"), b.rights = c.getElementText(a, "rights"), b.modified_date = c.querySelectorText(a, "meta[property='dcterms:modified']"), b.layout =
        c.querySelectorText(a, "meta[property='rendition:layout']"), b.orientation = c.querySelectorText(a, "meta[property='rendition:orientation']"), b.spread =
        c.querySelectorText(a, "meta[property='rendition:spread']"), b
}, EPUBJS.Parser.prototype.findCoverPath = function(a) {
    var b = a.querySelector("package").getAttribute("version");
    if ("2.0" === b) {
        var c = a.querySelector('meta[name="cover"]');
        if (c) {
            var d = c.getAttribute("content"),
                e = a.querySelector("item[id='" + d + "']");
            return e ? e.getAttribute("href") : !1
        }
        return !1
    }
    var f = a.querySelector("item[properties='cover-image']");
    return f ? f.getAttribute("href") : !1
}, EPUBJS.Parser.prototype.getElementText = function(a, b) {
    var c, d = a.getElementsByTagNameNS("http://purl.org/dc/elements/1.1/", b);
    return d && 0 !== d.length ? (c = d[0], c.childNodes.length ? c.childNodes[0].nodeValue : "") : ""
}, EPUBJS.Parser.prototype.querySelectorText = function(a, b) {
    var c = a.querySelector(b);
    return c && c.childNodes.length ? c.childNodes[0].nodeValue : ""
}, EPUBJS.Parser.prototype.manifest = function(a) {
    var b = this.baseUrl,
        c = {},
        d = a.querySelectorAll("item"),
        e = Array.prototype.slice.call(d);
    return e.forEach(function(a) {
        var d = a.getAttribute("id"),
            e = a.getAttribute("href") || "",
            f = a.getAttribute("media-type") || "",
            g = a.getAttribute("properties") || "";
        c[d] = {
            href: e,
            url: b + e,
            type: f,
            properties: g
        }
    }), c
}, EPUBJS.Parser.prototype.spine = function(a, b) {
    var c = [],
        d = a.getElementsByTagName("itemref"),
        e = Array.prototype.slice.call(d),
        f = Array.prototype.indexOf.call(a.parentNode.childNodes, a),
        g = new EPUBJS.EpubCFI;
    return e.forEach(function(a, d) {
        var e = a.getAttribute("idref"),
            h = g.generateChapterComponent(f, d, e),
            i = a.getAttribute("properties") || "",
            j = i.length ? i.split(" ") : [],
            k = b[e].properties,
            l = k.length ? k.split(" ") : [],
            m = {
                id: e,
                linear: a.getAttribute("linear") || "",
                properties: j,
                manifestProperties: l,
                href: b[e].href,
                url: b[e].url,
                index: d,
                cfiBase: h,
                cfi: "epubcfi(" + h + ")"
            };
        c.push(m)
    }), c
}, EPUBJS.Parser.prototype.querySelectorByType = function(a, b, c) {
    var d = a.querySelector(b + '[*|type="' + c + '"]');
    if (null !== d && 0 !== d.length) return d;
    d = a.querySelectorAll(b);
    for (var e = 0; e < d.length; e++)
        if (d[e].getAttributeNS("http://www.idpf.org/2007/ops", "type") === c) return d[e]
}, EPUBJS.Parser.prototype.nav = function(a, b, c) {
    var d, e, f, g = this.querySelectorByType(a, "nav", "toc"),
        h = g ? g.querySelectorAll("ol li") : [],
        i = h.length,
        j = {},
        k = [];
    if (!h || 0 === i) return k;
    for (d = 0; i > d; ++d) e = this.navItem(h[d], b, c), j[e.id] = e, e.parent ? (f = j[e.parent], f.subitems.push(e)) : k.push(e);
    return k
}, EPUBJS.Parser.prototype.navItem = function(a, b, c) {
    var d, e = a.getAttribute("id") || !1,
        f = a.querySelector("a, span"),
        g = f.getAttribute("href") || "",
        h = f.textContent || "",
        i = g.split("#"),
        j = i[0],
        k = b[j],
        l = c[k],
        m = [],
        n = a.parentNode,
        o = l ? l.cfi : "";
    return n && "navPoint" === n.nodeName && (d = n.getAttribute("id")), e || (k ? (l = c[k], e = l.id, o = l.cfi) : (e = "epubjs-autogen-toc-id-" + EPUBJS
            .core.uuid(), a.setAttribute("id", e))), {
        id: e,
        href: g,
        label: h,
        spinePos: k,
        subitems: m,
        parent: d,
        cfi: o
    }
}, EPUBJS.Parser.prototype.toc = function(a, b, c) {
    var d, e, f, g = a.querySelectorAll("navMap navPoint"),
        h = g.length,
        i = {},
        j = [];
    if (!g || 0 === h) return j;
    for (d = 0; h > d; ++d) e = this.tocItem(g[d], b, c), i[e.id] = e, e.parent ? (f = i[e.parent], f.subitems.push(e)) : j.push(e);
    return j
}, EPUBJS.Parser.prototype.tocItem = function(a, b, c) {
    var d, e = a.getAttribute("id") || !1,
        f = a.querySelector("content"),
        g = f.getAttribute("src"),
        h = a.querySelector("navLabel"),
        i = h.textContent ? h.textContent : "",
        j = g.split("#"),
        k = j[0],
        l = b[k],
        m = c[l],
        n = [],
        o = a.parentNode,
        p = m ? m.cfi : "";
    return o && "navPoint" === o.nodeName && (d = o.getAttribute("id")), e || (l ? (m = c[l], e = m.id, p = m.cfi) : (e = "epubjs-autogen-toc-id-" + EPUBJS
            .core.uuid(), a.setAttribute("id", e))), {
        id: e,
        href: g,
        label: i,
        spinePos: l,
        subitems: n,
        parent: d,
        cfi: p
    }
}, EPUBJS.Parser.prototype.pageList = function(a, b, c) {
    var d, e, f = this.querySelectorByType(a, "nav", "page-list"),
        g = f ? f.querySelectorAll("ol li") : [],
        h = g.length,
        i = [];
    if (!g || 0 === h) return i;
    for (d = 0; h > d; ++d) e = this.pageListItem(g[d], b, c), i.push(e);
    return i
}, EPUBJS.Parser.prototype.pageListItem = function(a) {
    var b, c, d, e = (a.getAttribute("id") || !1, a.querySelector("a")),
        f = e.getAttribute("href") || "",
        g = e.textContent || "",
        h = parseInt(g),
        i = f.indexOf("epubcfi");
    return -1 != i ? (b = f.split("#"), c = b[0], d = b.length > 1 ? b[1] : !1, {
        cfi: d,
        href: f,
        packageUrl: c,
        page: h
    }) : {
        href: f,
        page: h
    }
}, EPUBJS.Render.Iframe = function() {
    this.iframe = null, this.document = null, this.window = null, this.docEl = null, this.bodyEl = null, this.leftPos = 0, this.pageWidth = 0, this.id =
        EPUBJS.core.uuid()
}, EPUBJS.Render.Iframe.prototype.create = function() {
    return this.element = document.createElement("div"), this.element.id = "epubjs-view:" + this.id, this.isMobile = navigator.userAgent.match(
        /(iPad|iPhone|iPod|Mobile|Android)/g), this.transform = EPUBJS.core.prefixed("transform"), this.element
}, EPUBJS.Render.Iframe.prototype.addIframe = function() {
    return this.iframe = document.createElement("iframe"), this.iframe.id = "epubjs-iframe:" + this.id, this.iframe.scrolling = this.scrolling || "no",
        this.iframe.seamless = "seamless", this.iframe.style.border = "none", this.iframe.addEventListener("load", this.loaded.bind(this), !1), (this._width ||
    this._height) && (this.iframe.height = this._height, this.iframe.width = this._width), this.iframe
}, EPUBJS.Render.Iframe.prototype.load = function(a) {
    var b = this,
        c = new RSVP.defer;
    return this.window && this.unload(), this.iframe && this.element.removeChild(this.iframe), this.iframe = this.addIframe(), this.element.appendChild(
        this.iframe), this.iframe.onload = function() {
        b.document = b.iframe.contentDocument, b.docEl = b.document.documentElement, b.headEl = b.document.head, b.bodyEl = b.document.body || b.document
                .querySelector("body"), b.window = b.iframe.contentWindow, b.window.addEventListener("resize", b.resized.bind(b), !1), b.leftPos = 0, b.setLeft(
            0), b.bodyEl && (b.bodyEl.style.margin = "0"), c.resolve(b.docEl)
    }, this.iframe.onerror = function(a) {
        c.reject({
            message: "Error Loading Contents: " + a,
            stack: (new Error).stack
        })
    }, this.document = this.iframe.contentDocument, this.document ? (this.iframe.contentDocument.open(), this.iframe.contentDocument.write(a), this.iframe
        .contentDocument.close(), c.promise) : (c.reject(new Error("No Document Available")), c.promise)
}, EPUBJS.Render.Iframe.prototype.loaded = function() {
    var a, b, c = this.iframe.contentWindow.location.href;
    this.document = this.iframe.contentDocument, this.docEl = this.document.documentElement, this.headEl = this.document.head, this.bodyEl = this.document.body ||
        this.document.querySelector("body"), this.window = this.iframe.contentWindow, "about:blank" != c && (a = this.iframe.contentDocument.querySelector(
        "base"), b = a.getAttribute("href"), this.trigger("render:loaded", b))
}, EPUBJS.Render.Iframe.prototype.resize = function(a, b) {
    this.element && (this.element.style.height = b, isNaN(a) || a % 2 === 0 || (a += 1), this.element.style.width = a, this.iframe && (this.iframe.height =
        b, this.iframe.width = a), this._height = b, this._width = a, this.width = this.element.getBoundingClientRect().width || a, this.height =
        this.element.getBoundingClientRect().height || b)
}, EPUBJS.Render.Iframe.prototype.resized = function() {
    this.width = this.iframe.getBoundingClientRect().width, this.height = this.iframe.getBoundingClientRect().height
}, EPUBJS.Render.Iframe.prototype.totalWidth = function() {
    return this.docEl.scrollWidth
}, EPUBJS.Render.Iframe.prototype.totalHeight = function() {
    return this.docEl.scrollHeight
}, EPUBJS.Render.Iframe.prototype.setPageDimensions = function(a, b) {
    this.pageWidth = a, this.pageHeight = b
}, EPUBJS.Render.Iframe.prototype.setDirection = function(a) {
    this.direction = a, this.docEl && "rtl" == this.docEl.dir && (this.docEl.dir = "rtl", "pre-paginated" !== this.layout && (this.docEl.style.position =
        "static", this.docEl.style.right = "auto"))
}, EPUBJS.Render.Iframe.prototype.setLeft = function(a) {
    this.isMobile ? this.docEl.style[this.transform] = "translate(" + -a + "px, 0)" : this.document.defaultView.scrollTo(a, 0)
}, EPUBJS.Render.Iframe.prototype.setLayout = function(a) {
    this.layout = a
}, EPUBJS.Render.Iframe.prototype.setStyle = function(a, b, c) {
    c && (a = EPUBJS.core.prefixed(a)), this.bodyEl && (this.bodyEl.style[a] = b)
}, EPUBJS.Render.Iframe.prototype.removeStyle = function(a) {
    this.bodyEl && (this.bodyEl.style[a] = "")
}, EPUBJS.Render.Iframe.prototype.addHeadTag = function(a, b, c) {
    var d = c || this.document,
        e = d.createElement(a),
        f = d.head;
    for (var g in b) e.setAttribute(g, b[g]);
    f && f.insertBefore(e, f.firstChild)
}, EPUBJS.Render.Iframe.prototype.page = function(a) {
    this.leftPos = this.pageWidth * (a - 1), "rtl" === this.direction && (this.leftPos = -1 * this.leftPos), this.setLeft(this.leftPos)
}, EPUBJS.Render.Iframe.prototype.getPageNumberByElement = function(a) {
    var b, c;
    if (a) return b = this.leftPos + a.getBoundingClientRect().left, c = Math.floor(b / this.pageWidth) + 1
}, EPUBJS.Render.Iframe.prototype.getPageNumberByRect = function(a) {
    var b, c;
    return b = this.leftPos + a.left, c = Math.floor(b / this.pageWidth) + 1
}, EPUBJS.Render.Iframe.prototype.getBaseElement = function() {
    return this.bodyEl
}, EPUBJS.Render.Iframe.prototype.getDocumentElement = function() {
    return this.docEl
}, EPUBJS.Render.Iframe.prototype.isElementVisible = function(a) {
    var b, c;
    return a && "function" == typeof a.getBoundingClientRect && (b = a.getBoundingClientRect(), c = b.left, 0 !== b.width && 0 !== b.height && c >= 0 && c <
    this.pageWidth) ? !0 : !1
}, EPUBJS.Render.Iframe.prototype.scroll = function(a) {
    this.scrolling = a ? "yes" : "no"
}, EPUBJS.Render.Iframe.prototype.unload = function() {
    this.window.removeEventListener("resize", this.resized), this.iframe.removeEventListener("load", this.loaded)
}, RSVP.EventTarget.mixin(EPUBJS.Render.Iframe.prototype), EPUBJS.Renderer = function(a, b) {
    this.listenedEvents = ["keydown", "keyup", "keypressed", "mouseup", "mousedown", "click"], this.upEvent = "mouseup", this.downEvent = "mousedown",
    "ontouchstart" in document.documentElement && (this.listenedEvents.push("touchstart", "touchend"), this.upEvent = "touchend", this.downEvent =
        "touchstart"), a && "undefined" != typeof EPUBJS.Render[a] ? this.render = new EPUBJS.Render[a] : console.error("Not a Valid Rendering Method"),
        this.render.on("render:loaded", this.loaded.bind(this)), this.caches = {}, this.epubcfi = new EPUBJS.EpubCFI, this.spreads = !0, this.isForcedSingle = !
        1, this.resized = this.onResized.bind(this), this.layoutSettings = {}, this.hidden = b || !1, EPUBJS.Hooks.mixin(this), this.getHooks(
        "beforeChapterDisplay"), this._q = EPUBJS.core.queue(this), this._moving = !1
}, EPUBJS.Renderer.prototype.Events = ["renderer:keydown", "renderer:keyup", "renderer:keypressed", "renderer:mouseup", "renderer:mousedown",
    "renderer:click", "renderer:touchstart", "renderer:touchend", "renderer:selected", "renderer:chapterUnload", "renderer:chapterUnloaded",
    "renderer:chapterDisplayed", "renderer:locationChanged", "renderer:visibleLocationChanged", "renderer:visibleRangeChanged", "renderer:resized",
    "renderer:spreads"
], EPUBJS.Renderer.prototype.initialize = function(a, b, c) {
    this.container = a, this.element = this.render.create(), this.initWidth = b, this.initHeight = c, this.width = b || this.container.clientWidth, this.height =
        c || this.container.clientHeight, this.container.appendChild(this.element), b && c ? this.render.resize(this.width, this.height) : this.render.resize(
        "100%", "100%"), document.addEventListener("orientationchange", this.onResized.bind(this))
}, EPUBJS.Renderer.prototype.displayChapter = function(a, b) {
    if (this._moving) {
        console.warning("Rendering In Progress");
        var c = new RSVP.defer;
        return c.reject({
            message: "Rendering In Progress",
            stack: (new Error).stack
        }), c.promise
    }
    return this._moving = !0, a.render().then(function(c) {
        return this.currentChapter && (this.trigger("renderer:chapterUnload"), this.currentChapter.unload(), this.render.window && this.render.window
            .removeEventListener("resize", this.resized), this.removeEventListeners(), this.removeSelectionListeners(), this.trigger(
            "renderer:chapterUnloaded"), this.contents = null, this.doc = null, this.pageMap = null), this.currentChapter = a, this.chapterPos =
            1, this.currentChapterCfiBase = a.cfiBase, this.layoutSettings = this.reconcileLayoutSettings(b, a.properties), this.load(c, a.href)
    }.bind(this), function() {
        this._moving = !1
    }.bind(this))
}, EPUBJS.Renderer.prototype.load = function(a, b) {
    var c = new RSVP.defer;
    return this.layoutMethod = this.determineLayout(this.layoutSettings), this.layout = new EPUBJS.Layout[this.layoutMethod], this.visible(!1), this.render
        .load(a, b).then(function(a) {
            EPUBJS.Layout.isFixedLayout(a) && (this.layoutSettings.layout = "pre-paginated", this.layoutMethod = this.determineLayout(this.layoutSettings),
                this.layout = new EPUBJS.Layout[this.layoutMethod]), this.render.setLayout(this.layoutSettings.layout), "rtl" == this.render.direction &&
            "rtl" != this.render.docEl.dir && (this.render.docEl.dir = "rtl", "pre-paginated" !== this.render.layout && (this.render.docEl.style.position =
                "absolute", this.render.docEl.style.right = "0")), this.afterLoad(a), this.beforeDisplay(function() {
                this.afterDisplay(), this.visible(!0), c.resolve(this)
            }.bind(this))
        }.bind(this)), c.promise
}, EPUBJS.Renderer.prototype.afterLoad = function(a) {
    this.contents = a, this.doc = this.render.document, this.formated = this.layout.format(a, this.render.width, this.render.height, this.gap), this.render
        .setPageDimensions(this.formated.pageWidth, this.formated.pageHeight), this.initWidth || this.initHeight || this.render.window.addEventListener(
        "resize", this.resized, !1), this.addEventListeners(), this.addSelectionListeners()
}, EPUBJS.Renderer.prototype.afterDisplay = function() {
    var a = this.layout.calculatePages(),
        b = this.currentChapter,
        c = this._q.length();
    this._moving = !1, this.updatePages(a), this.visibleRangeCfi = this.getVisibleRangeCfi(), this.currentLocationCfi = this.visibleRangeCfi.start, 0 ===
    c && (this.trigger("renderer:locationChanged", this.currentLocationCfi), this.trigger("renderer:visibleRangeChanged", this.visibleRangeCfi)), b.cfi =
        this.currentLocationCfi, this.trigger("renderer:chapterDisplayed", b)
}, EPUBJS.Renderer.prototype.loaded = function(a) {
    this.trigger("render:loaded", a)
}, EPUBJS.Renderer.prototype.reconcileLayoutSettings = function(a, b) {
    var c = {};
    for (var d in a) a.hasOwnProperty(d) && (c[d] = a[d]);
    return b.forEach(function(a) {
        var b, d, e = a.replace("rendition:", ""),
            f = e.indexOf("-"); - 1 != f && (b = e.slice(0, f), d = e.slice(f + 1), c[b] = d)
    }), c
}, EPUBJS.Renderer.prototype.determineLayout = function(a) {
    var b = this.determineSpreads(this.minSpreadWidth),
        c = b ? "ReflowableSpreads" : "Reflowable",
        d = !1;
    return "pre-paginated" === a.layout && (c = "Fixed", d = !0, b = !1), "reflowable" === a.layout && "none" === a.spread && (c = "Reflowable", d = !1, b = !
        1), "reflowable" === a.layout && "both" === a.spread && (c = "ReflowableSpreads", d = !1, b = !0), this.spreads = b, this.render.scroll(d),
        this.trigger("renderer:spreads", b), c
}, EPUBJS.Renderer.prototype.beforeDisplay = function(a) {
    this.triggerHooks("beforeChapterDisplay", a, this)
}, EPUBJS.Renderer.prototype.updatePages = function() {
    this.pageMap = this.mapPage(), this.displayedPages = this.spreads ? Math.ceil(this.pageMap.length / 2) : this.pageMap.length, this.currentChapter.pages =
        this.pageMap.length, this._q.flush()
}, EPUBJS.Renderer.prototype.reformat = function() {
    var a, b, c = this;
    this.contents && (b = this.determineSpreads(this.minSpreadWidth), b != this.spreads && (this.spreads = b, this.layoutMethod = this.determineLayout(this
        .layoutSettings), this.layout = new EPUBJS.Layout[this.layoutMethod]), this.chapterPos = 1, this.render.page(this.chapterPos), c.formated =
        c.layout.format(c.render.docEl, c.render.width, c.render.height, c.gap), c.render.setPageDimensions(c.formated.pageWidth, c.formated.pageHeight),
        a = c.layout.calculatePages(), c.updatePages(a), c.currentLocationCfi && c.gotoCfi(c.currentLocationCfi))
}, EPUBJS.Renderer.prototype.visible = function(a) {
    return "undefined" == typeof a ? this.element.style.visibility : void(a !== !0 || this.hidden ? a === !1 && (this.element.style.visibility = "hidden") :
        this.element.style.visibility = "visible")
}, EPUBJS.Renderer.prototype.remove = function() {
    this.render.window && (this.render.unload(), this.render.window.removeEventListener("resize", this.resized), this.removeEventListeners(), this.removeSelectionListeners()),
        this.container.removeChild(this.element)
}, EPUBJS.Renderer.prototype.applyStyles = function(a) {
    for (var b in a) this.render.setStyle(b, a[b])
}, EPUBJS.Renderer.prototype.setStyle = function(a, b, c) {
    this.render.setStyle(a, b, c)
}, EPUBJS.Renderer.prototype.removeStyle = function(a) {
    this.render.removeStyle(a)
}, EPUBJS.Renderer.prototype.applyHeadTags = function(a) {
    for (var b in a) this.render.addHeadTag(b, a[b])
}, EPUBJS.Renderer.prototype.page = function(a) {
    return this.pageMap ? a >= 1 && a <= this.displayedPages ? (this.chapterPos = a, this.render.page(a), this.visibleRangeCfi = this.getVisibleRangeCfi(),
        this.currentLocationCfi = this.visibleRangeCfi.start, this.trigger("renderer:locationChanged", this.currentLocationCfi), this.trigger(
        "renderer:visibleRangeChanged", this.visibleRangeCfi), !0) : !1 : (console.warn("pageMap not set, queuing"), this._q.enqueue("page",
        arguments), !0)
}, EPUBJS.Renderer.prototype.nextPage = function() {
    return this.page(this.chapterPos + 1)
}, EPUBJS.Renderer.prototype.prevPage = function() {
    return this.page(this.chapterPos - 1)
}, EPUBJS.Renderer.prototype.pageByElement = function(a) {
    var b;
    a && (b = this.render.getPageNumberByElement(a), this.page(b))
}, EPUBJS.Renderer.prototype.lastPage = function() {
    return this._moving ? this._q.enqueue("lastPage", arguments) : void this.page(this.displayedPages)
}, EPUBJS.Renderer.prototype.firstPage = function() {
    return this._moving ? this._q.enqueue("firstPage", arguments) : void this.page(1)
}, EPUBJS.Renderer.prototype.section = function(a) {
    var b = this.doc.getElementById(a);
    b && this.pageByElement(b)
}, EPUBJS.Renderer.prototype.firstElementisTextNode = function(a) {
    var b = a.childNodes,
        c = b.length;
    return c && b[0] && 3 === b[0].nodeType && b[0].textContent.trim().length ? !0 : !1
}, EPUBJS.Renderer.prototype.isGoodNode = function(a) {
    var b = ["audio", "canvas", "embed", "iframe", "img", "math", "object", "svg", "video"];
    return -1 !== b.indexOf(a.tagName.toLowerCase()) ? !0 : this.firstElementisTextNode(a)
}, EPUBJS.Renderer.prototype.walk = function(a, b, c) {
    for (var d, e, f, g, h = a, i = [h], j = 1e4, k = 0; !d && i.length;) {
        if (a = i.shift(), this.containsPoint(a, b, c) && this.isGoodNode(a) && (d = a), !d && a && a.childElementCount > 0) {
            if (e = a.children, !e || !e.length) return d;
            f = e.length ? e.length : 0;
            for (var l = f - 1; l >= 0; l--) e[l] != g && i.unshift(e[l])
        }
        if (!d && 0 === i.length && h && null !== h.parentNode && (i.push(h.parentNode), g = h, h = h.parentNode), k++, k > j) {
            console.error("ENDLESS LOOP");
            break
        }
    }
    return d
}, EPUBJS.Renderer.prototype.containsPoint = function(a, b) {
    var c;
    return a && "function" == typeof a.getBoundingClientRect && (c = a.getBoundingClientRect(), 0 !== c.width && 0 !== c.height && c.left >= b && b <= c.left +
    c.width) ? !0 : !1
}, EPUBJS.Renderer.prototype.textSprint = function(a, b) {
    var c, d, e = function(a) {
        return /^\s*$/.test(a.data) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
    };
    try {
        for (c = document.createTreeWalker(a, NodeFilter.SHOW_TEXT, {
            acceptNode: e
        }, !1); d = c.nextNode();) b(d)
    } catch (f) {
        for (c = document.createTreeWalker(a, NodeFilter.SHOW_TEXT, e, !1); d = c.nextNode();) b(d)
    }
}, EPUBJS.Renderer.prototype.sprint = function(a, b) {
    for (var c, d = document.createTreeWalker(a, NodeFilter.SHOW_ELEMENT, null, !1); c = d.nextNode();) b(c)
}, EPUBJS.Renderer.prototype.mapPage = function() {
    var a, b, c, d, e, f, g, h, i = this,
        j = [],
        k = this.render.getBaseElement(),
        l = 1,
        m = this.layout.colWidth + this.layout.gap,
        n = this.formated.pageWidth * (this.chapterPos - 1),
        o = m * l - n,
        p = 0,
        q = function(b) {
            var c, e, f;
            if (b.nodeType == Node.TEXT_NODE) {
                if (e = document.createRange(), e.selectNodeContents(b), c = e.getBoundingClientRect(), !c || 0 === c.width && 0 === c.height) return;
                c.left > p && (f = r(b)), c.right > p && (f = r(b)), d = b, f && (a = null)
            }
        },
        r = function(e) {
            var f, g = i.splitTextNodeIntoWordsRanges(e);
            return g.forEach(function(e) {
                var g = e.getBoundingClientRect();
                !g || 0 === g.width && 0 === g.height || (g.left + g.width < o ? j[l - 1] || (e.collapse(!0), c = i.currentChapter.cfiFromRange(e),
                    f = j.push({
                        start: c,
                        end: null
                    })) : (!a && d && (b = i.splitTextNodeIntoWordsRanges(d), a = b[b.length - 1]), a && j.length && (a.collapse(!1), c = i
                    .currentChapter.cfiFromRange(a), j[j.length - 1] && (j[j.length - 1].end = c)), e.collapse(!0), c = i.currentChapter
                    .cfiFromRange(e), f = j.push({
                    start: c,
                    end: null
                }), l += 1, o = m * l - n, p = o), a = e)
            }), f
        },
        s = this.render.getDocumentElement(),
        t = s.dir;
    return "rtl" == t && (s.dir = "ltr", "pre-paginated" !== this.layoutSettings.layout && (s.style.position = "static")), this.textSprint(k, q), "rtl" ==
    t && (s.dir = t, "pre-paginated" !== this.layoutSettings.layout && (s.style.left = "auto", s.style.right = "0")), !a && d && (b = i.splitTextNodeIntoWordsRanges(
        d), a = b[b.length - 1]), a && (a.collapse(!1), c = i.currentChapter.cfiFromRange(a), j[j.length - 1].end = c), j.length || (e = this.doc.createRange(),
        e.selectNodeContents(k), e.collapse(!0), g = i.currentChapter.cfiFromRange(e), f = this.doc.createRange(), f.selectNodeContents(k), f.collapse(!
        1), h = i.currentChapter.cfiFromRange(f), j.push({
        start: g,
        end: h
    })), a = null, b = void 0, e = null, f = null, k = null, j
}, EPUBJS.Renderer.prototype.indexOfBreakableChar = function(a, b) {
    var c = "- 	\r\n\b\f";
    b || (b = 0);
    for (var d = b; d < a.length; d++)
        if (-1 != c.indexOf(a.charAt(d))) return d;
    return -1
}, EPUBJS.Renderer.prototype.splitTextNodeIntoWordsRanges = function(a) {
    var b, c = [],
        d = a.textContent.trim(),
        e = this.indexOfBreakableChar(d);
    if (-1 === e) return b = this.doc.createRange(), b.selectNodeContents(a), [b];
    for (b = this.doc.createRange(), b.setStart(a, 0), b.setEnd(a, e), c.push(b), b = this.doc.createRange(), b.setStart(a, e + 1); - 1 != e;) e = this.indexOfBreakableChar(
        d, e + 1), e > 0 && (b && (b.setEnd(a, e), c.push(b)), b = this.doc.createRange(), b.setStart(a, e + 1));
    return b && (b.setEnd(a, d.length), c.push(b)), c
}, EPUBJS.Renderer.prototype.rangePosition = function(a) {
    var b, c;
    return c = a.getClientRects(), c.length ? b = c[0] : null
}, EPUBJS.Renderer.prototype.getPageCfi = function() {
    var a = 2 * this.chapterPos - 1;
    return this.pageMap[a].start
}, EPUBJS.Renderer.prototype.getRange = function(a, b, c) {
    var d, e = this.doc.createRange();
    return c = !0, "undefined" == typeof document.caretPositionFromPoint || c ? "undefined" == typeof document.caretRangeFromPoint || c ? (this.visibileEl =
        this.findElementAfter(a, b), e.setStart(this.visibileEl, 1)) : e = this.doc.caretRangeFromPoint(a, b) : (d = this.doc.caretPositionFromPoint(a,
        b), e.setStart(d.offsetNode, d.offset)), e
}, EPUBJS.Renderer.prototype.pagesInCurrentChapter = function() {
    var a;
    return this.pageMap ? a = this.pageMap.length : (console.warn("page map not loaded"), !1)
}, EPUBJS.Renderer.prototype.currentRenderedPage = function() {
    var a;
    return this.pageMap ? a = this.spreads && this.pageMap.length > 1 ? 2 * this.chapterPos - 1 : this.chapterPos : (console.warn("page map not loaded"), !
        1)
}, EPUBJS.Renderer.prototype.getRenderedPagesLeft = function() {
    var a, b, c;
    return this.pageMap ? (b = this.pageMap.length, a = this.spreads ? 2 * this.chapterPos - 1 : this.chapterPos, c = b - a) : (console.warn(
        "page map not loaded"), !1)
}, EPUBJS.Renderer.prototype.getVisibleRangeCfi = function() {
    var a, b, c;
    return this.pageMap ? (this.spreads ? (a = 2 * this.chapterPos, b = this.pageMap[a - 2], c = b, this.pageMap.length > 1 && this.pageMap.length > a - 1 &&
    (c = this.pageMap[a - 1])) : (a = this.chapterPos, b = this.pageMap[a - 1], c = b), b || (console.warn("page range miss:", a, this.pageMap),
        b = this.pageMap[this.pageMap.length - 1], c = b), {
        start: b.start,
        end: c.end
    }) : (console.warn("page map not loaded"), !1)
}, EPUBJS.Renderer.prototype.gotoCfi = function(a) {
    var b, c, d;
    if (this._moving) return this._q.enqueue("gotoCfi", arguments);
    if (EPUBJS.core.isString(a) && (a = this.epubcfi.parse(a)), "undefined" == typeof document.evaluate) c = this.epubcfi.addMarker(a, this.doc), c && (b =
        this.render.getPageNumberByElement(c), this.epubcfi.removeMarker(c, this.doc), this.page(b));
    else if (d = this.epubcfi.generateRangeFromCfi(a, this.doc)) {
        var e = d.getBoundingClientRect();
        b = e ? this.render.getPageNumberByRect(e) : 1, this.page(b), this.currentLocationCfi = a.str
    } else this.page(1)
}, EPUBJS.Renderer.prototype.findFirstVisible = function(a) {
    var b, c = a || this.render.getBaseElement();
    return b = this.walk(c, 0, 0), b ? b : a
}, EPUBJS.Renderer.prototype.findElementAfter = function(a, b, c) {
    var d, e = c || this.render.getBaseElement();
    return d = this.walk(e, a, b), d ? d : e
}, EPUBJS.Renderer.prototype.resize = function(a, b, c) {
    this.width = a, this.height = b, c !== !1 && this.render.resize(this.width, this.height), this.contents && this.reformat(), this.trigger(
        "renderer:resized", {
            width: this.width,
            height: this.height
        })
}, EPUBJS.Renderer.prototype.onResized = function() {
    var a = this.container.clientWidth,
        b = this.container.clientHeight;
    this.resize(a, b, !1)
}, EPUBJS.Renderer.prototype.addEventListeners = function() {
    this.render.document && this.listenedEvents.forEach(function(a) {
        this.render.document.addEventListener(a, this.triggerEvent.bind(this), !1)
    }, this)
}, EPUBJS.Renderer.prototype.removeEventListeners = function() {
    this.render.document && this.listenedEvents.forEach(function(a) {
        this.render.document.removeEventListener(a, this.triggerEvent, !1)
    }, this)
}, EPUBJS.Renderer.prototype.triggerEvent = function(a) {
    this.trigger("renderer:" + a.type, a)
}, EPUBJS.Renderer.prototype.addSelectionListeners = function() {
    this.render.document.addEventListener("selectionchange", this.onSelectionChange.bind(this), !1)
}, EPUBJS.Renderer.prototype.removeSelectionListeners = function() {
    this.render.document && this.doc.removeEventListener("selectionchange", this.onSelectionChange, !1)
}, EPUBJS.Renderer.prototype.onSelectionChange = function() {
    this.selectionEndTimeout && clearTimeout(this.selectionEndTimeout), this.selectionEndTimeout = setTimeout(function() {
        this.selectedRange = this.render.window.getSelection(), this.trigger("renderer:selected", this.selectedRange)
    }.bind(this), 500)
}, EPUBJS.Renderer.prototype.setMinSpreadWidth = function(a) {
    this.minSpreadWidth = a, this.spreads = this.determineSpreads(a)
}, EPUBJS.Renderer.prototype.determineSpreads = function(a) {
    return this.isForcedSingle || !a || this.width < a ? !1 : !0
}, EPUBJS.Renderer.prototype.forceSingle = function(a) {
    this.isForcedSingle = a ? !0 : !1
}, EPUBJS.Renderer.prototype.setGap = function(a) {
    this.gap = a
}, EPUBJS.Renderer.prototype.setDirection = function(a) {
    this.direction = a, this.render.setDirection(this.direction)
}, EPUBJS.Renderer.prototype.replace = function(a, b, c, d) {
    var e = this.contents.querySelectorAll(a),
        f = Array.prototype.slice.call(e),
        g = f.length;
    return 0 === g ? void c(!1) : void f.forEach(function(a) {
        var e = !1,
            f = function(a, b) {
                e === !1 && (g--, d && d(a, b, g), 0 >= g && c && c(!0), e = !0)
            };
        b(a, f)
    }.bind(this))
}, RSVP.EventTarget.mixin(EPUBJS.Renderer.prototype);
var EPUBJS = EPUBJS || {};
EPUBJS.replace = {}, EPUBJS.replace.hrefs = function(a, b) {
    var c = this,
        d = function(a, d) {
            var e, f, g, h, i, j = a.getAttribute("href"),
                k = j.search("://"); - 1 != k ? a.setAttribute("target", "_blank") : (g = b.render.docEl.querySelector("base"), i = g.getAttribute("href"),
                h = EPUBJS.core.uri(i), e = h.directory, f = e ? "file" === h.protocol ? EPUBJS.core.resolveUrl(h.base, j) : EPUBJS.core.resolveUrl(e,
                j) : j, a.onclick = function() {
                return c.goto(f), !1
            }), d()
        };
    b.replace("a[href]", d, a)
}, EPUBJS.replace.head = function(a, b) {
    b.replaceWithStored("link[href]", "href", EPUBJS.replace.links, a)
}, EPUBJS.replace.resources = function(a, b) {
    b.replaceWithStored("[src]", "src", EPUBJS.replace.srcs, a)
}, EPUBJS.replace.svg = function(a, b) {
    b.replaceWithStored("svg image", "xlink:href", function(a, b, c) {
        a.getUrl(b).then(c)
    }, a)
}, EPUBJS.replace.srcs = function(a, b, c) {
    a.getUrl(b).then(c)
}, EPUBJS.replace.links = function(a, b, c, d) {
    "stylesheet" === d.getAttribute("rel") ? EPUBJS.replace.stylesheets(a, b).then(function(a, b) {
        c(a, b)
    }, function() {
        c(null)
    }) : a.getUrl(b).then(c, function() {
        c(null)
    })
}, EPUBJS.replace.stylesheets = function(a, b) {
    var c = new RSVP.defer;
    if (a) return a.getText(b).then(function(d) {
        EPUBJS.replace.cssImports(a, b, d).then(function(e) {
            d = e + d, EPUBJS.replace.cssUrls(a, b, d).then(function(a) {
                var b = window.URL || window.webkitURL || window.mozURL,
                    d = new Blob([a], {
                        type: "text/css"
                    }),
                    e = b.createObjectURL(d);
                c.resolve(e)
            }, function(a) {
                c.reject(a)
            })
        }, function(a) {
            c.reject(a)
        })
    }, function(a) {
        c.reject(a)
    }), c.promise
}, EPUBJS.replace.cssImports = function(a, b, c) {
    var d = new RSVP.defer;
    if (a) {
        for (var e, f = /@import\s+(?:url\()?\'?\"?((?!data:)[^\'|^\"^\)]*)\'?\"?\)?/gi, g = [], h = ""; e = f.exec(c);) g.push(e[1]);
        return 0 === g.length && d.resolve(h), g.forEach(function(c) {
            var e = EPUBJS.core.resolveUrl(b, c);
            e = EPUBJS.core.uri(e).path, a.getText(e).then(function(a) {
                h += a, g.indexOf(c) === g.length - 1 && d.resolve(h)
            }, function(a) {
                d.reject(a)
            })
        }), d.promise
    }
}, EPUBJS.replace.cssUrls = function(a, b, c) {
    var d = new RSVP.defer,
        e = [],
        f = c.match(/url\(\'?\"?((?!data:)[^\'|^\"^\)]*)\'?\"?\)/g);
    if (a) return f ? (f.forEach(function(f) {
        var g = EPUBJS.core.resolveUrl(b, f.replace(/url\(|[|\)|\'|\"]|\?.*$/g, "")),
            h = a.getUrl(g).then(function(a) {
                c = c.replace(f, 'url("' + a + '")')
            }, function(a) {
                d.reject(a)
            });
        e.push(h)
    }), RSVP.all(e).then(function() {
        d.resolve(c)
    }), d.promise) : (d.resolve(c), d.promise)
}, EPUBJS.Storage = function(a) {
    this.checkRequirements(), this.urlCache = {}, this.withCredentials = a, this.URL = window.URL || window.webkitURL || window.mozURL, this.offline = !1
}, EPUBJS.Storage.prototype.checkRequirements = function() {
    "undefined" == typeof localforage && console.error("localForage library not loaded")
}, EPUBJS.Storage.prototype.put = function(a) {
    var b = new RSVP.defer,
        c = a.length,
        d = 0,
        e = function(b) {
            var f, g, h = b || new RSVP.defer;
            return d >= c ? h.resolve() : (f = a[d].url, g = window.encodeURIComponent(f), EPUBJS.core.request(f, "binary").then(function(a) {
                return localforage.setItem(g, a)
            }).then(function() {
                d++, setTimeout(function() {
                    e(h)
                }, 1)
            })), h.promise
        }.bind(this);
    return Array.isArray(a) || (a = [a]), e().then(function() {
        b.resolve()
    }.bind(this)), b.promise
}, EPUBJS.Storage.prototype.token = function(a, b) {
    var c = window.encodeURIComponent(a);
    return localforage.setItem(c, b).then(function(a) {
        return null === a ? !1 : !0
    })
}, EPUBJS.Storage.prototype.isStored = function(a) {
    var b = window.encodeURIComponent(a);
    return localforage.getItem(b).then(function(a) {
        return null === a ? !1 : !0
    })
}, EPUBJS.Storage.prototype.getText = function(a) {
    var b = window.encodeURIComponent(a);
    return EPUBJS.core.request(a, "arraybuffer", this.withCredentials).then(function(a) {
        return this.offline && (this.offline = !1, this.trigger("offline", !1)), localforage.setItem(b, a), a
    }.bind(this)).then(function(b) {
        var c = new RSVP.defer,
            d = EPUBJS.core.getMimeType(a),
            e = new Blob([b], {
                type: d
            }),
            f = new FileReader;
        return f.addEventListener("loadend", function() {
            c.resolve(f.result)
        }), f.readAsText(e, d), c.promise
    }).catch(function() {
        var c = new RSVP.defer,
            d = localforage.getItem(b);
        return this.offline || (this.offline = !0, this.trigger("offline", !0)), d ? (d.then(function(b) {
            var d = EPUBJS.core.getMimeType(a),
                e = new Blob([b], {
                    type: d
                }),
                f = new FileReader;
            f.addEventListener("loadend", function() {
                c.resolve(f.result)
            }), f.readAsText(e, d)
        }), c.promise) : (c.reject({
            message: "File not found in the storage: " + a,
            stack: (new Error).stack
        }), c.promise)
    }.bind(this))
}, EPUBJS.Storage.prototype.getUrl = function(a) {
    var b = window.encodeURIComponent(a);
    return EPUBJS.core.request(a, "arraybuffer", this.withCredentials).then(function(c) {
        return this.offline && (this.offline = !1, this.trigger("offline", !1)), localforage.setItem(b, c), a
    }.bind(this)).catch(function() {
        var c, d, e = new RSVP.defer,
            f = window.URL || window.webkitURL || window.mozURL;
        return this.offline || (this.offline = !0, this.trigger("offline", !0)), b in this.urlCache ? (e.resolve(this.urlCache[b]), e.promise) : (c =
            localforage.getItem(b)) ? (c.then(function(c) {
            var g = new Blob([c], {
                type: EPUBJS.core.getMimeType(a)
            });
            d = f.createObjectURL(g), e.resolve(d), this.urlCache[b] = d
        }.bind(this)), e.promise) : (e.reject({
            message: "File not found in the storage: " + a,
            stack: (new Error).stack
        }), e.promise)
    }.bind(this))
}, EPUBJS.Storage.prototype.getXml = function(a) {
    var b = window.encodeURIComponent(a);
    return EPUBJS.core.request(a, "arraybuffer", this.withCredentials).then(function(a) {
        return this.offline && (this.offline = !1, this.trigger("offline", !1)), localforage.setItem(b, a), a
    }.bind(this)).then(function(b) {
        var c = new RSVP.defer,
            d = EPUBJS.core.getMimeType(a),
            e = new Blob([b], {
                type: d
            }),
            f = new FileReader;
        return f.addEventListener("loadend", function() {
            var a = new DOMParser,
                b = a.parseFromString(f.result, "text/xml");
            c.resolve(b)
        }), f.readAsText(e, d), c.promise
    }).catch(function() {
        var c = new RSVP.defer,
            d = localforage.getItem(b);
        return this.offline || (this.offline = !0, this.trigger("offline", !0)), d ? (d.then(function(b) {
            var d = EPUBJS.core.getMimeType(a),
                e = new Blob([b], {
                    type: d
                }),
                f = new FileReader;
            f.addEventListener("loadend", function() {
                var a = new DOMParser,
                    b = a.parseFromString(f.result, "text/xml");
                c.resolve(b)
            }), f.readAsText(e, d)
        }), c.promise) : (c.reject({
            message: "File not found in the storage: " + a,
            stack: (new Error).stack
        }), c.promise)
    }.bind(this))
}, EPUBJS.Storage.prototype.revokeUrl = function(a) {
    var b = window.URL || window.webkitURL || window.mozURL,
        c = this.urlCache[a];
    c && b.revokeObjectURL(c)
}, EPUBJS.Storage.prototype.failed = function(a) {
    console.error(a)
}, RSVP.EventTarget.mixin(EPUBJS.Storage.prototype), EPUBJS.Unarchiver = function() {
    this.checkRequirements(), this.urlCache = {}
}, EPUBJS.Unarchiver.prototype.checkRequirements = function() {
    "undefined" == typeof JSZip && console.error("JSZip lib not loaded")
}, EPUBJS.Unarchiver.prototype.open = function(a) {
    if (a instanceof ArrayBuffer) {
        this.zip = new JSZip(a);
        var b = new RSVP.defer;
        return b.resolve(), b.promise
    }
    return EPUBJS.core.request(a, "binary").then(function(a) {
        this.zip = new JSZip(a)
    }.bind(this))
}, EPUBJS.Unarchiver.prototype.getXml = function(a, b) {
    var c = window.decodeURIComponent(a);
    return this.getText(c, b).then(function(b) {
        var c = new DOMParser,
            d = EPUBJS.core.getMimeType(a);
        return c.parseFromString(b, d)
    })
}, EPUBJS.Unarchiver.prototype.getUrl = function(a) {
    var b, c, d = this,
        e = new RSVP.defer,
        f = window.decodeURIComponent(a),
        g = this.zip.file(f),
        h = window.URL || window.webkitURL || window.mozURL;
    return g ? a in this.urlCache ? (e.resolve(this.urlCache[a]), e.promise) : (c = new Blob([g.asUint8Array()], {
        type: EPUBJS.core.getMimeType(g.name)
    }), b = h.createObjectURL(c), e.resolve(b), d.urlCache[a] = b, e.promise) : (e.reject({
        message: "File not found in the epub: " + a,
        stack: (new Error).stack
    }), e.promise)
}, EPUBJS.Unarchiver.prototype.getText = function(a) {
    var b, c = new RSVP.defer,
        d = window.decodeURIComponent(a),
        e = this.zip.file(d);
    return e ? (b = e.asText(), c.resolve(b), c.promise) : (c.reject({
        message: "File not found in the epub: " + a,
        stack: (new Error).stack
    }), c.promise)
}, EPUBJS.Unarchiver.prototype.revokeUrl = function(a) {
    var b = window.URL || window.webkitURL || window.mozURL,
        c = this.urlCache[a];
    c && b.revokeObjectURL(c)
}, EPUBJS.Unarchiver.prototype.failed = function(a) {
    console.error(a)
}, EPUBJS.Unarchiver.prototype.afterSaved = function() {
    this.callback()
}, EPUBJS.Unarchiver.prototype.toStorage = function(a) {
    function b() {
        f--, 0 === f && e.afterSaved()
    }
    var c = 0,
        d = 20,
        e = this,
        f = a.length;
    a.forEach(function(a) {
        setTimeout(function(a) {
            e.saveEntryFileToStorage(a, b)
        }, c, a), c += d
    }), console.log("time", c)
},
    function() {
        var a = {
                application: {
                    ecmascript: ["es", "ecma"],
                    javascript: "js",
                    ogg: "ogx",
                    pdf: "pdf",
                    postscript: ["ps", "ai", "eps", "epsi", "epsf", "eps2", "eps3"],
                    "rdf+xml": "rdf",
                    smil: ["smi", "smil"],
                    "xhtml+xml": ["xhtml", "xht"],
                    xml: ["xml", "xsl", "xsd", "opf", "ncx"],
                    zip: "zip",
                    "x-httpd-eruby": "rhtml",
                    "x-latex": "latex",
                    "x-maker": ["frm", "maker", "frame", "fm", "fb", "book", "fbdoc"],
                    "x-object": "o",
                    "x-shockwave-flash": ["swf", "swfl"],
                    "x-silverlight": "scr",
                    "epub+zip": "epub",
                    "font-tdpfr": "pfr",
                    "inkml+xml": ["ink", "inkml"],
                    json: "json",
                    "jsonml+json": "jsonml",
                    "mathml+xml": "mathml",
                    "metalink+xml": "metalink",
                    mp4: "mp4s",
                    "omdoc+xml": "omdoc",
                    oxps: "oxps",
                    "vnd.amazon.ebook": "azw",
                    widget: "wgt",
                    "x-dtbook+xml": "dtb",
                    "x-dtbresource+xml": "res",
                    "x-font-bdf": "bdf",
                    "x-font-ghostscript": "gsf",
                    "x-font-linux-psf": "psf",
                    "x-font-otf": "otf",
                    "x-font-pcf": "pcf",
                    "x-font-snf": "snf",
                    "x-font-ttf": ["ttf", "ttc"],
                    "x-font-type1": ["pfa", "pfb", "pfm", "afm"],
                    "x-font-woff": "woff",
                    "x-mobipocket-ebook": ["prc", "mobi"],
                    "x-mspublisher": "pub",
                    "x-nzb": "nzb",
                    "x-tgif": "obj",
                    "xaml+xml": "xaml",
                    "xml-dtd": "dtd",
                    "xproc+xml": "xpl",
                    "xslt+xml": "xslt",
                    "internet-property-stream": "acx",
                    "x-compress": "z",
                    "x-compressed": "tgz",
                    "x-gzip": "gz"
                },
                audio: {
                    flac: "flac",
                    midi: ["mid", "midi", "kar", "rmi"],
                    mpeg: ["mpga", "mpega", "mp2", "mp3", "m4a", "mp2a", "m2a", "m3a"],
                    mpegurl: "m3u",
                    ogg: ["oga", "ogg", "spx"],
                    "x-aiff": ["aif", "aiff", "aifc"],
                    "x-ms-wma": "wma",
                    "x-wav": "wav",
                    adpcm: "adp",
                    mp4: "mp4a",
                    webm: "weba",
                    "x-aac": "aac",
                    "x-caf": "caf",
                    "x-matroska": "mka",
                    "x-pn-realaudio-plugin": "rmp",
                    xm: "xm",
                    mid: ["mid", "rmi"]
                },
                image: {
                    gif: "gif",
                    ief: "ief",
                    jpeg: ["jpeg", "jpg", "jpe"],
                    pcx: "pcx",
                    png: "png",
                    "svg+xml": ["svg", "svgz"],
                    tiff: ["tiff", "tif"],
                    "x-icon": "ico",
                    bmp: "bmp",
                    webp: "webp",
                    "x-pict": ["pic", "pct"],
                    "x-tga": "tga",
                    "cis-cod": "cod"
                },
                message: {
                    rfc822: ["eml", "mime", "mht", "mhtml", "nws"]
                },
                text: {
                    "cache-manifest": ["manifest", "appcache"],
                    calendar: ["ics", "icz", "ifb"],
                    css: "css",
                    csv: "csv",
                    h323: "323",
                    html: ["html", "htm", "shtml", "stm"],
                    iuls: "uls",
                    mathml: "mml",
                    plain: ["txt", "text", "brf", "conf", "def", "list", "log", "in", "bas"],
                    richtext: "rtx",
                    "tab-separated-values": "tsv",
                    "x-bibtex": "bib",
                    "x-dsrc": "d",
                    "x-diff": ["diff", "patch"],
                    "x-haskell": "hs",
                    "x-java": "java",
                    "x-literate-haskell": "lhs",
                    "x-moc": "moc",
                    "x-pascal": ["p", "pas"],
                    "x-pcs-gcd": "gcd",
                    "x-perl": ["pl", "pm"],
                    "x-python": "py",
                    "x-scala": "scala",
                    "x-setext": "etx",
                    "x-tcl": ["tcl", "tk"],
                    "x-tex": ["tex", "ltx", "sty", "cls"],
                    "x-vcard": "vcf",
                    sgml: ["sgml", "sgm"],
                    "x-c": ["c", "cc", "cxx", "cpp", "h", "hh", "dic"],
                    "x-fortran": ["f", "for", "f77", "f90"],
                    "x-opml": "opml",
                    "x-nfo": "nfo",
                    "x-sfv": "sfv",
                    "x-uuencode": "uu",
                    webviewhtml: "htt"
                },
                video: {
                    mpeg: ["mpeg", "mpg", "mpe", "m1v", "m2v", "mp2", "mpa", "mpv2"],
                    mp4: ["mp4", "mp4v", "mpg4"],
                    quicktime: ["qt", "mov"],
                    ogg: "ogv",
                    "vnd.mpegurl": ["mxu", "m4u"],
                    "x-flv": "flv",
                    "x-la-asf": ["lsf", "lsx"],
                    "x-mng": "mng",
                    "x-ms-asf": ["asf", "asx", "asr"],
                    "x-ms-wm": "wm",
                    "x-ms-wmv": "wmv",
                    "x-ms-wmx": "wmx",
                    "x-ms-wvx": "wvx",
                    "x-msvideo": "avi",
                    "x-sgi-movie": "movie",
                    "x-matroska": ["mpv", "mkv", "mk3d", "mks"],
                    "3gpp2": "3g2",
                    h261: "h261",
                    h263: "h263",
                    h264: "h264",
                    jpeg: "jpgv",
                    jpm: ["jpm", "jpgm"],
                    mj2: ["mj2", "mjp2"],
                    "vnd.ms-playready.media.pyv": "pyv",
                    "vnd.uvvu.mp4": ["uvu", "uvvu"],
                    "vnd.vivo": "viv",
                    webm: "webm",
                    "x-f4v": "f4v",
                    "x-m4v": "m4v",
                    "x-ms-vob": "vob",
                    "x-smv": "smv"
                }
            },
            b = function() {
                var b, c, d, e, f = {};
                for (b in a)
                    if (a.hasOwnProperty(b))
                        for (c in a[b])
                            if (a[b].hasOwnProperty(c))
                                if (d = a[b][c], "string" == typeof d) f[d] = b + "/" + c;
                                else
                                    for (e = 0; e < d.length; e++) f[d[e]] = b + "/" + c;
                return f
            }();
        EPUBJS.core.getMimeType = function(a) {
            var c = "text/plain";
            return a && b[a.split(".").pop().toLowerCase()] || c
        }
    }();
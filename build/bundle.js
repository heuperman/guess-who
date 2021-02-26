var app = (function () {
  "use strict";
  function t() {}
  function n(t) {
    return t();
  }
  function e() {
    return Object.create(null);
  }
  function o(t) {
    t.forEach(n);
  }
  function r(t) {
    return "function" == typeof t;
  }
  function l(t, n) {
    return t != t
      ? n == n
      : t !== n || (t && "object" == typeof t) || "function" == typeof t;
  }
  function c(t, n) {
    t.appendChild(n);
  }
  function u(t, n, e) {
    t.insertBefore(n, e || null);
  }
  function s(t) {
    t.parentNode.removeChild(t);
  }
  function i(t, n) {
    for (let e = 0; e < t.length; e += 1) t[e] && t[e].d(n);
  }
  function f(t) {
    return document.createElement(t);
  }
  function a(t) {
    return document.createTextNode(t);
  }
  function h() {
    return a(" ");
  }
  function d(t, n, e, o) {
    return t.addEventListener(n, e, o), () => t.removeEventListener(n, e, o);
  }
  function p(t, n, e) {
    null == e
      ? t.removeAttribute(n)
      : t.getAttribute(n) !== e && t.setAttribute(n, e);
  }
  function g(t, n) {
    (n = "" + n), t.wholeText !== n && (t.data = n);
  }
  function m(t, n) {
    for (let e = 0; e < t.options.length; e += 1) {
      const o = t.options[e];
      if (o.__value === n) return void (o.selected = !0);
    }
  }
  function $(t) {
    const n = t.querySelector(":checked") || t.options[0];
    return n && n.__value;
  }
  let v;
  function b(t) {
    v = t;
  }
  function x(t) {
    (function () {
      if (!v)
        throw new Error("Function called outside component initialization");
      return v;
    })().$$.on_mount.push(t);
  }
  const y = [],
    _ = [],
    w = [],
    j = [],
    k = Promise.resolve();
  let z = !1;
  function E(t) {
    w.push(t);
  }
  let A = !1;
  const C = new Set();
  function T() {
    if (!A) {
      A = !0;
      do {
        for (let t = 0; t < y.length; t += 1) {
          const n = y[t];
          b(n), M(n.$$);
        }
        for (b(null), y.length = 0; _.length; ) _.pop()();
        for (let t = 0; t < w.length; t += 1) {
          const n = w[t];
          C.has(n) || (C.add(n), n());
        }
        w.length = 0;
      } while (y.length);
      for (; j.length; ) j.pop()();
      (z = !1), (A = !1), C.clear();
    }
  }
  function M(t) {
    if (null !== t.fragment) {
      t.update(), o(t.before_update);
      const n = t.dirty;
      (t.dirty = [-1]),
        t.fragment && t.fragment.p(t.ctx, n),
        t.after_update.forEach(E);
    }
  }
  const q = new Set();
  let N;
  function O(t, n) {
    t && t.i && (q.delete(t), t.i(n));
  }
  function P(t, n, e, o) {
    if (t && t.o) {
      if (q.has(t)) return;
      q.add(t),
        N.c.push(() => {
          q.delete(t), o && (e && t.d(1), o());
        }),
        t.o(n);
    }
  }
  function S(t) {
    t && t.c();
  }
  function B(t, e, l) {
    const { fragment: c, on_mount: u, on_destroy: s, after_update: i } = t.$$;
    c && c.m(e, l),
      E(() => {
        const e = u.map(n).filter(r);
        s ? s.push(...e) : o(e), (t.$$.on_mount = []);
      }),
      i.forEach(E);
  }
  function L(t, n) {
    const e = t.$$;
    null !== e.fragment &&
      (o(e.on_destroy),
      e.fragment && e.fragment.d(n),
      (e.on_destroy = e.fragment = null),
      (e.ctx = []));
  }
  function D(t, n) {
    -1 === t.$$.dirty[0] &&
      (y.push(t), z || ((z = !0), k.then(T)), t.$$.dirty.fill(0)),
      (t.$$.dirty[(n / 31) | 0] |= 1 << n % 31);
  }
  function F(n, r, l, c, u, i, f = [-1]) {
    const a = v;
    b(n);
    const h = (n.$$ = {
      fragment: null,
      ctx: null,
      props: i,
      update: t,
      not_equal: u,
      bound: e(),
      on_mount: [],
      on_destroy: [],
      before_update: [],
      after_update: [],
      context: new Map(a ? a.$$.context : []),
      callbacks: e(),
      dirty: f,
      skip_bound: !1,
    });
    let d = !1;
    if (
      ((h.ctx = l
        ? l(n, r.props || {}, (t, e, ...o) => {
            const r = o.length ? o[0] : e;
            return (
              h.ctx &&
                u(h.ctx[t], (h.ctx[t] = r)) &&
                (!h.skip_bound && h.bound[t] && h.bound[t](r), d && D(n, t)),
              e
            );
          })
        : []),
      h.update(),
      (d = !0),
      o(h.before_update),
      (h.fragment = !!c && c(h.ctx)),
      r.target)
    ) {
      if (r.hydrate) {
        const t = (function (t) {
          return Array.from(t.childNodes);
        })(r.target);
        h.fragment && h.fragment.l(t), t.forEach(s);
      } else h.fragment && h.fragment.c();
      r.intro && O(n.$$.fragment), B(n, r.target, r.anchor), T();
    }
    b(a);
  }
  class G {
    $destroy() {
      L(this, 1), (this.$destroy = t);
    }
    $on(t, n) {
      const e = this.$$.callbacks[t] || (this.$$.callbacks[t] = []);
      return (
        e.push(n),
        () => {
          const t = e.indexOf(n);
          -1 !== t && e.splice(t, 1);
        }
      );
    }
    $set(t) {
      var n;
      this.$$set &&
        ((n = t), 0 !== Object.keys(n).length) &&
        ((this.$$.skip_bound = !0), this.$$set(t), (this.$$.skip_bound = !1));
    }
  }
  const I = [];
  function H(n, e = t) {
    let o;
    const r = [];
    function c(t) {
      if (l(n, t) && ((n = t), o)) {
        const t = !I.length;
        for (let t = 0; t < r.length; t += 1) {
          const e = r[t];
          e[1](), I.push(e, n);
        }
        if (t) {
          for (let t = 0; t < I.length; t += 2) I[t][0](I[t + 1]);
          I.length = 0;
        }
      }
    }
    return {
      set: c,
      update: function (t) {
        c(t(n));
      },
      subscribe: function (l, u = t) {
        const s = [l, u];
        return (
          r.push(s),
          1 === r.length && (o = e(c) || t),
          l(n),
          () => {
            const t = r.indexOf(s);
            -1 !== t && r.splice(t, 1), 0 === r.length && (o(), (o = null));
          }
        );
      },
    };
  }
  const J = H([]),
    K = H([]),
    Q = H([[], [], [], []]),
    R = H(new Array(4)),
    U = H([]),
    V = H([]),
    W = ["🍔", "⏰", "👽"];
  function X(t, n, e) {
    const o = t.slice();
    return (o[1] = n[e]), o;
  }
  function Y(t) {
    let n,
      e = W[t[1]] + "";
    return {
      c() {
        n = a(e);
      },
      m(t, e) {
        u(t, n, e);
      },
      p(t, o) {
        1 & o && e !== (e = W[t[1]] + "") && g(n, e);
      },
      d(t) {
        t && s(n);
      },
    };
  }
  function Z(n) {
    let e,
      o = n[0],
      r = [];
    for (let t = 0; t < o.length; t += 1) r[t] = Y(X(n, o, t));
    return {
      c() {
        e = f("div");
        for (let t = 0; t < r.length; t += 1) r[t].c();
        p(e, "class", "svelte-108fzrl");
      },
      m(t, n) {
        u(t, e, n);
        for (let t = 0; t < r.length; t += 1) r[t].m(e, null);
      },
      p(t, [n]) {
        if (1 & n) {
          let l;
          for (o = t[0], l = 0; l < o.length; l += 1) {
            const c = X(t, o, l);
            r[l] ? r[l].p(c, n) : ((r[l] = Y(c)), r[l].c(), r[l].m(e, null));
          }
          for (; l < r.length; l += 1) r[l].d(1);
          r.length = o.length;
        }
      },
      i: t,
      o: t,
      d(t) {
        t && s(e), i(r, t);
      },
    };
  }
  function tt(t, n, e) {
    let { character: o } = n;
    return (
      (t.$$set = (t) => {
        "character" in t && e(0, (o = t.character));
      }),
      [o]
    );
  }
  class nt extends G {
    constructor(t) {
      super(), F(this, t, tt, Z, l, { character: 0 });
    }
  }
  function et(t, n, e) {
    const o = t.slice();
    return (o[6] = n[e]), o;
  }
  function ot(t) {
    let n;
    return {
      c() {
        (n = f("div")), p(n, "class", "ruled-out svelte-13yb7z3");
      },
      m(t, e) {
        u(t, n, e);
      },
      d(t) {
        t && s(n);
      },
    };
  }
  function rt(t) {
    let n,
      e,
      o,
      r,
      l,
      i = !t[4](t[6], t[3], t[1], t[2]),
      a = i && ot();
    return (
      (o = new nt({ props: { character: t[6] } })),
      {
        c() {
          (n = f("div")),
            a && a.c(),
            (e = h()),
            S(o.$$.fragment),
            (r = h()),
            p(n, "class", "wrapper svelte-13yb7z3");
        },
        m(t, s) {
          u(t, n, s),
            a && a.m(n, null),
            c(n, e),
            B(o, n, null),
            c(n, r),
            (l = !0);
        },
        p(t, r) {
          15 & r && (i = !t[4](t[6], t[3], t[1], t[2])),
            i ? a || ((a = ot()), a.c(), a.m(n, e)) : a && (a.d(1), (a = null));
          const l = {};
          1 & r && (l.character = t[6]), o.$set(l);
        },
        i(t) {
          l || (O(o.$$.fragment, t), (l = !0));
        },
        o(t) {
          P(o.$$.fragment, t), (l = !1);
        },
        d(t) {
          t && s(n), a && a.d(), L(o);
        },
      }
    );
  }
  function lt(t) {
    let n,
      e,
      r = t[0],
      l = [];
    for (let n = 0; n < r.length; n += 1) l[n] = rt(et(t, r, n));
    const c = (t) =>
      P(l[t], 1, 1, () => {
        l[t] = null;
      });
    return {
      c() {
        n = f("div");
        for (let t = 0; t < l.length; t += 1) l[t].c();
        p(n, "class", "grid svelte-13yb7z3");
      },
      m(t, o) {
        u(t, n, o);
        for (let t = 0; t < l.length; t += 1) l[t].m(n, null);
        e = !0;
      },
      p(t, [e]) {
        if (31 & e) {
          let u;
          for (r = t[0], u = 0; u < r.length; u += 1) {
            const o = et(t, r, u);
            l[u]
              ? (l[u].p(o, e), O(l[u], 1))
              : ((l[u] = rt(o)), l[u].c(), O(l[u], 1), l[u].m(n, null));
          }
          for (N = { r: 0, c: [], p: N }, u = r.length; u < l.length; u += 1)
            c(u);
          N.r || o(N.c), (N = N.p);
        }
      },
      i(t) {
        if (!e) {
          for (let t = 0; t < r.length; t += 1) O(l[t]);
          e = !0;
        }
      },
      o(t) {
        l = l.filter(Boolean);
        for (let t = 0; t < l.length; t += 1) P(l[t]);
        e = !1;
      },
      d(t) {
        t && s(n), i(l, t);
      },
    };
  }
  function ct(t, n, e) {
    let o, r, l, c;
    J.subscribe((t) => e(0, (o = t))),
      Q.subscribe((t) => e(1, (r = t))),
      U.subscribe((t) => e(2, (l = t))),
      R.subscribe((t) => e(3, (c = t)));
    return [
      o,
      r,
      l,
      c,
      (t, n, e, o) => {
        let r = !0;
        if (
          (n &&
            t.forEach((t, o) => {
              ((void 0 !== n[o] && t !== n[o]) || e[o].includes(t)) && (r = !1);
            }),
          r)
        ) {
          const n = o.filter((n) =>
            ((t, n) =>
              t.length === n.length &&
              t.filter((t, e) => t === n[e]).length === n.length)(t, n)
          );
          r = !n.length;
        }
        return r;
      },
    ];
  }
  class ut extends G {
    constructor(t) {
      super(), F(this, t, ct, lt, l, {});
    }
  }
  function st(t, n, e) {
    const o = t.slice();
    return (o[11] = n[e]), o;
  }
  function it(t, n, e) {
    const o = t.slice();
    return (o[14] = n[e]), (o[16] = e), o;
  }
  function ft(t, n, e) {
    const o = t.slice();
    return (o[17] = n[e]), (o[16] = e), o;
  }
  function at(n) {
    let e,
      o,
      r,
      l = n[17] + "";
    return {
      c() {
        (e = f("option")),
          (o = a(l)),
          (r = h()),
          (e.__value = n[16]),
          (e.value = e.__value);
      },
      m(t, n) {
        u(t, e, n), c(e, o), c(e, r);
      },
      p: t,
      d(t) {
        t && s(e);
      },
    };
  }
  function ht(n) {
    let e,
      o,
      r,
      l = n[14] + "";
    return {
      c() {
        (e = f("option")),
          (o = a(l)),
          (r = h()),
          (e.__value = n[16]),
          (e.value = e.__value);
      },
      m(t, n) {
        u(t, e, n), c(e, o), c(e, r);
      },
      p: t,
      d(t) {
        t && s(e);
      },
    };
  }
  function dt(t) {
    let n,
      e,
      o,
      r,
      l,
      i,
      d = t[4][t[11]] + "",
      m = t[5](t[3][t[11]]) + "";
    return {
      c() {
        (n = f("p")),
          (e = a("The ")),
          (o = a(d)),
          (r = a(" position is not ")),
          (l = a(m)),
          (i = h()),
          p(n, "class", "svelte-1l7tjx7");
      },
      m(t, s) {
        u(t, n, s), c(n, e), c(n, o), c(n, r), c(n, l), c(n, i);
      },
      p(t, n) {
        8 & n && m !== (m = t[5](t[3][t[11]]) + "") && g(l, m);
      },
      d(t) {
        t && s(n);
      },
    };
  }
  function pt(t) {
    let n,
      e,
      o,
      r,
      l,
      i,
      d = t[4][t[11]] + "",
      m = W[t[2][t[11]]] + "";
    return {
      c() {
        (n = f("p")),
          (e = a("The ")),
          (o = a(d)),
          (r = a(" position is ")),
          (l = a(m)),
          (i = h()),
          p(n, "class", "svelte-1l7tjx7");
      },
      m(t, s) {
        u(t, n, s), c(n, e), c(n, o), c(n, r), c(n, l), c(n, i);
      },
      p(t, n) {
        4 & n && m !== (m = W[t[2][t[11]]] + "") && g(l, m);
      },
      d(t) {
        t && s(n);
      },
    };
  }
  function gt(t) {
    let n;
    function e(t, n) {
      return void 0 !== t[2][t[11]] ? pt : t[3][t[11]].length ? dt : void 0;
    }
    let o = e(t),
      r = o && o(t);
    return {
      c() {
        r && r.c(), (n = a(""));
      },
      m(t, e) {
        r && r.m(t, e), u(t, n, e);
      },
      p(t, l) {
        o === (o = e(t)) && r
          ? r.p(t, l)
          : (r && r.d(1), (r = o && o(t)), r && (r.c(), r.m(n.parentNode, n)));
      },
      d(t) {
        r && r.d(t), t && s(n);
      },
    };
  }
  function mt(n) {
    let e,
      r,
      l,
      g,
      $,
      v,
      b,
      x,
      y,
      _,
      w,
      j,
      k,
      z,
      A = n[4],
      C = [];
    for (let t = 0; t < A.length; t += 1) C[t] = at(ft(n, A, t));
    let T = W,
      M = [];
    for (let t = 0; t < T.length; t += 1) M[t] = ht(it(n, T, t));
    let q = [0, 1, 2, 3],
      N = [];
    for (let t = 0; t < 4; t += 1) N[t] = gt(st(n, q, t));
    return {
      c() {
        (e = f("div")),
          (r = f("form")),
          (l = f("div")),
          (g = a("Is the\n      ")),
          ($ = f("select"));
        for (let t = 0; t < C.length; t += 1) C[t].c();
        (v = a("\n      position the emoji\n      ")), (b = f("select"));
        for (let t = 0; t < M.length; t += 1) M[t].c();
        (x = a("\n      ?")),
          (y = h()),
          (_ = f("button")),
          (_.textContent = "Ask"),
          (w = h()),
          (j = f("div"));
        for (let t = 0; t < 4; t += 1) N[t].c();
        p($, "class", "svelte-1l7tjx7"),
          void 0 === n[0] && E(() => n[7].call($)),
          p(b, "class", "svelte-1l7tjx7"),
          void 0 === n[1] && E(() => n[8].call(b)),
          p(_, "type", "submit"),
          p(_, "class", "svelte-1l7tjx7"),
          p(r, "class", "svelte-1l7tjx7"),
          p(j, "class", "log svelte-1l7tjx7"),
          p(e, "class", "wrapper svelte-1l7tjx7");
      },
      m(t, o) {
        u(t, e, o), c(e, r), c(r, l), c(l, g), c(l, $);
        for (let t = 0; t < C.length; t += 1) C[t].m($, null);
        m($, n[0]), c(l, v), c(l, b);
        for (let t = 0; t < M.length; t += 1) M[t].m(b, null);
        m(b, n[1]), c(l, x), c(r, y), c(r, _), c(e, w), c(e, j);
        for (let t = 0; t < 4; t += 1) N[t].m(j, null);
        var s;
        k ||
          ((z = [
            d($, "change", n[7]),
            d(b, "change", n[8]),
            d(
              r,
              "submit",
              ((s = n[6]),
              function (t) {
                return t.preventDefault(), s.call(this, t);
              })
            ),
          ]),
          (k = !0));
      },
      p(t, [n]) {
        if (16 & n) {
          let e;
          for (A = t[4], e = 0; e < A.length; e += 1) {
            const o = ft(t, A, e);
            C[e] ? C[e].p(o, n) : ((C[e] = at(o)), C[e].c(), C[e].m($, null));
          }
          for (; e < C.length; e += 1) C[e].d(1);
          C.length = A.length;
        }
        if ((1 & n && m($, t[0]), 0 & n)) {
          let e;
          for (T = W, e = 0; e < T.length; e += 1) {
            const o = it(t, T, e);
            M[e] ? M[e].p(o, n) : ((M[e] = ht(o)), M[e].c(), M[e].m(b, null));
          }
          for (; e < M.length; e += 1) M[e].d(1);
          M.length = T.length;
        }
        if ((2 & n && m(b, t[1]), 60 & n)) {
          let e;
          for (q = [0, 1, 2, 3], e = 0; e < 4; e += 1) {
            const o = st(t, q, e);
            N[e] ? N[e].p(o, n) : ((N[e] = gt(o)), N[e].c(), N[e].m(j, null));
          }
          for (; e < 4; e += 1) N[e].d(1);
        }
      },
      i: t,
      o: t,
      d(t) {
        t && s(e), i(C, t), i(M, t), i(N, t), (k = !1), o(z);
      },
    };
  }
  function $t(t, n, e) {
    var o =
      (this && this.__awaiter) ||
      function (t, n, e, o) {
        return new (e || (e = Promise))(function (r, l) {
          function c(t) {
            try {
              s(o.next(t));
            } catch (t) {
              l(t);
            }
          }
          function u(t) {
            try {
              s(o.throw(t));
            } catch (t) {
              l(t);
            }
          }
          function s(t) {
            var n;
            t.done
              ? r(t.value)
              : ((n = t.value),
                n instanceof e
                  ? n
                  : new e(function (t) {
                      t(n);
                    })).then(c, u);
          }
          s((o = o.apply(t, n || [])).next());
        });
      };
    let r, l, c, u, s;
    R.subscribe((t) => e(2, (c = t))),
      Q.subscribe((t) => e(3, (u = t))),
      K.subscribe((t) => (s = t));
    return [
      r,
      l,
      c,
      u,
      ["first", "second", "third", "fourth"],
      (t) => {
        const n = t.map((t) => W[t]);
        return n.length > 1 ? n.join(" or ") : n[0];
      },
      () =>
        o(void 0, void 0, void 0, function* () {
          s[r] === l
            ? R.update((t) => ((t[r] = l), [...t]))
            : u[r].includes(l) || Q.update((t) => (t[r].push(l), [...t]));
        }),
      function () {
        (r = $(this)), e(0, r);
      },
      function () {
        (l = $(this)), e(1, l);
      },
    ];
  }
  class vt extends G {
    constructor(t) {
      super(), F(this, t, $t, mt, l, {});
    }
  }
  function bt(t) {
    let n,
      e,
      r,
      l,
      i,
      m,
      $,
      v,
      b,
      x,
      y,
      _ = t[2](t[1]) + "";
    return {
      c() {
        (n = f("div")),
          (e = f("button")),
          (e.textContent = "<"),
          (r = h()),
          (l = f("div")),
          (i = a(_)),
          (m = h()),
          ($ = f("button")),
          ($.textContent = ">"),
          (v = h()),
          (b = f("button")),
          (b.textContent = "Guess"),
          p(e, "class", "arrow svelte-1ojgzhl"),
          p(l, "class", "character svelte-1ojgzhl"),
          p($, "class", "arrow svelte-1ojgzhl"),
          p(n, "class", "selector svelte-1ojgzhl"),
          p(b, "class", "guess svelte-1ojgzhl"),
          p(b, "type", "submit");
      },
      m(o, s) {
        u(o, n, s),
          c(n, e),
          c(n, r),
          c(n, l),
          c(l, i),
          c(n, m),
          c(n, $),
          u(o, v, s),
          u(o, b, s),
          x ||
            ((y = [
              d(e, "click", t[3]),
              d($, "click", t[4]),
              d(b, "click", t[5]),
            ]),
            (x = !0));
      },
      p(t, n) {
        2 & n && _ !== (_ = t[2](t[1]) + "") && g(i, _);
      },
      d(t) {
        t && s(n), t && s(v), t && s(b), (x = !1), o(y);
      },
    };
  }
  function xt(n) {
    let e,
      o = n[0].length && bt(n);
    return {
      c() {
        (e = f("div")), o && o.c(), p(e, "class", "wrapper svelte-1ojgzhl");
      },
      m(t, n) {
        u(t, e, n), o && o.m(e, null);
      },
      p(t, [n]) {
        t[0].length
          ? o
            ? o.p(t, n)
            : ((o = bt(t)), o.c(), o.m(e, null))
          : o && (o.d(1), (o = null));
      },
      i: t,
      o: t,
      d(t) {
        t && s(e), o && o.d();
      },
    };
  }
  function yt(t, n, e) {
    var o =
      (this && this.__awaiter) ||
      function (t, n, e, o) {
        return new (e || (e = Promise))(function (r, l) {
          function c(t) {
            try {
              s(o.next(t));
            } catch (t) {
              l(t);
            }
          }
          function u(t) {
            try {
              s(o.throw(t));
            } catch (t) {
              l(t);
            }
          }
          function s(t) {
            var n;
            t.done
              ? r(t.value)
              : ((n = t.value),
                n instanceof e
                  ? n
                  : new e(function (t) {
                      t(n);
                    })).then(c, u);
          }
          s((o = o.apply(t, n || [])).next());
        });
      };
    let r, l, c, u, s, i, f, a;
    Q.subscribe((t) => e(8, (s = t))),
      U.subscribe((t) => e(9, (i = t))),
      R.subscribe((t) => e(10, (f = t))),
      K.subscribe((t) => (a = t));
    const h = (t, n) => {
      if (t.length !== n.length) return !1;
      return t.filter((t, e) => t === n[e]).length === n.length;
    };
    J.subscribe((t) => {
      e(0, (l = t)), e(6, (r = 0));
    });
    return (
      (t.$$.update = () => {
        1793 & t.$$.dirty &&
          e(
            7,
            (c = l.filter((t) =>
              ((t, n, e, o) => {
                let r = !0;
                if (
                  (n &&
                    t.forEach((t, o) => {
                      ((void 0 !== n[o] && t !== n[o]) || e[o].includes(t)) &&
                        (r = !1);
                    }),
                  r)
                ) {
                  const n = o.filter((n) => h(t, n));
                  r = !n.length;
                }
                return r;
              })(t, f, s, i)
            ))
          ),
          192 & t.$$.dirty && e(6, (r = r < c.length ? r : 0)),
          192 & t.$$.dirty && e(1, (u = c[r]));
      }),
      [
        l,
        u,
        (t) => t.map((t) => W[t]).join(""),
        () => {
          r > 0 && e(6, (r -= 1));
        },
        () => {
          r < l.length - 1 && e(6, (r += 1));
        },
        () =>
          o(void 0, void 0, void 0, function* () {
            h(a, u) ? V.update(() => u) : U.update((t) => [...t, u]);
          }),
        r,
        c,
        s,
        i,
        f,
      ]
    );
  }
  class _t extends G {
    constructor(t) {
      super(), F(this, t, yt, xt, l, {});
    }
  }
  function wt(n) {
    let e, o, r, l, i, a, d;
    return (
      (o = new ut({})),
      (l = new vt({})),
      (a = new _t({})),
      {
        c() {
          (e = f("div")),
            S(o.$$.fragment),
            (r = h()),
            S(l.$$.fragment),
            (i = h()),
            S(a.$$.fragment),
            p(e, "class", "grid svelte-12jtuqq");
        },
        m(t, n) {
          u(t, e, n),
            B(o, e, null),
            c(e, r),
            B(l, e, null),
            c(e, i),
            B(a, e, null),
            (d = !0);
        },
        p: t,
        i(t) {
          d ||
            (O(o.$$.fragment, t),
            O(l.$$.fragment, t),
            O(a.$$.fragment, t),
            (d = !0));
        },
        o(t) {
          P(o.$$.fragment, t),
            P(l.$$.fragment, t),
            P(a.$$.fragment, t),
            (d = !1);
        },
        d(t) {
          t && s(e), L(o), L(l), L(a);
        },
      }
    );
  }
  function jt(t, n, e) {
    var o =
      (this && this.__awaiter) ||
      function (t, n, e, o) {
        return new (e || (e = Promise))(function (r, l) {
          function c(t) {
            try {
              s(o.next(t));
            } catch (t) {
              l(t);
            }
          }
          function u(t) {
            try {
              s(o.throw(t));
            } catch (t) {
              l(t);
            }
          }
          function s(t) {
            var n;
            t.done
              ? r(t.value)
              : ((n = t.value),
                n instanceof e
                  ? n
                  : new e(function (t) {
                      t(n);
                    })).then(c, u);
          }
          s((o = o.apply(t, n || [])).next());
        });
      };
    const r = (t) => t[Math.floor(Math.random() * t.length)];
    return (
      x(() =>
        o(void 0, void 0, void 0, function* () {
          const t = (() => {
            const t = (() => {
              const t = [],
                n = [0, 1, 2];
              for (const e of n)
                for (const o of n)
                  for (const r of n) for (const l of n) t.push([e, o, r, l]);
              return t;
            })();
            return new Array(18).fill(null).map(() => {
              const n = Math.floor(Math.random() * t.length),
                e = t[n];
              return t.splice(n, 1), e;
            });
          })();
          if (t) {
            const n = r(t);
            J.update(() => t), K.update(() => n);
          }
        })
      ),
      [r]
    );
  }
  class kt extends G {
    constructor(t) {
      super(), F(this, t, jt, wt, l, { pickTarget: 0 });
    }
    get pickTarget() {
      return this.$$.ctx[0];
    }
  }
  function zt(n) {
    let e, o, r;
    return (
      (o = new kt({})),
      {
        c() {
          (e = f("main")), S(o.$$.fragment), p(e, "class", "svelte-svofhh");
        },
        m(t, n) {
          u(t, e, n), B(o, e, null), (r = !0);
        },
        p: t,
        i(t) {
          r || (O(o.$$.fragment, t), (r = !0));
        },
        o(t) {
          P(o.$$.fragment, t), (r = !1);
        },
        d(t) {
          t && s(e), L(o);
        },
      }
    );
  }
  return new (class extends G {
    constructor(t) {
      super(), F(this, t, null, zt, l, {});
    }
  })({ target: document.body });
})();
//# sourceMappingURL=bundle.js.map

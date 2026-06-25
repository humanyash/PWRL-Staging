/* ==========================================================================
   PWRL MOTION LAYER — pwrl-motion.js
   Tiny dependency-free utility (IntersectionObserver + one pointermove)
   that drives motion.css. Drop both files in and add:

     <link rel="stylesheet" href="motion.css">
     <script src="pwrl-motion.js" defer></script>

   Everything is additive and idempotent. Without this script no element is
   ever hidden (motion.css rules are gated on html[data-mo-on], which only
   this script sets) — so SSR, print, crawlers and no-JS all see the
   resting state.

   Public API: window.PWRLMotion = { init, set, replay, state }
   ========================================================================== */
(function () {
  "use strict";

  var doc = document;
  var root = doc.documentElement;

  /* Next.js adapter (repo patch, per handoff README "Next.js-specific
     notes"): init() re-runs after soft navigations, so listeners that
     bind*() functions register go through on()/offAll() to avoid
     accumulating handlers/spies; the full-page exit interception in
     bindTransitions is skipped when the app shell marks the root with
     data-mo-router (the MotionRouter client component drives the veil). */
  var bound = [];
  function on(t, ev, fn, opts) {
    t.addEventListener(ev, fn, opts);
    bound.push([t, ev, fn, opts]);
  }
  function offAll() {
    for (var i = 0; i < bound.length; i++) {
      bound[i][0].removeEventListener(bound[i][1], bound[i][2], bound[i][3]);
    }
    bound = [];
  }

  var state = {
    enabled: true,
    speed: 0.72,         // global duration multiplier (lower = faster)
    distance: 16,        // px
    stagger: 22,         // ms
    lift: 3,             // px
    glow: 0.25,          // 0..1
    glowRGB: "8 92 240", // light-surface glow color
    glowMode: "lumen",   // SHIPPED DEFAULT (committed): lumen | cast | edge
    magnetMode: "sheen",  // both | sheen | magnet | off — sheen only (no magnetic pull)
    magnetStrength: 0.3, // 0..2 — SHIPPED DEFAULT 0.3 (≈1.8px max pull)
    heroMode: "lines",   // lines | words | fade
    kenburns: true,
    parallax: true,
    reduced: false,      // QA override; real media query is honored anyway
    touch: false         // QA override; real (hover:none) is auto-detected
  };

  var mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  var touchMq = window.matchMedia("(hover: none) and (pointer: coarse)");

  function reducedNow() { return state.reduced || mq.matches; }
  function touchNow() { return state.touch || touchMq.matches; }

  /* ---------------------------------------------------------------- */
  /* Attribute / token sync                                           */
  /* ---------------------------------------------------------------- */
  function sync() {
    root.toggleAttribute("data-mo-on", state.enabled);
    root.toggleAttribute("data-mo-reduced", state.reduced || mq.matches);
    root.toggleAttribute("data-mo-touch", state.touch);
    root.toggleAttribute("data-kenburns", state.kenburns);
    root.toggleAttribute("data-parallax", state.parallax);
    root.setAttribute("data-glow", state.glowMode);
    root.setAttribute("data-magnet", state.magnetMode);
    root.setAttribute("data-hero", state.heroMode);
    root.style.setProperty("--mo-speed", state.speed);
    root.style.setProperty("--mo-dist", state.distance + "px");
    root.style.setProperty("--mo-stagger", state.stagger + "ms");
    root.style.setProperty("--mo-lift", state.lift + "px");
    root.style.setProperty("--mo-glow", state.glow);
    root.style.setProperty("--mo-glow-rgb", state.glowRGB);
    root.style.setProperty("--mo-magnet", state.magnetStrength);
  }

  /* ---------------------------------------------------------------- */
  /* Scroll reveals                                                   */
  /* ---------------------------------------------------------------- */
  var observer = null;
  var revealQueue = []; // elements awaiting reveal (IO + rect-scan fallback)

  function indexStaggers() {
    var groups = doc.querySelectorAll("[data-mo-stagger]");
    for (var g = 0; g < groups.length; g++) {
      var items = groups[g].querySelectorAll("[data-mo]");
      var i = 0;
      for (var k = 0; k < items.length; k++) {
        if (items[k].closest("[data-mo-stagger]") === groups[g]) {
          items[k].style.setProperty("--mo-i", i++);
        }
      }
    }
  }

  function onEnter(el) {
    // Promote just-in-time, release after the transition settles — keeps
    // layer memory low at rest but avoids mid-scroll layerization jank.
    el.style.willChange = "transform, opacity";
    el.classList.add("mo-in");
    var cleared = false;
    var clear = function () {
      if (cleared) return;
      cleared = true;
      el.style.willChange = "";
      el.removeEventListener("transitionend", clear);
    };
    el.addEventListener("transitionend", clear);
    setTimeout(clear, 2600); // safety net: > max delay + draw duration
    if (el.hasAttribute("data-countup")) runCountup(el);
    var counts = el.querySelectorAll("[data-countup]");
    for (var i = 0; i < counts.length; i++) runCountup(counts[i]);
  }

  function observeAll() {
    if (observer) observer.disconnect();
    revealQueue = [];
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(function (entries) {
        for (var i = 0; i < entries.length; i++) {
          if (entries[i].isIntersecting) {
            onEnter(entries[i].target);
            observer.unobserve(entries[i].target); // fire once, on first view
          }
        }
      }, { rootMargin: "0px 0px -4% 0px", threshold: 0.05 });
    }

    var els = doc.querySelectorAll("[data-mo], .mo-donut");
    for (var k = 0; k < els.length; k++) {
      if (els[k].classList.contains("mo-in")) continue;
      // Hero (on-load) elements never wait for scroll.
      if (els[k].closest("[data-mo-hero]")) continue;
      if (observer) observer.observe(els[k]);
      revealQueue.push(els[k]);
    }
    scanReveals();
  }

  /* Rect-scan fallback — covers environments where IO callbacks are
     throttled or unavailable (embedded webviews, some readers). Idempotent
     with the observer: whichever fires first wins.
     Read phase and write phase are strictly separated: all
     getBoundingClientRect reads happen before any class mutation, so a
     batch entry (e.g. the timeline's beam + connectors + years + cards)
     costs one layout, not one per element. */
  var scanRaf = 0;
  function scanReveals() {
    if (!revealQueue.length) return;
    var vh = window.innerHeight || doc.documentElement.clientHeight;
    var next = [];
    var entering = [];
    for (var i = 0; i < revealQueue.length; i++) {   // ── reads only
      var el = revealQueue[i];
      if (el.classList.contains("mo-in")) continue;
      var r = el.getBoundingClientRect();
      if (r.top < vh * 0.97 && r.bottom > 0) entering.push(el);
      else next.push(el);
    }
    revealQueue = next;
    for (var j = 0; j < entering.length; j++) onEnter(entering[j]); // ── writes
  }
  function queueScan() {
    if (scanRaf) return;
    scanRaf = requestAnimationFrame(function () {
      scanRaf = 0;
      scanReveals();
    });
  }
  window.addEventListener("scroll", queueScan, { passive: true });
  window.addEventListener("resize", queueScan, { passive: true });
  setInterval(function () { if (revealQueue.length) scanReveals(); }, 600);

  /* Hero entrance — fires immediately on init, never gated on scroll. */
  function enterHero() {
    var zones = doc.querySelectorAll("[data-mo-hero]");
    for (var z = 0; z < zones.length; z++) {
      var els = zones[z].querySelectorAll("[data-mo], .mo-line, .mo-word, .mo-donut");
      for (var i = 0; i < els.length; i++) els[i].classList.add("mo-in");
      if (zones[z].matches("[data-mo], .mo-line, .mo-word")) zones[z].classList.add("mo-in");
    }
    // Standalone masked lines outside data-mo-hero zones still enter on load.
    var lines = doc.querySelectorAll(".mo-line:not(.mo-in), .mo-word:not(.mo-in)");
    for (var j = 0; j < lines.length; j++) {
      if (!lines[j].closest("[data-mo-hero]")) lines[j].classList.add("mo-in");
    }
  }

  /* ---------------------------------------------------------------- */
  /* Per-word splitting (data-hero="words")                           */
  /* ---------------------------------------------------------------- */
  function splitWords() {
    var targets = doc.querySelectorAll(".mo-line");
    for (var t = 0; t < targets.length; t++) {
      var el = targets[t];
      if (state.heroMode === "words" && !el.dataset.moSplit) {
        el.dataset.moOriginal = el.innerHTML;
        var words = el.textContent.split(/\s+/).filter(Boolean);
        el.innerHTML = words
          .map(function (w, i) {
            return '<span class="mo-word" style="--mo-i:' + i + '">' + w + "</span>";
          })
          .join(" ");
        el.dataset.moSplit = "1";
      } else if (state.heroMode !== "words" && el.dataset.moSplit) {
        el.innerHTML = el.dataset.moOriginal;
        delete el.dataset.moSplit;
      }
    }
  }

  /* ---------------------------------------------------------------- */
  /* Cursor tracking: cards + magnetic buttons                        */
  /* ---------------------------------------------------------------- */
  var activeCard = null;
  var activeBtn = null;
  var pending = null;

  function trackPointer(e) {
    if (!state.enabled || reducedNow() || touchNow()) return;
    pending = e;
    if (trackPointer.raf) return;
    trackPointer.raf = requestAnimationFrame(function () {
      trackPointer.raf = 0;
      var ev = pending;
      var card = ev.target && ev.target.closest ? ev.target.closest(".mo-card") : null;
      if (activeCard && activeCard !== card) clearCard(activeCard);
      if (card) {
        var r = card.getBoundingClientRect();
        var x = ev.clientX - r.left;
        var y = ev.clientY - r.top;
        card.style.setProperty("--mx", x + "px");
        card.style.setProperty("--my", y + "px");
        card.style.setProperty("--dx", ((x / r.width) * 2 - 1).toFixed(3));
        card.style.setProperty("--dy", ((y / r.height) * 2 - 1).toFixed(3));
      }
      activeCard = card;

      var magnetic = state.magnetMode === "both" || state.magnetMode === "magnet";
      var btn = magnetic && ev.target && ev.target.closest ? ev.target.closest(".mo-btn") : null;
      if (activeBtn && activeBtn !== btn) clearBtn(activeBtn);
      if (btn) {
        var b = btn.getBoundingClientRect();
        var pull = 6 * state.magnetStrength;
        var tx = ((ev.clientX - (b.left + b.width / 2)) / (b.width / 2)) * pull;
        var ty = ((ev.clientY - (b.top + b.height / 2)) / (b.height / 2)) * pull;
        btn.style.transform = "translate(" + tx.toFixed(1) + "px," + ty.toFixed(1) + "px)";
      }
      activeBtn = btn;
    });
  }

  function clearCard(card) {
    card.style.removeProperty("--dx");
    card.style.removeProperty("--dy");
  }
  function clearBtn(btn) { btn.style.transform = ""; }

  doc.addEventListener("pointermove", trackPointer, { passive: true });
  doc.addEventListener("pointerleave", function () {
    if (activeBtn) clearBtn(activeBtn);
    activeBtn = null;
  });

  /* ---------------------------------------------------------------- */
  /* Count-ups                                                        */
  /* ---------------------------------------------------------------- */
  function runCountup(el) {
    if (!state.enabled || reducedNow()) return;
    if (el.dataset.moCounted) return;
    el.dataset.moCounted = "1";
    var text = el.textContent.trim();
    var m = text.match(/^([^0-9]*)([\d,]+(?:\.\d+)?)(.*)$/);
    if (!m) return;
    var prefix = m[1], numStr = m[2], suffix = m[3];
    var hasComma = numStr.indexOf(",") !== -1;
    var decimals = (numStr.split(".")[1] || "").length;
    var target = parseFloat(numStr.replace(/,/g, ""));
    var dur = 900 * state.speed;
    var t0 = null;
    function fmt(v) {
      var s = v.toFixed(decimals);
      if (hasComma) {
        var parts = s.split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        s = parts.join(".");
      }
      return prefix + s + suffix;
    }
    function frame(ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
      el.textContent = fmt(target * eased);
      if (p < 1) requestAnimationFrame(frame);
      else el.textContent = fmt(target);
    }
    requestAnimationFrame(frame);
  }

  /* ---------------------------------------------------------------- */
  /* Sector wheel — velocity-lerped spin, eases faster on hover       */
  /* ---------------------------------------------------------------- */
  var wheelItems = [];   // Next adapter: persists across init() calls
  var wheelLoopOn = false;
  function driveWheels() {
    var wheels = doc.querySelectorAll(".mo-wheel");
    if (!wheels.length) return;
    // Drop records whose element left the DOM (soft navigation).
    wheelItems = wheelItems.filter(function (it) { return doc.contains(it.el); });
    var items = wheelItems;
    for (var i = 0; i < wheels.length; i++) {
      (function (w) {
        if (w.dataset.moWheelBound) return;
        var orbit = w.querySelector(".wheel-orbit");
        if (!orbit) return;
        w.dataset.moWheelBound = "1";
        var rec = { el: w, orbit: orbit, inners: w.querySelectorAll(".wheel-icon-inner"), angle: 0, v: 18, hover: false };
        w.addEventListener("pointerenter", function () { rec.hover = true; });
        w.addEventListener("pointerleave", function () { rec.hover = false; });
        items.push(rec);
      })(wheels[i]);
    }
    if (wheelLoopOn) return;
    wheelLoopOn = true;
    var last = null;
    function tick(ts) {
      requestAnimationFrame(tick);
      if (last === null) { last = ts; return; }
      var dt = Math.min((ts - last) / 1000, 0.05);
      last = ts;
      var on = state.enabled && !reducedNow();
      for (var i = 0; i < items.length; i++) {
        var it = items[i];
        it.el.classList.toggle("mo-wheel-js", on);
        if (!on) { it.orbit.style.transform = ""; continue; }
        var target = (it.hover && !touchNow()) ? 40 : 18; // deg/s
        it.v += (target - it.v) * Math.min(dt * 4, 1);    // smooth ease
        it.angle = (it.angle + it.v * dt) % 360;
        it.orbit.style.transform = "rotate(" + it.angle.toFixed(2) + "deg)";
        for (var k = 0; k < it.inners.length; k++) {
          it.inners[k].style.transform = "rotate(" + (-it.angle).toFixed(2) + "deg)";
        }
      }
    }
    requestAnimationFrame(tick);
  }

  /* ---------------------------------------------------------------- */
  /* Hero parallax                                                    */
  /* ---------------------------------------------------------------- */
  function bindParallax() {
    var els = doc.querySelectorAll(".mo-parallax");
    if (!els.length) return;
    var raf = 0;
    var hostH = [];        // cached — re-measured on resize, not per scroll
    var lastOff = [];
    function measure() {
      for (var i = 0; i < els.length; i++) {
        var host = els[i].closest("section") || els[i].parentElement;
        hostH[i] = host ? host.offsetHeight : 600;
      }
    }
    function update() {
      raf = 0;
      var y = window.scrollY || 0;
      for (var i = 0; i < els.length; i++) {
        var off = (Math.max(Math.min(y, hostH[i]), 0) * 0.14).toFixed(1);
        if (off === lastOff[i]) continue; // clamped past the hero: no-op writes
        lastOff[i] = off;
        els[i].style.setProperty("--mo-py", off + "px");
      }
    }
    on(window, "scroll", function () {
      if (!state.enabled || reducedNow() || !state.parallax) return;
      if (!raf) raf = requestAnimationFrame(update);
    }, { passive: true });
    on(window, "resize", function () { measure(); }, { passive: true });
    measure();
    update();
  }

  /* ---------------------------------------------------------------- */
  /* Off-screen gating for persistent loops (Ken Burns)                */
  /* ---------------------------------------------------------------- */
  var gateIO = null;
  function gateLoops() {
    var loops = doc.querySelectorAll(".mo-kenwrap");
    if (gateIO) { gateIO.disconnect(); gateIO = null; }
    if (!loops.length || !("IntersectionObserver" in window)) return;
    var io = gateIO = new IntersectionObserver(function (es) {
      for (var i = 0; i < es.length; i++) {
        if (es[i].isIntersecting) es[i].target.removeAttribute("data-mo-offscreen");
        else es[i].target.setAttribute("data-mo-offscreen", "");
      }
    });
    for (var j = 0; j < loops.length; j++) io.observe(loops[j]);
  }

  /* ---------------------------------------------------------------- */
  /* E14: Anchor-nav scrollspy — bold the section currently in view.  */
  /* ---------------------------------------------------------------- */
  function bindScrollspy() {
    var nav = doc.querySelector(".anchor-nav");
    if (!nav) return;
    var links = nav.querySelectorAll('a[href*="#"]');
    var map = [];
    for (var i = 0; i < links.length; i++) {
      var href = links[i].getAttribute("href");
      var sec = doc.getElementById(href.slice(href.indexOf("#") + 1));
      if (sec) map.push({ link: links[i], sec: sec });
    }
    if (!map.length) return;
    var stale = nav.querySelector(".anchor-spy");
    if (stale) stale.remove();
    var current = null;
    var raf = 0;
    function setActive(link) {
      for (var i = 0; i < map.length; i++) {
        map[i].link.classList.toggle("is-active", map[i].link === link);
      }
    }
    function update() {
      raf = 0;
      if (!state.enabled) {
        setActive(null);
        current = null;
        return;
      }
      var vh = window.innerHeight || 800;
      var active = null;
      for (var i = 0; i < map.length; i++) {
        if (map[i].sec.getBoundingClientRect().top < vh * 0.45) active = map[i];
      }
      if (!active) {
        setActive(null);
        current = null;
        return;
      }
      if (active === current) return;
      current = active;
      setActive(active.link);
    }
    on(window, "scroll", function () {
      if (!raf) raf = requestAnimationFrame(update);
    }, { passive: true });
    on(window, "resize", function () {
      current = null;
      if (!raf) raf = requestAnimationFrame(update);
    }, { passive: true });
    update();
  }

  /* ---------------------------------------------------------------- */
  /* Page transitions — fade to navy on internal nav, lift on arrival  */
  /* ---------------------------------------------------------------- */
  function bindTransitions() {
    if (root.hasAttribute("data-mo-router")) return; // Next adapter owns the veil
    var EXIT_MS = 260;
    var NAV_KEY = "pwrl-mo-nav";

    function makeVeil(opacity) {
      var v = doc.createElement("div");
      v.className = "mo-veil";
      v.style.opacity = opacity;
      doc.body.appendChild(v);
      return v;
    }

    // Arrival: if we came here via an exit transition, lift the veil.
    try {
      if (sessionStorage.getItem(NAV_KEY) === "1") {
        sessionStorage.removeItem(NAV_KEY);
        if (state.enabled && !reducedNow()) {
          var lift = makeVeil("1");
          requestAnimationFrame(function () {
            requestAnimationFrame(function () { lift.style.opacity = "0"; });
          });
          setTimeout(function () { if (lift.parentNode) lift.parentNode.removeChild(lift); }, 700);
        }
      }
    } catch (e) { /* storage unavailable — skip */ }

    // Exit: intercept plain left-clicks on internal page links.
    on(doc, "click", function (e) {
      if (!state.enabled || reducedNow()) return;
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var a = e.target && e.target.closest ? e.target.closest("a[href]") : null;
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      var url;
      try { url = new URL(a.href, location.href); } catch (err) { return; }
      if (url.origin !== location.origin) return;          // external
      if (url.pathname === location.pathname) return;      // in-page anchor
      e.preventDefault();
      try { sessionStorage.setItem(NAV_KEY, "1"); } catch (err) { /* ok */ }
      var v = makeVeil("0");
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { v.style.opacity = "1"; });
      });
      setTimeout(function () { location.href = url.href; }, EXIT_MS);
    }, true);
  }

  /* ---------------------------------------------------------------- */
  /* Header auto-hide (existing site behavior, ported)                */
  /* ---------------------------------------------------------------- */
  function bindHeader() {
    var bar = doc.querySelector("[data-header-hide]");
    if (!bar) return;
    var lastY = 0;
    var hidden = false;
    on(window, "scroll", function () {
      var y = window.scrollY || 0;
      var hide = y > 120 && y > lastY;
      lastY = y;
      if (hide === hidden) return; // only touch style on state change
      hidden = hide;
      bar.style.transform = hide ? "translateY(-100%)" : "translateY(0)";
    }, { passive: true });
  }

  /* ---------------------------------------------------------------- */
  /* Public API                                                       */
  /* ---------------------------------------------------------------- */
  function set(opts) {
    var heroChanged = opts.heroMode && opts.heroMode !== state.heroMode;
    for (var k in opts) if (k in state) state[k] = opts[k];
    sync();
    if (heroChanged) { splitWords(); enterHero(); }
  }

  function replay() {
    var els = doc.querySelectorAll(".mo-in");
    for (var i = 0; i < els.length; i++) els[i].classList.remove("mo-in");
    var counted = doc.querySelectorAll("[data-mo-counted]");
    for (var c = 0; c < counted.length; c++) delete counted[c].dataset.moCounted;
    // Force style flush so pre-states re-apply before re-entering.
    void root.offsetWidth;
    requestAnimationFrame(function () {
      enterHero();
      observeAll();
    });
  }

  var mqBound = false;
  function init(opts) {
    offAll(); // Next adapter: safe re-init after soft navigations
    if (opts) for (var k in opts) if (k in state) state[k] = opts[k];
    sync();
    splitWords();
    indexStaggers();
    enterHero();
    observeAll();
    driveWheels();
    bindParallax();
    gateLoops();
    bindTransitions();
    bindScrollspy();
    bindHeader();
    if (!mqBound) { mqBound = true; mq.addEventListener("change", sync); }
  }

  window.PWRLMotion = { init: init, set: set, replay: replay, state: state };

  if (doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", function () { init(); });
  } else {
    init();
  }
})();

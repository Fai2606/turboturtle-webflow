/* turboturtle-combined.js
   - Core Lenis + GSAP ScrollTrigger
   - Parallax tweens & Config-based City Layer Reveals
   - Synchronized Mountain-triggered City Parallax
   - Highlight Reveal & Reusable Fadeup trigger
   - Rocket Standalone Launch Trigger
   - Jetman & Surprised Dolphin launch
   - Jetplane & Bigfly arcs & UFO chase + Akira trail
*/
(function (root) {
  if (!root) return;

  var isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  var gsap, ScrollTrigger, lenis;

  var vw = root.innerWidth / 100;
  var vh = root.innerHeight / 100;
  var lastWidth = root.innerWidth;

  root.addEventListener("resize", function () {
    vw = root.innerWidth / 100;
    vh = root.innerHeight / 100;
    if (root.innerWidth !== lastWidth) {
      lastWidth = root.innerWidth;
      if (root.ScrollTrigger) root.ScrollTrigger.refresh();
    }
  });

  function libsReady() { return !!(root.gsap && root.ScrollTrigger && root.Lenis); }

  function onDOMReady(fn) {
    if (document.readyState === "complete" || document.readyState === "interactive") fn();
    else document.addEventListener("DOMContentLoaded", fn, { once: true });
  }

  function startWhenReady(tries) {
    if (libsReady()) { onDOMReady(startCore); return; }
    if (tries > 0) setTimeout(function () { startWhenReady(tries - 1); }, 100);
    else console.error("[TT] Required libs not available (GSAP/ScrollTrigger/Lenis).");
  }

  startWhenReady(120);

  function q(sel)   { return document.querySelector(sel); }
  function exists(s){ return !!q(s); }
  function tweenIf(sel, vars) { if (exists(sel)) gsap.to(sel, vars); }

  function startCore() {
    console.log("[TT] startCore entered");
    try {
      gsap = root.gsap;
      ScrollTrigger = root.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      ScrollTrigger.config({ ignoreMobileResize: true });

// --- 1. LENIS (Smooth Scroll) ---
      lenis = new root.Lenis({ lerp: 0.1, smoothWheel: true, smoothTouch: false, wheelMultiplier: 1, touchMultiplier: 1, infinite: false });
      root.lenis = lenis;

      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);

      ScrollTrigger.scrollerProxy(window, {
        scrollTop: function (value) {
          if (arguments.length) return lenis.scrollTo(value);
          return (typeof lenis.scroll === "number") ? lenis.scroll : (root.pageYOffset || 0);
        },
        getBoundingClientRect: function () { return { top: 0, left: 0, width: innerWidth, height: innerHeight }; },
        pinType: document.body.style.transform ? "transform" : "fixed"
      });

      lenis.on("scroll", ScrollTrigger.update);
      ScrollTrigger.addEventListener("refresh", function () { if (lenis.resize) lenis.resize(); });

// --- 2. PARALLAX TWEENS ---
      var parallaxTrigger = exists(".parallax-wrapper") ? ".parallax-wrapper" : "body";

      function stable(vars) {
        vars.overwrite = "auto";
        if (!vars.scrollTrigger) vars.scrollTrigger = {};
        vars.scrollTrigger.invalidateOnRefresh = true;
        return vars;
      }

      tweenIf(".about_planet", stable({ y: () => 20 * vh, ease: "none", scrollTrigger: { trigger: parallaxTrigger, start: "top top", end: "bottom bottom", scrub: true } }));
      tweenIf(".spacecats", stable({ x: () => -3 * vw, y: () => 40 * vh, rotation: 20, scale: 1.1, ease: "none", scrollTrigger: { trigger: parallaxTrigger, start: "top top", end: "bottom bottom", scrub: 0.5, fastScrollEnd: true } }));
      tweenIf(".about_saturn", stable({ x: () => -2 * vw, y: () => 30 * vh, rotation: -25, scale: 0.9, ease: "none", scrollTrigger: { trigger: parallaxTrigger, start: "top top", end: "bottom bottom", scrub: true } }));
      tweenIf(".satellitemove", stable({ x: () => 10 * vw, y: () => 50 * vh, rotation: 15, scale: 0.85, ease: "none", scrollTrigger: { trigger: parallaxTrigger, start: "top top", end: "bottom bottom", scrub: true } }));
      tweenIf(".about_watermoon", stable({ yPercent: 35, ease: "none", scrollTrigger: { trigger: ".about_watermoon", start: "-20% bottom", end: "bottom -20%", scrub

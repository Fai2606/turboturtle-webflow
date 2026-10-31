/* turboturtle-combined.js - Optimized & Integrated Version */
(function (root) {
  if (!root) return;

  var isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  // V19 diagnostic: bypass Lenis smooth-scroll integration ONLY on iOS Chrome.
  var isIOSChromeNativeScroll = /CriOS\//.test(navigator.userAgent) && /iPhone|iPad|iPod/.test(navigator.userAgent);
  var gsap, ScrollTrigger, lenis, MorphSVGPlugin;

// ==========================================================
// REAL VIEWPORT UNITS
// Do NOT use window.innerWidth / innerHeight.city
// Some Android browsers report a scaled layout viewport.
// ==========================================================

function getRealViewportWidth() {
  return document.documentElement.clientWidth;
}

function getRealViewportHeight() {
  return document.documentElement.clientHeight;
}

var vw = getRealViewportWidth() / 100;
var vh = getRealViewportHeight() / 100;

var lastWidth =
  getRealViewportWidth();

var lastHeight =
  getRealViewportHeight();


root.addEventListener("resize", function () {

  var currentWidth =
    getRealViewportWidth();

  var currentHeight =
    getRealViewportHeight();


  var widthChanged =
    Math.abs(
      currentWidth -
      lastWidth
    ) > 20;


  // Android browser bars can change height while scrolling.
  // Don't refresh everything for tiny height-only changes.
  if (!widthChanged) return;


  vw =
    currentWidth / 100;

  vh =
    currentHeight / 100;


  lastWidth =
    currentWidth;

  lastHeight =
    currentHeight;


  if (root.ScrollTrigger) {
    root.ScrollTrigger.refresh();
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

  function q(sel) { return document.querySelector(sel); }
  function exists(s) { return !!q(s); }
  function tweenIf(sel, vars) { if (exists(sel)) gsap.to(sel, vars); }

  function startCore() {
    try {
      gsap = root.gsap;
      ScrollTrigger = root.ScrollTrigger;
      MorphSVGPlugin = root.MorphSVGPlugin;
      var SplitText = root.SplitText;
      var ttClouds = gsap.utils.toArray(".home2_cloud, .general_cloud");
      if (ttClouds.length) gsap.set(ttClouds, { opacity: 1 });
  



      // ============================================================
      // GLOBAL — SPLITTEXT SCATTER / UNIFY / SCATTER
      // Unified from top 60% to top 40%
      // ============================================================

      var SPLITTEXT_SETTINGS = {
        scatterX: 50,
        scatterY: 35,
        scatterRotation: 30,
        scrub: 1
      };

      if (SplitText) {

        gsap.utils.toArray(".splittext").forEach(function(el) {

          var split = SplitText.create(el, {
            type: "chars",
            charsClass: "splittext_char"
          });

          var chars = split.chars;

          var scatterData = chars.map(function() {
            return {
              x: gsap.utils.random(
                -SPLITTEXT_SETTINGS.scatterX,
                SPLITTEXT_SETTINGS.scatterX
              ),
              y: gsap.utils.random(
                -SPLITTEXT_SETTINGS.scatterY,
                SPLITTEXT_SETTINGS.scatterY
              ),
              rotation: gsap.utils.random(
                -SPLITTEXT_SETTINGS.scatterRotation,
                SPLITTEXT_SETTINGS.scatterRotation
              )
            };
          });

          // Initial scattered state
          chars.forEach(function(char, i) {
            gsap.set(char, {
              display: "inline-block",
              x: scatterData[i].x,
              y: scatterData[i].y,
              rotation: scatterData[i].rotation
            });
          });

          var tl = gsap.timeline({
            scrollTrigger: {
              trigger: el,
              start: "top 100%",
              end: "top 0%",
              scrub: SPLITTEXT_SETTINGS.scrub,
              invalidateOnRefresh: true
            }
          });

          // ========================================================
          // TOP 100% → 60%: UNIFY (EASE OUT)
          // ========================================================

          tl.to(chars, {
            x: 0,
            y: 0,
            rotation: 0,
            duration: 0.4,
            ease: "power2.out"
          }, 0);

          // ========================================================
          // TOP 60% → 40%: HOLD UNIFIED
          // ========================================================

          tl.to({}, {
            duration: 0.2
          }, 0.4);

          // ========================================================
          // TOP 40% → 0%: SPLIT (EASE IN)
          // ========================================================

          chars.forEach(function(char, i) {
            tl.to(char, {
              x: scatterData[i].x,
              y: scatterData[i].y,
              rotation: scatterData[i].rotation,
              duration: 0.4,
              ease: "power2.in"
            }, 0.6);
          });

        });

      } else {
        console.warn("[TT] SplitText plugin not loaded.");
      }





      ScrollTrigger.config({ ignoreMobileResize: true, syncInterval: 999 });

      lenis = new root.Lenis({
        lerp: isIOSChromeNativeScroll ? 1 : (isMobile ? 0.12 : 0.08),
        smoothWheel: !isIOSChromeNativeScroll,
        smoothTouch: false,
        syncTouch: false,
        touchMultiplier: 1.5,
        infinite: false
      });

      root.lenis = lenis;

      if (isIOSChromeNativeScroll) {
        // Diagnostic isolation: native scrolling + native ScrollTrigger positions.
        // Do not install Lenis' RAF driver or its ScrollTrigger scrollerProxy.
        // Keep the Lenis object available for other site modules and footer controls.
        // On iOS Chrome, touch scrolling was already native; this test specifically
        // removes the Lenis RAF/proxy coupling that may contribute to the glitch.
        root.addEventListener("scroll", ScrollTrigger.update, { passive: true });
        console.info("[TT V19] iOS Chrome: native ScrollTrigger scroll path; Lenis RAF/proxy bypassed.");
      } else {
        // V13 original integration, preserved unchanged for Safari/other browsers.
        gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
        gsap.ticker.lagSmoothing(0);

        ScrollTrigger.scrollerProxy(window, {
          scrollTop: function (value) {
            if (arguments.length) return lenis.scrollTo(value);
            return (typeof lenis.scroll === "number") ? lenis.scroll : (root.pageYOffset || 0);
          },
          getBoundingClientRect: function () {
            return {
              top: 0,
              left: 0,
              width: document.documentElement.clientWidth,
              height: document.documentElement.clientHeight
            };
          },
          pinType: "transform"
        });

        lenis.on("scroll", ScrollTrigger.update);
      }

      // ============================================================
      // GLOBAL — REUSABLE PENDULUM ACTION
      // Apply .pendulum_action to any Webflow element
      // ============================================================

      var pendulumElements =
        gsap.utils.toArray(".pendulum_action, .pendulum_action2");
        var PENDULUM_ACTION2_MAGNITUDE = 0.75;

      if (pendulumElements.length) {

        // ==========================================================
        // SETTINGS
        // ==========================================================

        var PENDULUM_SCROLL_TILT = 38;

        // Swing speed
        var PENDULUM_SPRING = 36;

        // Momentum retention
        var PENDULUM_DAMPING = isMobile ? 0.7 : 1.0;

        // Scroll sensitivity
        var PENDULUM_SCROLL_SENSITIVITY = 3.5;

        // Response and release
        var PENDULUM_RESPONSE = 12;
        var PENDULUM_RELEASE = 9;


        // ==========================================================
        // PHYSICS STATE
        // ==========================================================

        var pendulumAngle = 0;
        var pendulumVelocity = 0;
        var scrollInfluence = 0;
        var scrollVelocity = 0;
        var lastScrollEventTime = -Infinity;

        var DEG_TO_RAD = Math.PI / 180;
        var RAD_TO_DEG = 180 / Math.PI;

        var maxTilt =
          PENDULUM_SCROLL_TILT * DEG_TO_RAD;

        gsap.set(pendulumElements, {
          rotation: 0,
          force3D: true
        });

        // ==========================================================
        // GLOBAL SCROLL INPUT
        // ==========================================================

        lenis.on("scroll", function(event) {

          scrollVelocity = event.velocity || 0;

          lastScrollEventTime = performance.now();

        });

        // ==========================================================
        // PENDULUM PHYSICS
        // ==========================================================

        gsap.ticker.add(function(time, deltaTime) {

          var totalDt = Math.min(
            deltaTime / 1000,
            0.05
          );

          var steps = Math.max(
            1,
            Math.ceil(totalDt / (1 / 120))
          );

          var dt = totalDt / steps;

          // ------------------------------------------
          // Scroll inactivity
          // ------------------------------------------

          if (
            performance.now() -
            lastScrollEventTime > 100
          ) {
            scrollVelocity = 0;
          }

          // ------------------------------------------
          // Scroll direction
          //
          // Desktop:
          // Down = Left
          // Up   = Right
          //
          // Mobile:
          // Down = Right
          // Up   = Left
          // ------------------------------------------

          var normalizedVelocity =
            (isMobile ? scrollVelocity : -scrollVelocity) /
            PENDULUM_SCROLL_SENSITIVITY;

          // ------------------------------------------
          // Target tilt
          // ------------------------------------------

          var desiredTilt =
            maxTilt *
            (
              normalizedVelocity /
              (
                1 +
                Math.abs(normalizedVelocity)
              )
            );

          // ------------------------------------------
          // Smooth scroll influence
          // ------------------------------------------

          var responseRate =
            Math.abs(desiredTilt) >
            Math.abs(scrollInfluence)
              ? PENDULUM_RESPONSE
              : PENDULUM_RELEASE;

          var influenceBlend =
            1 - Math.exp(
              -responseRate * totalDt
            );

          scrollInfluence +=
            (desiredTilt - scrollInfluence) *
            influenceBlend;

          // ------------------------------------------
          // Spring physics
          // ------------------------------------------

          for (var i = 0; i < steps; i++) {

            var displacement =
              pendulumAngle - scrollInfluence;

            var acceleration =
              -PENDULUM_SPRING *
              Math.sin(displacement)
              -
              PENDULUM_DAMPING *
              pendulumVelocity;

            pendulumVelocity +=
              acceleration * dt;

            pendulumAngle +=
              pendulumVelocity * dt;

          }

          // ------------------------------------------
          // Natural settling
          // ------------------------------------------

          if (
            Math.abs(pendulumAngle) < 0.00005 &&
            Math.abs(pendulumVelocity) < 0.00005 &&
            Math.abs(scrollInfluence) < 0.00005
          ) {
            pendulumAngle = 0;
            pendulumVelocity = 0;
            scrollInfluence = 0;
          }

          // ------------------------------------------
          // Apply to ALL pendulum_action elements
          // ------------------------------------------

          pendulumElements.forEach(function(el) {
          
            var magnitude = el.classList.contains("pendulum_action2")
              ? PENDULUM_ACTION2_MAGNITUDE
              : 1;
          
            gsap.set(el, {
              rotation: pendulumAngle * RAD_TO_DEG * magnitude
            });
          
          });

        });

      }

      ScrollTrigger.addEventListener("refresh", function () {
        if (lenis.resize) lenis.resize();
      });

      var parallaxTrigger = exists(".parallax-wrapper") ? ".parallax-wrapper" : "body";

      // Stability / GPU helper
      function stable(vars) {
        vars.overwrite = "auto";
        vars.force3D = true;

        if (!vars.scrollTrigger) vars.scrollTrigger = {};
        if (vars.scrollTrigger.scrub === true) vars.scrollTrigger.scrub = 1;
        if (!vars.scrollTrigger.start) vars.scrollTrigger.start = "top 120%";

        vars.scrollTrigger.invalidateOnRefresh = true;
        vars.scrollTrigger.fastScrollEnd = true;

        var userOnToggle = vars.scrollTrigger.onToggle;

        vars.scrollTrigger.onToggle = function (self) {
          if (vars.targetEl) {
            var els = typeof vars.targetEl === "string"
              ? document.querySelectorAll(vars.targetEl)
              : [vars.targetEl];

            els.forEach(function (el) {
              el.style.willChange = self.isActive ? "transform" : "auto";
            });
          }

          if (userOnToggle) userOnToggle(self);
        };

        // targetEl is internal metadata for onToggle, not a GSAP tween property.
        var cleanVars = Object.assign({}, vars);
        delete cleanVars.targetEl;
        return cleanVars;
      }

      // -------------------------------------------------------------
      // LIQUID MORPH
      // -------------------------------------------------------------
      if (exists("#liquid-stream") && MorphSVGPlugin) {
        var drippedPath = "M395,120 C380,250 370,400 395,520 C400,530 400,530 405,520 C430,400 420,250 405,120 Z";

        gsap.to("#liquid-stream", {
          morphSVG: drippedPath,
          ease: "none",
          scrollTrigger: {
            trigger: exists(".sticky-wrapper") ? ".sticky-wrapper" : parallaxTrigger,
            start: "top top",
            end: "bottom bottom",
            scrub: 1
          }
        });
      }

// -------------------------------------------------------------
// ABOUT US — PARALLAX
// DIRECT SCROLL-LINKED — NO SCRUB LAG
// -------------------------------------------------------------

tweenIf(".general_cloud", stable({ targetEl: ".general_cloud", y: () => -65 * vh, ease: "none", scrollTrigger: { trigger: ".general_cloud", start: "top bottom", end: "bottom top", scrub: true } }));
      
tweenIf(".about_planet", stable({ targetEl: ".about_planet", y: () => 20 * vh, ease: "none", scrollTrigger: { trigger: parallaxTrigger, start: "top top", end: "bottom bottom", scrub: true } }));
tweenIf(".spacecats", stable({ targetEl: ".spacecats", x: () => -3 * vw, y: () => 40 * vh, rotation: 20, scale: 1.1, ease: "none", scrollTrigger: { trigger: parallaxTrigger, start: "top top", end: "bottom bottom", scrub: true } }));
tweenIf(".about_saturn", stable({ targetEl: ".about_saturn", x: () => -2 * vw, y: () => 30 * vh, rotation: -25, scale: 0.9, ease: "none", scrollTrigger: { trigger: parallaxTrigger, start: "top top", end: "bottom bottom", scrub: true } }));
tweenIf(".satellitemove", stable({ targetEl: ".satellitemove", x: () => 10 * vw, y: () => 50 * vh, rotation: 15, scale: 0.85, ease: "none", scrollTrigger: { trigger: parallaxTrigger, start: "top top", end: "bottom bottom", scrub: true } }));
tweenIf(".about_watermoon", stable({ targetEl: ".about_watermoon", yPercent: 35, ease: "none", scrollTrigger: { trigger: ".about_watermoon", start: "-20% bottom", end: "bottom -20%", scrub: true } }));
tweenIf(".about_section_1", stable({ targetEl: ".about_section_1", y: () => -10 * vh, ease: "none", scrollTrigger: { trigger: parallaxTrigger, start: "top top", end: "bottom bottom", scrub: true } }));
tweenIf(".about_section_2", stable({ targetEl: ".about_section_2", y: () => -10 * vh, ease: "none", scrollTrigger: { trigger: ".about_section_2", start: "top bottom", end: "bottom top", scrub: true } }));
tweenIf(".lakeshrink", stable({ targetEl: ".lakeshrink", scaleY: 0.2, ease: "none", scrollTrigger: { trigger: ".lakeshrink", start: "top bottom", end: "bottom top", scrub: true } }));
tweenIf(".duckswim", stable({ targetEl: ".duckswim", x: () => -5 * vw - 80, yPercent: -35, ease: "none", scrollTrigger: { trigger: ".duckswim", start: "top bottom", end: "bottom top", scrub: true } }));
tweenIf(".about_turtle2", stable({ targetEl: ".about_turtle2", x: () => 60 * vw, y: () => 10 * vw, rotation: 6, ease: "none", scrollTrigger: { trigger: ".about_turtle2", start: "-20% bottom", end: "bottom -20%", scrub: true } }));
// Blood cells — similar direction to turtle2, slightly slower movement.
tweenIf(".about_bloodcell", stable({ targetEl: ".about_bloodcell", x: () => 5 * vw, y: () => 8 * vw, rotation: 5, ease: "none", scrollTrigger: { trigger: ".about_bloodcell", start: "-20% bottom", end: "bottom -20%", scrub: true } }));
tweenIf(".about_turtle1", stable({ targetEl: ".about_turtle1", x: () => 28 * vw, y: () => -5 * vw, rotation: -5, ease: "none", scrollTrigger: { trigger: ".about_turtle1", start: "top bottom", end: "bottom top", scrub: true } }));
tweenIf(".about_nessie", stable({ targetEl: ".about_nessie", x: () => 7 * vw, y: () => -13 * vw, rotation: -20, ease: "none", scrollTrigger: { trigger: ".about_nessie", start: "top bottom", end: "bottom top", scrub: true } }));
tweenIf(".about_bigbigfly", stable({ targetEl: ".about_bigbigfly", x: () => 220 * vw, y: () => -4 * vw, rotation: -5, ease: "none", scrollTrigger: { trigger: ".about_bigbigfly", start: "top bottom", end: "bottom -10%", scrub: true } }));
tweenIf(".about_turtle3", stable({ targetEl: ".about_turtle3", x: () => 40 * vw, y: () => -5 * vh, ease: "none", scrollTrigger: { trigger: ".about_turtle3", start: "-20% bottom", end: "bottom -20%", scrub: true } }));
tweenIf(".about_turtle4", stable({ targetEl: ".about_turtle4", x: () => 20 * vw, y: () => 8 * vh, ease: "none", scrollTrigger: { trigger: ".about_turtle4", start: "-20% bottom", end: "bottom -20%", scrub: true } }));
tweenIf(".about_chickenfish", stable({ targetEl: ".about_chickenfish", x: () => 12 * vw, y: () => 5 * vh, ease: "none", scrollTrigger: { trigger: ".about_chickenfish", start: "top bottom", end: "bottom top", scrub: true } }));
tweenIf(".about_flyduck", stable({ targetEl: ".about_flyduck", x: () => 140 * vw, y: () => 5 * vh, ease: "none", scrollTrigger: { trigger: ".about_flyduck", start: isMobile ? "top 120%" : "top bottom", end: "bottom top", scrub: true } }));
tweenIf(".about_octopus1", stable({ targetEl: ".about_octopus1", x: () => 20 * vw, y: () => -15 * vh, rotation: -10, ease: "none", scrollTrigger: { trigger: ".about_octopus1", start: "top bottom", end: "bottom top", scrub: true } }));
tweenIf(".about_octopus2", stable({ targetEl: ".about_octopus2", x: () => 15 * vw, y: () => 25 * vh, rotation: 10, ease: "none", scrollTrigger: { trigger: ".about_octopus2", start: "-20% bottom", end: "bottom -20%", scrub: true } }));
tweenIf(".about_bubble", stable({ targetEl: ".about_bubble", y: () => -400 * vh, x: () => 2 * vw, ease: "none", scrollTrigger: { trigger: ".about_bubble", start: "top bottom", end: "bottom -200%", scrub: true } }));
tweenIf(".about_bigbubble", stable({ targetEl: ".about_bigbubble", y: () => -1400 * vh, x: () => 2 * vw, ease: "none", scrollTrigger: { trigger: ".about_bigbubble", start: "top bottom", end: "bottom -400%", scrub: true } }));
tweenIf(".about_small_planet1", stable({ targetEl: ".about_small_planet1", y: () => 10 * vh, ease: "none", scrollTrigger: { trigger: ".about_small_planet1", start: "top bottom", end: "bottom top", scrub: true } }));
tweenIf(".about_small_planet2", stable({ targetEl: ".about_small_planet2", y: () => 15 * vh, ease: "none", scrollTrigger: { trigger: ".about_small_planet2", start: "top bottom", end: "bottom top", scrub: true } }));
tweenIf(".footer_ask", stable({ targetEl: ".footer_ask", y: () => -10 * vh, ease: "none", scrollTrigger: { trigger: ".footer_ask", start: "top bottom", end: "bottom top", scrub: true } }));
tweenIf(".footer_credit", stable({ targetEl: ".footer_credit", y: () => 10 * vh, ease: "none", scrollTrigger: { trigger: ".footer_credit", start: "top bottom", end: "bottom top", scrub: true } }));
tweenIf(".about_citymoon", stable({ targetEl: ".about_citymoon", y: () => 10 * vh, ease: "none", scrollTrigger: { trigger: ".about_citymoon", start: "top bottom", end: "bottom top", scrub: true } }));
tweenIf(".about_cityballoon", stable({ targetEl: ".about_cityballoon", y: () => 30 * vh, ease: "none", scrollTrigger: { trigger: ".about_cityballoon", start: "top bottom", end: "bottom top", scrub: true } }));
var giantSquid = document.querySelector(".about_giant_squid");

if (giantSquid) {

  var squidSpeed = 0.36;

  // Freeze these measurements.
  // Mobile URL bar appearing/disappearing must NOT change them.
  var squidViewportHeight = document.documentElement.clientHeight;
  var squidElementHeight = giantSquid.offsetHeight;

  function squidDistance() {
    return squidElementHeight + squidViewportHeight;
  }

  gsap.to(giantSquid, {

    y: squidDistance() * ((1 / squidSpeed) - 1),

    x: 8 * vw,

    ease: "none",
    force3D: true,

    scrollTrigger: {
      trigger: giantSquid,

      start: "top bottom",

      end: "+=" + (squidDistance() / squidSpeed),

      scrub: isMobile ? 0.6 : true,

      // IMPORTANT:
      // don't rebuild squid movement when URL bar changes height
      invalidateOnRefresh: false
    }
  });
}
      
      if (exists(".about_balloon")) {
        gsap.set(".about_balloon", { force3D: true, z: 0.1 });

        gsap.fromTo(
          ".about_balloon",
          { y: "0vh", yPercent: 0 },
          {
            y: "50vh",
            yPercent: 50,
            ease: "none",
            scrollTrigger: {
              trigger: ".about_balloon",
              start: "top 120%",
              end: "bottom top",
              scrub: 1,
              fastScrollEnd: true
            }
          }
        );
      }

// -------------------------------------------------------------
// ABOUT US — CITY REVEALS
// MANUAL SCROLL VERSION
//
// WHY:
// Chrome iOS reports broken geometry for children inside
// a CSS-zoomed city.
//
// The CITY itself still uses the SAME CSS zoom system as Homepage.
//
// We do NOT let ScrollTrigger measure .about_mountain.
// Instead we calculate progress from about_section6 itself.
// -------------------------------------------------------------

var aboutCity =
  q(".about_section6_city");

var aboutSection =
  q(".about_section6");

var aboutMountain =
  q(".about_mountain");

var aboutBottomArea =
  q(".about_bottom_area");

var mountainTrigger =
  aboutMountain ||
  aboutBottomArea;


// -------------------------------------------------------------
// CITY REVEAL SETTINGS
// -------------------------------------------------------------

var cityReveals = [

  {
    sel: ".about_crystal",
    fromY: -20,
    start: 1.20,
    end: 0.20
  },

  {
    sel: ".about_citybuilding_4",
    fromY: 5,
    start: 1.20,
    end: 0.30
  },

  {
    sel: ".about_citybuilding_3",
    fromY: 10,
    start: 1.20,
    end: 0.30
  },

  {
    sel: ".about_citybuilding_6",
    fromY: 15,
    start: 1.20,
    end: 0.30
  },

  {
    sel: ".about_citybuilding_5",
    fromY: 20,
    start: 1.20,
    end: 0.30
  },

  {
    sel: ".about_citybuilding_2",
    fromY: 25,
    start: 1.20,
    end: 0.30
  },

  {
    sel: ".about_backlayer",
    fromY: 30,
    start: 1.20,
    end: 0.30
  },

  {
    sel: ".about_mountain",
    fromY: 35,
    start: 1.20,
    end: 0.30
  },

  {
    sel: ".about_citytree_1",
    fromY: 80,
    start: 1.20,
    end: 0.30
  },

  {
    sel: ".about_citytree_2",
    fromY: 80,
    start: 1.20,
    end: 0.30
  },

  {
    sel: ".about_citytree_3",
    fromY: 80,
    start: 1.20,
    end: 0.30
  },

  {
    sel: ".about_citytree_4",
    fromY: 50,
    start: 1.20,
    end: 0.30
  },

  {
    sel: ".about_eyetower",
    fromY: 50,
    start: 1.10,
    end: 0.30
  }

];


// -------------------------------------------------------------
// PREPARE ELEMENTS
// -------------------------------------------------------------

cityReveals.forEach(function(item) {

  item.el =
    q(item.sel);

  if (!item.el) return;


  gsap.set(
    item.el,
    {
      y:
        item.fromY *
        getRealViewportHeight() /
        100,

      force3D: true
    }
  );

});


// -------------------------------------------------------------
// GET TRUE DOCUMENT TOP
//
// IMPORTANT:
// about_section6 itself is OUTSIDE the problematic
// zoom measurement.
//
// We use its document position as our stable anchor.
// -------------------------------------------------------------

function getAboutSectionDocumentTop() {

  if (!aboutSection) {
    return 0;
  }


  return (
    aboutSection
      .getBoundingClientRect()
      .top +
    window.scrollY
  );

}


// -------------------------------------------------------------
// GET MOUNTAIN POSITION INSIDE CITY
//
// offsetTop is layout geometry and is NOT corrupted by
// Chrome iOS CSS zoom.
//
// Then multiply by current city zoom.
// -------------------------------------------------------------

function getAboutMountainVisualOffset() {

  if (
    !aboutCity ||
    !mountainTrigger
  ) {
    return 0;
  }


  var total = 0;

  var current =
    mountainTrigger;


  while (
    current &&
    current !== aboutCity
  ) {

    total +=
      current.offsetTop || 0;

    current =
      current.offsetParent;

  }


  var scale =
    parseFloat(
      getComputedStyle(
        aboutCity
      ).zoom
    ) || 1;


  return total * scale;

}


// -------------------------------------------------------------
// MANUAL REVEAL UPDATE
//
// Recreates:
//
// start: "top 120%"
// end:   "top 30%"
//
// without ScrollTrigger measuring the zoomed mountain.
// -------------------------------------------------------------

function updateAboutCityReveals() {

  if (
    !aboutSection ||
    !aboutCity ||
    !mountainTrigger
  ) {
    return;
  }


  var viewportHeight =
    getRealViewportHeight();


  var scrollY =
    window.scrollY;


  var mountainDocumentTop =
    getAboutSectionDocumentTop() +
    getAboutMountainVisualOffset();


  cityReveals.forEach(
    function(item) {

      if (!item.el) return;


      // -----------------------------------------------
      // Equivalent ScrollTrigger positions
      // -----------------------------------------------

      var startScroll =
        mountainDocumentTop -
        (
          viewportHeight *
          item.start
        );


      var endScroll =
        mountainDocumentTop -
        (
          viewportHeight *
          item.end
        );


      var distance =
        endScroll -
        startScroll;


      var progress =
        distance !== 0
          ? (
              scrollY -
              startScroll
            ) /
            distance
          : 1;


      // Clamp 0 → 1
      progress =
        Math.max(
          0,
          Math.min(
            1,
            progress
          )
        );


      // Same visual movement as before.
      var startY =
        item.fromY *
        viewportHeight /
        100;


      var currentY =
        startY *
        (
          1 -
          progress
        );


      gsap.set(
        item.el,
        {
          y: currentY,
          force3D: true
        }
      );

    }
  );

}


// -------------------------------------------------------------
// UPDATE FROM REAL SCROLL
// -------------------------------------------------------------

window.addEventListener(
  "scroll",
  updateAboutCityReveals,
  {
    passive: true
  }
);


// Lenis also drives scrolling.
// Hook directly into it as well.
if (
  lenis &&
  lenis.on
) {

  lenis.on(
    "scroll",
    updateAboutCityReveals
  );

}


// -------------------------------------------------------------
// RESIZE / ORIENTATION
// -------------------------------------------------------------

window.addEventListener(
  "resize",
  function() {

    requestAnimationFrame(
      updateAboutCityReveals
    );

  }
);


// -------------------------------------------------------------
// INITIAL POSITION
// -------------------------------------------------------------

requestAnimationFrame(
  updateAboutCityReveals
);

// -------------------------------------------------------------
// ABOUT US — Character / Rocket Reveals
//
// SAFE VERSION FOR IOS CHROME:
//
// Keep .about_trigger as the design trigger,
// but DO NOT let ScrollTrigger measure it directly
// inside the CSS-zoomed city.
//
// Instead calculate its visual position from
// about_section6 + internal offset × city zoom.
// -------------------------------------------------------------

var aboutTrigger =
  q(".about_trigger");

var aboutTriggerProxy = null;


// -------------------------------------------------------------
// CREATE SAFE TRIGGER PROXY
// -------------------------------------------------------------

if (
  aboutTrigger &&
  aboutSection &&
  aboutCity
) {

  aboutTriggerProxy =
    document.createElement("div");


  aboutTriggerProxy.setAttribute(
    "data-about-launch-trigger",
    "true"
  );


  aboutTriggerProxy.style.position =
    "absolute";

  aboutTriggerProxy.style.left =
    "0px";

  aboutTriggerProxy.style.width =
    "1px";

  aboutTriggerProxy.style.height =
    "1px";

  aboutTriggerProxy.style.pointerEvents =
    "none";

  aboutTriggerProxy.style.visibility =
    "hidden";

  aboutTriggerProxy.style.zIndex =
    "-1";


  // Make sure Section 6 can contain the proxy.

  if (
    getComputedStyle(aboutSection)
      .position === "static"
  ) {

    aboutSection.style.position =
      "relative";
  }


  aboutSection.appendChild(
    aboutTriggerProxy
  );


  // -----------------------------------------------------------
  // GET TRIGGER OFFSET INSIDE CITY
  // -----------------------------------------------------------

  function getAboutTriggerOffset() {

    var total = 0;

    var current =
      aboutTrigger;


    while (
      current &&
      current !== aboutCity
    ) {

      total +=
        current.offsetTop || 0;

      current =
        current.offsetParent;
    }


    return total;
  }


  // -----------------------------------------------------------
  // POSITION SAFE PROXY
  // -----------------------------------------------------------

  function positionAboutLaunchTrigger() {

    if (
      !aboutTriggerProxy ||
      !aboutTrigger
    ) {
      return;
    }


    var scale =
      parseFloat(
        getComputedStyle(
          aboutCity
        ).zoom
      ) || 1;


    var visualTop =
      getAboutTriggerOffset() *
      scale;


    aboutTriggerProxy.style.top =
      visualTop + "px";
  }


  positionAboutLaunchTrigger();


  window.addEventListener(
    "resize",
    function () {

      requestAnimationFrame(
        positionAboutLaunchTrigger
      );

    }
  );


  ScrollTrigger.addEventListener(
    "refreshInit",
    positionAboutLaunchTrigger
  );

}


// -------------------------------------------------------------
// CHARACTER / ROCKET REVEALS
// -------------------------------------------------------------

var launchTargets = [

  {
    sel: ".about_cityqueen",
    from: { y: "35vh" }
  },

  {
    sel: ".about_doggod",
    from: { x: 100 }
  },

  {
    sel: ".about_frog",
    from: { y: "15vh" }
  },

  {
    sel: ".about_violincat",
    from: { x: "3vw" }
  },

  {
    sel: ".about_cityrocket",
    from: { y: "30vh" }
  },

  {
    sel: ".about_cityrocket_2",
    from: { y: "20vh" }
  }

];


if (
  aboutTrigger &&
  aboutTriggerProxy
) {

  launchTargets.forEach(
    function(item) {

      var el =
        q(item.sel);

      if (!el) return;


      // Starting position

      gsap.set(
        el,
        Object.assign(
          {
            force3D: true
          },
          item.from
        )
      );


      // Animate back to Webflow position

      gsap.to(
        el,
        {
          x: 0,
          y: 0,

          duration: 1,

          ease:
            "power3.out",

          force3D: true,

          scrollTrigger: {

            // IMPORTANT:
            // safe non-zoomed proxy
            trigger:
              aboutTriggerProxy,

            start:
              "top 80%",

            toggleActions:
              "play none none reverse",

            invalidateOnRefresh:
              true
          }
        }
      );

    }
  );

}
      // -------------------------------------------------------------
      // HIGHLIGHT
      // -------------------------------------------------------------
      gsap.utils.toArray(".black_highlight").forEach(function (el) {
        ScrollTrigger.create({
          trigger: el,
          start: "top 85%",
          end: "bottom 0%",
          onEnter: function () { el.style.setProperty("--highlight-scale", "1"); },
          onLeave: function () { el.style.setProperty("--highlight-scale", "0"); },
          onEnterBack: function () { el.style.setProperty("--highlight-scale", "1"); },
          onLeaveBack: function () { el.style.setProperty("--highlight-scale", "0"); }
        });
      });

      // -------------------------------------------------------------
      // FADE UP
      // -------------------------------------------------------------
      gsap.utils.toArray(".fadeup").forEach(function (el) {
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            force3D: true,
            immediateRender: false,
            scrollTrigger: {
              trigger: el,
              start: "top 80%",
              end: "top 10%",
              toggleActions: "play reverse play reverse"
            }
          }
        );
      });

      // -------------------------------------------------------------
      // JETMAN + DOLPHIN
      // -------------------------------------------------------------
      var jetman = q(".about_jetman");
      var dolphin = q(".about_dolphin");

      if (jetman) {
        var hoverTween;

        function startHover() {
          hoverTween = gsap.to(jetman, {
            y: "-=15",
            duration: 1,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1
          });
        }

        startHover();

        ScrollTrigger.create({
          trigger: jetman,
          start: "top 75%",

          onEnter: function () {
            gsap.killTweensOf(jetman);
            if (hoverTween) hoverTween.kill();
            if (dolphin) gsap.killTweensOf(dolphin);

            gsap.to(jetman, {
              x: "100vw",
              y: () => -100 * Math.tan(45 * Math.PI / 180) + "vw",
              rotation: -50,
              duration: 1.1,
              ease: "power2.in"
            });

            if (dolphin) {
              gsap.to(dolphin, {
                rotation: -20,
                duration: 0.4,
                delay: 0.2,
                ease: "back.out(1.7)"
              });
            }
          },

          onLeaveBack: function () {
            gsap.killTweensOf(jetman);
            if (hoverTween) hoverTween.kill();
            if (dolphin) gsap.killTweensOf(dolphin);

            gsap.set(jetman, { rotation: 180 });

            gsap.to(jetman, {
              x: 0,
              y: 0,
              rotation: 0,
              duration: 1.4,
              ease: "power2.out",
              onComplete: startHover
            });

            if (dolphin) {
              gsap.to(dolphin, {
                rotation: 0,
                duration: 0.8,
                ease: "power2.out"
              });
            }
          }
        });
      }

      // -------------------------------------------------------------
      // JETPLANE
      // -------------------------------------------------------------
      var jet = q(".about_jetplane");

      if (jet) {
        ScrollTrigger.create({
          trigger: ".about_jetplane",
          start: "top 20%",
          end: "bottom 50%",
          scrub: 1,
          invalidateOnRefresh: true,

          onUpdate: function (self) {
            var t = self.progress;
            var x = 145 * vw * t;

            var arc = (isMobile ? 26 : 36) * vh;
            var climbY = -arc * Math.pow(t, 2.2);

            var dipEnd = 0.18;
            var dipAmp = (isMobile ? 6 : 9) * vh;
            var dipY = (t < dipEnd) ? dipAmp * Math.sin(Math.PI * (t / dipEnd)) : 0;

            var y = -5 * vw + dipY + climbY;

            var dClimb = -arc * 2.2 * Math.pow(Math.max(t, 0.0001), 1.2);

            var dDip = (t < dipEnd)
              ? dipAmp * (Math.PI / dipEnd) * Math.cos(Math.PI * (t / dipEnd))
              : 0;

            var dydt = dClimb + dDip;
            var dxdt = 130 * vw;
            var angleDeg = Math.atan2(dydt, dxdt) * (180 / Math.PI);

            if (t < 0.05) angleDeg *= t / 0.05;

            var targetRot = Math.max(-18, Math.min(angleDeg * 0.9, 0));
            var prevRot = parseFloat(jet.dataset.prevRot || "0");
            var smooth = prevRot + (targetRot - prevRot) * 0.15;

            jet.dataset.prevRot = smooth;

            jet.style.transform =
              "translate3d(" + x + "px," + y + "px, 0) rotate(" + smooth + "deg)";
          }
        });
      }

      // -------------------------------------------------------------
      // BIG FLY
      // -------------------------------------------------------------
      var fly = q(".about_bigfly");

      if (fly) {
        ScrollTrigger.create({
          trigger: ".about_bigfly",
          start: "-20% bottom",
          end: "bottom -20%",
          scrub: 0.35,
          invalidateOnRefresh: true,

          onUpdate: function (self) {
            var t = self.progress;
            var x = 20 * vw * t;
            var arc = (isMobile ? 24 : 32) * vh;
            var climbY = -arc * Math.pow(t, 2.1);
            var y = -3 * vw + climbY;

            fly.style.transform =
              "translate3d(" + x + "px," + y + "px, 0) rotate(-10deg)";
          }
        });
      }

      // Galaxy Parallax
      tweenIf(".about_galaxy", {
        y: () => -70 * vh,
        ease: "none",
        force3D: true,
        scrollTrigger: {
          trigger: ".about_viewport_wrapper",
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          invalidateOnRefresh: true
        }
      });

      // -------------------------------------------------------------
      // OFFSCREEN VIDEO AUTO PAUSE
      // -------------------------------------------------------------
      var vids = document.querySelectorAll(".about_onceupon video, video[data-pause-offscreen]");

      if (vids.length) {
        vids.forEach(function (v) {
          v.setAttribute("playsinline", "");
          v.setAttribute("muted", "");
        });

        vids.forEach(function (v) {
          ScrollTrigger.create({
            trigger: v,
            start: "top 120%",
            end: "bottom -20%",
            onEnter: function () { try { v.play && v.play(); } catch (e) {} },
            onEnterBack: function () { try { v.play && v.play(); } catch (e) {} },
            onLeave: function () { try { v.pause && v.pause(); } catch (e) {} },
            onLeaveBack: function () { try { v.pause && v.pause(); } catch (e) {} }
          });
        });
      }


    // -------------------------------------------------------------
    // ABOUT US UFO
    // -------------------------------------------------------------
    bootUFO();
    


    // =============================================================
    // UFO TRAIL ENGINE
    // =============================================================
    function bootUFO() {
        var host = document.querySelector(".about_womanufo");
        if (!host) return;
    
        var velocity = isMobile ? 1 : 3;
        var maxAmpVal = isMobile ? 20 * vh : 80 * vh;
        var tiltDiv = 3;
        var chaseSpeed = isMobile ? 0.08 : 0.15;
    
        function getBaseY() {
          return -5 * vh;
        }
    
        var target = {
          x: 0,
          y: getBaseY(),
          rot: 0
        };
    
        var actual = {
          x: 0,
          y: getBaseY(),
          rot: 0
        };
    
    
/* =====================================================
   WOMAN UFO — HORIZONTAL FLIGHT FIX

   Independent of ScrollTrigger geometry.
   Keeps existing bounce, tilt and trail.
   ===================================================== */

function getUFOTravelDistance() {
  var rect = host.getBoundingClientRect();
  var startLeft = rect.left - actual.x;
  var viewportWidth = document.documentElement.clientWidth;

  return Math.max(
    0,
    viewportWidth - startLeft + rect.width + 30
  );
}

function ensureX() {

  var scrollPos =
    (lenis && typeof lenis.scroll === "number")
      ? lenis.scroll
      : (root.pageYOffset || 0);

  var viewportHeight =
    document.documentElement.clientHeight;

  // Desktop: fly out over first 50% viewport of scrolling.
  // Mobile: fly out over first 25% viewport of scrolling.
  var flightDistance =
    viewportHeight * (isMobile ? 0.25 : 0.5);

  var progress = Math.max(
    0,
    Math.min(
      1,
      scrollPos / Math.max(1, flightDistance)
    )
  );

  target.x = getUFOTravelDistance() * progress;
}

    
        var lastScroll = 0;
        var bouncePhase = 0;
        var idleFrames = 0;
        var idleMax = 30;
    
        function updateBounceTilt() {
          var scrollPos =
            (typeof lenis?.scroll === "number")
              ? lenis.scroll
              : (root.pageYOffset || 0);
    
          var deltaY = scrollPos - lastScroll;
          lastScroll = scrollPos;
    
          ensureX();
    
          var amplitude =
            Math.min(
              Math.abs(deltaY) * velocity,
              maxAmpVal
            );
    
          var horizontal = target.x / vw;
    
          var scale =
            (horizontal <= 30)
              ? 0
              : (horizontal >= 100)
                ? 1
                : (horizontal - 30) / 70;
    
          if (Math.abs(deltaY) < 1) {
            idleFrames++;
    
            if (idleFrames > idleMax) {
              if (gsap) {
                gsap.to(target, {
                  y: getBaseY(),
                  duration: 0.4,
                  ease: "power3.out"
                });
              } else {
                target.y = getBaseY();
              }
            }
          } else {
            idleFrames = 0;
            bouncePhase += 0.1;
    
            target.y =
              getBaseY() +
              Math.sin(bouncePhase) *
              amplitude *
              scale;
          }
    
          target.rot =
            Math.max(
              -20,
              Math.min(
                deltaY / tiltDiv,
                20
              )
            ) * scale;
    
          requestAnimationFrame(updateBounceTilt);
        }
    
        requestAnimationFrame(updateBounceTilt);
    
        var canvas = document.getElementById("akiraMouseTrail");
    
        if (!canvas) {
          canvas = document.createElement("canvas");
          canvas.id = "akiraMouseTrail";
    
          Object.assign(canvas.style, {
            position: "fixed",
            top: 0,
            left: 0,
            pointerEvents: "none",
            zIndex: 10,
            background: "transparent"
          });
    
          (
            document.querySelector(".fixed_screen_area") ||
            document.body
          ).appendChild(canvas);
        }
    
        var ctx = canvas.getContext("2d");
    
        function resizeCanvas() {
          canvas.width = innerWidth;
          canvas.height = innerHeight;
        }
    
        resizeCanvas();
    
        var trail = [];
        var trailMax = 40;
        var fadeTime = 800;
    
        function loop() {
          actual.x += (target.x - actual.x) * chaseSpeed;
          actual.y += (target.y - actual.y) * chaseSpeed;
          actual.rot += (target.rot - actual.rot) * chaseSpeed;
    
          host.style.transform =
            "translate3d(" +
            actual.x +
            "px," +
            actual.y +
            "px,0) rotate(" +
            actual.rot +
            "deg)";
    
          var r = host.getBoundingClientRect();
    
          trail.push({
            x: r.left + r.width / 2,
            y: r.top + r.height / 2,
            t: performance.now()
          });
    
          if (trail.length > trailMax) trail.shift();
    
          ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
          );
    
          var maxW = r.height * 0.4;
    
          for (var i = 0; i < trail.length - 1; i++) {
            var p1 = trail[i];
            var p2 = trail[i + 1];
    
            var dx = p2.x - p1.x;
            var dy = p2.y - p1.y;
    
            if (Math.hypot(dx, dy) < 1) continue;
    
            var alpha =
              1 -
              (performance.now() - p1.t) /
              fadeTime;
    
            if (alpha <= 0) continue;
    
            ctx.strokeStyle =
              "rgba(225,255,0," +
              alpha +
              ")";
    
            ctx.lineWidth =
              10 +
              (maxW - 10) *
              alpha;
    
            ctx.beginPath();
    
            ctx.moveTo(
              p1.x,
              p1.y
            );
    
            ctx.quadraticCurveTo(
              p1.x + dx * 0.5,
              p1.y + dy * 0.5,
              p2.x,
              p2.y
            );
    
            ctx.stroke();
          }
    
          requestAnimationFrame(loop);
        }
    
        requestAnimationFrame(loop);
      }
    







  // -------------------------------------------------------------
  // HOMEPAGE
  // -------------------------------------------------------------
  initHomeSection1();
  initHomeSection2();
  initHomeSection3();
  initHomeSection4();
  initHomeSection5();
  initHomeSection6();
  initHomeSection7();
  initHomeSection8();
  initHomeSection9();
  initHomeResponsiveScale();


  



 
  
  // ============================================================
  // GLOBAL — SELF ROTATE + YELLOW CIRCLE
  //
  // .selfrotate
  //   Original scroll momentum behavior
  //
  // .selfrotate_yellowcircle
  //   Absolute scroll position -> target rotation
  //   Smoothly chases target
  //   Always returns to 0 at page top
  // ============================================================


  // ============================================================
  // SETTINGS
  // ============================================================

  var SELFROTATE_SETTINGS = {

    selfrotate: {
      speed: 2.5,
      friction: 3.5,
      maxSpeed: 360
    },

    selfrotate_yellowcircle: {

      // 10 scroll pixels = 360 degrees
      pixelsPerRotation: 1800,
      mobileSpeedMultiplier: 2, // double rotation speed at mobile widths

      // Higher = faster chasing
      chaseSpeed: 9

    },

    // Slow clockwise idle + scroll momentum in either direction
    selfrotate_yellowcircle2: {
      duration: 24,      // seconds per idle revolution (half the old speed)
      direction: 1,     // clockwise idle; scroll momentum can reverse it
      speed: 2.5,       // scroll impulse, same as .selfrotate
      friction: 3.5,    // how quickly scroll momentum fades
      maxSpeed: 360     // maximum added scroll rotation (degrees/second)
    },

    // Same as yellowcircle2, but HALF the scroll-driven rotation speed.
    selfrotate_yellowcircle3: {
      duration: 24,
      direction: 1,
      speed: 1,       // Half of yellowcircle2's scroll impulse (2.5)
      friction: 3.5,
      maxSpeed: 150      // Half of yellowcircle2's scroll momentum cap (360)
    }

  };


  // ============================================================
  // INITIALIZATION
  // ============================================================

  var normalRotateElements =
    gsap.utils.toArray(".selfrotate");

  var yellowCircleElements =
    gsap.utils.toArray(".selfrotate_yellowcircle");


  // ============================================================
  // ORIGINAL SELFROTATE
  // UNCHANGED MOMENTUM BEHAVIOR
  // ============================================================

  if (normalRotateElements.length) {

    var normalAngle = 0;
    var normalVelocity = 0;

    var normalSettings =
      SELFROTATE_SETTINGS.selfrotate;

    var normalLastScroll =
      typeof lenis.scroll === "number"
        ? lenis.scroll
        : window.scrollY;


    lenis.on("scroll", function(event) {

      var currentScroll =
        typeof event.scroll === "number"
          ? event.scroll
          : window.scrollY;

      var delta =
        currentScroll - normalLastScroll;

      normalLastScroll = currentScroll;

      normalVelocity +=
        delta * normalSettings.speed;

      normalVelocity = Math.max(
        -normalSettings.maxSpeed,
        Math.min(
          normalSettings.maxSpeed,
          normalVelocity
        )
      );

    });


    gsap.ticker.add(function(time, deltaTime) {

      var dt =
        Math.min(deltaTime / 1000, 0.05);

      normalAngle += normalVelocity * dt;

      normalVelocity *= Math.exp(
        -normalSettings.friction * dt
      );

      if (Math.abs(normalVelocity) < 0.01) {
        normalVelocity = 0;
      }

      normalAngle %= 360;

      normalRotateElements.forEach(function(el) {
        if (el.dataset.ttPhysicsActive === "1") return;
        gsap.set(el, { rotation: normalAngle });
      });

    });

  }


  // ============================================================
  // YELLOW CIRCLE
  // ABSOLUTE SCROLL POSITION + SMOOTH CHASE
  // ============================================================

  if (yellowCircleElements.length) {

    var yellowSettings =
      SELFROTATE_SETTINGS.selfrotate_yellowcircle;

    var yellowAngle = 0;

    gsap.set(yellowCircleElements, {
      rotation: 0
    });


    gsap.ticker.add(function(time, deltaTime) {

      var dt =
        Math.min(deltaTime / 1000, 0.05);


      // ========================================================
      // READ ABSOLUTE SCROLL POSITION
      // ========================================================

      var scrollPosition =
        typeof lenis.scroll === "number"
          ? lenis.scroll
          : window.scrollY;

      scrollPosition =
        Math.max(0, scrollPosition);


      // ========================================================
      // CALCULATE TARGET ROTATION
      //
      // 0px  -> 0deg
      // 10px -> 360deg
      // 20px -> 720deg
      // 30px -> 1080deg
      // ========================================================

      var targetAngle =
        scrollPosition /
        (yellowSettings.pixelsPerRotation / (window.matchMedia("(max-width: 767px)").matches ? yellowSettings.mobileSpeedMultiplier : 1)) *
        360;


      // ========================================================
      // SMOOTH CHASE
      //
      // Frame-rate independent exponential smoothing
      // ========================================================

      var smoothing =
        1 - Math.exp(
          -yellowSettings.chaseSpeed * dt
        );

      yellowAngle +=
        (targetAngle - yellowAngle) *
        smoothing;


      // ========================================================
      // EXACT ZERO AT TOP
      //
      // No snapping during normal movement
      // ========================================================

      if (
        scrollPosition <= 0.01 &&
        Math.abs(yellowAngle) < 0.01
      ) {
        yellowAngle = 0;
      }


      // ========================================================
      // APPLY ROTATION
      // ========================================================

      yellowCircleElements.forEach(function(el) {
        if (el.dataset.ttPhysicsActive === "1") return;
        gsap.set(el, { rotation: yellowAngle, force3D: true });
      });

    });

  }



  



      
  // ============================================================
  // SELFROTATE YELLOWCIRCLE 2 — IDLE CLOCKWISE + SCROLL MOMENTUM
  // Single ticker owns rotation: no competing infinite GSAP tween.
  // ============================================================
  (function initMomentumYellowCircle2() {
    var elements = gsap.utils.toArray(".selfrotate_yellowcircle2");
    if (!elements.length) return;

    var settings = SELFROTATE_SETTINGS.selfrotate_yellowcircle2;
    var idleVelocity = (360 / settings.duration) * settings.direction;
    var momentumVelocity = 0;
    var angle = 0;
    var lastScroll = typeof lenis.scroll === "number" ? lenis.scroll : window.scrollY;

    // Same scroll-delta impulse as .selfrotate; upward scrolling
    // gives negative momentum, which can overcome clockwise idle.
    lenis.on("scroll", function(event) {
      var currentScroll = typeof event.scroll === "number"
        ? event.scroll : window.scrollY;
      var delta = currentScroll - lastScroll;
      lastScroll = currentScroll;

      momentumVelocity += delta * settings.speed;
      momentumVelocity = Math.max(-settings.maxSpeed,
        Math.min(settings.maxSpeed, momentumVelocity));
    });

    gsap.ticker.add(function(time, deltaTime) {
      var dt = Math.min(deltaTime / 1000, 0.05);
      angle += (idleVelocity + momentumVelocity) * dt;
      momentumVelocity *= Math.exp(-settings.friction * dt);
      if (Math.abs(momentumVelocity) < 0.01) momentumVelocity = 0;
      angle %= 360;

      elements.forEach(function(el) {
        if (el.dataset.ttPhysicsActive === "1") return;
        gsap.set(el, { rotation: angle, force3D: true });
      });
    });
  })();


  // ============================================================
  // ============================================================
  // SELFROTATE YELLOWCIRCLE 3 — SAME IDLE, HALF SCROLL MOMENTUM
  // ============================================================
  (function initMomentumYellowCircle3() {
    var elements = gsap.utils.toArray(".selfrotate_yellowcircle3");
    if (!elements.length) return;

    var settings = SELFROTATE_SETTINGS.selfrotate_yellowcircle3;
    var idleVelocity = (360 / settings.duration) * settings.direction;
    var momentumVelocity = 0;
    var angle = 0;
    var lastScroll = typeof lenis.scroll === "number" ? lenis.scroll : window.scrollY;

    lenis.on("scroll", function(event) {
      var currentScroll = typeof event.scroll === "number"
        ? event.scroll : window.scrollY;
      var delta = currentScroll - lastScroll;
      lastScroll = currentScroll;

      momentumVelocity += delta * settings.speed;
      momentumVelocity = Math.max(-settings.maxSpeed,
        Math.min(settings.maxSpeed, momentumVelocity));
    });

    gsap.ticker.add(function(time, deltaTime) {
      var dt = Math.min(deltaTime / 1000, 0.05);
      angle += (idleVelocity + momentumVelocity) * dt;
      momentumVelocity *= Math.exp(-settings.friction * dt);
      if (Math.abs(momentumVelocity) < 0.01) momentumVelocity = 0;
      angle %= 360;

      elements.forEach(function(el) {
        if (el.dataset.ttPhysicsActive === "1") return;
        gsap.set(el, { rotation: angle, force3D: true });
      });
    });
  })();


  // ============================================================
  // CIRCLE_TEXT — WEBFLOW COLOR AT HOME; CYCLING HUE WHEN RELEASED
  // Initial/docked: Webflow-selected background, no hue progression.
  // Released: 0.1s transition to #afe7da with random hue rotation;
  //           then 360 degrees per 8 seconds, continuously.
  // Returning: 0.1s transition back to Webflow's original color.
  // ============================================================
  (function initCircleTextScrollHue() {
    var ball = document.querySelector('.circle_text');
    if (!ball) return;

    // Capture the Webflow color BEFORE applying any inline color.
    var webflowColor = getComputedStyle(ball).backgroundColor;
    var released = false;
    var currentHue = 0;
    var lastTime = performance.now();
    var RELEASED_CYCLE_MS = 8000;
    var COLOR_TRANSITION_S = 0.1;
    var colorTween = null;
    var hueTweenTarget = { hue: 0 };

    function hsvColor(hue) {
      // Hue-rotate the exact #afe7da base (RGB 175,231,218), preserving
      // its original saturation and value rather than the Webflow color's.
      var r = 175 / 255, g = 231 / 255, b = 218 / 255;
      var hi = Math.max(r,g,b), lo = Math.min(r,g,b), d = hi-lo;
      var h0 = ((b-r)/d + 2)*60; // #afe7da is green/cyan
      var h = ((h0 + hue) % 360 + 360) % 360;
      var c = d, x = c * (1-Math.abs((h/60)%2-1)), m = lo;
      var rgb = h<60?[c,x,0]:h<120?[x,c,0]:h<180?[0,c,x]:
                h<240?[0,x,c]:h<300?[x,0,c]:[c,0,x];
      return 'rgb(' + rgb.map(function(v){return Math.round((v+m)*255);}).join(',') + ')';
    }

    function stopTween() {
      if (colorTween) { colorTween.kill(); colorTween = null; }
    }

    ball.ttColorStart = function () {
      stopTween();
      released = true;
      currentHue = Math.random() * 360;
      lastTime = performance.now();
      // Tween from the Webflow/docked color to the randomly shifted mint.
      colorTween = gsap.to(ball, {
        backgroundColor: hsvColor(currentHue),
        duration: COLOR_TRANSITION_S,
        ease: 'none',
        overwrite: 'auto',
        onComplete: function () { colorTween = null; }
      });
    };

    ball.ttColorStop = function () {
      released = false;
      stopTween();
      colorTween = gsap.to(ball, {
        backgroundColor: webflowColor,
        duration: COLOR_TRANSITION_S,
        ease: 'none',
        overwrite: 'auto',
        onComplete: function () {
          colorTween = null;
          // Remove the inline override so Webflow remains the color source.
          ball.style.removeProperty('background-color');
        }
      });
    };

    function tick(now) {
      var dt = Math.min(Math.max(now - lastTime, 0), 100);
      lastTime = now;
      if (released) {
        currentHue = (currentHue + dt * 360 / RELEASED_CYCLE_MS) % 360;
        // Do not fight the 0.1s entrance transition.
        if (!colorTween) ball.style.backgroundColor = hsvColor(currentHue);
      }
      requestAnimationFrame(tick);
    }

    // Initially use the untouched Webflow color, with no cycling.
    requestAnimationFrame(tick);
  })();

  // ============================================================
  // CIRCLE_TEXT — DRAG, THROW, SCROLL JUMP, MAGNETIC DOCK
  // Only this image enters physics mode; other rotations remain.
  // ============================================================
  (function initCircleTextPhysics() {
    var el = document.querySelector(".circle_text");
    if (!el || el.dataset.ttBallReady === "1") return;
    var base = document.querySelector('.circle_text_base');
    if (!base || !base.contains(el)) {
      console.warn('[TT] Move .circle_text inside .circle_text_base in Webflow before using this version.');
      return;
    }
    var bounds = el.getBoundingClientRect();
    if (bounds.width < 1 || bounds.height < 1) return;
    el.dataset.ttBallReady = "1";


    var css = document.createElement("style");
    css.textContent = [
      '.tt-ball-wrap{position:absolute;left:0;top:0;width:100%;height:100%;margin:0;padding:0;z-index:10000;touch-action:none;cursor:grab;user-select:none}',
      '.tt-ball-wrap.tt-free{position:fixed!important;left:0!important;top:0!important;width:var(--tt-ball-width)!important;height:var(--tt-ball-height)!important;z-index:2147483000!important;will-change:transform}',
      '.tt-ball-wrap.tt-dragging{cursor:grabbing}',
    
      // Invisible docking target — magnetic snap still works
      '.tt-ball-dock{position:fixed;box-sizing:border-box;border:none;background:transparent;border-radius:50%;pointer-events:none;z-index:9999}',
      '.tt-ball-dock.tt-near{border:none;background:transparent}',
    
      '.tt-ball-wrap>.circle_text{position:absolute!important;top:0!important;left:0!important;right:auto!important;bottom:auto!important;width:100%!important;height:100%!important;max-width:none!important;margin:0!important;object-fit:contain;pointer-events:none}'
    ].join('\n');

    document.head.appendChild(css);

    var wrap = document.createElement('div');
    var dock = document.createElement('div');
    wrap.className = 'tt-ball-wrap';
    dock.className = 'tt-ball-dock';
    // The base owns the docked layout; the wrapper is absolute inside it.
    // Only undock into a fixed-position physics layer when interaction begins.
    var w = bounds.width, h = bounds.height;
    var rightGap = document.documentElement.clientWidth - bounds.right;
    var bottomGap = document.documentElement.clientHeight - bounds.bottom;
    // Webflow controls the docked dimensions. When the ball is detached,
    // preserve the ACTUAL rendered ball dimensions in its temporary wrapper.
    // Never impose a viewport-based sizing formula on the ball.
    function syncWebflowBallSize() {
      var r = el.getBoundingClientRect();
      if (!r.width || !r.height) r = base.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) {
        wrap.style.setProperty('--tt-ball-width', r.width + 'px');
        wrap.style.setProperty('--tt-ball-height', r.height + 'px');
      }
    }
    syncWebflowBallSize();
    base.appendChild(wrap);
    wrap.appendChild(el);
    document.body.appendChild(dock);

    // ============================================================
    // HOLEMAN — RANDOM CHARACTER, BOTTOM-RIGHT POP, 1s HOLD
    // Webflow owns all positioning, sizing and child artwork.
    // Each ball departure randomly chooses an unseen character until all have appeared.
    // ============================================================
    var holeman = document.querySelector('.holeman_wrapper');
    var holemanCharacters = holeman
      ? Array.prototype.filter.call(holeman.children, function(child) {
          return Array.prototype.some.call(child.classList, function(name) {
            return /^holeman\d+$/i.test(name);
          });
        })
      : [];
    // One appearance at a time: pending -> appearing -> holding -> retreating -> idle.
    // A new drag cannot swap artwork until the previous character is fully hidden.
    var holemanArmed = true;
    var holemanState = 'idle';
    var holemanDelayTimer = null;
    var holemanReturnTimer = null;
    // No-repeat random pool: each character is selected once per cycle.
    var holemanRemaining = holemanCharacters.map(function (_, i) { return i; });
    var HOLEMAN_DELAY = 0.1; // Seconds after ball leaves home

    if (holeman) {
      gsap.set(holeman, {
        xPercent: 90,
        yPercent: 115,
        autoAlpha: 0,
        force3D: true
      });
      if (holemanCharacters.length) {
        gsap.set(holemanCharacters, { autoAlpha: 0 });
      }
    }

    function cancelPendingHoleman() {
      if (holemanState !== 'pending') return;
      if (holemanDelayTimer) {
        holemanDelayTimer.kill();
        holemanDelayTimer = null;
      }
      holemanState = 'idle';
    }

    function hideHoleman() {
      if (!holeman || holemanState !== 'holding') return;
      if (holemanReturnTimer) {
        holemanReturnTimer.kill();
        holemanReturnTimer = null;
      }
      holemanState = 'retreating';
      gsap.to(holeman, {
        xPercent: 90,
        yPercent: 115,
        autoAlpha: 0,
        duration: 0.32,
        ease: 'power2.in',
        overwrite: true,
        onComplete: function () {
          holemanState = 'idle';
          // Do not immediately retrigger during an existing drag.
          // The next return-to-dock arms the next appearance.
        }
      });
    }

    function showHoleman() {
      if (!holeman || !holemanArmed || holemanState !== 'idle') return;
      holemanArmed = false;
      holemanState = 'pending';
      holemanDelayTimer = gsap.delayedCall(HOLEMAN_DELAY, function () {
        holemanDelayTimer = null;
        // If the ball returned before the delay, don't show a character.
        if (holemanState !== 'pending' || mode === 'docked' || mode === 'snap' || distance() <= 35) {
          holemanState = 'idle';
          return;
        }
        holemanState = 'appearing';
        // Select only when the appearance starts, never mid-animation.
        if (holemanCharacters.length) {
          // Uniformly draw from characters not yet shown this cycle.
          // Refill only after all characters have appeared once.
          if (!holemanRemaining.length) {
            holemanRemaining = holemanCharacters.map(function (_, i) { return i; });
          }
          var poolIndex = Math.floor(Math.random() * holemanRemaining.length);
          var choice = holemanRemaining.splice(poolIndex, 1)[0];
          gsap.set(holemanCharacters, { autoAlpha: 0 });
          gsap.set(holemanCharacters[choice], { autoAlpha: 1 });
        }
        gsap.to(holeman, {
          xPercent: 0,
          yPercent: 0,
          autoAlpha: 1,
          duration: 0.43,
          ease: 'back.out(1.2)',
          overwrite: true,
          onComplete: function () {
            holemanState = 'holding';
            holemanReturnTimer = gsap.delayedCall(1, hideHoleman);
          }
        });
      });
    }

    var C = { gravity:1550, bounce:.68, wallBounce:.78,
              snapRadius:85, jumpCooldown:.38, scrollThreshold:1.5 };
    var x=bounds.left, y=bounds.top, hx=x, hy=y;
    var vx=0, vy=0, angle=0, spin=0, cooldown=0;
    var mode='docked', pointer=null, lastPoint=null, history=[];
    // Docked lid: irregular micro double-knocks, accelerating during idle.
    // Intervals after preloader: 2, 4, 3.5, 3, 2.5, 2, 1.5, 1 seconds; 1 second repeats.
    // Scrolling cancels the current knock and resets the sequence.
    var lidIntervals = [2, 4, 3.5, 3, 2.5, 2, 1.5, 1];
    var lidIntervalIndex = 0;
    var lidTimer = null, lidScrollTimer = null, lidScrolling = false;
    var lidHovered = false;
    // 10% chance per knock to flash the alternate lid text for 0.15s.
    var holemanLidText1 = document.querySelector('.holeman_lid_text1');
    var holemanLidText2 = document.querySelector('.holeman_lid_text2');
    var holemanTextFlashTimer = null;
    function resetHolemanLidText() {
      if (holemanTextFlashTimer) { holemanTextFlashTimer.kill(); holemanTextFlashTimer = null; }
      if (holemanLidText1) holemanLidText1.style.display = 'block';
      if (holemanLidText2) holemanLidText2.style.display = 'none';
    }
    function maybeFlashHolemanLidText() {
      if (!holemanLidText1 || !holemanLidText2 || Math.random() >= 0.10) return;
      // Restart the 0.15s flash if a second qualifying knock happens during it.
      if (holemanTextFlashTimer) holemanTextFlashTimer.kill();
      holemanLidText1.style.display = 'none';
      holemanLidText2.style.display = 'block';
      holemanTextFlashTimer = gsap.delayedCall(0.15, function() {
        holemanTextFlashTimer = null;
        resetHolemanLidText();
      });
    }
    var lidOpen = null;
    var triangleTimer = null;
    // Use a viewport-level overlay, not an SVG inside the ball wrapper.
    // The Webflow base or its ancestors may clip overflow outside the circle.
    var triangleLayer = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    triangleLayer.setAttribute('aria-hidden', 'true');
    triangleLayer.style.cssText = 'position:fixed;left:0;top:0;width:1px;height:1px;overflow:visible;pointer-events:none;z-index:2147483646;visibility:hidden;';
    document.body.appendChild(triangleLayer);

    function clearKnockTriangles() {
      if (triangleTimer) { triangleTimer.kill(); triangleTimer = null; }
      while (triangleLayer.firstChild) {
        gsap.killTweensOf(triangleLayer.firstChild);
        triangleLayer.removeChild(triangleLayer.firstChild);
      }
      triangleLayer.style.visibility = 'hidden';
    }
    function showKnockTriangles(scale) {
      clearKnockTriangles();
      if (mode !== 'docked' || (lidScrolling && !lidHovered)) return;
      // Measure the real Webflow circle, not a fixed desktop radius. The base
      // can be smaller at mobile breakpoints, and the wrapper may transform.
      var ballRect = el.getBoundingClientRect();
      var baseRect = base.getBoundingClientRect();
      var rect = ballRect.width > 0 && ballRect.height > 0 ? ballRect : baseRect;
      if (!rect.width || !rect.height) return;
      var diameter = Math.min(rect.width, rect.height);
      var radius = diameter * 0.5;
      // Scale the *gap beyond the circle edge*, never the center-to-tip radius.
      // This prevents the earlier 0.7 multiplier from embedding triangles in it.
      var unit = diameter / 300;
      var tipClearance = Math.max(7, Math.min(14, 10 * unit));
      var maxExtraGap = Math.max(15, Math.min(37, 28 * unit));
      var travel = Math.max(3, Math.min(8, 6 * unit));
      var maxSize = 13 * scale * Math.max(0.65, Math.min(1.3, unit));
      var pad = Math.ceil(maxExtraGap + maxSize + travel + 24);
      var vw = rect.width + pad * 2, vh = rect.height + pad * 2;
      triangleLayer.style.left = (rect.left - pad) + 'px';
      triangleLayer.style.top = (rect.top - pad) + 'px';
      triangleLayer.style.width = vw + 'px';
      triangleLayer.style.height = vh + 'px';
      triangleLayer.setAttribute('viewBox', '0 0 ' + vw + ' ' + vh);
      var cx = pad + rect.width / 2, cy = pad + rect.height / 2;
      var count = 3, centers = [], tries = 0;
      var minGap = Math.max(20, Math.min(28, diameter * 0.085));
      while (centers.length < count && tries++ < 240) {
        var a = Math.PI * (1.06 + Math.random() * 0.88);
        var gap = tipClearance + Math.random() * maxExtraGap;
        // p is the triangle's CENTER. Its inward tip must stay outside edge.
        var r = radius + gap + maxSize * 0.5;
        var px = cx + r * Math.cos(a), py = cy + r * Math.sin(a);
        if (centers.every(function(q) { return Math.hypot(px-q[0], py-q[1]) >= minGap; })) centers.push([px,py]);
      }
      while (centers.length < count) {
        var i = centers.length;
        var a = Math.PI * (1.08 + i * 0.84 / Math.max(1,count-1));
        var r = radius + tipClearance + maxSize * 0.5 + Math.random() * maxExtraGap;
        centers.push([cx + r*Math.cos(a), cy + r*Math.sin(a)]);
      }
      // Preserve the original three black triangle positions and geometry.
      // Generate three additional white triangles with the same distribution.
      var whiteCenters = [], whiteTries = 0;
      while (whiteCenters.length < count && whiteTries++ < 240) {
        var wa = Math.PI * (1.06 + Math.random() * 0.88);
        var wgap = tipClearance + Math.random() * maxExtraGap;
        var wr = radius + wgap + maxSize * 0.5;
        var wx = cx + wr * Math.cos(wa), wy = cy + wr * Math.sin(wa);
        if (whiteCenters.every(function(q) { return Math.hypot(wx-q[0], wy-q[1]) >= minGap; })) whiteCenters.push([wx,wy]);
      }
      while (whiteCenters.length < count) {
        var wi = whiteCenters.length;
        var wa2 = Math.PI * (1.08 + wi * 0.84 / Math.max(1,count-1));
        var wr2 = radius + tipClearance + maxSize * 0.5 + Math.random() * maxExtraGap;
        whiteCenters.push([cx + wr2*Math.cos(wa2), cy + wr2*Math.sin(wa2)]);
      }
      function drawTriangleSet(points, color) {
        points.forEach(function(p) {
          var dist = Math.hypot(cx-p[0], cy-p[1]);
          var ux = (cx-p[0]) / dist, uy = (cy-p[1]) / dist;
          var px = -uy, py = ux;
          var halfLength = 6.4 * scale * Math.max(0.65, Math.min(1.3, unit));
          var halfWidth = 2.08 * scale * Math.max(0.65, Math.min(1.3, unit));
          var tipX = p[0] + ux * halfLength, tipY = p[1] + uy * halfLength;
          var backX = p[0] - ux * halfLength, backY = p[1] - uy * halfLength;
          var triangle = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
          triangle.setAttribute('points',
            tipX+','+tipY+' '+(backX+px*halfWidth)+','+(backY+py*halfWidth)+' '+
            (backX-px*halfWidth)+','+(backY-py*halfWidth));
          triangle.setAttribute('fill', color);
          triangleLayer.appendChild(triangle);
          var move = travel * (0.7 + Math.random() * 0.6);
          gsap.fromTo(triangle, {x:0,y:0}, {x:-ux*move,y:-uy*move,duration:lidHovered ? 0.12 : 0.2,ease:'power2.out'});
        });
      }
      drawTriangleSet(centers, '#2c2c2c');
      drawTriangleSet(whiteCenters, '#ffffff');
      triangleLayer.style.visibility = 'visible';
      triangleTimer = gsap.delayedCall(lidHovered ? 0.14 : 0.2, clearKnockTriangles);
    }
    function stopLid() {
      if (lidTimer) { lidTimer.kill(); lidTimer = null; }
      if (lidOpen) { lidOpen.kill(); lidOpen = null; }
      clearKnockTriangles();
      resetHolemanLidText();
      gsap.set(wrap, {x:0,y:0,rotation:0});
    }
    function runDoubleKnock() {
      if (mode !== 'docked' || (lidScrolling && !lidHovered)) return;
      // Each vibration has a 10% chance of briefly swapping the two lid texts.
      maybeFlashHolemanLidText();
      // Hover jumps immediately to the strongest stage.
      if (lidOpen) { lidOpen.kill(); lidOpen = null; }
      var progress = lidHovered ? 1 : Math.min(1, Math.max(0, (lidIntervalIndex - 1) / 7));
      var power = 1 + 0.35 * progress;
      var strength = (0.65 + Math.random() * 0.95) * power;
      var strength2 = (0.65 + Math.random() * 0.95) * power;
      // Triangle size grows from 70% to 110% over the eight knock stages.
      var triangleScale = lidHovered ? 1.1 : Math.min(1.1, 0.7 + Math.max(0, lidIntervalIndex - 1) * (0.4 / 7));
      // A complete two-direction hover knock fits inside the 0.18s repeat.
      // Normal idle knocks keep their original, slower timings.
      var knockOut1 = lidHovered ? 0.025 : 0.045;
      var knockBack1 = lidHovered ? 0.045 : 0.085;
      var knockOut2 = lidHovered ? 0.025 : 0.05;
      var knockBack2 = lidHovered ? 0.045 : 0.10;
      lidOpen = gsap.timeline({onComplete:function() {
        lidOpen = null;
        if (mode === 'docked' && !lidScrolling && !lidHovered) scheduleNextLid();
      }});
      lidOpen.call(function(){ showKnockTriangles(triangleScale); })
        .to(wrap,{x:-1.7*strength,y:-2.6*strength,rotation:-1.15*strength,duration:knockOut1,ease:'power3.in'})
        .to(wrap,{x:0,y:0,rotation:0,duration:knockBack1,ease:'power2.out'})
        .call(function(){ showKnockTriangles(triangleScale); })
        .to(wrap,{x:1.3*strength2,y:-2.2*strength2,rotation:0.9*strength2,duration:knockOut2,ease:'power3.in'})
        .to(wrap,{x:0,y:0,rotation:0,duration:knockBack2,ease:'power2.out'});
      // Hover cadence is measured from knock START, not completion.
      // Hover knock finishes in 0.14s, before the next knock starts at 0.18s.
      if (lidHovered) scheduleLid(0.18);
    }
    function scheduleLid(delay) {
      if (lidTimer) { lidTimer.kill(); lidTimer = null; }
      if (mode !== 'docked' || (lidScrolling && !lidHovered)) return;
      lidTimer = gsap.delayedCall(delay,function(){
        lidTimer = null;
        runDoubleKnock();
      });
    }
    function scheduleNextLid() {
      var delay = lidHovered ? 0.18 : lidIntervals[Math.min(lidIntervalIndex,lidIntervals.length-1)];
      if (!lidHovered && lidIntervalIndex < lidIntervals.length-1) lidIntervalIndex++;
      scheduleLid(delay);
    }
    function onLidScroll() {
      lidScrolling = true;
      lidIntervalIndex = 0;
      // Scroll resets idle knocks, but must never interrupt hover knocks.
      if (mode === 'docked' && !lidHovered) stopLid();
      if (lidScrollTimer) lidScrollTimer.kill();
      lidScrollTimer = gsap.delayedCall(0.3,function(){
        lidScrolling = false;
        if (mode === 'docked' && !lidHovered) scheduleNextLid();
      });
    }
    // Mouse hover is attached to the interactive wrapper because .circle_text has pointer-events:none.
    // Maximum knock strength / triangle size at 0.18s intervals.
    // Leaving restores the original idle progression from its first stage.
    wrap.addEventListener('mouseenter', function() {
      lidHovered = true;
      if (mode !== 'docked' || (lidScrolling && !lidHovered)) return;
      stopLid();
      runDoubleKnock();
    });
    wrap.addEventListener('mouseleave', function() {
      if (!lidHovered) return;
      lidHovered = false;
      if (mode !== 'docked') return;
      stopLid();
      lidIntervalIndex = 0;
      if (!lidScrolling) scheduleNextLid();
    });
    window.addEventListener('scroll',onLidScroll,{passive:true});
    if (lenis && typeof lenis.on === 'function') lenis.on('scroll',onLidScroll);
    // Start the very first 2-second countdown only after the preloader ends.
    // Match the existing moon-intro convention: html.tt-loading indicates loading.
    function waitForLidPreloader() {
      if (document.documentElement.classList.contains('tt-loading')) {
        requestAnimationFrame(waitForLidPreloader);
        return;
      }
      scheduleNextLid();
    }
    waitForLidPreloader();

    var sx=0, sy=0, sa=0, moved=false;
    var lastScroll=typeof lenis.scroll==='number'?lenis.scroll:window.scrollY;
    var lastJumpAt=0;
    function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
    // Keep ALL ball positions (pointer, home, render and collision) in the
    // same CSS fixed-position coordinate system. visualViewport.offsetTop
    // is NOT an additional offset to apply to the ball on iOS Chrome.
    function minX(){return 0;}
    function minY(){return 0;}
    function maxX(){return Math.max(0,document.documentElement.clientWidth-w);}
    function maxY(){
      // Browser chrome changes the usable height without necessarily changing
      // the layout viewport. Only use the visible HEIGHT for the floor, not
      // visualViewport.offsetTop (which caused the vertical drag/snap shift).
      var vv=window.visualViewport;
      // visualViewport.height alone is not a bottom coordinate when the
      // visible viewport has a nonzero offset. Both values are in viewport
      // CSS pixels; no page scroll value is added.
      var visibleBottom=(isMobile && vv) ? vv.offsetTop+vv.height : document.documentElement.clientHeight;
      return Math.max(0,visibleBottom-h);
    }
    function distance(){return Math.hypot(x-hx,y-hy);}
    // iOS Chrome can shift the CSS origin of position:fixed elements when
    // scrolling, even though pointer.clientY and getBoundingClientRect()
    // remain in viewport coordinates. Measure the actual fixed origin using
    // a zero-sized sibling in the SAME positioning context as the free ball.
    // Never infer it from scrollY, pageY or visualViewport.offsetTop.
    var fixedOriginProbe = document.createElement('div');
    fixedOriginProbe.setAttribute('aria-hidden', 'true');
    fixedOriginProbe.style.cssText = 'position:fixed!important;left:0!important;top:0!important;width:0!important;height:0!important;padding:0!important;margin:0!important;border:0!important;pointer-events:none!important;visibility:hidden!important;transform:none!important;';
    document.body.appendChild(fixedOriginProbe);
    function fixedOrigin(){
      var r=fixedOriginProbe.getBoundingClientRect();
      return {x:r.left,y:r.top};
    }
    function render(){
      if(mode==='docked') return; // CSS alone positions the docked ball.
      // x/y are viewport coordinates. Convert to the actual CSS fixed origin
      // at render time, so mobile browser chrome and scroll never add an offset.
      var origin=fixedOrigin();
      gsap.set(wrap,{x:x-origin.x,y:y-origin.y,rotation:angle,force3D:true});
    }
    function home(){
      // The base is the single source of truth. No viewport-height clamping.
      var br=base.getBoundingClientRect();
      hx=br.left+(br.width-w)/2;
      hy=br.top+(br.height-h)/2;
      dock.style.width=w+'px';dock.style.height=h+'px';
      dock.style.left=hx+'px';dock.style.top=hy+'px';
    }
    function undock(){
      if(wrap.classList.contains('tt-free')) return;
      // Snapshot while still inside Webflow's CSS layout. This prevents
      // 100% from suddenly referring to the body after reparenting.
      var r=el.getBoundingClientRect();
      var wrapperRect=wrap.getBoundingClientRect();
      w=r.width || wrapperRect.width;
      h=r.height || wrapperRect.height;
      x=wrapperRect.left;y=wrapperRect.top;
      wrap.style.setProperty('--tt-ball-width',w+'px');
      wrap.style.setProperty('--tt-ball-height',h+'px');
      document.body.appendChild(wrap);
      wrap.classList.add('tt-free');
      gsap.set(wrap,{clearProps:'transform'});
      home();
      render();
    }
    function redock(){
      // Rejoin the CSS layout; never chase a mobile viewport shift.
      wrap.classList.remove('tt-free','tt-dragging');
      wrap.style.removeProperty('--tt-ball-width');wrap.style.removeProperty('--tt-ball-height');
      wrap.style.removeProperty('width');wrap.style.removeProperty('height');
      gsap.set(wrap,{clearProps:'transform'});
      base.appendChild(wrap);
      mode='docked';angle=0;vx=vy=spin=0;
      stopLid();
      lidIntervalIndex=0;
      scheduleNextLid();
      w=wrap.offsetWidth;h=wrap.offsetHeight;
      home();x=hx;y=hy;
    }
    function layout(){
      if(mode==='docked'){
        w=wrap.offsetWidth;h=wrap.offsetHeight;
        home();x=hx;y=hy;
      }else{
        // Webflow remains the size source on resize, even while detached.
        // Read the base's live CSS dimensions, preserving the ball center.
        var newRect=base.getBoundingClientRect();
        if(newRect.width>0 && newRect.height>0 &&
           (Math.abs(newRect.width-w)>0.5 || Math.abs(newRect.height-h)>0.5)){
          x+=(w-newRect.width)/2;y+=(h-newRect.height)/2;
          w=newRect.width;h=newRect.height;
          wrap.style.setProperty('--tt-ball-width',w+'px');
          wrap.style.setProperty('--tt-ball-height',h+'px');
        }
        home();
        x=clamp(x,minX(),maxX());y=clamp(y,minY(),maxY());
        render();
      }
    }
    function startPhysics(){
      el.dataset.ttPhysicsActive='1';
      gsap.set(el,{rotation:0});
    }
    function dockPhysics(){
      el.dataset.ttPhysicsActive='0';
      // On the next core ticker, original scroll rotation resumes.
      gsap.set(el,{rotation:0});
    }
    function snap(){
      if (typeof el.ttColorStop === 'function') el.ttColorStop();
      mode='snap';vx=vy=spin=sx=sy=sa=0;
      cancelPendingHoleman();
      holemanArmed=true; // Next departure can trigger only after current Holeman finishes.
      dock.classList.add('tt-near');
    }
    function point(e){return {x:e.clientX,y:e.clientY,t:performance.now()};}
    wrap.addEventListener('pointerdown',function(e){
      if(e.pointerType==='mouse'&&e.button!==0)return;
      e.preventDefault();
      pointer=e.pointerId;
      // Transfer the currently visible rotation to the physics wrapper.
      if(mode==='docked'){
        stopLid();
        gsap.set(wrap,{x:0,y:0});
        angle=Number(gsap.getProperty(el,'rotation'))||0;
        undock();
      }
      // Reparenting can cancel pointer capture on Safari. Capture only AFTER undocking.
      startPhysics();mode='drag';moved=false;
      try { wrap.setPointerCapture(pointer); } catch(err) {}
      vx=vy=spin=0;lastPoint=point(e);history=[lastPoint];
      wrap.classList.add('tt-dragging');dock.classList.remove('tt-near');
      render();
    });
    function moveBallPointer(e){
      if(mode!=='drag'||pointer!==e.pointerId)return;
      var p=point(e), dx=p.x-lastPoint.x, dy=p.y-lastPoint.y;
      if(Math.abs(dx)+Math.abs(dy)>1)moved=true;
      x=clamp(x+dx,minX(),maxX());y=clamp(y+dy,minY(),maxY());
      if(distance()>35) showHoleman();
      lastPoint=p;history.push(p);
      history=history.filter(function(v){return p.t-v.t<110;});
      dock.classList.toggle('tt-near',distance()<C.snapRadius);
      render();
    }
    // Window listeners are essential when a fast swipe leaves the ball,
    // or mobile Safari drops capture during DOM reparenting.
    window.addEventListener('pointermove',moveBallPointer,{passive:false});
    function release(e){
      if(mode!=='drag'||pointer!==e.pointerId)return;
      pointer=null;wrap.classList.remove('tt-dragging');
      if(!moved){
        // A tap on the docked CTA is not a throw.
        if(distance()<C.snapRadius){snap();return;}
      }
      if(distance()<C.snapRadius){snap();return;}
      mode='physics';
      if (typeof el.ttColorStart === 'function') el.ttColorStart();
      var a=history[0],b=history[history.length-1];
      if(a&&b&&b.t-a.t>8&&performance.now()-b.t<110){
        var dt=(b.t-a.t)/1000;
        vx=clamp((b.x-a.x)/dt,-1800,1800);
        vy=clamp((b.y-a.y)/dt,-1800,1800);
        spin=vx*.23;
      }
    }
    window.addEventListener('pointerup',release);
    window.addEventListener('pointercancel',release);
    wrap.addEventListener('lostpointercapture',function(){
      // Do not abandon a live drag merely because Safari loses capture.
      // Window-level pointermove/up continue to handle the gesture.
    });
    window.addEventListener('blur',function(){
      if(mode==='drag'){pointer=null;mode='physics';wrap.classList.remove('tt-dragging');if(typeof el.ttColorStart==='function')el.ttColorStart();}
    });
    function jump(power){
      if(mode!=='physics'||cooldown>0||y<maxY()-8)return;
      var dir=Math.random()<.5?-1:1;
      vy=-Math.min(1100,400+400*power);
      spin=dir*(90+Math.random()*180);
      vx+=dir*(25+Math.random()*55);
      cooldown=C.jumpCooldown;
    }
    function onScroll(value){
      var delta=value-lastScroll;lastScroll=value;
      if(Math.abs(delta)<C.scrollThreshold||mode!=='physics')return;
      var now=performance.now();
      if(now-lastJumpAt<100)return;
      jump(Math.min(1.7,Math.abs(delta)/16));
      lastJumpAt=now;
    }
    // Lenis is already initialized in startCore; do not attach duplicate native scroll input.
    if(lenis&&typeof lenis.on==='function'){
      lenis.on('scroll',function(e){onScroll(typeof e.scroll==='number'?e.scroll:window.scrollY);});
    }else{
      window.addEventListener('scroll',function(){onScroll(window.scrollY);},{passive:true});
    }
    gsap.ticker.add(function(time,deltaMs){
      var dt=Math.min(deltaMs/1000,.032);
      cooldown=Math.max(0,cooldown-dt);
      if(mode==='snap'||mode==='physics') home();
      if(mode==='snap'){
        var k=205,decay=Math.exp(-19*dt);
        sx=(sx+(hx-x)*k*dt)*decay;
        sy=(sy+(hy-y)*k*dt)*decay;
        x+=sx*dt;y+=sy*dt;
        var targetAngle=Math.round(angle/360)*360;
        sa=(sa+(targetAngle-angle)*k*dt)*decay;
        angle+=sa*dt;
        if(distance()<.4&&Math.hypot(sx,sy)<2&&Math.abs(angle-targetAngle)<.5){
          x=hx;y=hy;angle=0;cancelPendingHoleman();holemanArmed=true;dockPhysics();dock.classList.remove('tt-near');
          redock();
        }
        render();

}else if(mode==='physics'){

  var steps=Math.max(1,Math.ceil(dt/.008));
  var hdt=dt/steps;

  // ==================================================
  // BLACK HOLE MAGNETIC DOCK
  // ==================================================

  // Adjustable settings (pixels)
  var attractionRadius=165;
  var captureRadius=48;
  var magneticForce=2600;

  for(var i=0;i<steps;i++){

    // Distance to original home position
    var dx=hx-x;
    var dy=hy-y;
    var dist=Math.hypot(dx,dy);

    // Automatically capture the ball near home
    if(dist<captureRadius){
      snap();
      break;
    }

    // Gently pull a flying ball towards home
    if(dist<attractionRadius && dist>0.001){

      var strength=1-dist/attractionRadius;

      var acceleration=
        magneticForce*strength*strength;

      vx+=(dx/dist)*acceleration*hdt;
      vy+=(dy/dist)*acceleration*hdt;
    }

    // Existing gravity and movement
    vy+=C.gravity*hdt;
    x+=vx*hdt;
    y+=vy*hdt;
    angle+=spin*hdt;

    // Existing wall collisions
    if(x<minX()){
      x=minX();
      vx=Math.abs(vx)*C.wallBounce;
    }

    if(x>maxX()){
      x=maxX();
      vx=-Math.abs(vx)*C.wallBounce;
    }

    if(y<minY()){
      y=minY();
      vy=Math.abs(vy)*.72;
    }

    // Existing floor bounce
    if(y>maxY()){
      y=maxY();
      vy=-Math.abs(vy)*C.bounce;
      vx*=.91;
      spin*=.85;

      if(Math.abs(vy)<60)vy=0;
    }

    // Existing friction
    vx*=Math.exp(-.4*hdt);
    spin*=Math.exp(-.7*hdt);

    if(y>=maxY()-.1 && vy===0){
      vx*=Math.exp(-4*hdt);
      spin*=Math.exp(-4*hdt);
    }
  }

  // Only render physics while still in physics mode.
  // The existing snap branch handles the return.
  if(mode==='physics'){
    if(distance()>35) showHoleman();
    render();
  }
}

    });
    window.addEventListener('resize',layout,{passive:true});
    if(window.visualViewport){
      // Update only the physical floor on toolbar changes. Never move a
      // finger-held ball or apply viewport offsets to its dock target.
      var syncVisualViewport=function(){
        if(mode==='physics'){
          x=clamp(x,minX(),maxX());
          if(y>maxY()){
            y=maxY();
            if(vy>0) vy=0;
          }
          home();render();
        }else if(mode==='snap'){
          home();
        }
      };
      window.visualViewport.addEventListener('resize',syncVisualViewport,{passive:true});
      window.visualViewport.addEventListener('scroll',syncVisualViewport,{passive:true});
    }
    layout();
    console.log('[TT] circle_text physics ready');
  })();

  // ============================================================
  // REUSABLE — ROTATE FLOAT
  // Add .rotate_float to any element
  // ============================================================
  
  gsap.utils.toArray(".rotate_float").forEach(function(el) {
  
    // Find the object's home/about section
    var section = el.parentElement;
  
    while (section) {
  
      var isSection = Array.from(section.classList).some(
        function(className) {
          return /^(home|about)_section\d+$/.test(className);
        }
      );
  
      if (isSection) break;
  
      section = section.parentElement;
    }
  
    if (!section) return;
  
    gsap.to(el, {
  
      xPercent: 300,
      yPercent: -200,
      rotation: 900,
  
      ease: "none",
      force3D: true,
  
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        scrub: 1.5,
        invalidateOnRefresh: true
      }
  
    });
  
  });


  







  // =============================================================
  // HOMEPAGE SECTION 1
  // MASTER-SPACE VERSION
  // =============================================================
  function initHomeSection1() {
  
    var section = q(".home_section1");
    var moon = q(".home1_moon");
    var realMoon = q(".home1_realmoon");
    var realMoon2 = q(".home1_realmoon2");
    var cloud = q(".home1_cloud");
    var pyramid = q(".home1_pyramid");
    var text = q(".home_kv");
    var goose = q(".home1_goose");
    var galaxy = q(".home1_galaxy");
  
    if (!section || !gsap || !ScrollTrigger) return;
  
  
    // ==========================================================
    // MASTER DESIGN VALUES
    //
    // Original working viewport:
    // width  ≈ 2195
    // height ≈ 1100
    //
    // Therefore:
    // 1vw ≈ 21.95px
    // 1vh ≈ 11px
    // ==========================================================
  
    var MASTER_VW = 21.95;
    var MASTER_VH = 11;

    
  
  
    // // ==========================================================
    // // LAYER ORDER
    // // ==========================================================
  
    // if (galaxy) gsap.set(galaxy, { zIndex: 1 });
    // if (realMoon) gsap.set(realMoon, { zIndex: 2 });
    // if (pyramid) gsap.set(pyramid, { zIndex: 3 });
    // if (text) gsap.set(text, { zIndex: 5 });
    // if (moon) gsap.set(moon, { zIndex: 7 });
    // if (cloud) gsap.set(cloud, { zIndex: 10 });
  
  
    // ==========================================================
    // INTRO — MOON BOUNCE
    // Starts AFTER preloader
    // Repeats every 4 seconds
    // ==========================================================
    
    function playMoonIntro() {

      if (!moon) {
        document.dispatchEvent(new CustomEvent("tt:moon-intro-complete"));
        return;
      }

      gsap.killTweensOf(moon);
    
      gsap.set(moon, {
        y: 0,
        force3D: true
      });
    
      gsap.timeline({
        repeat: -1,
        repeatDelay: 2.95
      })
    
      .to(moon, {
        y: -8 * MASTER_VH,
        duration: 0.45,
        ease: "power2.out"
      })
    
      .to(moon, {
        y: 0,
        duration: 0.9,
        ease: "bounce.out",
        onComplete: function () {
          if (!window.ttMoonFirstBounceDone) {
            window.ttMoonFirstBounceDone = true;
            document.dispatchEvent(new CustomEvent("tt:moon-intro-complete"));
          }
        }
      });
    }
    
    
    function waitForPreloader() {
    
      if (
        document.documentElement.classList.contains("tt-loading")
      ) {
        requestAnimationFrame(waitForPreloader);
        return;
      }
    
      // Give the freshly revealed page half a second to settle.
      window.setTimeout(playMoonIntro, 500);
    }

    waitForPreloader();
  
  
    // ==========================================================
    // CLOUD
    // ==========================================================
  
    if (cloud) {
  
      gsap.to(cloud, {
  
        y: -30 * MASTER_VH,
  
        ease: "none",
  
        force3D: true,
  
        scrollTrigger: {
  
          trigger: section,
  
          start: "top top",
  
          end: "bottom top",
  
          scrub: 1,
  
          invalidateOnRefresh: true
  
        }
  
      });
  
    }
  
  
 // ==========================================================
// PYRAMID — SLOW PARALLAX
// ==========================================================

if (pyramid) {

  // SETTINGS
  // 1.0 = normal scroll speed
  // 0.7 = slightly slower
  // 0.5 = half scroll speed
  // 0.3 = very slow

  var PYRAMID_SPEED = 0.5;

  gsap.to(pyramid, {

    y: function () {
      return section.offsetHeight * (1 - PYRAMID_SPEED);
    },

    ease: "none",
    force3D: true,

    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: "bottom top",
      scrub: 1,
      invalidateOnRefresh: true
    }

  });

}
  
  

    // ==========================================================
    // REAL MOON — SLOW PARALLAX
    // ==========================================================

    if (realMoon) {

      // SETTINGS
      // 0.5 = moves upward at approximately half scroll speed
      // 0.3 = moves upward slower
      // 0.7 = moves upward faster
      var REAL_MOON_SPEED = 0.5;

      gsap.to(realMoon, {

        y: function () {
          return section.offsetHeight * (1 - REAL_MOON_SPEED);
        },

        ease: "none",
        force3D: true,

        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true
        }

      });

    }

    if (realMoon2) {

      // SETTINGS
      // 0.5 = moves upward at approximately half scroll speed
      // 0.3 = moves upward slower
      // 0.7 = moves upward faster
      var REAL_MOON2_SPEED = 0.45;

      gsap.to(realMoon2, {

        y: function () {
          return section.offsetHeight * (1 - REAL_MOON2_SPEED);
        },

        ease: "none",
        force3D: true,

        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true
        }

      });

    }

  
  
// ==========================================================
// GOOSE
//
// GOAL:
// - Home1 opening composition = full 100vw × 100vh
// - Goose stays at its designed starting position on load
// - Goose starts flying shortly AFTER scrolling begins
// - Do NOT wait until 102vh anymore
// - Portrait gets a little more flight distance
// ==========================================================

if (goose) {

  // --------------------------------------------------------
  // Make sure resize / ScrollTrigger refresh never leaves
  // an old transform on the goose.
  // --------------------------------------------------------

  gsap.set(goose, {
    x: 0,
    y: 0,
    rotation: 0,
    force3D: true
  });


  gsap.to(goose, {

    // Original master-space flight path
    x: -145 * MASTER_VW,
    y: -85 * MASTER_VH,

    rotation: -12,

    ease: "none",
    force3D: true,


    scrollTrigger: {

      trigger: section,


      // ====================================================
      // START
      //
      // OLD:
      // waited until 1.02 × viewport height
      //
      // NEW:
      // start after only 12% viewport scroll.
      //
      // This means:
      // - initial Home1 is still the hero
      // - goose doesn't immediately jump away
      // - but we actually get to WATCH it fly
      // ====================================================

      start: function () {

        return "top+=" +
          (window.innerHeight * 0.12) +
          " top";

      },


      // ====================================================
      // END
      //
      // Use almost all of Home1's available scroll distance.
      //
      // Landscape Home1 total = 1.50vh
      // Portrait Home1 total  = 1.80vh
      //
      // So the goose now has a proper visible flight window.
      // ====================================================

      end: function () {

        var isPortraitTablet =
          window.innerHeight > window.innerWidth &&
          window.innerWidth <= 1100;


        return "top+=" +
          (
            window.innerHeight *
            (isPortraitTablet ? 1.68 : 1.38)
          ) +
          " top";

      },


      scrub: 1,

      invalidateOnRefresh: true

    }

  });

}
}


  

// =============================================================
// HOMEPAGE SECTION 2
// MASTER-SPACE PARALLAX
// =============================================================
function initHomeSection2() {

  var section =
    q(".home_section2");

  if (
    !section ||
    !gsap ||
    !ScrollTrigger
  ) {
    return;
  }





  
  // ==========================================================
  // HOME 2 — WALKER GENTLE FLOAT
  // ==========================================================

  var home2Walker = q(".home2_walker");

  if (home2Walker) {

    // SETTINGS
    var WALKER_FLOAT_AMPLITUDE = 6;  // Pixels (Emperor = 12)
    var WALKER_FLOAT_DURATION = 2.0; // Seconds per half-cycle

    gsap.to(home2Walker, {
      y: WALKER_FLOAT_AMPLITUDE,
      duration: WALKER_FLOAT_DURATION,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      force3D: true
    });

  }


  
  
  // ==========================================================
  // HOME 2 — SCROLL ROTATION
  // ==========================================================


  if (q(".home2_dinosaur")) {
    gsap.fromTo(".home2_dinosaur",
      {
        rotation: -20
      },
      {
        rotation: 20,
        ease: "none",
        force3D: true,
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true
        }
      }
    );
  }


  if (q(".home2_spark")) {
    gsap.fromTo(".home2_spark",
      {
        rotation: 40
      },
      {
        rotation: -40,
        ease: "none",
        force3D: true,
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true
        }
      }
    );
  }



  



  // ==========================================================
  // ORIGINAL DESIGN HEIGHT
  //
  // 1vh at original viewport ≈ 11px
  // ==========================================================

  var MASTER_VH = 11;

  
  // ==========================================================
  // HOME 2 — CLOUD UPWARD PARALLAX
  // Match HOME 1 cloud movement speed
  // ==========================================================

  var home2Cloud = q(".home2_cloud");
  var home1Section = q(".home_section1");

  if (home2Cloud) {

    gsap.fromTo(home2Cloud,
      {
        y: 0
      },
      {
        y: -40 * MASTER_VH,

        ease: "none",
        force3D: true,
        immediateRender: false,

        scrollTrigger: {
          trigger: section,

start: function () {
  return isMobile
    ? "top bottom+=" + Math.round(window.innerHeight * 0.2)
    : "top bottom+=" + Math.round(window.innerHeight * 0.1) ;
},

          // Same scroll distance as Home 1 = same speed
          end: function () {
            return "+=" + (
              home1Section
                ? home1Section.offsetHeight
                : section.offsetHeight
            );
          },

          scrub: true,
          invalidateOnRefresh: true
        }
      }
    );

  }


  
  
 

// ==========================================================
// HOME 2 — FLOAT CLOUDS + FLOAT MOUNTAIN CLOUDS: INDEPENDENT PARALLAX
// ==========================================================

// Cloud travel distances increased by 1.3x (master-space travel units)
var HOME2_FLOATCLOUD1_SPEED = -24;
var HOME2_FLOATCLOUD2_SPEED = -50;

// Mountain clouds automatically travel HALF as far as their matching cloud.
// Each element starts when its own top reaches the viewport bottom.
[
  { sel: ".home2_floatcloud1",       speed: HOME2_FLOATCLOUD1_SPEED },
  { sel: ".home2_floatcloud2",       speed: HOME2_FLOATCLOUD2_SPEED },
  { sel: ".home2_floatmount1_cloud", speed: HOME2_FLOATCLOUD1_SPEED * 0.5, driftX: -2 },
  { sel: ".floatmount_cloud",        speed: HOME2_FLOATCLOUD2_SPEED * 0.2, driftX: 3 }
].forEach(function(item) {
  gsap.utils.toArray(item.sel).forEach(function(cloud) {
    gsap.fromTo(cloud,
      { y: 0, x: 0 },
      {
        y: function() { return item.speed * MASTER_VH; },
        x: function() { return (item.driftX || 0) * getRealViewportWidth() / 100; },
        ease: "none",
        force3D: true,
        immediateRender: false,
        scrollTrigger: {
          trigger: cloud,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true
        }
      }
    );
  });
});

// ==========================================================
// HOME 2 — FLOAT MOUNTAIN BEAR HEAD: SCROLL ROTATION
// ==========================================================
// Rotates from -26 to +26 degrees while travelling through the viewport.
// Set transform-origin in Webflow to control its pivot point.
gsap.utils.toArray(".floatmount_bear_head").forEach(function(bearHead) {
  gsap.fromTo(bearHead,
    { rotation: 26 },
    {
      rotation: -24,
      ease: "power1.out",
      force3D: true,
      scrollTrigger: {
        trigger: bearHead,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        invalidateOnRefresh: true
      }
    }
  );
});


// ==========================================================
// HOME 2 — FLOAT MOUNTAIN BEAR GROUP: SCROLL ROTATION
// ==========================================================
// Same scroll-linked behavior as .floatmount_bear_head.
// Parent group rotates independently from -23° to -7°.
gsap.utils.toArray(".floatmount_bear_group").forEach(function(bearGroup) {
  gsap.fromTo(bearGroup,
    { rotation: -25 },
    {
      rotation: 15,
      ease: "power1.out",
      force3D: true,
      immediateRender: false,
      scrollTrigger: {
        trigger: bearGroup,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        invalidateOnRefresh: true
      }
    }
  );
});


// ==========================================================
// HOME 2 — FLOAT MOUNTAIN TURTLE: TINY BOUNCE (~3s INTERVAL)
// ==========================================================
// For a ~20px turtle: three small hops, like the Home 6 dinosaur.
// Play only while the turtle is near the viewport.
gsap.utils.toArray(".floatmount_turtle").forEach(function(turtle) {
  var turtleBounce = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 2.25 })
    .to(turtle, { y: -5, duration: 0.13, ease: "power3.out" })
    .to(turtle, { y: 0, duration: 0.16, ease: "bounce.out" })
    .to(turtle, { y: -3, duration: 0.11, ease: "power3.out" })
    .to(turtle, { y: 0, duration: 0.13, ease: "bounce.out" })
    .to(turtle, { y: -1.5, duration: 0.09, ease: "power3.out" })
    .to(turtle, { y: 0, duration: 0.13, ease: "bounce.out" });

  ScrollTrigger.create({
    trigger: turtle,
    start: "top bottom",
    end: "bottom top",
    onEnter: function() { turtleBounce.play(); },
    onEnterBack: function() { turtleBounce.play(); },
    onLeave: function() { turtleBounce.pause(); },
    onLeaveBack: function() { turtleBounce.pause(); }
  });
});


// ==========================================================
// HOME 2 — PARTY BEAR: SCROLL ROTATION (+18° TO -12°)
// ==========================================================
// Independent ScrollTrigger, grouped with the float-cloud effects.
// Starts when the bear enters from the bottom of the viewport.
gsap.utils.toArray(".partybear").forEach(function(partyBear) {
  gsap.fromTo(partyBear,
    { rotation: 18 },
    {
      rotation: -12,
      ease: "none",
      force3D: true,
      immediateRender: false,
      scrollTrigger: {
        trigger: partyBear,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        invalidateOnRefresh: true
      }
    }
  );
});


  // ==========================================================
  // HOME 2 — BUILDING 12 CLOUD: INDEPENDENT GENTLE DRIFT
  // ==========================================================
  // Keep near the Building 12 animations, not the float-cloud group.
  // Its own position controls when it starts and finishes.
  gsap.utils.toArray(".home2_building12_cloud").forEach(function(buildingCloud) {
    gsap.fromTo(buildingCloud,
      { x: 0, y: 0 },
      {
        x: function() { return getRealViewportWidth() * 0.02; }, // right 2vw
        y: function() { return -getRealViewportHeight() * 0.08; }, // up 8vh
        ease: "none",
        force3D: true,
        immediateRender: false,
        scrollTrigger: {
          trigger: buildingCloud,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true
        }
      }
    );
  });

  // ==========================================================
  // DEPTH PARALLAX
  // ==========================================================

  var depthGroups = [

    {
      targets:
        ".home2_building12",

      travel: 0
    },

    {
      targets:
        ".home2_building9",

      travel: 12
    },

    {
      targets:
        ".home2_clocktower, .home2_dinosaur, .home2_5centcat",

      travel: 24
    },

    {
      targets:
        ".home2_bridge, .home2_bridgebuilding, .home2_building2, .home2_statue",

      travel: 36
    },

    {
      targets:
        ".home2_mount4, .home2_spacecat",

      travel: 48
    },

    {
      targets:
        ".home2_building1, .home2_spark, .home2_crystal, .home2_pickle, .home2_riv",

      travel: 60
    },

    {
      targets:
        ".home2_oceanball, .home2_whale, .home2_triangle, .home2_mushroom, .home2_pillar, .home2_jupiter, .home2_cat",

      travel: 72
    }

  ];


  depthGroups.forEach(
    function (group) {

      var elements =
        gsap.utils.toArray(
          group.targets
        );


      if (
        !elements.length ||
        group.travel === 0
      ) {
        return;
      }


      var distance =
        group.travel *
        MASTER_VH;


      gsap.fromTo(

        elements,

        {

          y: distance,

          force3D: true

        },

        {

          y: -distance,

          ease: "none",

          force3D: true,

          scrollTrigger: {

            trigger: section,

            start: "top bottom",

            end: "bottom top",

            scrub: 1,

            invalidateOnRefresh: true

          }

        }

      );

    }
  );




// ==========================================================
// STATUE FIRE + PUNCH + RETURN LASER
// Original punch movement preserved. Laser only reads spots.
// ==========================================================
// ==========================================================
// LASER SETTINGS
// ==========================================================

// Laser when punch shoots OUT
var LASER_SHOOT_OUT = false;  // true = ON, false = OFF

// Laser when punch flies BACK
var LASER_RETURN = false;     // true = ON, false = OFF

  
var statuePunch = q(".home2_statue_punch_group");
var statueFire = q(".home2_statue_fire");

var statueShots = [
  statuePunch,
  statueFire
].filter(Boolean);

var home2City = q(".home_section2_city");
var punchSpot1 = q(".punch_spot1");
var punchSpot2 = q(".punch_spot2");

// ----------------------------------------------------------
// LASER VISUAL — DRAW FROM SPOT 2 TO SPOT 1
// ----------------------------------------------------------

var punchLaser = null;
var punchLaserRunning = false;


if (statuePunch && punchSpot1 && punchSpot2) {

  punchLaser = document.createElement("div");

  Object.assign(punchLaser.style, {
    position: "fixed",
    left: "0px",
    top: "0px",
    width: "0px",
    height: "3px",
    background: "#e4f643",
    transformOrigin: "0 50%",
    pointerEvents: "none",
    zIndex: "9999",
    display: "none"
  });

  document.body.appendChild(punchLaser);
}


function updatePunchLaser() {
  if (!punchLaser || !punchLaserRunning) return;

  var a = punchSpot1.getBoundingClientRect();
  var b = punchSpot2.getBoundingClientRect();

  var x1 = a.left + a.width / 2;
  var y1 = a.top + a.height / 2;
  var x2 = b.left + b.width / 2;
  var y2 = b.top + b.height / 2;

  var dx = x1 - x2;
  var dy = y1 - y2;

  punchLaser.style.width = Math.hypot(dx, dy) + "px";
  punchLaser.style.transform =
    "translate3d(" + x2 + "px," + y2 + "px,0) " +
    "rotate(" + Math.atan2(dy, dx) + "rad)";
}

function startPunchLaser() {
  if (!punchLaser || punchLaserRunning) return;

  punchLaserRunning = true;
  punchLaser.style.display = "block";

  updatePunchLaser();
  gsap.ticker.add(updatePunchLaser);
}

function stopPunchLaser() {
  if (!punchLaser) return;

  punchLaserRunning = false;
  gsap.ticker.remove(updatePunchLaser);
  punchLaser.style.display = "none";
}

// ----------------------------------------------------------
// ORIGINAL PUNCH FLIGHT
// ----------------------------------------------------------

if (statueShots.length) {

  function getHome2CityScale() {
    if (!home2City) return 1;

    return (
      parseFloat(getComputedStyle(home2City).zoom) || 1
    );
  }

  function getPunchTravelX() {
    var visualDistance = getRealViewportWidth() * 1.25;
    return -visualDistance / getHome2CityScale();
  }

  function getPunchTravelY() {
    var visualDistance = getRealViewportWidth() * 1.25;
    var visualY = visualDistance * Math.tan(53.4 * Math.PI / 180);
    return -visualY / getHome2CityScale();
  }

  gsap.set(statueShots, {
    x: 0,
    y: 0,
    scale: 1,
    force3D: true
  });

  if (statueFire) {
    gsap.set(statueFire, { autoAlpha: 0 });
  }

    ScrollTrigger.create({
      trigger: ".home2_statue",
      start: "center 100%",

    // FLY OUT — ORIGINAL MOVEMENT, NO LASER
    onEnter: function () {
      if (LASER_SHOOT_OUT) {
            startPunchLaser();
          } else {
            stopPunchLaser();
          }
      gsap.killTweensOf(statueShots);

      if (statueFire) {
        gsap.set(statueFire, { autoAlpha: 1 });
      }

      gsap.to(statueShots, {
        x: getPunchTravelX,
        y: getPunchTravelY,
        scale: isMobile ? 4 : 7.5,
        duration: 1.8,
        ease: "power3.in",
        force3D: true,

        onComplete: stopPunchLaser
      });
    },

    // FLY BACK — ORIGINAL MOVEMENT + LASER
    onLeaveBack: function () {
      gsap.killTweensOf(statueShots);

      if (statueFire) {
        gsap.set(statueFire, { autoAlpha: 0 });
      }

      if (LASER_RETURN) {
          startPunchLaser();
        } else {
          stopPunchLaser();
        }

      gsap.to(statueShots, {
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.7,
        ease: "power2.out",
        force3D: true,
        onComplete: stopPunchLaser
      });
    }
  });
}

  // ==========================================================
  // OCEAN BALL FLOAT
  // ==========================================================
  

  // ==========================================================
  // OCEAN BALL FLOAT
  //
  // yPercent is already relative to itself,
  // so keep this unchanged.
  // ==========================================================

  var oceanBall =
    q(".home2_oceanball");


  if (oceanBall) {

    gsap.to(
      oceanBall,
      {

        yPercent: -3,

        rotation: 1.5,

        duration: 2.4,

        ease: "sine.inOut",

        yoyo: true,

        repeat: -1,

        force3D: true

      }
    );

  }


  requestAnimationFrame(
    function () {

      ScrollTrigger.refresh();

    }
  );


// -------------------------------------------------------------
// HOME 2 — AIRSHIP
// Slowly travels left → right while scrolling
// -------------------------------------------------------------

if (exists(".home2_airship")) {

  gsap.fromTo(
    ".home2_airship",

    {
      x: "-10vw"
    },

    {
      x: "12vw",

      ease: "none",

      scrollTrigger: {
        trigger: ".home_section2",
        start: "top bottom",
        end: "bottom top",
        scrub: 2,
        invalidateOnRefresh: true
      }
    }
  );

  }
  



  

// -------------------------------------------------------------
// HOME 2 — CITY LIGHT
// Searchlights move WITH scroll
// -------------------------------------------------------------

var cityLight =
  q(".home2_citylight");

var cityLight2 =
  q(".home2_citylight2");

var cityLight3 =
  q(".home2_citylight3");

var cityLight4 =
  q(".home2_citylight4");


// LIGHT 1
if (cityLight) {

  gsap.fromTo(
    cityLight,

    {
      rotation: -55,
      transformOrigin: "50% 100%"
    },

    {
      rotation: -10,

      ease: "none",

      force3D: true,

      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
        invalidateOnRefresh: true
      }
    }
  );

}


// LIGHT 2
if (cityLight2) {

  gsap.fromTo(
    cityLight2,

    {
      rotation: 10,
      transformOrigin: "50% 100%"
    },

    {
      rotation: -10,

      ease: "none",

      force3D: true,

      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
        invalidateOnRefresh: true
      }
    }
  );

}

// LIGHT 3
if (cityLight3) {

  gsap.fromTo(
    cityLight3,

    {
      rotation: -20,
      transformOrigin: "50% 100%"
    },

    {
      rotation: 4,

      ease: "none",

      force3D: true,

      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
        invalidateOnRefresh: true
      }
    }
  );

}

// LIGHT 4
if (cityLight4) {

  gsap.fromTo(
    cityLight4,

    {
      rotation: 12,
      transformOrigin: "50% 100%"
    },

    {
      rotation: -5,

      ease: "none",

      force3D: true,

      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
        invalidateOnRefresh: true
      }
    }
  );

}


  
  



// -------------------------------------------------------------
// HOME 2 — GROW UP
//
// CSS-ZOOM SAFE VERSION
//
// IMPORTANT:
// Do NOT let ScrollTrigger measure .growup directly.
// .home_section2_city is CSS-zoomed.
//
// Instead:
// section document top
// + element offset inside city × city zoom
// = TRUE visual document position
// -------------------------------------------------------------

var enableGrowup =
  !/Mobi|Android|iPhone|iPad|iPod/i.test(
    navigator.userAgent
  );


if (enableGrowup) {

  var home2City =
    q(".home_section2_city");


  var growupItems =
    gsap.utils.toArray(
      ".home_section2_city .growup"
    );


  // ========================================================
  // GET CITY ZOOM
  // ========================================================

  function getHome2CityZoom() {

    if (!home2City) return 1;


    var zoom =
      parseFloat(
        window.getComputedStyle(
          home2City
        ).zoom
      );


    return zoom || 1;

  }


  // ========================================================
  // GET ELEMENT OFFSET INSIDE CITY
  //
  // offsetTop = unscaled layout position
  // ========================================================

  function getHome2GrowupOffset(el) {

    if (
      !el ||
      !home2City
    ) {
      return 0;
    }


    var total = 0;

    var current = el;


    while (
      current &&
      current !== home2City
    ) {

      total +=
        current.offsetTop || 0;

      current =
        current.offsetParent;

    }


    return total;

  }


  // ========================================================
  // TRUE VISUAL DOCUMENT TOP
  // ========================================================

  function getHome2GrowupDocumentTop(el) {

    if (
      !section ||
      !home2City ||
      !el
    ) {
      return 0;
    }


    var sectionDocumentTop =
      section.getBoundingClientRect().top +
      window.scrollY;


    var cityTopInsideSection =
      home2City.offsetTop || 0;


    var zoom =
      getHome2CityZoom();


    var growupOffset =
      getHome2GrowupOffset(el);


    return (
      sectionDocumentTop +
      cityTopInsideSection +
      growupOffset * zoom
    );

  }


  // ========================================================
  // PREPARE GROWUP ITEMS
  // ========================================================

  growupItems.forEach(
    function(el) {

      gsap.set(
        el,
        {
          yPercent: 100,
          force3D: true
        }
      );

    }
  );


  // ========================================================
  // MANUAL UPDATE
  //
  // START:
  // object visual top reaches 115% viewport
  //
  // END:
  // object visual top reaches 55% viewport
  //
  // This starts BEFORE the object becomes clearly visible.
  // ========================================================

  function updateHome2Growups() {

    if (
      !section ||
      !home2City
    ) {
      return;
    }


    var viewportHeight =
      getRealViewportHeight();


    var scrollY =
      window.scrollY;


    growupItems.forEach(
      function(el) {

        var elementDocumentTop =
          getHome2GrowupDocumentTop(
            el
          );


        // Start BEFORE it reaches viewport bottom.
        var startScroll =
          elementDocumentTop -
          viewportHeight * 0.88;


        // Finish around middle-lower viewport.
        var endScroll =
          elementDocumentTop -
          viewportHeight * 0.42;


        var distance =
          endScroll -
          startScroll;


        var progress =
          distance !== 0

            ? (
                scrollY -
                startScroll
              ) /
              distance

            : 1;


        progress =
          Math.max(
            0,
            Math.min(
              1,
              progress
            )
          );


        // Slight ease-out.
        var eased =
          1 -
          Math.pow(
            1 - progress,
            2
          );


        gsap.set(
          el,
          {
            yPercent:
              100 *
              (
                1 -
                eased
              ),

            force3D: true
          }
        );

      }
    );

  }


  // ========================================================
  // UPDATE WITH REAL SCROLL
  // ========================================================

  window.addEventListener(
    "scroll",
    updateHome2Growups,
    {
      passive: true
    }
  );


  // Lenis scroll
  if (
    lenis &&
    lenis.on
  ) {

    lenis.on(
      "scroll",
      updateHome2Growups
    );

  }


  // ========================================================
  // REFRESH AFTER RESPONSIVE CITY ZOOM CHANGES
  // ========================================================

  ScrollTrigger.addEventListener(
    "refresh",
    updateHome2Growups
  );


  window.addEventListener(
    "resize",
    function() {

      requestAnimationFrame(
        updateHome2Growups
      );

    }
  );


  // ========================================================
  // INITIAL POSITION
  // ========================================================

  requestAnimationFrame(
    updateHome2Growups
  );

}


  
  




  // ==========================================================
  // HOME 2 — RANDOM TRAINS
  // 6 train designs / random speed / both directions
  // ==========================================================

  var train = q(".home2_train");
  var trainReverse = q(".home2_train_reverse");
  var trainMask = q(".home2_train_mask");

  // Flip reverse train artwork horizontally
  if (trainReverse) {
    gsap.set(Array.from(trainReverse.children), {
      scaleX: -1
    });
  }

  if (trainMask) {

    // ========================================================
    // SETTINGS
    // ========================================================

    // RIGHT → LEFT
    var TRAIN_DURATION_MIN = 3.2;
    var TRAIN_DURATION_MAX = 5.8;
    var TRAIN_GAP_MIN = 0;
    var TRAIN_GAP_MAX = 1.2;

    // LEFT → RIGHT
    var REVERSE_DURATION_MIN = 4.0;
    var REVERSE_DURATION_MAX = 7.0;
    var REVERSE_GAP_MIN = 2.0;
    var REVERSE_GAP_MAX = 4.5;
    var REVERSE_FIRST_DELAY = 1.5;

    // ========================================================
    // RANDOM TRAIN ENGINE
    // ========================================================

    function createRandomTrain(wrapper, reverse) {

      if (!wrapper) return;

      var trains = Array.from(wrapper.children);

      if (!trains.length) return;

      var lastTrainIndex = -1;

      gsap.killTweensOf(wrapper);

      gsap.set(trains, {
        display: "none"
      });

      function runTrain() {

        // Random train, avoiding immediate repetition
        var index = Math.floor(
          Math.random() * trains.length
        );

        if (trains.length > 1) {
          while (index === lastTrainIndex) {
            index = Math.floor(
              Math.random() * trains.length
            );
          }
        }

        lastTrainIndex = index;

        // Show only the selected train
        gsap.set(trains, {
          display: "none"
        });

        gsap.set(trains[index], {
          display: "block"
        });

        // Random speed for this appearance
        var duration = reverse
          ? gsap.utils.random(
              REVERSE_DURATION_MIN,
              REVERSE_DURATION_MAX
            )
          : gsap.utils.random(
              TRAIN_DURATION_MIN,
              TRAIN_DURATION_MAX
            );

        // Calculate travel distance
        var maskWidth = trainMask.offsetWidth;
        var trainWidth = wrapper.offsetWidth;

        // Set starting position
        gsap.set(wrapper, {
          left: reverse ? 0 : "100%",
          x: reverse ? -trainWidth : 0,
          force3D: true
        });

        // Travel across the bridge
        gsap.to(wrapper, {

          x: reverse
            ? maskWidth
            : -(maskWidth + trainWidth),

          duration: duration,
          ease: "none",
          force3D: true,

          onComplete: function() {

            // Random wait before next appearance
            var gap = reverse
              ? gsap.utils.random(
                  REVERSE_GAP_MIN,
                  REVERSE_GAP_MAX
                )
              : gsap.utils.random(
                  TRAIN_GAP_MIN,
                  TRAIN_GAP_MAX
                );

            gsap.delayedCall(gap, runTrain);

          }

        });

      }

      // Start
      if (reverse) {
        gsap.delayedCall(
          REVERSE_FIRST_DELAY,
          runTrain
        );
      } else {
        runTrain();
      }

    }

    // ========================================================
    // START BOTH DIRECTIONS
    // ========================================================

    createRandomTrain(train, false);
    createRandomTrain(trainReverse, true);

  }

  
    
  
  } // End

  
  
  // =============================================================
  // HOMEPAGE SECTION 3
  // =============================================================
  function initHomeSection3() {
    var section = q(".home_section3");
    if (!section || !gsap || !ScrollTrigger) return;
  
  var moversDesktop = [
    { sel: ".home3_fish1",      x: 50, y:   3, r:   0 },
    { sel: ".home3_fish2",      x: 40, y:  -4, r:   0 },
    { sel: ".home3_fish3",      x: 20, y:   0, r:   0 },
    { sel: ".home3_dolphin",    x: 16, y:  -6, r:   0 },
    { sel: ".home3_shark",      x: 12, y:   4, r:   0 },
    { sel: ".home3_cat",        x:  7, y:  -6, r: -20 },
    { sel: ".home3_moon",       x:  0, y:  30, r:   0 },
    { sel: ".home3_jet",        x: 90, y:  -8, r:   0 },
    { sel: ".home3_superman",   x: 110,y:  -5, r:   0 },
    { sel: ".home3_turtle",     x: 20, y:  12, r:  -5 },
    { sel: ".home3_lion",       x: 12, y:   8, r: -30 },
    { sel: ".home3_bear",       x:  5, y:  30, r:  -1 },
    { sel: ".home3_fishbunch1", x: 10, y:  30, r:   0 },
    { sel: ".home3_fishbunch2", x: 10, y:  30, r:   0 }
  ];

  var moversMobile = [
    { sel: ".home3_fish1",      x: 100,y:   3, r:   0 },
    { sel: ".home3_fish2",      x: 80, y:  -4, r:   0 },
    { sel: ".home3_fish3",      x: 50, y:   0, r:   0 },
    { sel: ".home3_dolphin",    x: 50, y:  -6, r:   0 },
    { sel: ".home3_shark",      x: 30, y:   4, r:   0 },
    { sel: ".home3_cat",        x: 38, y:  -5, r: -20 },
    { sel: ".home3_moon",       x:  0, y:  30, r:   0 },
    { sel: ".home3_jet",        x: 90, y:  -8, r:   0 },
    { sel: ".home3_superman",   x: 75, y:  -5, r:   0 },
    { sel: ".home3_turtle",     x: 40, y:  12, r:  -5 },
    { sel: ".home3_lion",       x: 20, y:   8, r: -30 },
    { sel: ".home3_bear",       x: 10, y:   0, r:   0 },
    { sel: ".home3_fishbunch1", x: 10, y:  30, r:   0 },
    { sel: ".home3_fishbunch2", x: 10, y:  30, r:   0 }
  ];

// Select by viewport width
var movers = window.matchMedia("(max-width: 767px)").matches
  ? moversMobile
  : moversDesktop;


// ==========================================================
// HOME 3 — FISH / DOLPHIN / CHARACTER MOVEMENT
// ==========================================================

movers.forEach(function(item) {

  tweenIf(item.sel, {

    x: () => item.x * vw,
    y: () => item.y * vh,
    rotation: item.r,

    ease: "power1.out",
    force3D: true,

    scrollTrigger: {
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      scrub: 1,
      invalidateOnRefresh: true
    }

  });

});


// ==========================================================
// HOME 3 — CAT LIMBS: SCRUBBED WITH THE CAT'S SCROLL MOVEMENT
// Limbs 1 & 2: -60 degrees from their Webflow initial rotation.
// Limbs 3 & 4: +60 degrees from their Webflow initial rotation.
// Uses the exact same scroll range and scrub as .home3_cat.
// No looping or time-based movement.
// ==========================================================

(function initHome3CatLimbs() {
  var cat = q(".home3_cat");
  if (!cat) return;

  [
    { selector: ".home3_cat_limb1", offset: -45 },
    { selector: ".home3_cat_limb2", offset: -25 },
    { selector: ".home3_cat_limb3", offset:  45 },
    { selector: ".home3_cat_limb4", offset:  25 }
  ].forEach(function(item) {
    var limb = cat.querySelector(item.selector);
    if (!limb) return;

    // Read the existing Webflow rotation once; don't reset the limb to zero.
    var webflowRotation = Number(gsap.getProperty(limb, "rotation")) || 0;

    gsap.fromTo(limb,
      { rotation: webflowRotation },
      {
        rotation: webflowRotation + item.offset,
        ease: "power1.out",
        force3D: true,
        immediateRender: false,
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
          invalidateOnRefresh: true
        }
      }
    );
  });
})();


// ==========================================================
// HOME 3 — LION LIMBS + TAIL: SCROLL-LINKED
// Same scroll range and scrub as .home3_lion.
// Preserve the initial Webflow rotation for every part.
// Limbs 1/2: anticlockwise; limbs 3/4: clockwise.
// Tail: clockwise 50 degrees.
// ==========================================================

(function initHome3LionParts() {
  var lion = q(".home3_lion");
  if (!lion) return;

  [
    { selector: ".home3_lion_limb1", offset: -55 },
    { selector: ".home3_lion_limb2", offset: -70 },
    { selector: ".home3_lion_limb3", offset:  55 },
    { selector: ".home3_lion_limb4", offset:  70 },
    { selector: ".home3_lion_tail",  offset:  50 }
  ].forEach(function(item) {
    var part = lion.querySelector(item.selector);
    if (!part) return;

    var webflowRotation = Number(gsap.getProperty(part, "rotation")) || 0;

    gsap.fromTo(part,
      { rotation: webflowRotation },
      {
        rotation: webflowRotation + item.offset,
        ease: "power1.out",
        force3D: true,
        immediateRender: false,
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
          invalidateOnRefresh: true
        }
      }
    );
  });
})();


// ==========================================================
// ==========================================================
// ==========================================================
// HOME 3 — TURTLE LIMBS: SCROLL-LINKED
// Limb 1: +81 degrees; limb 2: +90 degrees clockwise from Webflow rotation.
// Limb 3: +99 degrees; limb 4: +108 degrees clockwise from Webflow rotation.
// Match the existing Home 3 scroll range and scrub.
// ==========================================================
(function initHome3TurtleLimbs() {
  var turtle = q(".home3_turtle");
  if (!turtle) return;

  [
    { selector: ".home3_turtle_limb1", offset: 81 },
    { selector: ".home3_turtle_limb2", offset: 90 },
    { selector: ".home3_turtle_limb3", offset: 99 },
    { selector: ".home3_turtle_limb4", offset: 108 }
  ].forEach(function(item) {
    var limb = turtle.querySelector(item.selector);
    if (!limb) return;

    var webflowRotation = Number(gsap.getProperty(limb, "rotation")) || 0;
    gsap.fromTo(limb,
      { rotation: webflowRotation },
      {
        rotation: webflowRotation + item.offset,
        ease: "power1.out",
        force3D: true,
        immediateRender: false,
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
          invalidateOnRefresh: true
        }
      }
    );
  });
})();


// ==========================================================
// HOME 3 — GALAXY
// ==========================================================

var galaxy = q(".home3_galaxy");
  
    if (galaxy) {
      gsap.to(galaxy, {
        y: () => 50 * vh,
        ease: "none",
        force3D: true,
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
          invalidateOnRefresh: true
        }
      });
    }
  }

  
// =============================================================
// HOMEPAGE SECTION 4
// =============================================================

function initHomeSection4() {

  var section =
    q(".home_section4");

  var city =
    q(".home_section4_city");

  var pulse =
    q(".home4_pulse");

  var wave =
    q("#home4-top-wave");


  if (
    !section ||
    !gsap ||
    !ScrollTrigger
  ) {
    return;
  }


  // ==========================================================
  // SECTION 4 CITY
  // ==========================================================

  if (city) {

    gsap.to(city, {

      yPercent: -80,

      ease: "none",

      force3D: true,

      scrollTrigger: {

        trigger: section,

        start: "top bottom",

        end: "bottom top",

        scrub: 1,

        invalidateOnRefresh: true

      }

    });

  }


  // ==========================================================
  // HOME4 DOT — SCROLL SCALE (0.2 -> 0.6)
  // Begins when dot top enters viewport bottom.
  // ==========================================================

  var home4Dots = gsap.utils.toArray(".home4_dot");

  home4Dots.forEach(function (dot) {
    gsap.fromTo(dot,
      { scale: 0.1 },
      {
        scale: 0.75,
        ease: "power3.inout",
        immediateRender: false,
        scrollTrigger: {
          trigger: dot,
          start: "top bottom",
          end: "top 30%",
          scrub: 1,
          invalidateOnRefresh: true
        }
      }
    );
  });


  // ==========================================================
  // DOT PATTERN
  //
  // SAME SIMPLE METHOD AS HOME3_LION
  // ==========================================================

  tweenIf(
    ".home4_dot_pattern",
    {

      y: function () {
        return -40 * vh;
      },

      ease: "none",

      force3D: true,

      scrollTrigger: {

        trigger: section,

        start: "top bottom",

        end: "bottom top",

        scrub: true,

        invalidateOnRefresh: true

      }

    }
  );





  // ==========================================================
  // PULSE
  // ==========================================================

  if (pulse) {

    gsap.to(pulse, {

      y: "+=450",

      duration: 3,

      ease: "power3.in",

      repeat: -1,

      force3D: true

    });

  }


  // ==========================================================
  // WAVE
  // ==========================================================

  if (
    !wave ||
    !MorphSVGPlugin
  ) {
    return;
  }


  var waveA =
    "M0,430 " +
    "C320,425 520,405 760,410 " +
    "C980,415 1160,390 1360,400 " +
    "C1540,410 1690,380 1810,395 " +
    "C1870,402 1900,410 1925,414 " +
    "C1950,410 1980,402 2040,395 " +
    "C2160,380 2310,410 2490,400 " +
    "C2690,390 2870,415 3090,410 " +
    "C3330,405 3530,425 3838,430 " +
    "L3838,485 L0,485 Z";


  var waveB =
    "M0,430 " +
    "C280,410 500,420 760,397 " +
    "C980,380 1160,415 1360,390 " +
    "C1530,370 1690,405 1810,385 " +
    "C1870,375 1905,402 1925,410 " +
    "C1945,402 1980,375 2040,385 " +
    "C2160,405 2320,370 2490,390 " +
    "C2690,415 2870,380 3090,397 " +
    "C3350,420 3560,410 3838,430 " +
    "L3838,485 L0,485 Z";


  var waveC =
    "M0,430 " +
    "C300,438 520,392 760,420 " +
    "C990,440 1170,382 1360,412 " +
    "C1530,435 1700,392 1810,405 " +
    "C1875,414 1905,422 1925,424 " +
    "C1945,422 1975,414 2040,405 " +
    "C2150,392 2320,435 2490,412 " +
    "C2680,382 2860,440 3090,420 " +
    "C3330,392 3550,438 3838,430 " +
    "L3838,485 L0,485 Z";


  gsap.timeline({
    repeat: -1
  })

  .to(wave, {

    morphSVG: waveB,

    duration: 3.2,

    ease: "sine.inOut"

  })

  .to(wave, {

    morphSVG: waveC,

    duration: 3.6,

    ease: "sine.inOut"

  })

  .to(wave, {

    morphSVG: waveA,

    duration: 3.4,

    ease: "sine.inOut"

  });

}

  
// =============================================================
// HOMEPAGE SECTION 5
// =============================================================

function initHomeSection5() {

  var section = q(".home_section5");

  if (!section || !gsap || !ScrollTrigger) return;

  var planet = q(".home5_planet");
  var planetRotateNegative = gsap.utils.toArray(
    ".home5_planet .home5_planet4, .home5_planet .home5_planet5"
  );

  var planetRotatePositive = gsap.utils.toArray(
    ".home5_planet .home5_planet2, .home5_planet .home5_planet3"
  );

  gsap.set(planetRotateNegative, { rotation: -80 });
  gsap.set(planetRotatePositive, { rotation: 80 });

  var jupiter = q(".home5_jupiter");
  var ball = q(".home5_ball");
  var satellite = q(".home5_satellite");
  var rocketTip = q(".home5_rockettip");
  var burger = q(".home5_burger");
  var bear = q(".home5_bear");
  var bloodcell = q(".home5_bloodcell");
  var jetman = q(".home5_jetman");
  var umbrellaCat = q(".home5_umbrellacat");
  var galaxy = q(".home5_galaxy");
  var light = q(".home5_light");
  var dim = q(".home5_dim");


  // ============================================================
  // PLANET / BALL / JUPITER
  // ============================================================

  ScrollTrigger.create({
    trigger: section,
    start: "top bottom",
    end: "bottom top",
    scrub: 1,
    invalidateOnRefresh: true,

    onUpdate: function(self) {

      var t = self.progress;
      var arc = Math.sin(Math.PI * t);

      if (planet) {

        gsap.set(planet, {
          xPercent: -70 * t,
          yPercent: (-55 * t) - (22 * arc),
          force3D: true
        });

        gsap.set(planetRotateNegative, {
          rotation: -80 + (156 * t),
          force3D: true
        });

        gsap.set(planetRotatePositive, {
          rotation: 80 - (156 * t),
          force3D: true
        });
      }

      if (ball) {
        gsap.set(ball, {
          xPercent: -70 * t,
          yPercent: (-48 * t) - (18 * arc),
          force3D: true
        });
      }

      if (jupiter) {
        gsap.set(jupiter, {
          xPercent: 35 * t,
          yPercent: (-30 * t) + (10 * arc),
          force3D: true
        });
      }
    }
  });


  // ============================================================
  // GALAXY
  // ============================================================

  if (galaxy) {
    gsap.to(galaxy, {
      yPercent: 35,
      ease: "none",
      force3D: true,

      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
        invalidateOnRefresh: true
      }
    });
  }


  // ============================================================
  // SATELLITE
  // ============================================================

  if (satellite) {
    gsap.to(satellite, {
      xPercent: 750,
      yPercent: -250,
      rotation: -6,
      ease: "none",
      force3D: true,

      scrollTrigger: {
        trigger: section,
        start: "top 45%",
        end: "bottom 0%",
        scrub: 2.2,
        invalidateOnRefresh: true
      }
    });
  }


  // ============================================================
  // ROCKET TIP / LIGHT / BEAR
  // ============================================================

  if (rocketTip) {

    var rocketDropTimeline;

    if (light) {
      gsap.set(light, {
        scaleX: 0,
        scaleY: 1,
        opacity: 0,
        transformOrigin: "top center"
      });
    }

    if (dim) {
      gsap.set(dim, { opacity: 1 });
    }

    if (bear) {
      gsap.set(bear, { x: 0 });
    }


    function switchLightsOn() {

      if (light) {
        gsap.to(light, {
          scaleX: 1.4,
          opacity: 0.95,
          duration: 0.13,
          ease: "power3.out",
          overwrite: true
        });
      }

      if (dim) {
        gsap.to(dim, {
          opacity: 0,
          duration: 0.1,
          ease: "power3.out",
          overwrite: true
        });
      }

      if (bear) {
        gsap.to(bear, {
          x: 32,
          scale: 1.04,
          duration: 0.7,
          ease: "power2.out",
          overwrite: true
        });
      }
    }


    function switchLightsOff() {

      // LIGHT — DELAY 0.2 SECONDS
      if (light) {
        gsap.to(light, {
          scaleX: 0,
          opacity: 0,
          delay: 0.2,
          duration: 0.13,
          ease: "power3.out",
          overwrite: true
        });
      }

      // DIM LAYER — DELAY 0.2 SECONDS
      if (dim) {
        gsap.to(dim, {
          opacity: 1,
          delay: 0.2,
          duration: 0.1,
          ease: "power3.out",
          overwrite: true
        });
      }

      // BEAR — IMMEDIATE
      if (bear) {
        gsap.to(bear, {
          x: 0,
          scale: 1,
          delay: 0.25,
          duration: 0.6,
          ease: "power3.inout",
          overwrite: true
        });
      }
    }


    function dropRocketTip() {

      if (rocketDropTimeline) {
        rocketDropTimeline.kill();
      }

      gsap.killTweensOf(rocketTip);

      rocketDropTimeline = gsap.timeline()

        .to(rocketTip, {
          y: 165,
          duration: 0.4,
          ease: "power2.in",
          force3D: true
        })

        .call(switchLightsOn)

        .to(rocketTip, {
          y: 105,
          duration: 0.28,
          ease: "power2.out"
        })

        .to(rocketTip, {
          y: 165,
          duration: 0.28,
          ease: "power2.in"
        })

        .to(rocketTip, {
          y: 128,
          duration: 0.18,
          ease: "power2.out"
        })

        .to(rocketTip, {
          y: 165,
          duration: 0.18,
          ease: "power2.in"
        })

        .to(rocketTip, {
          y: 139,
          duration: 0.11,
          ease: "power2.out"
        })

        .to(rocketTip, {
          y: 165,
          duration: 0.11,
          ease: "power2.in"
        });
    }


    function returnRocketTip() {

      if (rocketDropTimeline) {
        rocketDropTimeline.kill();
        rocketDropTimeline = null;
      }

      gsap.killTweensOf(rocketTip);

      // Bear immediately, lighting after 0.2s
      switchLightsOff();

      // Rocket immediately
      gsap.to(rocketTip, {
        y: 0,
        duration: 0.5,
        ease: "power2.inOut",
        force3D: true
      });
    }


    // ============================================================
    // SCROLL TRIGGER
    // ============================================================

    ScrollTrigger.create({
      trigger: ".home5_lightpillar",
      start: "top 45%",
      markers: false,

      onEnter: dropRocketTip,
      onLeaveBack: returnRocketTip
    });

  } // END if (rocketTip)


  // ============================================================
  // BURGER
  // ============================================================

  if (burger) {

    gsap.timeline({
      repeat: -1,
      repeatDelay: 4
    })

    .to(burger, {
      y: -7,
      duration: 0.15,
      ease: "power3.out"
    })

    .to(burger, {
      y: 0,
      duration: 0.19,
      ease: "bounce.out"
    })

    .to(burger, {
      y: -5,
      duration: 0.13,
      ease: "power3.out"
    })

    .to(burger, {
      y: 0,
      duration: 0.17,
      ease: "bounce.out"
    })

    .to(burger, {
      y: -2,
      duration: 0.11,
      ease: "power3.out"
    })

    .to(burger, {
      y: 0,
      duration: 0.15,
      ease: "bounce.out"
    });
  }


  // ============================================================
  // JETMAN
  // ============================================================

  if (jetman) {

    var home5JetHover;

    function startHome5JetHover() {

      home5JetHover = gsap.to(jetman, {
        y: "-=15",
        duration: 1,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1
      });
    }

    startHome5JetHover();


    ScrollTrigger.create({

      trigger: jetman,
      start: "top 75%",

      onEnter: function() {

        gsap.killTweensOf(jetman);

        if (home5JetHover) {
          home5JetHover.kill();
        }

        gsap.to(jetman, {
          xPercent: 1600,
          yPercent: -1000,
          rotation: -50,
          duration: 1,
          ease: "power2.in"
        });
      },

      onLeaveBack: function() {

        gsap.killTweensOf(jetman);

        if (home5JetHover) {
          home5JetHover.kill();
        }

        gsap.set(jetman, {
          rotation: 180
        });

        gsap.to(jetman, {
          xPercent: 0,
          yPercent: 0,
          x: 0,
          y: 0,
          rotation: 0,
          duration: 1.4,
          ease: "power2.out",

          onComplete: startHome5JetHover
        });
      }
    });
  }


  // ============================================================
  // UMBRELLA CAT
  // ARC FLIGHT — CITY-ZOOM SAFE
  // ============================================================

  if (umbrellaCat) {

    var home5City =
      q(".home_section5_city");


    function getUmbrellaScale() {

      if (!home5City) return 1;

      return (
        parseFloat(
          getComputedStyle(home5City).zoom
        ) || 1
      );
    }


    function getUmbrellaOffsetInsideCity() {

      var x = 0;
      var y = 0;

      var current = umbrellaCat;

      while (
        current &&
        current !== home5City
      ) {

        x += current.offsetLeft || 0;
        y += current.offsetTop || 0;

        current = current.offsetParent;
      }

      return {
        x: x,
        y: y
      };
    }


    // INITIAL STATE

    gsap.set(umbrellaCat, {
      x: 0,
      y: 0,
      rotation: 0,
      opacity: 1,
      visibility: "hidden",
      force3D: true
    });


    // ARC FLIGHT

    ScrollTrigger.create({

      trigger: section,
      start: "top bottom",
      end: "bottom top",
      invalidateOnRefresh: true,

      onUpdate: function(self) {

        var viewportWidth =
          document.documentElement.clientWidth;

        var viewportHeight =
          document.documentElement.clientHeight;

        var scale =
          getUmbrellaScale();

        var offsets =
          getUmbrellaOffsetInsideCity();

        var visualWidth =
          (umbrellaCat.offsetWidth || 120) * scale;

        var visualHeight =
          (umbrellaCat.offsetHeight || 120) * scale;


        // FLIGHT PROGRESS

        var triggerDistance =
          Math.max(1, self.end - self.start);

        var flightSpan =
          (viewportHeight * 1.35) / triggerDistance;

        var p =
          (self.progress - 0.1) / flightSpan;

        p = Math.max(0, Math.min(1, p));


        // NATURAL SCREEN POSITION

        var sectionRect =
          section.getBoundingClientRect();

        var naturalLeft =
          sectionRect.left + (offsets.x * scale);

        var naturalTop =
          sectionRect.top + (offsets.y * scale);


        // ARC START / END

        var startLeft = naturalLeft;

        var startTop =
          -visualHeight - 60;

        var endLeft =
          -visualWidth - 80;

        var endTop =
          viewportHeight * 0.6;


        // SOFT ARC

        var curveX =
          Math.pow(p, 2.5);

        var curveY =
          1 - Math.pow(1 - p, 2.8);


        var desiredLeft =
          startLeft +
          (endLeft - startLeft) * curveX;

        var desiredTop =
          startTop +
          (endTop - startTop) * curveY;


        // SCREEN TO CITY COORDINATES

        var localX =
          (desiredLeft - naturalLeft) / scale;

        var localY =
          (desiredTop - naturalTop) / scale;


        // APPLY

        gsap.set(umbrellaCat, {

          x: localX,
          y: localY,

          rotation: 60 * curveX,

          visibility:
            p > 0.001 ? "visible" : "hidden",

          force3D: true
        });
      },


      onLeave: function() {

        gsap.set(umbrellaCat, {
          visibility: "hidden"
        });
      },


      onLeaveBack: function() {

        gsap.set(umbrellaCat, {
          visibility: "hidden"
        });
      }

    });

  } // END if (umbrellaCat)

} // END initHomeSection5



  // ==========================================================
  // HOME SECTION 6
  // ==========================================================

  
  

function initHomeSection6() {

  // ==========================================================
  // HOME 6 — TREE WIND SWAY
  // Extremely subtle, natural wind movement.
  // Transform origin remains controlled by Webflow.
  // ==========================================================

  (function initHome6TreeWindSway() {
    var tree = q(".home6_tree_group");
    if (!tree) return;

    // SETTINGS
    var MAX_ROTATION = 0.25; // Maximum +/- 0.25 degrees
    var MIN_DURATION = 5;    // Minimum swing time (seconds)
    var MAX_DURATION = 8;    // Maximum swing time (seconds)

    var baseRotation =
      Number(gsap.getProperty(tree, "rotation")) || 0;

    var direction = Math.random() < 0.5 ? 1 : -1;

    function sway() {
      // Small randomized angles, alternating direction
      var target =
        baseRotation +
        direction * gsap.utils.random(
          0.005,
          MAX_ROTATION
        );

      direction *= -1;

      gsap.to(tree, {
        rotation: target,
        duration: gsap.utils.random(
          MIN_DURATION,
          MAX_DURATION
        ),
        ease: "sine.inOut",
        overwrite: "auto",
        onComplete: sway
      });
    }

    sway();
  })();

  // Continue existing Home 6 animations inside initHomeSection6().

  var section = q(".home_section6");
  var city = q(".home_section6_city");

  // ==========================================================
  // HOME 6 — MONSTER HEAD IDLE MOVEMENT
  // Webflow owns transform-origin; this only adds subtle motion.
  // ==========================================================
  (function initHome6MonsterHeadIdle() {
    var head = q(".home6_monster_group");
    if (!head) return;

    var initialRotation = Number(gsap.getProperty(head, "rotation")) || 0;
    var initialY = Number(gsap.getProperty(head, "y")) || 0;

    // A gentle nod and vertical breathing motion, continuously looping.
    // Separate durations avoid a mechanical, perfectly synchronized cycle.
    gsap.to(head, {
      rotation: initialRotation + 5,
      duration: 2.2,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      overwrite: false
    });

    gsap.to(head, {
      y: initialY - 11,
      duration: 2.8,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      overwrite: false
    });
  })();



  

  // ==========================================================
  // HOME 6 — CAMEL GROUP IDLE MOVEMENT
  // Larger vertical sway, very subtle rotation.
  // Preserve the transform origin defined in Webflow.
  // ==========================================================
  (function initHome6CamelIdle() {
    var camelGroup = q(".home6_camel_group");
    if (!camelGroup) return;

    var initialRotation = Number(gsap.getProperty(camelGroup, "rotation")) || 0;
    var initialY = Number(gsap.getProperty(camelGroup, "y")) || 0;

    gsap.to(camelGroup, {
      rotation: initialRotation + 1,
      duration: 3.4,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      overwrite: false
    });

    gsap.to(camelGroup, {
      y: initialY - 14,
      duration: 3.0,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      overwrite: false
    });
  })();


  // ==========================================================
  // HOME 6 — FAST RISING CLOUDS
  // Each cloud has its own viewport-based trigger
  // ==========================================================

  var HOME6_CLOUD_SETTINGS = [
    { selector: ".home6_parallaxcloud1", speed: -0.3 },
    { selector: ".home6_parallaxcloud2", speed: -0.4 },
    { selector: ".home6_parallaxcloud3", speed: -0.24 },
    { selector: ".home6_parallaxcloud4", speed: -0.12 },
    { selector: ".home6_parallaxcloud5", speed: -0.5 }
  ];

  HOME6_CLOUD_SETTINGS.forEach(function(item) {

    var cloud = q(item.selector);
    if (!cloud) return;

    // Use a fixed, non-animated trigger at the cloud's
    // original Webflow position.
    var trigger = document.createElement("div");

    trigger.style.cssText =
      "position:absolute;" +
      "top:0;left:0;" +
      "width:1px;height:100%;" +
      "pointer-events:none;visibility:hidden;";

    cloud.parentElement.insertBefore(trigger, cloud);

    // Cloud begins at its original position.
    gsap.set(cloud, {
      y: 0,
      force3D: true
    });

    gsap.to(cloud, {

      // Extra upward travel, relative to the scroll distance.
      y: function() {
        return -(
          document.documentElement.clientHeight +
          cloud.getBoundingClientRect().height
        ) * item.speed;
      },

      ease: "none",
      force3D: true,

      scrollTrigger: {
        trigger: trigger,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        invalidateOnRefresh: true
      }
    });

  });

  

  var weirdSunHorn = q(".home6_weirdsunhorn");
  var weirdSun = q(".home6_weirdsun");
  var weirdSunText = q(".weirdsun_text");
  var home6TallPillar = q(".home6_tallpillar");
  var home6Lake = q(".home6_lake");

  var lakeWater1 = q(".home6_lake_water1");
  var lakeWater2 = q(".home6_lake_water2");

  if (!window.gsap || !window.ScrollTrigger) return;

  
  // ============================================================
  // DINOSAUR BOUNCE — SAME AS HOME 5 BURGER
  // ============================================================

  var dinosaurBounce = q(".home6_dinosaur_bounce");

  if (dinosaurBounce) {

    gsap.timeline({
      repeat: -1,
      repeatDelay: 4
    })

    .to(dinosaurBounce, {
      y: -7,
      duration: 0.15,
      ease: "power3.out"
    })

    .to(dinosaurBounce, {
      y: 0,
      duration: 0.19,
      ease: "bounce.out"
    })

    .to(dinosaurBounce, {
      y: -5,
      duration: 0.13,
      ease: "power3.out"
    })

    .to(dinosaurBounce, {
      y: 0,
      duration: 0.17,
      ease: "bounce.out"
    })

    .to(dinosaurBounce, {
      y: -2,
      duration: 0.11,
      ease: "power3.out"
    })

    .to(dinosaurBounce, {
      y: 0,
      duration: 0.15,
      ease: "bounce.out"
    });
  }



  // ==========================================================
  // SAFARI DETECTION
  // ==========================================================

  var isSafari =
    /^((?!chrome|android).)*safari/i.test(navigator.userAgent);


  // ==========================================================
  // SAFARI-SAFE CITY GEOMETRY
  // ==========================================================

  function getCityScale() {

    if (!city) return 1;

    var zoom =
      parseFloat(window.getComputedStyle(city).zoom);

    return zoom || 1;
  }


  function getOffsetInsideCity(el) {

    if (!el || !city) return 0;

    var total = 0;
    var current = el;

    while (current && current !== city) {

      total += current.offsetTop || 0;

      current = current.offsetParent;
    }

    return total;
  }


  function getSafariVisualTop(el) {

    if (!section || !city || !el) return 0;

    var sectionTop =
      section.getBoundingClientRect().top +
      window.scrollY;

    return (
      sectionTop +
      getOffsetInsideCity(el) * getCityScale()
    );
  }


  function getSafariVisualHeight(el) {

    if (!el) return 0;

    return el.offsetHeight * getCityScale();
  }


  function safariStart(el, viewportRatio) {

    return function() {

      return (
        getSafariVisualTop(el) -
        document.documentElement.clientHeight * viewportRatio
      );
    };
  }


  // ==========================================================
  // LAKE WATER
  // ==========================================================

  if (lakeWater1 && lakeWater2) {

    gsap.set([lakeWater1, lakeWater2], {
      scale: 1.002,
      transformOrigin: "50% 50%",
      force3D: true
    });

    gsap.set(lakeWater1, {
      xPercent: 0
    });

    gsap.set(lakeWater2, {
      xPercent: -200,
      x: 2
    });

    gsap.to([lakeWater1, lakeWater2], {
      xPercent: "+=100",
      duration: 45,
      ease: "none",
      repeat: -1,
      force3D: true
    });
  }


  // ==========================================================
  // LAKE — VERTICAL SHRINK ON SCROLL
  // ==========================================================

  if (home6Lake) {

    var lakeScrollTrigger;

    if (isSafari && section && city) {

      lakeScrollTrigger = {

        trigger: section,

        start: function() {
          return (
            getSafariVisualTop(home6Lake) -
            document.documentElement.clientHeight
          );
        },

        end: function() {
          return (
            getSafariVisualTop(home6Lake) +
            getSafariVisualHeight(home6Lake)
          );
        },

        scrub: 1,
        invalidateOnRefresh: true
      };

    } else {

      lakeScrollTrigger = {
        trigger: home6Lake,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
        invalidateOnRefresh: true
      };
    }


    gsap.fromTo(
      home6Lake,

      {
        scaleY: 1.6,
        transformOrigin: "50% 0%"
      },

      {
        scaleY: 1,
        ease: "none",
        force3D: true,

        scrollTrigger: lakeScrollTrigger
      }
    );
  }


  // ==========================================================
  // WEIRD SUN HORN
  // ==========================================================

  if (weirdSunHorn) {

    gsap.set(weirdSunHorn, {
      transformOrigin: "50% 50%",
      force3D: true
    });

    gsap.to(weirdSunHorn, {
      rotation: "+=360",
      duration: 24,
      ease: "none",
      repeat: -1
    });
  }



  // ==========================================================
  // WEIRD SUN + TEXT — CONSTANT SLOW PARALLAX
  //
  // Starts: Sun top enters viewport bottom
  // Ends:   Moving sun bottom exits viewport top
  // ==========================================================

  if (weirdSun) {

    // ========================================================
    // SETTINGS
    // ========================================================

    var WEIRD_SUN_TRAVEL = 360;

    // Freeze viewport height against mobile browser bars
    var WEIRD_SUN_VH =
      document.documentElement.clientHeight;

    // ========================================================
    // SCROLL DISTANCE
    // ========================================================

    // Actual visual downward movement of the sun
    function getWeirdSunExtraTravel() {
      return WEIRD_SUN_TRAVEL * getCityScale();
    }

    // Original visual height of the sun
    function getWeirdSunHeight() {
      return getSafariVisualHeight(weirdSun);
    }

    // Original document position, unaffected by GSAP y
    function getWeirdSunTop() {
      return getSafariVisualTop(weirdSun);
    }

    // ========================================================
    // ONE TIMELINE — SUN + TEXT
    // ========================================================

    var weirdSunTimeline = gsap.timeline({

      scrollTrigger: {

        trigger: section,

        start: function() {
          return getWeirdSunTop() - WEIRD_SUN_VH;
        },

        // Extend the scroll range by the amount that
        // the sun moves downward.
        end: function() {
          return (
            getWeirdSunTop() +
            getWeirdSunHeight() +
            getWeirdSunExtraTravel()
          );
        },

        scrub: true,
        invalidateOnRefresh: true
      }
    });

    // Sun inside zoomed city
    weirdSunTimeline.to(
      weirdSun,
      {
        y: WEIRD_SUN_TRAVEL,
        ease: "none",
        force3D: true
      },
      0
    );

    // Text outside city — matches visual movement
    if (weirdSunText) {

      weirdSunTimeline.to(
        weirdSunText,
        {
          y: function() {
            return getWeirdSunExtraTravel();
          },
          ease: "none",
          force3D: true
        },
        0
      );

    }

  }


  // ==========================================================
  // HOME 6 — SCROLL-LINKED CASTLE BUILD
  //
  // Tall Pillar:
  // top 100% → top 60%
  //
  // Shorter movement than previous version.
  // ==========================================================

  if (home6TallPillar) {

    var home6BuildSelectors = [
      ".home6_tree",
      ".home6_bloodcell",
      ".home6_cone",
      ".home6_castlepeak",
      ".home6_conetop",
      ".home6_sphere",
      ".home6_backcastle",
      ".home6_building",
      ".home6_building1",
      ".home6_biggate",
      ".home6_castle",
      ".home6_pyramid",
      ".home6_dinosaur"
    ];


    var home6BuildLayers =
      home6BuildSelectors
        .map(function(selector) {
          return document.querySelector(selector);
        })
        .filter(Boolean);


    var camel =
      q(".home6_camel");

    var monster =
      q(".home6_monster");

    var rocket =
      q(".home6_rocket");

    var emperor =
      q(".home6_emperor");

    var emperorRocket =
      q(".home6_emperor_rocket");

    var castleInside =
      q(".home6_castleinside");

    var cat =
      q(".home6_cat");

    var pyramid =
      q(".home6_pyramid");

    var giraffe = 
      q(".home6_giraffe");

    // ========================================================
    // INITIAL STATES
    //
    // OLD:
    // Most objects = 80
    // Camel / Monster = 50
    //
    // NEW:
    // Most objects = 45
    // Camel / Monster = 30
    // ========================================================

    if (home6BuildLayers.length) {

      gsap.set(home6BuildLayers, {
        yPercent: 70,
        force3D: true
      });
    }


    if (camel) {

      gsap.set(camel, {
        yPercent: 40,
        force3D: true
      });
    }


    if (monster) {

      gsap.set(monster, {
        yPercent: 40,
        force3D: true
      });
    }


    if (rocket) {

      gsap.set(rocket, {
        yPercent: 100,
        force3D: true
      });
    }
    
    if (giraffe) {

      gsap.set(giraffe, {
        yPercent: 120,
        force3D: true
      });
    }


    if (emperor) {

      gsap.set(emperor, {
        yPercent: 70,
        force3D: true
      });
    }


    if (emperorRocket) {

      gsap.set(emperorRocket, {
        yPercent: 0,
        force3D: true
      });
    }


    if (castleInside) {

      gsap.set(castleInside, {
        yPercent: 70,
        force3D: true
      });
    }


    if (cat) {

      gsap.set(cat, {
        yPercent: 90,
        force3D: true
      });
    }


    gsap.set(home6TallPillar, {
      yPercent: 70,
      force3D: true
    });


    // ========================================================
    // SHARED BUILD TRIGGER
    //
    // KEEP SAME TIMING:
    // top 100% → top 60%
    // ========================================================

function makeBuildTrigger() {

  if (isSafari && section && city) {

    return {

      trigger: section,

      start:
        safariStart(
          home6TallPillar,
          0.95
        ),

      end:
        safariStart(
          home6TallPillar,
          0.40
        ),

      scrub: 0.6,

      invalidateOnRefresh: true
    };

  }


  return {

    trigger:
      home6TallPillar,

    start:
      "top 95%",

    end:
      "top 40%",

    scrub: 0.6,

    invalidateOnRefresh: true
  };
}


    // ========================================================
    // NORMAL CASTLE LAYERS
    // ========================================================

    if (home6BuildLayers.length) {

      gsap.to(
        home6BuildLayers,
        {
          yPercent: 0,

          ease: "power2.out",

          force3D: true,

          scrollTrigger:
            makeBuildTrigger()
        }
      );
    }


    // ========================================================
    // CAMEL
    // ========================================================

    if (camel) {

      gsap.to(
        camel,
        {
          yPercent: 0,

          ease: "power2.out",

          force3D: true,

          scrollTrigger:
            makeBuildTrigger()
        }
      );
    }


    // ========================================================
    // MONSTER
    // ========================================================

    if (monster) {

      gsap.to(
        monster,
        {
          yPercent: 0,

          ease: "power2.out",

          force3D: true,

          scrollTrigger:
            makeBuildTrigger()
        }
      );
    }


    // ========================================================
    // HOME 6 MONSTER — BOTTOM POSITION THROUGH SECTION SCROLL
    // Independent of the existing castle-build yPercent reveal.
    // ========================================================
    if (monster && section) {
      gsap.fromTo(monster,
        { bottom: "56px" },
        {
          bottom: "104px",
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
            invalidateOnRefresh: true
          }
        }
      );
    }

    // ========================================================
    // ROCKET
    // ========================================================

    if (rocket) {

      gsap.to(
        rocket,
        {
          yPercent: 0,

          ease: "power2.out",

          force3D: true,

          scrollTrigger:
            makeBuildTrigger()
        }
      );
    }


    // ========================================================
    // GIRAFFE
    // ========================================================
    
    if (giraffe) {
    
      gsap.to(
        giraffe,
        {
          yPercent: 0,
    
          ease: "power2.out",
    
          force3D: true,
    
          scrollTrigger:
            makeBuildTrigger()
        }
      );
    }
        

    // ========================================================
    // CAT
    // ========================================================

    if (cat) {

      gsap.to(
        cat,
        {
          yPercent: 0,

          ease: "power2.out",

          force3D: true,

          scrollTrigger:
            makeBuildTrigger()
        }
      );
    }


    // ========================================================
    // CASTLE INSIDE
    // ========================================================

    if (castleInside) {

      gsap.to(
        castleInside,
        {
          yPercent: 0,

          ease: "power2.out",

          force3D: true,

          scrollTrigger:
            makeBuildTrigger()
        }
      );
    }


    // ========================================================
    // TALL PILLAR
    // ========================================================

    gsap.to(
      home6TallPillar,
      {
        yPercent: 0,

        ease: "power2.out",

        force3D: true,

        scrollTrigger:
          makeBuildTrigger()
      }
    );


    // ========================================================
    // EMPEROR — STAGE 1
    //
    // top 100% → top 60%
    //
    // +45% → Webflow position
    // ========================================================

    if (emperor) {

      gsap.to(
        emperor,
        {
          yPercent: 0,

          ease: "power2.out",

          force3D: true,

          scrollTrigger:
            makeBuildTrigger()
        }
      );
    }


// ========================================================
// EMPEROR — STAGE 2
//
// STRUCTURE:
//
// .home6_emperor
//   └── .home6_emperor_rocket
//         └── .home6_emperor_float
//
// emperorRocket = actual flight
// emperorFloat  = subtle floating only
// ========================================================

var emperorFloat =
  q(".home6_emperor_float");


if (emperorRocket) {

  var emperorFloatTween = null;


  // ======================================================
  // FLIGHT DESTINATION
  //
  // OLD = 10vh above viewport
  // NEW = 35vh above viewport
  //
  // This prevents mobile from seeing Emperor
  // awkwardly stop near the top edge.
  // ======================================================

  function emperorFlightDistance() {
  
    var cityScale =
      getCityScale();
  
    return -(
      getRealViewportHeight() *
      0.08 /
      cityScale
    );
  
  }

  // ======================================================
  // STOP FLOAT
  // ======================================================

function stopEmperorFloat(instant) {

  if (emperorFloatTween) {

    emperorFloatTween.kill();

    emperorFloatTween = null;

  }


  if (!emperorFloat) return;


  gsap.killTweensOf(
    emperorFloat
  );


  // Normal cleanup / before launching
  if (instant) {

    gsap.set(
      emperorFloat,
      {
        y: 0,
        force3D: true
      }
    );

  }

}


  // ======================================================
  // START FLOAT
  //
  // Inner wrapper only.
  // Does NOT interfere with emperorRocket flight.
  // ======================================================

  function startEmperorFloat() {

    if (!emperorFloat) return;


    stopEmperorFloat();


emperorFloatTween =
  gsap.to(
    emperorFloat,
    {
      // IMPORTANT:
      // First floating movement goes DOWN,
      // so it continues naturally after the upward flight.
      y: 12,

      duration: 0.75,

      ease: "sine.inOut",

      repeat: -1,

      yoyo: true,

      force3D: true
    }
  );

  }


  // ======================================================
  // INITIAL FLOAT STATE
  // ======================================================

  if (emperorFloat) {

    gsap.set(
      emperorFloat,
      {
        y: 0,
        force3D: true
      }
    );

  }


  // ======================================================
  // LAUNCH TRIGGER
  // ======================================================

  var emperorLaunchTrigger = {

    trigger:
      (isSafari && section && city)
        ? section
        : home6TallPillar,


    start:
      (isSafari && section && city)

        ? safariStart(
            home6TallPillar,
            0.40
          )

        : "top 40%",


    invalidateOnRefresh: true,


    // ====================================================
    // SCROLL DOWN
    //
    // 1. Stop any old float
    // 2. Fly upward
    // 3. Ease gently into final position
    // 4. Start subtle floating
    // ====================================================

    onEnter: function() {
    
      stopEmperorFloat(true);


      gsap.killTweensOf(
        emperorRocket
      );

      // Start the cat movement together with the Emperor's rise.
      if (cat) {
        gsap.to(cat, {
          right: "48.6%",
          duration: 0.6,
          ease: "power2.inOut",
          overwrite: "auto"
        });
      }

      gsap.to(
        emperorRocket,
        {
          y:
            emperorFlightDistance,

          duration: 1.5,

          ease: "power2.inOut",

          force3D: true,

          overwrite: true,


          onComplete: function() {

            startEmperorFloat();


          }

        }
      );

    },


    // ====================================================
    // SCROLL UP
    //
    // Stop float first,
    // then return Emperor to Webflow position.
    // ====================================================

onLeaveBack: function() {

  // Restore the cat's original horizontal position on reverse scroll.
  if (cat) {
    gsap.to(cat, {
      right: "47.6%",
      duration: 0.6,
      ease: "power2.inOut",
      overwrite: "auto"
    });
  }

  // Stop floating WITHOUT snapping float wrapper to y:0
  stopEmperorFloat(false);


  gsap.killTweensOf(
    emperorRocket
  );


  // Smoothly absorb whatever floating offset
  // Emperor currently has while he starts descending.
  if (emperorFloat) {

    gsap.to(
      emperorFloat,
      {
        y: 0,

        duration: 0.25,

        ease: "power2.out",

        force3D: true,

        overwrite: true
      }
    );

  }


  // Emperor returns to Webflow position
  // at the same time.
  gsap.to(
    emperorRocket,
    {
      y: 0,

      duration: 1.4,

      ease: "power2.inOut",

      force3D: true,

      overwrite: true

    }
  );

}

  };


  ScrollTrigger.create(
    emperorLaunchTrigger
  );

  // Pyramid rises at a slightly later SCROLL POSITION than the cat.
  // Cat / Emperor: top 40%; pyramid: top 35% (5vh farther down-scroll).
  // Its independent trigger also reverses at its own threshold.
  if (pyramid) {
    ScrollTrigger.create({
      trigger: emperorLaunchTrigger.trigger,
      start: (isSafari && section && city)
        ? safariStart(home6TallPillar, 0.35)
        : "top 35%",
      invalidateOnRefresh: true,
      onEnter: function() {
        gsap.to(pyramid, {
          bottom: "281px",
          duration: 0.6,
          ease: "power3.out",
          overwrite: "auto"
        });
      },
      onLeaveBack: function() {
        gsap.to(pyramid, {
          bottom: "250px",
          duration: 0.6,
          ease: "power2.inOut",
          overwrite: "auto"
        });
      }
    });
  }

}
// CLOSE: if (home6TallPillar)
}


// ==========================================================
// UFO + LIGHT TRANSITION
//
// FLOW:
//
// DOWN:
// UFO starts when weirdSun reaches viewport
// UFO slowly travels down
// UFO reaches Webflow final position
// small settling delay
// LIGHT ON
//
// UP:
// LIGHT OFF immediately
// UFO then travels back upward
// ==========================================================

var home6UFO = q(".home6_ufo");
var home6Light = q(".home6_light");
var ufoLightBottom = q(".ufo_lightbottom");

var home7LightBlur = q(".home7_lightblur");
var home7WhiteCover = q(".home7_whitecover");

var lightsAreOn = false;

var home6LightOnDelay = null;


// ==========================================================
// UFO HIDDEN POSITION
// ==========================================================

// ==========================================================
// UFO / SUN START ALIGNMENT — DESIGN-SPACE GAP
//
// This is a FIXED vertical gap in Home6 City design pixels,
// not a percentage of the distance to the UFO's final position.
// Increase to start LOWER beneath the Sun; decrease for HIGHER.
// Adjust only this value to fine-tune the visual art direction.
// CSS zoom / City Scaling applies to both positions and this gap.
// ==========================================================
var HOME6_UFO_SUN_GAP = 150;

function getHome6UFOHiddenY() {

  if (!home6UFO || !weirdSun || !city) {
    return -getRealViewportHeight() * 1.15;
  }

  // Both offsets are in the same unscaled Home6 City coordinates.
  // GSAP y on a child of the zoomed City uses these local CSS pixels;
  // do NOT multiply by getCityScale() again (double scaling).
  var ufoTop = getOffsetInsideCity(home6UFO);
  var sunTop = getOffsetInsideCity(weirdSun);

  // Final UFO position remains its Webflow placement (y: 0).
  // Initial UFO top is Sun anchor + fixed intentional gap.
  // This no longer depends on the height of .home_section6_city.
  return sunTop - ufoTop + HOME6_UFO_SUN_GAP;

}


// ==========================================================
// INITIAL STATES
// ==========================================================



  
if (home6UFO) {

  gsap.set(
    home6UFO,
    {
      y: getHome6UFOHiddenY(),

      visibility: "hidden",
      opacity: 0,
      filter: "blur(5px)",

      force3D: true
    }
  );

}


if (home6Light) {

  gsap.set(
    home6Light,
    {
      scaleX: 0,

      transformOrigin: "50% 0%",

      visibility: "hidden",
      opacity: 0,

      force3D: true
    }
  );

}


if (home7LightBlur) {

  gsap.set(
    home7LightBlur,
    {
      scaleX: 0,

      transformOrigin: "50% 0%",

      visibility: "hidden",
      opacity: 0,

      force3D: true
    }
  );

}


if (home7WhiteCover) {

  gsap.set(
    home7WhiteCover,
    {
      opacity: 1
    }
  );

}


if (ufoLightBottom) {
  gsap.set(ufoLightBottom, {
    opacity: 0
  });
}


// ==========================================================
// LIGHT ON
// ==========================================================

function turnHome6LightsOn() {

  if (lightsAreOn) return;

  lightsAreOn = true;


  if (home6Light) {
    gsap.killTweensOf(home6Light);
  }

  if (home7LightBlur) {
    gsap.killTweensOf(home7LightBlur);
  }

  if (home7WhiteCover) {
    gsap.killTweensOf(home7WhiteCover);
  }


  var lightTL =
    gsap.timeline();

  if (ufoLightBottom) {

  gsap.killTweensOf(ufoLightBottom);

  lightTL.to(
    ufoLightBottom,
    {
      opacity: 1,
      duration: 0.3,
      ease: "power2.out"
    },
    0
  );

}


  if (home6Light) {

    lightTL.set(
      home6Light,
      {
        scaleX: 0,

        visibility: "visible",
        opacity: 0.9
      },
      0
    );


    lightTL.to(
      home6Light,
      {
        scaleX: 1,

        duration: 0.22,

        ease: "power2.out",

        force3D: true
      },
      0
    );

  }


  if (home7LightBlur) {

    lightTL.set(
      home7LightBlur,
      {
        scaleX: 0,

        visibility: "visible",
        opacity: 1
      },
      0
    );


    lightTL.to(
      home7LightBlur,
      {
        scaleX: 1,

        duration: 0.22,

        ease: "power2.out",

        force3D: true
      },
      0
    );

  }


  if (home7WhiteCover) {

    lightTL.to(
      home7WhiteCover,
      {
        opacity: 0,

        duration: 0.75,

        ease: "power3.out"
      },
      0
    );

  }

}


// ==========================================================
// LIGHT OFF
// ==========================================================

function turnHome6LightsOff() {

  if (!lightsAreOn) return;

  lightsAreOn = false;

  if (ufoLightBottom) {

    gsap.killTweensOf(ufoLightBottom);
  
    gsap.to(ufoLightBottom, {
      opacity: 0,
      duration: 0.16,
      ease: "power2.in"
    });
  
  }


  if (home6Light) {

    gsap.killTweensOf(home6Light);

    gsap.to(
      home6Light,
      {
        scaleX: 0,
        opacity: 0,

        duration: 0.16,

        ease: "power2.in",

        force3D: true,

        onComplete: function() {

          if (!lightsAreOn) {

            gsap.set(
              home6Light,
              {
                visibility: "hidden"
              }
            );

          }

        }
      }
    );

  }


  if (home7LightBlur) {

    gsap.killTweensOf(home7LightBlur);

    gsap.to(
      home7LightBlur,
      {
        scaleX: 0,
        opacity: 0,

        duration: 0.16,

        ease: "power2.in",

        force3D: true,

        onComplete: function() {

          if (!lightsAreOn) {

            gsap.set(
              home7LightBlur,
              {
                visibility: "hidden"
              }
            );

          }

        }
      }
    );

  }


  if (home7WhiteCover) {

    gsap.killTweensOf(
      home7WhiteCover
    );

    gsap.to(
      home7WhiteCover,
      {
        opacity: 1,

        duration: 0.20,

        ease: "power2.out"
      }
    );

  }

}


// ==========================================================
// CANCEL PENDING LIGHT
// ==========================================================

function cancelHome6LightDelay() {

  if (!home6LightOnDelay) return;

  home6LightOnDelay.kill();

  home6LightOnDelay = null;

}


// ==========================================================
// UFO LONG SCROLL DESCENT
//
// IMPORTANT:
//
// Keep the movement you said is already correct.
//
// START:
// weirdSun top 90%
//
// END:
// tallPillar top -5%
//
// scrub 0.35 gives the UFO a small amount of settling
// without changing the actual travel range.
// ==========================================================

if (
  weirdSun &&
  home6TallPillar &&
  home6UFO
) {

  gsap.fromTo(
    home6UFO,

    {
      y: getHome6UFOHiddenY()
    },

    {
      y: 0,

      ease: "none",

      force3D: true,

      immediateRender: false,


      scrollTrigger: {

        trigger:
          (isSafari && section && city)
            ? section
            : weirdSun,


        // ==================================================
        // UFO START
        // ==================================================

        start:
          (isSafari && section && city)

            ? safariStart(
                weirdSun,
                0.45
              )

            : "top 45%",


        // ==================================================
        // UFO FINAL WEBFLOW POSITION
        // ==================================================

        endTrigger:
          ((isSafari || window.matchMedia("(max-width: 767px)").matches) && section && city)
            ? section
            : home6TallPillar,


        // MOBILE FIX: use the UFO's own FINAL Webflow position as the anchor.
        // Its CSS zoomed City position is calculated from layout offsets,
        // not its animated getBoundingClientRect() (which would move).
        // At completion the UFO's final top sits at 65% of viewport height.
        // Desktop keeps its existing tall-pillar timing unchanged.
        end: function() {
          if (window.matchMedia("(max-width: 767px)").matches && section && city) {
            return safariStart(home6UFO, 0.65)();
          }
          return (isSafari && section && city)
            ? safariStart(home6TallPillar, 0.30)()
            : "top 30%";
        },


        // ==================================================
        // SMALL SMOOTH SETTLING
        // ==================================================

        scrub: 0.35,


        invalidateOnRefresh: true,

        onUpdate: function(self) {

        // First 20% of UFO journey = reveal.
        // UFO blur
        var revealProgress =
          Math.min(
            1,
            self.progress / 0.2
          );
      
      
        // Smooth ease-out.
        var reveal =
          1 -
          Math.pow(
            1 - revealProgress,
            2
          );
      
      
        gsap.set(
          home6UFO,
          {
            opacity: reveal,
      
            filter:
              "blur(" +
              (
                5 *
                (1 - reveal)
              ) +
              "px)"
          }
        );
      
      },


        // ==================================================
        // UFO ENTERS
        // ==================================================

        onEnter: function() {

          cancelHome6LightDelay();

          turnHome6LightsOff();


          gsap.set(
            home6UFO,
            {
              visibility: "visible",
            }
          );

        },


        // ==================================================
        // UFO HAS REACHED THE END OF ITS SCROLL RANGE
        //
        // Wait for scrub smoothing to settle,
        // THEN turn light on.
        // ==================================================

        onLeave: function() {

          cancelHome6LightDelay();


          // Wait for the actual UFO transform to settle at y:0.
          // A fixed 0.12s delay can turn lights on while scrub:0.35
          // is still visibly moving the UFO.
          function lightWhenUFOSettled() {
            home6LightOnDelay = null;
            if (this.progress < 0.999) return;
            if (Math.abs(Number(gsap.getProperty(home6UFO, "y")) || 0) > 1) {
              home6LightOnDelay = gsap.delayedCall(0.06, lightWhenUFOSettled.bind(this));
              return;
            }
            turnHome6LightsOn();
          }
          home6LightOnDelay = gsap.delayedCall(0.12, lightWhenUFOSettled.bind(this));

        },


        // ==================================================
        // REVERSE
        //
        // FIRST:
        // cancel pending light + turn light OFF
        //
        // THEN:
        // scrubbed UFO starts travelling upward.
        // ==================================================

        onEnterBack: function() {

          cancelHome6LightDelay();

          turnHome6LightsOff();


          gsap.set(
            home6UFO,
            {
              visibility: "visible",
              opacity: 1
            }
          );

        },


        // ==================================================
        // UFO COMPLETELY LEAVES ABOVE HOME6
        // ==================================================

        onLeaveBack: function() {

          cancelHome6LightDelay();

          turnHome6LightsOff();


        gsap.set(
          home6UFO,
          {
            visibility: "visible", // remain measurable for trailing clones after fading
            opacity: 0,
            filter: "blur(5px)"
          }
        );

        }

      }

    }
  );

}



  // ==========================================================
  // HOME 6 UFO — SIX DELAYED SILHOUETTE CLONES (V6 LOCAL-SPACE FIX)
  // ==========================================================
  // Each clone samples the REAL on-screen UFO path at a fixed time delay.
  // No velocity projection, no directional repositioning, no flying ghosts.
  // Clones start coincident with UFO and become visible only in motion.
  (function initHome6UFOTrailV15() {
    if (!home6UFO || home6UFO.dataset.ttAfterimageInstalled === "1") return;
    var picture = home6UFO.matches("img") ? home6UFO : home6UFO.querySelector("img");
    if (!picture || !home6UFO.parentElement) return;
    home6UFO.dataset.ttAfterimageInstalled = "1";

    // V15: single source of truth is the UFO's actual GSAP Y.
    // No exit timer, no fabricated return trajectory, no onLeaveBack event.
    var COUNT = 7;
    var DELAY_MS = 30;
    var PALETTE = ["#f0ff00", "#d79eff", "#6861ff"];
    var PALETTE_STEP_MS = 80;
    var COLOR_EASING = false; // false = instant color switch; true = smooth transition
    var COLOR_EASE_POWER = 1; // 1 = linear, 2 = ease-in-out (smoothstep below)
    var CLONE_HUE_OFFSET_STEPS = 0;
    var FADE_IN_MS = 45;
    var FADE_OUT_MS = 75;
    var MOVE_THRESHOLD = 0.35;
    // Last 18% of the UFO's actual return path collapses the history gap.
    // At the exact start all clones coincide with the UFO and fade to zero.
    var START_COLLAPSE_FRACTION = 0.18;

    var parent = home6UFO.parentElement;
    if (getComputedStyle(parent).position === "static") parent.style.position = "relative";
    var originalZ = getComputedStyle(home6UFO).zIndex;
    var baseZ = originalZ !== "auto" && isFinite(parseInt(originalZ, 10))
      ? parseInt(originalZ, 10) : 1;
    if (getComputedStyle(home6UFO).position === "static") home6UFO.style.position = "relative";
    home6UFO.style.zIndex = String(baseZ + 1);

    var layer = document.createElement("div");
    layer.setAttribute("data-tt-home6-ufo-afterimages", "clones-v15");
    Object.assign(layer.style, {
      position: "absolute", left: "0", top: "0", width: "0", height: "0",
      overflow: "visible", pointerEvents: "none", zIndex: "-100",
      visibility: "hidden"
    });
    parent.insertBefore(layer, home6UFO);

    var ghosts = [];
    for (var i = 0; i < COUNT; i++) {
      var ghost = document.createElement("div");
      Object.assign(ghost.style, {
        position: "absolute", left: "0", top: "0", width: "1px", height: "1px",
        backgroundColor: PALETTE[0], opacity: "0", pointerEvents: "none",
        maskRepeat: "no-repeat", webkitMaskRepeat: "no-repeat",
        maskSize: "100% 100%", webkitMaskSize: "100% 100%",
        transformOrigin: "top left", willChange: "transform,opacity"
      });
      layer.appendChild(ghost);
      ghosts.push(ghost);
    }

    var history = [];
    var last = null;
    var lastTime = 0;
    var visibleSince = 0;
    var strength = 0;
    var maskSource = "";
    var lastPaletteStep = -1;

    function sampleAt(t) {
      if (!history.length) return null;
      if (t <= history[0].t) return history[0];
      var end = history[history.length - 1];
      if (t >= end.t) return end;
      for (var j = history.length - 1; j > 0; j--) {
        var a = history[j - 1], b = history[j];
        if (a.t <= t) {
          var f = (t - a.t) / Math.max(1, b.t - a.t);
          return {x:a.x+(b.x-a.x)*f, y:a.y+(b.y-a.y)*f,
            w:a.w+(b.w-a.w)*f, h:a.h+(b.h-a.h)*f};
        }
      }
      return history[0];
    }

    function frame(now) {
      var dt = lastTime ? Math.min(50, now-lastTime) : 16.7;
      lastTime = now;
      var url = picture.currentSrc || picture.src;
      if (url && url !== maskSource) {
        maskSource = url;
        var mask = 'url("' + url.replace(/"/g,"%22") + '")';
        ghosts.forEach(function(g) {
          g.style.maskImage = mask;
          g.style.webkitMaskImage = mask;
        });
      }
      var r = picture.getBoundingClientRect();
      var pr = parent.getBoundingClientRect();
      var sx = parent.offsetWidth ? pr.width/parent.offsetWidth : 1;
      var sy = parent.offsetHeight ? pr.height/parent.offsetHeight : 1;
      if (!isFinite(sx) || Math.abs(sx)<0.001) sx=1;
      if (!isFinite(sy) || Math.abs(sy)<0.001) sy=1;
      var p = {t:now, x:(r.left-pr.left)/sx, y:(r.top-pr.top)/sy,
        w:r.width/Math.abs(sx), h:r.height/Math.abs(sy)};

      // Derive the start proximity from GSAP's ACTUAL current Y every frame.
      // This remains valid after the UFO's opacity is set to zero.
      var startY = getHome6UFOHiddenY();
      var currentY = Number(gsap.getProperty(home6UFO,"y")) || 0;
      var progress = Math.abs(startY)>0.001
        ? Math.max(0,Math.min(1,1-currentY/startY)) : 0;
      var collapse = Math.max(0,Math.min(1,progress/START_COLLAPSE_FRACTION));
      collapse = collapse*collapse*(3-2*collapse); // smooth spatial convergence
      var style = getComputedStyle(home6UFO);
      var inView = !!maskSource && r.width>0 && r.height>0 &&
        r.bottom>0 && r.top<getRealViewportHeight() &&
        r.right>0 && r.left<getRealViewportWidth();
      var active = inView && style.visibility!=="hidden" && progress>0.0001;

      var palettePosition = now / Math.max(1, PALETTE_STEP_MS);
      var paletteStep = Math.floor(palettePosition);
      if (COLOR_EASING) {
        // Interpolate between consecutive palette entries (no GSAP tweens).
        // Uses the same palette and per-clone offset as instant mode.
        var mix = palettePosition - paletteStep;
        if (COLOR_EASE_POWER === 2) mix = mix * mix * (3 - 2 * mix);
        ghosts.forEach(function(g, i) {
          var index = (paletteStep + i * CLONE_HUE_OFFSET_STEPS) % PALETTE.length;
          var next = (index + 1) % PALETTE.length;
          var from = PALETTE[index].replace('#', '');
          var to = PALETTE[next].replace('#', '');
          var r1 = parseInt(from.slice(0,2),16), g1 = parseInt(from.slice(2,4),16), b1 = parseInt(from.slice(4,6),16);
          var r2 = parseInt(to.slice(0,2),16), g2 = parseInt(to.slice(2,4),16), b2 = parseInt(to.slice(4,6),16);
          g.style.backgroundColor = 'rgb(' +
            Math.round(r1 + (r2-r1)*mix) + ',' +
            Math.round(g1 + (g2-g1)*mix) + ',' +
            Math.round(b1 + (b2-b1)*mix) + ')';
        });
      } else if (paletteStep !== lastPaletteStep) {
        lastPaletteStep = paletteStep;
        ghosts.forEach(function(g,i) {
          g.style.backgroundColor =
            PALETTE[(paletteStep+i*CLONE_HUE_OFFSET_STEPS)%PALETTE.length];
        });
      }

      if (!active) {
        history.length=0; last=null; visibleSince=0; strength=0;
        layer.style.visibility="hidden";
        requestAnimationFrame(frame);
        return;
      }
      if (!visibleSince) visibleSince=now;
      history.push(p);
      while(history.length>2 && history[1].t<now-COUNT*DELAY_MS-80)
        history.shift();

      var distance=last ? Math.hypot(p.x-last.x,p.y-last.y) : 0;
      last=p;
      var moving=now-visibleSince>COUNT*DELAY_MS+40 &&
        distance>MOVE_THRESHOLD;
      var target=moving?1:0;
      var tau=target>strength?FADE_IN_MS:FADE_OUT_MS;
      strength+=(target-strength)*(1-Math.exp(-dt/tau));
      if (strength<0.001) strength=0;
      var effectiveStrength=strength*collapse;
      layer.style.visibility=effectiveStrength>0.001?"visible":"hidden";

      if (effectiveStrength>0.001) {
        ghosts.forEach(function(g,i) {
          var old=sampleAt(now-(i+1)*DELAY_MS)||p;
          // Normal travel: delayed local-space positions, exactly as V7.
          // Near start: converge smoothly on the UFO's CURRENT actual position.
          var x=p.x+(old.x-p.x)*collapse;
          var y=p.y+(old.y-p.y)*collapse;
          var w=p.w+(old.w-p.w)*collapse;
          var h=p.h+(old.h-p.h)*collapse;
          g.style.opacity=(0.85*Math.pow(1-i/COUNT,1.35)*
            effectiveStrength).toFixed(3);
          g.style.width=w+"px"; g.style.height=h+"px";
          g.style.transform="translate3d("+x+"px,"+y+"px,0)";
        });
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  })();

  requestAnimationFrame(
    function() {

      requestAnimationFrame(
        function() {

          ScrollTrigger.refresh();
        }
      );
    }
  );

}
  


// =============================================================
// HOMEPAGE SECTION 7
// MASTER-SPACE VERSION
// =============================================================
function initHomeSection7() {

  var section = q(".home_section7");

  if (!section || !gsap || !ScrollTrigger) return;


  // ============================================================
  // MASTER DESIGN SIZE
  //
  // Original working viewport:
  // 2195 × ~1100 CSS px
  //
  // 1vw ≈ 21.95px
  // 1vh ≈ 11px
  // ============================================================

  var MASTER_VW = 21.95;
  var MASTER_VH = 11;


  // ============================================================
  // ELEMENTS
  // ============================================================

  var universe   = q(".home7_universe");

  var balloon    = q(".home7_balloon");
  var moon       = q(".home7_moon");
  var satellite  = q(".home7_satellite");

  var dino2Arm   = q(".home7_dino2_arm");

  var fish1      = q(".home7_fishhero1");
  var fish2      = q(".home7_fishhero2");

  var longneck   = q(".home7_longneck");
  var heroBear   = q(".home7_herobear");
  var rocket     = q(".home7_rocket");


  // ============================================================
  // IMPORTANT
  //
  // home7_whitecover
  // home7_lightblur
  //
  // are controlled entirely by HOME 6.
  // ============================================================


  // ============================================================
  // MASTER SCROLL
  // ============================================================

  ScrollTrigger.create({

    trigger: section,

    start: "top bottom",
    end: "bottom top",

    invalidateOnRefresh: true,


    onUpdate: function(self) {

      var p = self.progress;


      // ========================================================
      // UNIVERSE
      // ========================================================

      if (universe) {

        gsap.set(universe, {

          y:
            -35 *
            MASTER_VH *
            p,

          force3D: true

        });

      }


      // ========================================================
      // BALLOON
      // ========================================================

      if (balloon) {

        gsap.set(balloon, {

          x:
            10 *
            MASTER_VW *
            p,

          y:
            30 *
            MASTER_VH *
            p,

          force3D: true

        });

      }
      

      // ========================================================
      // DINO 2 ARM
      // -26deg → 18deg
      // Same scroll progress as balloon
      // ========================================================
      
      if (dino2Arm) {
      
        gsap.set(dino2Arm, {
      
          rotation:
            -90 +
            (110 * p),
      
          force3D: true
      
        });
      
      }


      // ========================================================
      // MOON
      // ========================================================

      if (moon) {

        gsap.set(moon, {

          x:
            -11 *
            MASTER_VW *
            p,

          y:
            33 *
            MASTER_VH *
            p,

          force3D: true

        });

      }


      // ========================================================
      // SATELLITE
      // ========================================================

      if (satellite) {

        gsap.set(satellite, {

          x:
            -22 *
            MASTER_VW *
            p,

          y:
            -32 *
            MASTER_VH *
            p,

          force3D: true

        });

      }


      // ========================================================
      // FISH 1
      // ========================================================

      if (fish1) {

        gsap.set(fish1, {

          x:
            -18 *
            MASTER_VW *
            p,

          y:
            -55 *
            MASTER_VH *
            p,

          rotation:
            -3 *
            p,

          force3D: true

        });

      }


      // ========================================================
      // FISH 2
      // ========================================================

      if (fish2) {

        gsap.set(fish2, {

          x:
            -38 *
            MASTER_VW *
            p,

          y:
            -116 *
            MASTER_VH *
            p,

          rotation:
            -4 *
            p,

          force3D: true

        });

      }


      // ========================================================
      // LONGNECK
      // ========================================================

      if (longneck) {

        gsap.set(longneck, {

          x:
            -10 *
            MASTER_VW *
            p,

          y:
            -32 *
            MASTER_VH *
            p,

          rotation:
            15 *
            p,

          force3D: true

        });

      }


      // ========================================================
      // HERO BEAR
      // ========================================================

      if (heroBear) {

        gsap.set(heroBear, {

          x: 0,

          y:
            110 *
            MASTER_VH *
            p,

          force3D: true

        });

      }


      // ========================================================
      // ROCKET
      // ========================================================

      if (rocket) {

        gsap.set(rocket, {

          x: 0,

          y:
            -135 *
            MASTER_VH *
            p,

          force3D: true

        });

      }

    }

  });


  requestAnimationFrame(function() {

    ScrollTrigger.refresh();

  });

}




  

// =============================================================
// HOMEPAGE SECTION 8
// =============================================================
function initHomeSection8() {

  var section = q(".home_section8");

  if (!section || !gsap || !ScrollTrigger) return;


  // -----------------------------------------------------------
  // SCROLL DOWNWARD MOVEMENT
  // -----------------------------------------------------------

  var movers = [

    { sel: ".home8_crystal",  y: 120 },
    { sel: ".home8_bear",     y: 130, x: 30, r: 11 },

    { sel: ".home8_mount3",   y: 130 },

    { sel: ".home8_ball",     y: 110 },
    { sel: ".home8_tree2",    y: 100 },
    { sel: ".home8_tree3",    y: 100 },

    { sel: ".home8_guy1",     y: 80 },
    { sel: ".home8_guy2",     y: 75 },

    { sel: ".home8_dinosaur", y: 50 }

  ];


  movers.forEach(function(item) {

    var el = q(item.sel);

    if (!el) return;


    gsap.fromTo(
      el,

      {
        x: 0,
        y: 0,
        rotation: 0
      },

      {
        x: item.x || 0,
        y: item.y,
        rotation: item.r || 0,

        ease: "none",
        force3D: true,

        scrollTrigger: {
          trigger: section,

          start: "top bottom",
          end: "bottom top",

          scrub: 1,

          invalidateOnRefresh: true
        }
      }
    );

  });


  requestAnimationFrame(function() {
    ScrollTrigger.refresh();
  });

} // END initHomeSection8


// =============================================================
// HOMEPAGE SECTION 9
// =============================================================
function initHomeSection9() {

  var section = q(".home_section9");

  if (!section || !gsap || !ScrollTrigger) return;


  // ==========================================================
  // HOME 9 — DEPTH / PARALLAX
  // ==========================================================

  var movers = [

    // FASTEST UP
    { sel: ".home9_yellow", y: -180 },

    // UP — slightly slower than yellow
    { sel: ".home9_tree1",  y: -130 },
    { sel: ".home9_tree2",  y: -130 },

    // UP — subtle
    { sel: ".home9_mount",  y: -50 },

    // DOWN — appears to move slower than normal
    { sel: ".home9_black",  y: 60 },

    // DOWN — even less movement
    { sel: ".home9_flower", y: 50 }

  ];


  movers.forEach(function(item) {

    var el = q(item.sel);

    if (!el) return;


    gsap.fromTo(
      el,

      {
        y: 0
      },

      {
        y: item.y,

        ease: "none",
        force3D: true,

        scrollTrigger: {
          trigger: section,

          start: "top bottom",
          end: "bottom top",

          scrub: 1,

          invalidateOnRefresh: true
        }
      }
    );

  });




  




  // ==========================================================
  // HOME 9 — INTERACTIVE FIREFLIES V5
  // Mouse + mobile touch + adjustable glow
  // ==========================================================

  var fireflyField =
    q(".home9_fireflies") ||
    q(".home_fireflies");

  if (fireflyField && !fireflyField.dataset.firefliesInitialized) {

    fireflyField.dataset.firefliesInitialized = "1";

    // ========================================================
    // SETTINGS
    // ========================================================

    // Population
    var FIREFLY_COUNT_DESKTOP = 50;
    var FIREFLY_COUNT_MOBILE = 35;
    
    var FIREFLY_COUNT = isMobile
      ? FIREFLY_COUNT_MOBILE
      : FIREFLY_COUNT_DESKTOP;

    // Appearance
    var FIREFLY_MIN_SIZE = 2;
    var FIREFLY_MAX_SIZE = 6;
    var FIREFLY_COLOR = "#efff5b";

    // --------------------------------------------------------
    // OUTER GLOW CONTROLS
    // --------------------------------------------------------

    // 0 = no glow, 0.7 = current glow, 1 = original glow
    var GLOW_STRENGTH = 0;

    // 0.5 = half radius, 1 = current, 2 = double radius
    var GLOW_SIZE = 0;

    // --------------------------------------------------------
    // IDLE MOVEMENT
    // --------------------------------------------------------

    var WANDER_X = 100;
    var WANDER_Y = 80;

    var WANDER_MIN_DURATION = 10;
    var WANDER_MAX_DURATION = 15;

    // Upward movement in pixels per second
    var RISE_MIN_SPEED = 0;
    var RISE_MAX_SPEED = 1;

    // --------------------------------------------------------
    // LIFE CYCLE
    // --------------------------------------------------------

    var LIFE_MIN = 1;
    var LIFE_MAX = 20;

    var SPAWN_FADE_DURATION = 0.6;
    var DEATH_FADE = 0.6;

    var RESPAWN_MIN = 1;
    var RESPAWN_MAX = 3;

    // --------------------------------------------------------
    // MOUSE / TOUCH ESCAPE
    // --------------------------------------------------------

    var MOUSE_RADIUS = 85;
    var FLEE_DISTANCE = 55;
    var FLEE_DURATION = 1;

    // --------------------------------------------------------
    // SPAWN DISTRIBUTION
    // --------------------------------------------------------

    // 75% chance of spawning in center 50% of width
    var CENTER_SPAWN_CHANCE = 0.75;

    var fireflies = [];

    // ========================================================
    // HELPERS
    // ========================================================

    function random(min, max) {
      return min + Math.random() * (max - min);
    }

    function randomSpawnX() {

      if (Math.random() < CENTER_SPAWN_CHANCE) {
        return random(25, 75);
      }

      return Math.random() < 0.5
        ? random(5, 25)
        : random(75, 95);
    }

    // ========================================================
    // GLOW GENERATOR
    // ========================================================

function getFireflyGlow(fireflySize) {

  var strength = Math.max(0, GLOW_STRENGTH);

  // 5px firefly = current glow size
  // 2px firefly = 40% of current glow size
  var scale = (fireflySize / 5) * GLOW_SIZE;

  var innerOpacity = Math.min(1, 0.85 * strength);
  var outerOpacity = Math.min(1, 0.25 * strength);

  return (
    "0 0 " + (2 * scale) + "px " +
    (1 * scale) + "px rgba(239,255,91," +
    innerOpacity + "), " +

    "0 0 " + (5 * scale) + "px " +
    (2 * scale) + "px rgba(239,255,91," +
    outerOpacity + ")"
  );
}
    // ========================================================
    // COMBINED MOVEMENT
    // ========================================================

    function renderMotion(fly) {

      if (!fly.alive || fly.fleeing) return;

      gsap.set(fly.el, {
        x: fly.motion.wanderX,
        y: fly.motion.wanderY + fly.motion.riseY
      });
    }

    // ========================================================
    // RANDOM IDLE WANDERING
    // ========================================================

    function wander(fly) {

      if (!fly.alive || fly.fleeing) return;

      fly.wanderTween = gsap.to(fly.motion, {

        wanderX: random(-WANDER_X, WANDER_X),
        wanderY: random(-WANDER_Y, WANDER_Y),

        duration: random(
          WANDER_MIN_DURATION,
          WANDER_MAX_DURATION
        ),

        ease: "sine.inOut",

        onUpdate: function() {
          renderMotion(fly);
        },

        onComplete: function() {
          wander(fly);
        }
      });
    }

    // ========================================================
    // CONTINUOUS UPWARD DRIFT
    // ========================================================

    function startRising(fly, lifetime) {

      var riseSpeed = random(
        RISE_MIN_SPEED,
        RISE_MAX_SPEED
      );

      fly.riseTween = gsap.to(fly.motion, {

        riseY: -(riseSpeed * lifetime),

        duration: lifetime,
        ease: "none",

        onUpdate: function() {
          renderMotion(fly);
        }
      });
    }

    // ========================================================
    // STOP MOVEMENT
    // ========================================================

    function stopMovement(fly) {

      if (fly.wanderTween) {
        fly.wanderTween.kill();
        fly.wanderTween = null;
      }

      if (fly.riseTween) {
        fly.riseTween.kill();
        fly.riseTween = null;
      }
    }

    // ========================================================
    // RESPAWN
    // ========================================================

    function scheduleRespawn(fly) {

      gsap.delayedCall(
        random(RESPAWN_MIN, RESPAWN_MAX),
        function() {
          spawn(fly);
        }
      );
    }

    // ========================================================
    // DEATH
    // ========================================================

    function die(fly, alreadyHidden) {

      if (!fly.alive) return;

      fly.alive = false;
      fly.fleeing = false;

      if (fly.lifeTimer) {
        fly.lifeTimer.kill();
        fly.lifeTimer = null;
      }

      stopMovement(fly);

      if (fly.fleeTween) {
        fly.fleeTween.kill();
        fly.fleeTween = null;
      }

      gsap.killTweensOf(fly.el);

      // Mouse/touch escape already faded it out
      if (alreadyHidden) {

        gsap.set(fly.el, {
          opacity: 0
        });

        scheduleRespawn(fly);
        return;
      }

      // Natural death
      gsap.to(fly.el, {
        opacity: 0,
        duration: DEATH_FADE,
        ease: "power3.in",
        onComplete: function() {
          scheduleRespawn(fly);
        }
      });
    }

    // ========================================================
    // SPAWN / RESPAWN
    // ========================================================

    function spawn(fly) {

      var size = random(
        FIREFLY_MIN_SIZE,
        FIREFLY_MAX_SIZE
      ) * (isMobile ? 1.2 : 1);

      var lifetime = random(
        LIFE_MIN,
        LIFE_MAX
      );

      // Random position inside Webflow container
      fly.el.style.left = randomSpawnX() + "%";
      fly.el.style.top = random(10, 90) + "%";

      fly.el.style.width = size + "px";
      fly.el.style.height = size + "px";

      fly.el.style.boxShadow = getFireflyGlow(size);

      fly.motion = {
        wanderX: 0,
        wanderY: 0,
        riseY: 0
      };

      fly.alive = true;
      fly.fleeing = false;

      // Start invisible
      gsap.set(fly.el, {
        x: 0,
        y: 0,
        opacity: 0
      });

      // Fade in
      gsap.to(fly.el, {
        opacity: 1,
        duration: SPAWN_FADE_DURATION,
        ease: "power3.out"
      });

      wander(fly);
      startRising(fly, lifetime);

      fly.lifeTimer = gsap.delayedCall(
        lifetime,
        function() {
          die(fly, false);
        }
      );
    }

    // ========================================================
    // CURVED ESCAPE — MOUSE OR FINGER
    // ========================================================

    function flee(fly, pointerX, pointerY) {

      if (!fly.alive || fly.fleeing) return;

      fly.fleeing = true;

      // Escaping replaces natural death
      if (fly.lifeTimer) {
        fly.lifeTimer.kill();
        fly.lifeTimer = null;
      }

      stopMovement(fly);

      gsap.killTweensOf(fly.el, "opacity");

      var rect = fly.el.getBoundingClientRect();

      var cx = rect.left + rect.width / 2;
      var cy = rect.top + rect.height / 2;

      var dx = cx - pointerX;
      var dy = cy - pointerY;

      var length = Math.hypot(dx, dy);

      if (length < 1) {

        var angle = random(0, Math.PI * 2);

        dx = Math.cos(angle);
        dy = Math.sin(angle);

        length = 1;
      }

      dx /= length;
      dy /= length;

      // Compensate for CSS zoom
      var scale = fireflyField.offsetWidth
        ? fireflyField.getBoundingClientRect().width /
          fireflyField.offsetWidth
        : 1;

      if (!isFinite(scale) || scale <= 0) {
        scale = 1;
      }

      var distance = random(
        FLEE_DISTANCE * 0.7,
        FLEE_DISTANCE * 1.3
      ) / scale;

      var startX =
        Number(gsap.getProperty(fly.el, "x")) || 0;

      var startY =
        Number(gsap.getProperty(fly.el, "y")) || 0;

      var startOpacity =
        Number(gsap.getProperty(fly.el, "opacity")) || 0;

      // Perpendicular direction creates curve
      var perpendicularX = -dy;
      var perpendicularY = dx;

      var curve = random(-35, 35) / scale;

      var flight = { progress: 0 };

      fly.fleeTween = gsap.to(flight, {

        progress: 1,
        duration: FLEE_DURATION,
        ease: "power2.out",

        onUpdate: function() {

          var t = flight.progress;

          var bend =
            Math.sin(t * Math.PI) * curve;

          gsap.set(fly.el, {

            x:
              startX +
              dx * distance * t +
              perpendicularX * bend,

            y:
              startY +
              dy * distance * t +
              perpendicularY * bend,

            opacity: startOpacity * (1 - Math.pow(t, 3))
          });
        },

        onComplete: function() {

          fly.fleeTween = null;

          // Mouse/touch escape counts as death
          die(fly, true);
        }
      });
    }

    // ========================================================
    // CREATE FIREFLY POOL
    // ========================================================

    for (var i = 0; i < FIREFLY_COUNT; i++) {

      var dot = document.createElement("div");

      Object.assign(dot.style, {

        position: "absolute",

        borderRadius: "50%",
        background: FIREFLY_COLOR,

        // Glow controlled by aliases above
        boxShadow: "none",

        pointerEvents: "none",
        willChange: "transform, opacity",

        opacity: "0"
      });

      fireflyField.appendChild(dot);

      var fly = {

        el: dot,

        alive: false,
        fleeing: false,

        motion: {
          wanderX: 0,
          wanderY: 0,
          riseY: 0
        },

        wanderTween: null,
        riseTween: null,
        fleeTween: null,
        lifeTimer: null
      };

      fireflies.push(fly);

      // Random initial appearance
      gsap.delayedCall(
        random(0, 3),

        (function(currentFly) {
          return function() {
            spawn(currentFly);
          };
        })(fly)
      );
    }

    // ========================================================
    // MOUSE + MOBILE TOUCH INTERACTION
    // ========================================================

    function reactToFireflyPoint(x, y) {

      fireflies.forEach(function(fly) {

        if (!fly.alive || fly.fleeing) return;

        var rect = fly.el.getBoundingClientRect();

        var cx = rect.left + rect.width / 2;
        var cy = rect.top + rect.height / 2;

        var distance = Math.hypot(
          cx - x,
          cy - y
        );

        if (distance < MOUSE_RADIUS) {
          flee(fly, x, y);
        }
      });
    }

    // --------------------------------------------------------
    // DESKTOP MOUSE
    // --------------------------------------------------------

    section.addEventListener(
      "pointermove",
      function(event) {

        // Touch is handled separately below
        if (event.pointerType === "touch") return;

        reactToFireflyPoint(
          event.clientX,
          event.clientY
        );
      },
      { passive: true }
    );

    // --------------------------------------------------------
    // MOBILE TOUCH
    // --------------------------------------------------------

    // Limit touchmove checks to one per animation frame
    // to avoid unnecessary work during mobile scrolling.

    var touchFramePending = false;
    var latestTouchX = 0;
    var latestTouchY = 0;

    function handleTouchMove(event) {

      if (!event.touches.length) return;

      var touch = event.touches[0];

      latestTouchX = touch.clientX;
      latestTouchY = touch.clientY;

      if (touchFramePending) return;

      touchFramePending = true;

      requestAnimationFrame(function() {

        touchFramePending = false;

        reactToFireflyPoint(
          latestTouchX,
          latestTouchY
        );
      });
    }

    // Finger touches the screen
    section.addEventListener(
      "touchstart",
      function(event) {

        if (!event.touches.length) return;

        var touch = event.touches[0];

        reactToFireflyPoint(
          touch.clientX,
          touch.clientY
        );
      },
      { passive: true }
    );

    // Finger moves, including while scrolling
    section.addEventListener(
      "touchmove",
      handleTouchMove,
      { passive: true }
    );

  }





  

} // END initHomeSection9





  
// =============================================================
// UNIVERSAL RESPONSIVE CITY SYSTEM
//
// RULES
//
// 1. SECTION 1 / KV is NEVER scaled here.
//    home_section1 + about_section1 use true responsive sizing
//    in Webflow/CSS: calc(vw + vh + px)
//
// 2. Only *_city elements listed below participate.
//
// 3. Every city can have its own scale values.
//
// 4. Typography is now positioned OUTSIDE the City and is NOT
//    compensated by this system. Legacy compensation was removed.
//
// 5. Homepage body width is a separate layout rule.
// =============================================================

function initHomeResponsiveScale() {

  // ==========================================================
  // CRITICAL LEGACY DESIGN COORDINATE SYSTEM — PRESERVE 2195
  // ==========================================================
  // CONFIRMED BY ORIGINAL DESIGNER (October 2026):
  // - The original City artwork/layout was built in Webflow Designer
  //   on a Windows 4K physical monitor: 3840 x 2160 pixels.
  // - Windows Display Scaling was 175%, and still needs to remain
  //   usable at that setting (100% makes UI text too small).
  // - Each *_city is deliberately a fixed 3840px-wide design canvas
  //   (e.g. home_section2_city: 3840 x 2200px in Webflow).
  // - Child DIVs wrapping images were often visually right around
  //   width: 60%, while width: 100% extended beyond the intended
  //   composition. The extra ~3% was intentional visual bleed.
  // - The responsive City system was subsequently tuned around
  //   this existing layout. It is currently WORKING; do not rebuild
  //   or reposition the Webflow artwork to 'fix' the history.
  //
  // STRONG MATHEMATICAL EXPLANATION (NOT A PROVEN BROWSER BUG):
  // 3840 physical px / Windows scaling factor 1.75 = 2194.2857
  // logical px; rounded design reference is about 2195.
  // 2195 / 3840 = 0.5716 (~57.2%), close to the historical 60%.
  // This explains the numerical relationship, but DOES NOT prove
  // that Windows scaling itself broke CSS width:100%: CSS percent
  // widths are relative to the containing block, not physical px.
  // The fixed 3840px parent, CSS zoom, Designer viewport/panels,
  // browser zoom, and element layout all need separate examination
  // before attributing the original overflow to a single cause.
  //
  // MASTER_WIDTH=2195 is a CALIBRATED REFERENCE, not a Webflow
  // breakpoint or an invitation to use 1920/1440 instead.
  // Scale curves, cropping, horizontal centering, section offsets,
  // and animation distances depend on this legacy composition.
  // Never replace 2195 with 1920, 1440, 3840, or 2194 without a
  // complete visual regression audit across devices and sections.
  //
  // PERFORMANCE: the arithmetic (mode selection, interpolation,
  // centering) is trivial. The main possible browser cost is the
  // resulting CSS zoom/layout/paint and ScrollTrigger refresh.
  // This routine runs on initialization and qualified resize,
  // NOT as a per-animation-frame scaling calculation.
  // ==========================================================

  var MASTER_WIDTH = 2195;


  // ==========================================================
  // MASTER CITY LIST
  //
  // THIS IS THE MAIN CONTROL PANEL.
  //
  // To change one city's crop/scale:
  // just edit its numbers here.
  //
  // Section 1 is deliberately NOT here.
  // ==========================================================

  var CITY_CONFIG = [

    {
      city: ".home_section2_city",
      section: ".home_section2",

      desktop2195: 1.00,
      desktop1920: 0.90,
      desktop1440: 0.75,

      landscapeMin: 0.52,
      landscapeMax: 0.75,

      portraitMin: 0.48,
      portraitMax: 0.62,

      phoneMin: 0.50,
      phoneMax: 0.65,

      outerType: "top",
      outerBase: -300
    },


    {
      city: ".home_section3_city",
      section: ".home_section3",

      desktop2195: 1.00,
      desktop1920: 0.90,
      desktop1440: 0.75,

      landscapeMin: 0.52,
      landscapeMax: 0.75,

      portraitMin: 0.48,
      portraitMax: 0.62,

      phoneMin: 0.40,
      phoneMax: 0.52,

      outerType: "marginTop",
      outerBase: -700
    },


    {
      city: ".home_section4_city",
      section: ".home_section4",

      desktop2195: 1.00,
      desktop1920: 0.90,
      desktop1440: 0.75,

      landscapeMin: 0.52,
      landscapeMax: 0.75,

      portraitMin: 0.48,
      portraitMax: 0.62,

      phoneMin: 0.40,
      phoneMax: 0.52,

      outerType: "marginTop",
      outerBase: 360
    },


    {
      city: ".home_section5_city",
      section: ".home_section5",

      desktop2195: 1.00,
      desktop1920: 0.90,
      desktop1440: 0.75,

      landscapeMin: 0.52,
      landscapeMax: 0.75,

      portraitMin: 0.48,
      portraitMax: 0.62,

      phoneMin: 0.40,
      phoneMax: 0.52,

      outerType: "marginTop",
      outerBase: -2560
    },


    {
      city: ".home_section6_city",
      section: ".home_section6",

      desktop2195: 1.00,
      desktop1920: 0.90,
      desktop1440: 0.75,

      landscapeMin: 0.52,
      landscapeMax: 0.75,

      portraitMin: 0.48,
      portraitMax: 0.62,

      phoneMin: 0.60,
      phoneMax: 0.72,

      outerType: "marginTop",
      outerBase: 200
    },


    {
      city: ".home_section7_city",
      section: ".home_section7",

      desktop2195: 1.00,
      desktop1920: 0.90,
      desktop1440: 0.75,

      landscapeMin: 0.52,
      landscapeMax: 0.75,

      portraitMin: 0.48,
      portraitMax: 0.62,

      phoneMin: 0.40,
      phoneMax: 0.52,

      outerType: "marginTop",
      outerBase: -100
    },


    {
      city: ".home_section8_city",
      section: ".home_section8",

      desktop2195: 1.00,
      desktop1920: 0.90,
      desktop1440: 0.75,

      landscapeMin: 0.52,
      landscapeMax: 0.75,

      portraitMin: 0.48,
      portraitMax: 0.62,

      phoneMin: 0.40,
      phoneMax: 0.52,

      outerType: "marginTop",
      outerBase: -100
    },


    {
      city: ".home_section9_city",
      section: ".home_section9",

      desktop2195: 1.00,
      desktop1920: 0.90,
      desktop1440: 0.75,

      landscapeMin: 0.52,
      landscapeMax: 0.75,

      portraitMin: 0.48,
      portraitMax: 0.62,

      phoneMin: 0.55,
      phoneMax: 0.68,

      outerType: "marginTop",
      outerBase: -283
    },

    {
      city: ".home_section10_city",
      section: ".home_section10",
    
      desktop2195: 1.00,
      desktop1920: 0.90,
      desktop1440: 0.75,
    
      landscapeMin: 0.52,
      landscapeMax: 0.75,
    
      portraitMin: 0.48,
      portraitMax: 0.62,
    
      phoneMin: 0.70,
      phoneMax: 0.82,
    
      outerType: null,
      outerBase: 0
    },

    {
      city: ".about_section6_city",
      section: ".about_section6",
    
      desktop2195: 1.00,
      desktop1920: 0.90,
      desktop1440: 0.75,
    
      landscapeMin: 0.52,
      landscapeMax: 0.75,
    
      portraitMin: 0.48,
      portraitMax: 0.62,
    
      phoneMin: 0.40,
      phoneMax: 0.52,
    
      outerType: null,
      outerBase: 0
    }


    // ========================================================
    // ABOUT US
    //
    // Add each new About city here when ready.
    //
    // Example:
    //
    // {
    //   city: ".about_section2_city",
    //   section: ".about_section2",
    //
    //   desktop2195: 1.00,
    //   desktop1920: 0.90,
    //   desktop1440: 0.75,
    //
    //   landscapeMin: 0.52,
    //   landscapeMax: 0.75,
    //
    //   portraitMin: 0.48,
    //   portraitMax: 0.62,
    //
    //   phoneMin: 0.40,
    //   phoneMax: 0.52,
    //
    //   outerType: null,
    //   outerBase: 0
    // }
    //
    // DO NOT ADD .about_section1
    // ========================================================

  ];



  // ==========================================================
  // HELPERS
  // ==========================================================

  function mix(a, b, t) {
    return a + (b - a) * t;
  }


  function clamp(value, min, max) {
    return Math.max(
      min,
      Math.min(max, value)
    );
  }



  // ==========================================================
  // RESPONSIVE MODE
  // ==========================================================

  function getResponsiveMode(width, height) {

    var portrait =
      height > width;


    if (width >= 1920) {
      return "desktop";
    }


    if (
      width >= 1440 &&
      !portrait
    ) {
      return "small-desktop";
    }


    if (width >= 768) {

      return portrait
        ? "tablet-portrait"
        : "tablet-landscape";

    }


    return "phone";
  }



  // ==========================================================
  // CITY SCALE CALCULATION
  // ==========================================================

  function getCityScale(config, width, height) {

    var mode =
      getResponsiveMode(
        width,
        height
      );


    // --------------------------------------------------------
    // LARGE DESKTOP
    // --------------------------------------------------------

    if (width >= MASTER_WIDTH) {

      return (
        width /
        MASTER_WIDTH
      );

    }


    // --------------------------------------------------------
    // 1920 → 2195
    // --------------------------------------------------------

    if (width >= 1920) {

      var t2195 =
        (
          width - 1920
        ) /
        (
          MASTER_WIDTH - 1920
        );


      return mix(
        config.desktop1920,
        config.desktop2195,
        t2195
      );

    }


    // --------------------------------------------------------
    // 1440 → 1920
    // --------------------------------------------------------

    if (
      width >= 1440 &&
      mode === "small-desktop"
    ) {

      var tDesktop =
        (
          width - 1440
        ) /
        (
          1920 - 1440
        );


      return mix(
        config.desktop1440,
        config.desktop1920,
        tDesktop
      );

    }


    // --------------------------------------------------------
    // TABLET LANDSCAPE
    // --------------------------------------------------------

    if (
      mode ===
      "tablet-landscape"
    ) {

      var tLandscape =
        clamp(
          (
            width - 768
          ) /
          (
            1440 - 768
          ),
          0,
          1
        );


      return mix(
        config.landscapeMin,
        config.landscapeMax,
        tLandscape
      );

    }


    // --------------------------------------------------------
    // TABLET PORTRAIT
    // --------------------------------------------------------

    if (
      mode ===
      "tablet-portrait"
    ) {

      var tPortrait =
        clamp(
          (
            width - 768
          ) /
          (
            1100 - 768
          ),
          0,
          1
        );


      return mix(
        config.portraitMin,
        config.portraitMax,
        tPortrait
      );

    }


    // --------------------------------------------------------
    // PHONE
    // --------------------------------------------------------

    var tPhone =
      clamp(
        (
          width - 320
        ) /
        (
          767 - 320
        ),
        0,
        1
      );


    return mix(
      config.phoneMin,
      config.phoneMax,
      tPhone
    );
  }


  



// ==========================================================
// REUSABLE SLOWER-SCROLL PARALLAX
// Add class: .moveslower1
// iOS Safari viewport-height safe
// ==========================================================

(function () {

  var elements = gsap.utils.toArray(".moveslower1");

  if (!elements.length) return;

  // ========================================================
  // EASY SETTINGS
  // ========================================================

  var MOVESLOWER1_SPEED_DESKTOP = 0.65;
  var MOVESLOWER1_SPEED_MOBILE  = 0.7;

  // 1.0 = normal page scroll speed
  // 0.8 = 20% slower
  // 0.65 = 35% slower
  // 0.5 = half speed
  // 0.3 = very slow

  // ========================================================

  var previousWidth =
    document.documentElement.clientWidth;

  var fixedViewportHeight =
    document.documentElement.clientHeight;

  var resizeTimer;

  function getScroll() {
    return (
      lenis &&
      typeof lenis.scroll === "number"
    )
      ? lenis.scroll
      : (window.scrollY || 0);
  }

  function getSpeed() {
    return isMobile
      ? MOVESLOWER1_SPEED_MOBILE
      : MOVESLOWER1_SPEED_DESKTOP;
  }


  elements.forEach(function (el) {

    var startScroll = 0;

    gsap.set(el, {
      y: 0,
      force3D: false
    });

    var setY = gsap.quickSetter(
      el,
      "y",
      "px"
    );


    function update() {

      var scroll = getScroll();

      var distance = Math.max(
        0,
        scroll - startScroll
      );

      var y =
        distance *
        (1 - getSpeed());

      setY(y);
    }


    function measure() {

      // reset before measuring actual layout position
      setY(0);

      var scroll = getScroll();

      var elementTop =
        el.getBoundingClientRect().top +
        scroll;

      startScroll =
        elementTop -
        fixedViewportHeight;

      update();
    }


    // Lenis scroll
    if (lenis && lenis.on) {
      lenis.on("scroll", update);
    }

    // Native scroll fallback
    window.addEventListener(
      "scroll",
      update,
      { passive: true }
    );


    // Initial measure
    requestAnimationFrame(function () {
      requestAnimationFrame(measure);
    });


    // Store measure function on element
    el._moveslower1Measure = measure;

  });


  // ========================================================
  // RESIZE
  // Ignore iOS Safari height-only changes
  // ========================================================

  window.addEventListener("resize", function () {

    var currentWidth =
      document.documentElement.clientWidth;

    // Ignore Safari browser bar viewport-height changes
    if (
      Math.abs(
        currentWidth - previousWidth
      ) < 20
    ) {
      return;
    }

    previousWidth = currentWidth;

    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(function () {

      fixedViewportHeight =
        document.documentElement.clientHeight;

      elements.forEach(function (el) {

        if (el._moveslower1Measure) {
          el._moveslower1Measure();
        }

      });

    }, 200);

  }, { passive: true });


})();


// ==========================================================
// REUSABLE SLOWER-SCROLL PARALLAX
// Add class: .moveslower2 (midway between .moveslower1 and .moveslower3)
// iOS Safari viewport-height safe
// ==========================================================

(function () {

  var elements = gsap.utils.toArray(".moveslower2");

  if (!elements.length) return;

  // ========================================================
  // EASY SETTINGS
  // ========================================================

  var MOVESLOWER2_SPEED_DESKTOP = 0.7375;
  var MOVESLOWER2_SPEED_MOBILE  = 0.775;

  // Desktop: 0.7375 (26.25% slower); Mobile: 0.775 (22.5% slower)
  // 1.0 = normal page scroll speed
  // 0.8 = 20% slower
  // 0.5 = half speed
  // 0.3 = very slow

  // ========================================================

  var previousWidth =
    document.documentElement.clientWidth;

  var fixedViewportHeight =
    document.documentElement.clientHeight;

  var resizeTimer;

  function getScroll() {
    return (
      lenis &&
      typeof lenis.scroll === "number"
    )
      ? lenis.scroll
      : (window.scrollY || 0);
  }

  function getSpeed() {
    return isMobile
      ? MOVESLOWER2_SPEED_MOBILE
      : MOVESLOWER2_SPEED_DESKTOP;
  }


  elements.forEach(function (el) {

    var startScroll = 0;

    gsap.set(el, {
      y: 0,
      force3D: false
    });

    var setY = gsap.quickSetter(
      el,
      "y",
      "px"
    );


    function update() {

      var scroll = getScroll();

      var distance = Math.max(
        0,
        scroll - startScroll
      );

      var y =
        distance *
        (1 - getSpeed());

      setY(y);
    }


    function measure() {

      // reset before measuring actual layout position
      setY(0);

      var scroll = getScroll();

      var elementTop =
        el.getBoundingClientRect().top +
        scroll;

      startScroll =
        elementTop -
        fixedViewportHeight;

      update();
    }


    // Lenis scroll
    if (lenis && lenis.on) {
      lenis.on("scroll", update);
    }

    // Native scroll fallback
    window.addEventListener(
      "scroll",
      update,
      { passive: true }
    );


    // Initial measure
    requestAnimationFrame(function () {
      requestAnimationFrame(measure);
    });


    // Store measure function on element
    el._moveslower2Measure = measure;

  });


  // ========================================================
  // RESIZE
  // Ignore iOS Safari height-only changes
  // ========================================================

  window.addEventListener("resize", function () {

    var currentWidth =
      document.documentElement.clientWidth;

    // Ignore Safari browser bar viewport-height changes
    if (
      Math.abs(
        currentWidth - previousWidth
      ) < 20
    ) {
      return;
    }

    previousWidth = currentWidth;

    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(function () {

      fixedViewportHeight =
        document.documentElement.clientHeight;

      elements.forEach(function (el) {

        if (el._moveslower2Measure) {
          el._moveslower2Measure();
        }

      });

    }, 200);

  }, { passive: true });


})();




  

// ==========================================================
// REUSABLE SLOWER-SCROLL PARALLAX
// Add class: .moveslower3 (half the slowing effect of .moveslower1)
// iOS Safari viewport-height safe
// ==========================================================

(function () {

  var elements = gsap.utils.toArray(".moveslower3");

  if (!elements.length) return;

  // ========================================================
  // EASY SETTINGS
  // ========================================================

  var MOVESLOWER3_SPEED_DESKTOP = 0.825;
  var MOVESLOWER3_SPEED_MOBILE  = 0.85;

  // Desktop: 0.825 (17.5% slower); Mobile: 0.85 (15% slower)
  // 1.0 = normal page scroll speed
  // 0.8 = 20% slower
  // 0.5 = half speed
  // 0.3 = very slow

  // ========================================================

  var previousWidth =
    document.documentElement.clientWidth;

  var fixedViewportHeight =
    document.documentElement.clientHeight;

  var resizeTimer;

  function getScroll() {
    return (
      lenis &&
      typeof lenis.scroll === "number"
    )
      ? lenis.scroll
      : (window.scrollY || 0);
  }

  function getSpeed() {
    return isMobile
      ? MOVESLOWER3_SPEED_MOBILE
      : MOVESLOWER3_SPEED_DESKTOP;
  }


  elements.forEach(function (el) {

    var startScroll = 0;

    gsap.set(el, {
      y: 0,
      force3D: false
    });

    var setY = gsap.quickSetter(
      el,
      "y",
      "px"
    );


    function update() {

      var scroll = getScroll();

      var distance = Math.max(
        0,
        scroll - startScroll
      );

      var y =
        distance *
        (1 - getSpeed());

      setY(y);
    }


    function measure() {

      // reset before measuring actual layout position
      setY(0);

      var scroll = getScroll();

      var elementTop =
        el.getBoundingClientRect().top +
        scroll;

      startScroll =
        elementTop -
        fixedViewportHeight;

      update();
    }


    // Lenis scroll
    if (lenis && lenis.on) {
      lenis.on("scroll", update);
    }

    // Native scroll fallback
    window.addEventListener(
      "scroll",
      update,
      { passive: true }
    );


    // Initial measure
    requestAnimationFrame(function () {
      requestAnimationFrame(measure);
    });


    // Store measure function on element
    el._moveslower3Measure = measure;

  });


  // ========================================================
  // RESIZE
  // Ignore iOS Safari height-only changes
  // ========================================================

  window.addEventListener("resize", function () {

    var currentWidth =
      document.documentElement.clientWidth;

    // Ignore Safari browser bar viewport-height changes
    if (
      Math.abs(
        currentWidth - previousWidth
      ) < 20
    ) {
      return;
    }

    previousWidth = currentWidth;

    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(function () {

      fixedViewportHeight =
        document.documentElement.clientHeight;

      elements.forEach(function (el) {

        if (el._moveslower3Measure) {
          el._moveslower3Measure();
        }

      });

    }, 200);

  }, { passive: true });


})();




  

  // ==========================================================
  // HOMEPAGE MOBILE BODY WIDTH
  //
  // IMPORTANT:
  // This affects HOMEPAGE ONLY.
  //
  // About Us is NOT touched.
  // ==========================================================

  // function applyHomeBodyWidth(mode) {
  
  //   var homeBodyTexts =
  //     document.querySelectorAll(
  //       '[class*="home_section"] .body_text'
  //     );
  
  //   homeBodyTexts.forEach(
  //     function(el) {
  
  //       // Let Webflow control body text width / max-width
  //       el.style.width = "";
  //       el.style.maxWidth = "";
  
  //     }
  //   );
  
  // }



  // ==========================================================
  // APPLY EVERYTHING
  // ==========================================================

function applyResponsiveCitySystem() {

  var width =
    document.documentElement.clientWidth;

  var height =
    document.documentElement.clientHeight;

  var mode =
    getResponsiveMode(
      width,
      height
    );


  CITY_CONFIG.forEach(function(config) {

    var city =
      document.querySelector(config.city);

    if (!city) return;


    var section =
      document.querySelector(config.section);


    // ====================================================
    // ONE SCALE CALCULATION ONLY
    // ====================================================

    var scale =
      getCityScale(
        config,
        width,
        height
      );


    // ====================================================
    // RESET ONLY RESPONSIVE PROPERTIES WE OWN
    //
    // IMPORTANT:
    // DO NOT clear transform on homepage cities.
    // GSAP may own that transform.
    // ====================================================

    city.style.zoom = "";
    city.style.left = "";
    city.style.marginLeft = "";


// ====================================================
// ALL CITIES — SAME METHOD
// Homepage + About
// ====================================================

city.style.transformOrigin = "";
city.style.transform = "";
city.style.zoom = scale;


// ----------------------------------------------------
// HORIZONTAL CENTRING
// ----------------------------------------------------

if (width < 1920) {

  var cityWidth =
    city.offsetWidth;

  var scaledCityWidth =
    cityWidth *
    scale;

  var targetLeft =
    (
      width -
      scaledCityWidth
    ) / 2;

  var naturalLeft =
    city.offsetLeft;

  var visualCorrection =
    targetLeft -
    (
      naturalLeft *
      scale
    );

  var cityCorrection =
    visualCorrection /
    scale;

  city.style.left =
    cityCorrection +
    "px";
}


    // ====================================================
    // OUTER SECTION OFFSET
    // ====================================================

    if (
      section &&
      config.outerType
    ) {

      var scaledOuter =
        config.outerBase *
        scale;


      if (
        config.outerType ===
        "marginTop"
      ) {

        section.style.marginTop =
          scaledOuter +
          "px";

      }


      if (
        config.outerType ===
        "top"
      ) {

        section.style.top =
          scaledOuter +
          "px";

      }

    }


    // ====================================================
    // DEBUG
    // ====================================================

    city.setAttribute(
      "data-responsive-scale",
      scale.toFixed(4)
    );

    city.setAttribute(
      "data-responsive-mode",
      mode
    );

  });


  // // ====================================================
  // // HOMEPAGE BODY TEXT WIDTH
  // // ====================================================

  // applyHomeBodyWidth(
  //   mode
  // );


  // ====================================================
  // REFRESH AFTER LAYOUT
  // ====================================================

  requestAnimationFrame(function() {

    if (
      lenis &&
      lenis.resize
    ) {
      lenis.resize();
    }


    if (ScrollTrigger) {
      ScrollTrigger.refresh();
    }

  });

}



  // ==========================================================
  // FIRST RUN
  // ==========================================================

  applyResponsiveCitySystem();



  // ==========================================================
  // RESIZE
  // ==========================================================

  var resizeTimer;

  var previousWidth =
    document.documentElement.clientWidth;

  var previousPortrait =
    document.documentElement.clientHeight >
    document.documentElement.clientWidth;


  window.addEventListener(
    "resize",
    function() {

      var currentWidth =
        document.documentElement.clientWidth;

      var currentPortrait =
        document.documentElement.clientHeight >
        document.documentElement.clientWidth;


      var widthChanged =
        Math.abs(
          currentWidth -
          previousWidth
        ) > 20;


      var orientationChanged =
        currentPortrait !==
        previousPortrait;


      if (
        !widthChanged &&
        !orientationChanged
      ) {

        return;

      }


      previousWidth =
        currentWidth;

      previousPortrait =
        currentPortrait;


      clearTimeout(
        resizeTimer
      );


      resizeTimer =
        setTimeout(
          function() {

            applyResponsiveCitySystem();

          },
          180
        );

    }
  );

}

      } catch (e) {
        console.error("[TT] startCore crashed", e);
      }
    }




  
})(window);


  


/* TT RELOCATED MODULES — unchanged from working slim-footer migration */
/* TURBO TURTLE — CORE ADDITIONS — append to turboturtle-core.js @ e66d731
   Relocated verbatim from the supplied footer. Do not include <script> tags. */

(function () {
  function updateNavbarLogo() {
    document.documentElement.classList.toggle("navbar-scrolled", window.scrollY > 5);
  }
  window.addEventListener("scroll", updateNavbarLogo, { passive: true });
  updateNavbarLogo();
})();

(function () {
  "use strict";
  var EXIT_MS = 500;
  var exiting = false;
  var overlay = document.createElement("div");
  overlay.id = "tt-page-exit";
  overlay.setAttribute("aria-hidden", "true");
  document.body.appendChild(overlay);

  function resetExit() {
    exiting = false;
    document.documentElement.classList.remove("tt-page-exiting");
  }
  // Restore the page if it is brought back from the browser's back-forward cache.
  window.addEventListener("pageshow", resetExit);

  document.addEventListener("click", function (event) {
    if (event.defaultPrevented || exiting || event.button !== 0 ||
        event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    var link = event.target.closest && event.target.closest("a[href]");
    if (!link || link.hasAttribute("download") ||
        (link.target && link.target.toLowerCase() !== "_self") ||
        link.hasAttribute("data-no-page-transition")) return;

    var dest;
    try { dest = new URL(link.href, window.location.href); }
    catch (e) { return; }
    if ((dest.protocol !== "http:" && dest.protocol !== "https:") ||
        dest.origin !== window.location.origin) return;

    // Let in-page hash navigation happen normally.
    if (dest.pathname === window.location.pathname &&
        dest.search === window.location.search &&
        (dest.hash || dest.href === window.location.href)) return;

    event.preventDefault();
    exiting = true;
    document.documentElement.classList.add("tt-page-exiting");
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(function () {
      window.location.assign(dest.href);
    }, reduced ? 20 : EXIT_MS);
  });
})();

(function () {
  "use strict";
  var ua = navigator.userAgent || "";
  if (!/CriOS/.test(ua) || !/iPhone|iPad|iPod/.test(ua)) return;

  var ran = false;
  function refreshOnce() {
    if (ran || document.hidden) return;
    if (document.documentElement.classList.contains("tt-loading") ||
        document.documentElement.classList.contains("tt-revealing")) return;
    ran = true;

    // Force a contained, temporary layout invalidation, not a viewport offset.
    // This is an experiment; it cannot invoke Chrome's native tab reinitialization.
    var probe = document.createElement("div");
    probe.setAttribute("aria-hidden", "true");
    probe.style.cssText = "position:absolute;left:0;top:0;width:1px;height:1px;" +
      "visibility:hidden;pointer-events:none;contain:layout style paint;";
    document.body.appendChild(probe);
    void probe.offsetHeight;
    probe.style.width = "2px";
    void probe.offsetHeight;
    probe.remove();

    // Request one ordinary resize pass after the preloader/nav entrance.
    // No ScrollTrigger refresh: it can disturb active scroll animations.
    window.dispatchEvent(new Event("resize"));
    if (window.lenis && typeof window.lenis.resize === "function") {
      window.lenis.resize();
    }
    window.ttChromeViewportRefreshResult = {
      attempted: true,
      at: Math.round(performance.now()),
      innerHeight: window.innerHeight,
      visualHeight: window.visualViewport ? window.visualViewport.height : null
    };
  }

  function waitUntilReady() {
    if (ran) return;
    if (document.documentElement.classList.contains("tt-loading") ||
        document.documentElement.classList.contains("tt-revealing")) {
      setTimeout(waitUntilReady, 150);
      return;
    }
    // Original reveal lasts 1.75s; navbar finishes ~2.90s from reveal start.
    // Wait an additional 1.3s after the preloader class clears.
    setTimeout(function () {
      requestAnimationFrame(function () {
        requestAnimationFrame(refreshOnce);
      });
    }, 1300);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", waitUntilReady, { once: true });
  } else {
    waitUntilReady();
  }
})();

(function () {
  "use strict";
  function placeShaderLast() {
    var shader = document.querySelector(".shader");
    if (!shader || !document.body) return;
    if (shader.parentElement !== document.body ||
        shader !== document.body.lastElementChild) {
      document.body.appendChild(shader);
    }
  }
  // This footer runs after Webflow's body markup and the page-exit overlay.
  placeShaderLast();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", placeShaderLast, { once: true });
  }
})();


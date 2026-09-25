/* turboturtle-combined.js - Optimized & Integrated Version */
(function (root) {
  if (!root) return;

  var isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  var gsap, ScrollTrigger, lenis, MorphSVGPlugin;

// ==========================================================
// REAL VIEWPORT UNITS
// Do NOT use window.innerWidth / innerHeight.
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

      if (MorphSVGPlugin) gsap.registerPlugin(ScrollTrigger, MorphSVGPlugin);
      else gsap.registerPlugin(ScrollTrigger);

      ScrollTrigger.config({ ignoreMobileResize: true, syncInterval: 999 });

      lenis = new root.Lenis({
        lerp: isMobile ? 0.12 : 0.08,
        smoothWheel: true,
        smoothTouch: false,
        touchMultiplier: 1.5,
        infinite: false
      });

      root.lenis = lenis;

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

        return vars;
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
      // -------------------------------------------------------------
      tweenIf(".about_planet", stable({ targetEl: ".about_planet", y: () => 20 * vh, ease: "none", scrollTrigger: { trigger: parallaxTrigger, start: "top top", end: "bottom bottom", scrub: 1 } }));
      tweenIf(".spacecats", stable({ targetEl: ".spacecats", x: () => -3 * vw, y: () => 40 * vh, rotation: 20, scale: 1.1, ease: "none", scrollTrigger: { trigger: parallaxTrigger, start: "top top", end: "bottom bottom", scrub: 0.5 } }));
      tweenIf(".about_saturn", stable({ targetEl: ".about_saturn", x: () => -2 * vw, y: () => 30 * vh, rotation: -25, scale: 0.9, ease: "none", scrollTrigger: { trigger: parallaxTrigger, start: "top top", end: "bottom bottom", scrub: 1 } }));
      tweenIf(".satellitemove", stable({ targetEl: ".satellitemove", x: () => 10 * vw, y: () => 50 * vh, rotation: 15, scale: 0.85, ease: "none", scrollTrigger: { trigger: parallaxTrigger, start: "top top", end: "bottom bottom", scrub: 1 } }));
      tweenIf(".about_watermoon", stable({ targetEl: ".about_watermoon", yPercent: 35, ease: "none", scrollTrigger: { trigger: ".about_watermoon", start: "-20% bottom", end: "bottom -20%", scrub: 1 } }));
      tweenIf(".about_section_1", stable({ targetEl: ".about_section_1", y: () => -10 * vh, ease: "none", scrollTrigger: { trigger: parallaxTrigger, start: "top top", end: "bottom bottom", scrub: 1 } }));
      tweenIf(".about_section_2", stable({ targetEl: ".about_section_2", y: () => -10 * vh, ease: "none", scrollTrigger: { trigger: ".about_section_2", start: "top bottom", end: "bottom top", scrub: 1 } }));
      tweenIf(".lakeshrink", stable({ targetEl: ".lakeshrink", scaleY: 0.2, ease: "none", scrollTrigger: { trigger: ".lakeshrink", start: "top bottom", end: "bottom top", scrub: 1 } }));
      tweenIf(".duckswim", stable({ targetEl: ".duckswim", x: () => -5 * vw - 80, yPercent: -35, ease: "none", scrollTrigger: { trigger: ".duckswim", start: "top bottom", end: "bottom top", scrub: 1 } }));
      tweenIf(".about_turtle2", stable({ targetEl: ".about_turtle2", x: () => 60 * vw, y: () => 10 * vw, rotation: 6, ease: "none", scrollTrigger: { trigger: ".about_turtle2", start: "-20% bottom", end: "bottom -20%", scrub: 1 } }));
      tweenIf(".about_turtle1", stable({ targetEl: ".about_turtle1", x: () => 28 * vw, y: () => -5 * vw, rotation: -5, ease: "none", scrollTrigger: { trigger: ".about_turtle1", start: "top bottom", end: "bottom top", scrub: 1 } }));
      tweenIf(".about_nessie", stable({ targetEl: ".about_nessie", x: () => 7 * vw, y: () => -13 * vw, rotation: -30, ease: "none", scrollTrigger: { trigger: ".about_nessie", start: "top bottom", end: "bottom top", scrub: 1 } }));
      tweenIf(".about_giant_squid", stable({ targetEl: ".about_giant_squid", x: () => 15 * vw, y: () => 100 * vh, rotation: -5, ease: "none", scrollTrigger: { trigger: ".about_giant_squid", start: "top bottom", end: "bottom -250%", scrub: 1 } }));
      tweenIf(".about_bigbigfly", stable({ targetEl: ".about_bigbigfly", x: () => 220 * vw, y: () => -4 * vw, rotation: -5, ease: "none", scrollTrigger: { trigger: ".about_bigbigfly", start: "top bottom", end: "bottom -10%", scrub: 1 } }));
      tweenIf(".about_turtle3", stable({ targetEl: ".about_turtle3", x: () => 30 * vw, y: () => -5 * vh, ease: "none", scrollTrigger: { trigger: ".about_turtle3", start: "-20% bottom", end: "bottom -20%", scrub: 1 } }));
      tweenIf(".about_turtle4", stable({ targetEl: ".about_turtle4", x: () => 20 * vw, y: () => 8 * vh, ease: "none", scrollTrigger: { trigger: ".about_turtle4", start: "-20% bottom", end: "bottom -20%", scrub: 1 } }));
      tweenIf(".about_chickenfish", stable({ targetEl: ".about_chickenfish", x: () => 12 * vw, y: () => 5 * vh, ease: "none", scrollTrigger: { trigger: ".about_chickenfish", start: "top bottom", end: "bottom top", scrub: 1 } }));
      tweenIf(".about_flyduck", stable({ targetEl: ".about_flyduck", x: () => 140 * vw, y: () => 5 * vh, ease: "none", scrollTrigger: { trigger: ".about_flyduck", start: "top bottom", end: "bottom top", scrub: 1 } }));
      tweenIf(".about_octopus1", stable({ targetEl: ".about_octopus1", x: () => 20 * vw, y: () => -15 * vh, rotation: -10, ease: "none", scrollTrigger: { trigger: ".about_octopus1", start: "top bottom", end: "bottom top", scrub: 1 } }));
      tweenIf(".about_octopus2", stable({ targetEl: ".about_octopus2", x: () => 15 * vw, y: () => 25 * vh, rotation: 10, ease: "none", scrollTrigger: { trigger: ".about_octopus2", start: "-20% bottom", end: "bottom -20%", scrub: 1 } }));
      tweenIf(".about_bubble", stable({ targetEl: ".about_bubble", y: () => -400 * vh, x: () => 2 * vw, ease: "none", scrollTrigger: { trigger: ".about_bubble", start: "top bottom", end: "bottom -200%", scrub: 1 } }));
      tweenIf(".about_bigbubble", stable({ targetEl: ".about_bigbubble", y: () => -1400 * vh, x: () => 2 * vw, ease: "none", scrollTrigger: { trigger: ".about_bigbubble", start: "top bottom", end: "bottom -400%", scrub: 1 } }));
      tweenIf(".about_small_planet1", stable({ targetEl: ".about_small_planet1", y: () => 10 * vh, ease: "none", scrollTrigger: { trigger: ".about_small_planet1", start: "top bottom", end: "bottom top", scrub: 1 } }));
      tweenIf(".about_small_planet2", stable({ targetEl: ".about_small_planet2", y: () => 15 * vh, ease: "none", scrollTrigger: { trigger: ".about_small_planet2", start: "top bottom", end: "bottom top", scrub: 1 } }));
      tweenIf(".footer_ask", stable({ targetEl: ".footer_ask", y: () => -10 * vh, ease: "none", scrollTrigger: { trigger: ".footer_ask", start: "top bottom", end: "bottom top", scrub: 1 } }));
      tweenIf(".footer_credit", stable({ targetEl: ".footer_credit", y: () => 10 * vh, ease: "none", scrollTrigger: { trigger: ".footer_credit", start: "top bottom", end: "bottom top", scrub: 1 } }));
      tweenIf(".about_citymoon", stable({ targetEl: ".about_citymoon", y: () => 10 * vh, ease: "none", scrollTrigger: { trigger: ".about_citymoon", start: "top bottom", end: "bottom top", scrub: 1 } }));
      tweenIf(".about_cityballoon", stable({ targetEl: ".about_cityballoon", y: () => 30 * vh, ease: "none", scrollTrigger: { trigger: ".about_cityballoon", start: "top bottom", end: "bottom top", scrub: 1 } }));

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
      // -------------------------------------------------------------
      var mountainTrigger = exists(".about_mountain") ? ".about_mountain" : ".about_bottom_area";

      var cityReveals = [
        { sel: ".about_crystal", from: { y: "-20vh" }, to: { y: "0vh" }, start: "120%", end: "20%" },
        { sel: ".about_citybuilding_4", from: { y: "5vh" }, to: { y: "0vh" }, start: "120%", end: "30%" },
        { sel: ".about_citybuilding_3", from: { y: "10vh" }, to: { y: "0vh" }, start: "120%", end: "30%" },
        { sel: ".about_citybuilding_6", from: { y: "15vh" }, to: { y: "0vh" }, start: "120%", end: "30%" },
        { sel: ".about_citybuilding_5", from: { y: "20vh" }, to: { y: "0vh" }, start: "120%", end: "30%" },
        { sel: ".about_citybuilding_2", from: { y: "25vh" }, to: { y: "0vh" }, start: "120%", end: "30%" },
        { sel: ".about_backlayer", from: { y: "30vh" }, to: { y: "0vh" }, start: "120%", end: "30%" },
        { sel: ".about_mountain", from: { y: "35vh" }, to: { y: "0vh" }, start: "120%", end: "30%" },
        { sel: ".about_citytree_1", from: { y: "80vh" }, to: { y: "0vh" }, start: "120%", end: "30%" },
        { sel: ".about_citytree_2", from: { y: "80vh" }, to: { y: "0vh" }, start: "120%", end: "30%" },
        { sel: ".about_citytree_3", from: { y: "80vh" }, to: { y: "0vh" }, start: "120%", end: "30%" },
        { sel: ".about_citytree_4", from: { y: "50vh" }, to: { y: "0vh" }, start: "120%", end: "30%" },
        { sel: ".about_eyetower", from: { y: "50vh" }, to: { y: "0vh" }, start: "110%", end: "30%" }
      ];

      cityReveals.forEach(function (item) {
        if (!exists(item.sel)) return;

        gsap.set(item.sel, Object.assign({ force3D: true }, item.from));

        gsap.fromTo(
          item.sel,
          item.from,
          Object.assign({}, item.to, {
            ease: "power2.out",
            immediateRender: false,
            scrollTrigger: {
              trigger: mountainTrigger,
              start: "top " + (item.start || "120%"),
              end: "top " + (item.end || "40%"),
              scrub: 1,
              fastScrollEnd: true,
              invalidateOnRefresh: true,
              onToggle: function (self) {
                var el = q(item.sel);
                if (el) el.style.willChange = self.isActive ? "transform" : "auto";
              }
            }
          })
        );
      });

      // -------------------------------------------------------------
      // ABOUT US — CHARACTER / ROCKET REVEALS
      // -------------------------------------------------------------
      var launchTargets = [
        { sel: ".about_cityqueen", from: { y: "35vh" }, to: { y: "0vh" }, start: "80%" },
        { sel: ".about_doggod", from: { x: "4.6vw" }, to: { x: "0vw" }, start: "70%" },
        { sel: ".about_frog", from: { y: "15vh" }, to: { y: "0vh" }, start: "80%" },
        { sel: ".about_violincat", from: { x: "3vw" }, to: { x: "0vw" }, start: "80%" },
        { sel: ".about_cityrocket", from: { y: "30vh" }, to: { y: "0vh" }, start: "80%" },
        { sel: ".about_cityrocket_2", from: { y: "20vh" }, to: { y: "0vh" }, start: "75%" }
      ];

      launchTargets.forEach(function (item) {
        if (!exists(item.sel)) return;

        gsap.set(item.sel, Object.assign({ force3D: true }, item.from));

        gsap.fromTo(
          item.sel,
          item.from,
          Object.assign({}, item.to, {
            duration: 1,
            ease: "power3.out",
            immediateRender: false,
            scrollTrigger: {
              trigger: item.sel,
              start: "top " + (item.start || "80%"),
              toggleActions: "play reverse play reverse",
              invalidateOnRefresh: true
            }
          })
        );
      });

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
          scrub: 1,
          invalidateOnRefresh: true,

          onUpdate: function (self) {
            var t = self.progress;
            var x = 80 * vw * t;
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
    
      } catch (e) {
        console.error("[TT] startCore crashed", e);
      }
    }

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
    
        var lastProgress = 0;
    
        if (root.ScrollTrigger) {
          root.ScrollTrigger.create({
            trigger: ".parallax-wrapper",
            start: "top top",
            end: (isMobile ? innerHeight * 0.25 : innerHeight * 0.5) + "px top",
            scrub: 1,
    
            onUpdate: function (self) {
              lastProgress = self.progress;
              target.x = 130 * vw * self.progress;
            }
          });
        }
    
        function ensureX() {
          if (lastProgress > 0) return;
    
          var max = (document.documentElement.scrollHeight - innerHeight) || 1;
    
          target.x =
            130 *
            vw *
            Math.max(
              0,
              Math.min(
                1,
                (root.pageYOffset || 0) / max
              )
            );
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
  







  // =============================================================
  // HOMEPAGE SECTION 1
  // MASTER-SPACE VERSION
  // =============================================================
  function initHomeSection1() {
  
    var section = q(".home_section1");
    var moon = q(".home1_moon");
    var realMoon = q(".home1_realmoon");
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
  
  
    // ==========================================================
    // LAYER ORDER
    // ==========================================================
  
    if (galaxy) gsap.set(galaxy, { zIndex: 1 });
    if (realMoon) gsap.set(realMoon, { zIndex: 2 });
    if (pyramid) gsap.set(pyramid, { zIndex: 3 });
    if (text) gsap.set(text, { zIndex: 5 });
    if (moon) gsap.set(moon, { zIndex: 7 });
    if (cloud) gsap.set(cloud, { zIndex: 10 });
  
  
    // ==========================================================
    // INTRO — MOON BOUNCE
    // ==========================================================
  
    if (lenis) lenis.stop();
  
  
    var intro = gsap.timeline({
  
      onComplete: function () {
  
        if (lenis) lenis.start();
  
        ScrollTrigger.refresh();
  
      }
  
    });
  
  
    if (moon) {
  
      intro
        .set(moon, {
          y: 0,
          force3D: true
        })
  
        .to(moon, {
          y: -8 * MASTER_VH,
          duration: 0.45,
          ease: "power2.out"
        })
  
        .to(moon, {
          y: 0,
          duration: 0.6,
          ease: "bounce.out"
        });
  
    } else {
  
      intro.to({}, {
        duration: 1
      });
  
    }
  
  
    // ==========================================================
    // CLOUD
    // ==========================================================
  
    if (cloud) {
  
      gsap.to(cloud, {
  
        y: -115 * MASTER_VH,
  
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
    // PYRAMID
    // ==========================================================
  
    if (pyramid) {
  
      gsap.to(pyramid, {
  
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
    // REAL MOON
    //
    // Keep relative behavior.
    // This already measures actual section height.
    // ==========================================================
  
    if (realMoon) {
  
      gsap.to(realMoon, {
  
        y: function () {
  
          var scrollDistance =
            Math.max(
              0,
              section.offsetHeight -
              window.innerHeight
            );
  
          return scrollDistance * 0.82;
  
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
  // ORIGINAL DESIGN HEIGHT
  //
  // 1vh at original viewport ≈ 11px
  // ==========================================================

  var MASTER_VH = 11;


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

      travel: 15
    },

    {
      targets:
        ".home2_clocktower, .home2_dinosaur, .home2_5centcat",

      travel: 30
    },

    {
      targets:
        ".home2_bridge, .home2_train, .home2_building2, .home2_statue",

      travel: 45
    },

    {
      targets:
        ".home2_mount4, .home2_spacecat",

      travel: 60
    },

    {
      targets:
        ".home2_building1, .home2_spark, .home2_crystal, .home2_pickle, .home2_riv",

      travel: 75
    },

    {
      targets:
        ".home2_oceanball, .home2_whale, .home2_triangle, .home2_mushroom, .home2_pillar, .home2_jupiter, .home2_cat",

      travel: 90
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

}
  
  // =============================================================
  // HOMEPAGE SECTION 3
  // =============================================================
  function initHomeSection3() {
    var section = q(".home_section3");
    if (!section || !gsap || !ScrollTrigger) return;
  
    var movers = [
      { sel: ".home3_fish2",   x: 70, y:  -4, r:  0 },
      { sel: ".home3_fish1",   x: 80, y:   3, r:  0 },
      { sel: ".home3_dolphin", x: 16, y:  -6, r:  0 },
      { sel: ".home3_shark",   x: 12, y:   4, r:  0 },
      { sel: ".home3_cat",     x: 40, y: -12, r:  0 },
      { sel: ".home3_moon",    x:  0, y:  30, r:  0 },
      { sel: ".home3_jet",     x: 90, y:  -5, r:  0 },
      { sel: ".home3_turtle",  x: 20, y:   6, r: -5 },
      { sel: ".home3_lion",    x: 12, y:  -3, r: -2 },
      { sel: ".home3_bear",    x: 10, y:  30, r:  0 }
    ];
  
    movers.forEach(function (item) {
      tweenIf(item.sel, {
        x: () => item.x * vw,
        y: () => item.y * vh,
        rotation: item.r,
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
    });
  
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
    var pulse = q(".home4_pulse");
    var wave = q("#home4-top-wave");
    var section4 = q(".home_section4");
    var section4City = q(".home_section4_city");
    
    if (section4 && section4City) {
      gsap.to(section4City, {
        yPercent: -80,
        ease: "none",
        force3D: true,
    
        scrollTrigger: {
          trigger: section4,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
          invalidateOnRefresh: true
        }
      });
    }
  
  if (pulse) {
    gsap.to(pulse, {
      y: "+=450",
      duration: 3,
      ease: "power3.in",
      repeat: -1,
      force3D: true
    });
  }
  
    if (!wave || !MorphSVGPlugin) return;

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
          xPercent: -85 * t,
          yPercent: (-55 * t) - (22 * arc),
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
  // ROCKET TIP
  // ============================================================

  if (rocketTip) {

    gsap.to(rocketTip, {
      y: 145,
      duration: 1.25,
      ease: "power3.in",
      force3D: true,

      scrollTrigger: {
        trigger: rocketTip,
        start: "top 40%",
        toggleActions: "play reverse play reverse"
      }
    });
  }


  // ============================================================
  // BURGER
  // ============================================================

  if (burger) {

    gsap.timeline({
      repeat: -1,
      repeatDelay: 1.4
    })

    .to(burger, {
      y: -9,
      duration: 0.18,
      ease: "power2.out"
    })

    .to(burger, {
      y: 0,
      duration: 0.22,
      ease: "bounce.out"
    })

    .to(burger, {
      y: -7,
      duration: 0.16,
      ease: "power2.out"
    })

    .to(burger, {
      y: 0,
      duration: 0.2,
      ease: "bounce.out"
    })

    .to(burger, {
      y: -4,
      duration: 0.14,
      ease: "power2.out"
    })

    .to(burger, {
      y: 0,
      duration: 0.18,
      ease: "bounce.out"
    });
  }


  // ============================================================
  // BEAR
  // ============================================================

  if (bear) {

    gsap.to(bear, {
      x: 25,
      duration: 1,
      ease: "power3.out",
      force3D: true,

      scrollTrigger: {
        trigger: bear,
        start: "top 40%",
        toggleActions: "play reverse play reverse"
      }
    });
  }


  // ============================================================
  // BLOOD CELL
  // ============================================================

  if (bloodcell) {

    gsap.to(bloodcell, {
      xPercent: 300,
      yPercent: -220,
      rotation: 220,
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
  //
  // DOWN:
  // - waits ABOVE screen and INVISIBLE
  // - falls downward
  // - drifts slightly left
  // - rotates anticlockwise to -15deg
  // - invisible after completely leaving bottom
  //
  // UP:
  // - reappears when physically entering from bottom
  // - rises upward
  // - returns right
  // - rotates back to 0deg
  // - invisible again when it reaches the waiting/top state
  //
  // Fully reversible / repeatable.
  // ============================================================

  if (umbrellaCat) {

    var umbrellaReady = false;

    var umbrellaTriggerScroll = 0;

    var umbrellaStartY = 0;
    var umbrellaStartRectTop = 0;
    var umbrellaHeight = 0;


    // ----------------------------------------------------------
    // REMOVE OLD EXPERIMENTAL INLINE STYLES
    // ----------------------------------------------------------

    gsap.set(umbrellaCat, {
      clearProps:
        "position,top,left,right,bottom,width,zIndex,transform"
    });


    // ----------------------------------------------------------
    // DEFAULT — ALWAYS INVISIBLE
    // ----------------------------------------------------------

    gsap.set(umbrellaCat, {
      visibility: "hidden",
      opacity: 1,
      x: 0,
      y: 0,
      rotation: 0,
      force3D: true
    });


    // ----------------------------------------------------------
    // PREPARE
    // ----------------------------------------------------------

    function prepareUmbrellaCat() {

      if (umbrellaReady) return;

      umbrellaReady = true;

      umbrellaTriggerScroll =
        window.scrollY;


      // Measure original Webflow position.
      var rect =
        umbrellaCat.getBoundingClientRect();


      umbrellaStartRectTop =
        rect.top;


      umbrellaHeight =
        rect.height ||
        umbrellaCat.offsetHeight ||
        120;


      // --------------------------------------------------------
      // START FARTHER ABOVE VIEWPORT
      //
      // Previous = -40px
      // New      = -100px
      //
      // Gives us more safety space above the screen.
      // --------------------------------------------------------

      var desiredTop =
        -umbrellaHeight - 100;


      umbrellaStartY =
        desiredTop -
        umbrellaStartRectTop;


      gsap.set(umbrellaCat, {
        x: 0,
        y: umbrellaStartY,
        rotation: 0,
        visibility: "hidden",
        force3D: true
      });
    }


    // ----------------------------------------------------------
    // MASTER SCROLL WATCHER
    // ----------------------------------------------------------

    ScrollTrigger.create({

      trigger: section,

      start: "top bottom",
      end: "bottom top",

      invalidateOnRefresh: true,


      onUpdate: function(self) {

        // ------------------------------------------------------
        // WAIT UNTIL WORKING START AREA
        // ------------------------------------------------------

        if (!umbrellaReady) {

          if (self.progress < 0.28) {

            // Extra safety:
            // cat must remain invisible while waiting.
            gsap.set(umbrellaCat, {
              visibility: "hidden"
            });

            return;
          }

          prepareUmbrellaCat();
        }


        // ------------------------------------------------------
        // SCROLL DISTANCE
        // ------------------------------------------------------

        var scrollDistance =
          window.scrollY -
          umbrellaTriggerScroll;


        // ------------------------------------------------------
        // FALL DURATION
        // ------------------------------------------------------

        var scrollNeeded =
          window.innerHeight * 1.15;


        var progress =
          scrollDistance /
          scrollNeeded;


        progress =
          Math.max(
            0,
            Math.min(1, progress)
          );


        // ------------------------------------------------------
        // COMPENSATE FOR PARENT MOVING UP
        // ------------------------------------------------------

        var parentCompensation =
          Math.max(0, scrollDistance);


        // ------------------------------------------------------
        // DOWNWARD FALL
        // ------------------------------------------------------

        var fallDistance =
          (window.innerHeight * 1.55) +
          umbrellaHeight;


        var fallMovement =
          fallDistance *
          progress;


        var finalY =
          umbrellaStartY +
          parentCompensation +
          fallMovement;


        // ------------------------------------------------------
        // LEFT DRIFT
        // ------------------------------------------------------

        var leftMovement =
          -window.innerWidth *
          0.06 *
          progress;


        // ------------------------------------------------------
        // APPLY MOVEMENT
        // ------------------------------------------------------

        gsap.set(umbrellaCat, {

          x:
            leftMovement,

          y:
            finalY,

          rotation:
            -15 * progress,

          force3D: true
        });


        // ------------------------------------------------------
        // VISIBILITY — IMPORTANT FIX
        //
        // progress 0 = ALWAYS hidden.
        //
        // This prevents the cat sitting visibly at the top
        // before the actual fall begins.
        //
        // Once movement begins, visibility is determined by
        // the cat's REAL viewport position.
        // ------------------------------------------------------

        if (progress <= 0.001) {

          gsap.set(umbrellaCat, {
            visibility: "hidden"
          });

        } else {

          var catRect =
            umbrellaCat.getBoundingClientRect();


          var catIsOnScreen =
            catRect.bottom > 0 &&
            catRect.top < window.innerHeight;


          gsap.set(umbrellaCat, {

            visibility:
              catIsOnScreen
                ? "visible"
                : "hidden"
          });

        }

      },


      // --------------------------------------------------------
      // RESET ABOVE SECTION
      // --------------------------------------------------------

      onLeaveBack: function() {

        if (!umbrellaReady) return;


        gsap.set(umbrellaCat, {
          x: 0,
          y: umbrellaStartY,
          rotation: 0,
          visibility: "hidden"
        });
      }

    });

  }


} // END initHomeSection5
  
// =============================================================
// HOMEPAGE SECTION 6
// =============================================================
  
function initHomeSection6() {

  var weirdSunHorn = q(".home6_weirdsunhorn");
  var weirdSun = q(".home6_weirdsun");
  var home6TallPillar = q(".home6_tallpillar");
  var home6Lake = q(".home6_lake");

  var lakeWater1 = q(".home6_lake_water1");
  var lakeWater2 = q(".home6_lake_water2");

  if (!window.gsap || !window.ScrollTrigger) return;


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
  // scaleY 1.6 -> 1
  // ==========================================================

  if (home6Lake) {

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

        scrollTrigger: {
          trigger: home6Lake,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
          invalidateOnRefresh: true
        }
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
  // WEIRD SUN PARALLAX
  // ==========================================================

  if (weirdSun) {

    gsap.to(weirdSun, {
      y: 360,
      ease: "none",
      force3D: true,

      scrollTrigger: {
        trigger: weirdSun,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        invalidateOnRefresh: true
      }
    });
  }

  
  // ==========================================================
  // HOME 6 — CASTLE BUILD
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
      ".home6_giraffe",
      ".home6_castle",
      ".home6_pyramid",
      ".home6_dinosaur"
    ];

    var home6BuildLayers = home6BuildSelectors
      .map(function(selector) {
        return document.querySelector(selector);
      })
      .filter(Boolean);


    var camel = q(".home6_camel");
    var monster = q(".home6_monster");
    var rocket = q(".home6_rocket");
    var emperor = q(".home6_emperor");
    var castleInside = q(".home6_castleinside");
    var cat = q(".home6_cat");


    // NORMAL BUILD LAYERS

    if (home6BuildLayers.length) {

      gsap.set(home6BuildLayers, {
        yPercent: 80,
        force3D: true
      });
    }


    // SPECIAL LAYERS

    if (camel) {
      gsap.set(camel, {
        yPercent: 50,
        force3D: true
      });
    }

    if (monster) {
      gsap.set(monster, {
        yPercent: 50,
        force3D: true
      });
    }

    if (rocket) {
      gsap.set(rocket, {
        yPercent: 80,
        force3D: true
      });
    }

    if (emperor) {
      gsap.set(emperor, {
        yPercent: 80,
        force3D: true
      });
    }

    if (castleInside) {
      gsap.set(castleInside, {
        yPercent: 80,
        force3D: true
      });
    }

    if (cat) {
      gsap.set(cat, {
        yPercent: 80,
        force3D: true
      });
    }

    gsap.set(home6TallPillar, {
      yPercent: 80,
      force3D: true
    });


    // ========================================================
    // BUILD TIMELINE
    // ========================================================

    var buildTL = gsap.timeline({
      paused: true
    });


    if (home6BuildLayers.length) {

      buildTL.to(home6BuildLayers, {
        yPercent: 0,
        duration: 1.6,
        stagger: 0.035,
        ease: "power3.out",
        force3D: true
      }, 0);
    }


    if (camel) {

      buildTL.to(camel, {
        yPercent: 0,
        duration: 1.6,
        ease: "power3.out",
        force3D: true
      }, 0);
    }


    if (monster) {

      buildTL.to(monster, {
        yPercent: 0,
        duration: 1.6,
        ease: "power3.out",
        force3D: true
      }, 0);
    }


    if (rocket) {

      buildTL.to(rocket, {
        yPercent: 0,
        duration: 1.6,
        ease: "power3.out",
        force3D: true
      }, 0.5);
    }


    if (cat) {

      buildTL.to(cat, {
        yPercent: 0,
        duration: 1.6,
        ease: "power3.out",
        force3D: true
      }, 0.5);
    }


    if (emperor) {

      buildTL.to(emperor, {
        yPercent: 0,
        duration: 1.6,
        ease: "power3.out",
        force3D: true
      }, 0.65);
    }


    if (castleInside) {

      buildTL.to(castleInside, {
        yPercent: 0,
        duration: 1.6,
        ease: "power3.out",
        force3D: true
      }, 0.8);
    }


    buildTL.to(home6TallPillar, {
      yPercent: 0,
      duration: 2.1,
      ease: "power3.out",
      force3D: true
    }, 0);


    ScrollTrigger.create({

      trigger: home6TallPillar,
      start: "top 80%",

      invalidateOnRefresh: true,

      onEnter: function() {
        buildTL.timeScale(1).play();
      },

      onLeaveBack: function() {
        buildTL.timeScale(2).reverse();
      }

    });
  }


  // ==========================================================
  // UFO + LIGHT TRANSITION
  //
  // SIMPLE / STABLE VERSION
  //
  // UFO lands
  //      ↓
  // LIGHT + LIGHTBLUR
  // 0% -> 100%
  //      ↓
  // STAY AT 100%
  // ==========================================================

  var home6UFO = q(".home6_ufo");
  var home6Light = q(".home6_light");

  var home7LightBlur = q(".home7_lightblur");
  var home7WhiteCover = q(".home7_whitecover");


  var ufoHasLanded = false;
  var lightTriggerReached = false;
  var lightsAreOn = false;


  // ==========================================================
  // INITIAL STATES
  // ==========================================================

  if (home6UFO) {

    gsap.set(home6UFO, {
      y: -window.innerHeight * 1.5,
      visibility: "hidden",
      opacity: 0,
      force3D: true
    });
  }


  if (home6Light) {

    gsap.set(home6Light, {
      scaleX: 0,
      transformOrigin: "50% 0%",
      visibility: "hidden",
      opacity: 0,
      force3D: true
    });
  }


  if (home7LightBlur) {

    gsap.set(home7LightBlur, {
      scaleX: 0,
      transformOrigin: "50% 0%",
      visibility: "hidden",
      opacity: 0,
      force3D: true
    });
  }


  if (home7WhiteCover) {

    gsap.set(home7WhiteCover, {
      opacity: 1
    });
  }


  // ==========================================================
  // TURN LIGHTS ON
  //
  // ONLY:
  // 0 -> 100%
  // ==========================================================

  function turnHome6LightsOn() {

    if (lightsAreOn) return;
    if (!lightTriggerReached) return;
    if (!ufoHasLanded) return;


    lightsAreOn = true;


    // Kill anything left over before starting.
    if (home6Light) {
      gsap.killTweensOf(home6Light);
    }

    if (home7LightBlur) {
      gsap.killTweensOf(home7LightBlur);
    }


    var lightTL = gsap.timeline();


    // YELLOW UFO LIGHT
    // 0 -> 100%

    if (home6Light) {

      lightTL.set(home6Light, {
        scaleX: 0,
        visibility: "visible",
        opacity: 0.9
      }, 0);

      lightTL.to(home6Light, {
        scaleX: 1,
        duration: 0.18,
        ease: "power2.out",
        force3D: true
      }, 0);
    }


    // WHITE LIGHT BLUR
    // 0 -> 100%

    if (home7LightBlur) {

      lightTL.set(home7LightBlur, {
        scaleX: 0,
        visibility: "visible",
        opacity: 1
      }, 0);

      lightTL.to(home7LightBlur, {
        scaleX: 1,
        duration: 0.18,
        ease: "power2.out",
        force3D: true
      }, 0);
    }


    // WHITE COVER

    if (home7WhiteCover) {

      lightTL.to(home7WhiteCover, {
        opacity: 0,
        duration: 1,
        ease: "power3.out"
      }, 0);
    }
  }


  // ==========================================================
  // UFO ENTER
  // ==========================================================

  function showHome6UFO() {

    if (!home6UFO) return;


    gsap.killTweensOf(home6UFO);

    ufoHasLanded = false;


    gsap.set(home6UFO, {
      visibility: "visible",
      opacity: 1
    });


    gsap.to(home6UFO, {

      y: 0,

      duration: 1.2,

      ease: "power3.out",

      force3D: true,

      onComplete: function() {

        ufoHasLanded = true;

        turnHome6LightsOn();
      }

    });
  }


  // ==========================================================
  // RESET
  // ==========================================================

  function resetHome6UFO() {

    ufoHasLanded = false;
    lightTriggerReached = false;
    lightsAreOn = false;


    if (home6Light) {

      gsap.killTweensOf(home6Light);

      gsap.set(home6Light, {
        scaleX: 0,
        visibility: "hidden",
        opacity: 0
      });
    }


    if (home7LightBlur) {

      gsap.killTweensOf(home7LightBlur);

      gsap.set(home7LightBlur, {
        scaleX: 0,
        visibility: "hidden",
        opacity: 0
      });
    }


    if (home7WhiteCover) {

      gsap.killTweensOf(home7WhiteCover);

      gsap.set(home7WhiteCover, {
        opacity: 1
      });
    }


    if (home6UFO) {

      gsap.killTweensOf(home6UFO);

      gsap.set(home6UFO, {
        y: -window.innerHeight * 1.5,
        visibility: "hidden",
        opacity: 0,
        force3D: true
      });
    }
  }


  // ==========================================================
  // UFO TRIGGER
  //
  // weird sun reaches top 10%
  // ==========================================================

  if (weirdSun && home6UFO) {

    ScrollTrigger.create({

      trigger: weirdSun,

      start: "top 10%",

      invalidateOnRefresh: true,

      onEnter: function() {
        showHome6UFO();
      },

      onLeaveBack: function() {
        resetHome6UFO();
      }

    });
  }


  // ==========================================================
  // LIGHT TRIGGER
  //
  // lake reaches 70%
  // ==========================================================

  if (home6Lake) {

    ScrollTrigger.create({

      trigger: home6Lake,

      start: "top 70%",

      invalidateOnRefresh: true,

      onEnter: function() {

        lightTriggerReached = true;

        turnHome6LightsOn();
      },

      onLeaveBack: function() {

        lightTriggerReached = false;
      }

    });
  }


  requestAnimationFrame(function() {
    ScrollTrigger.refresh();
  });

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
    { sel: ".home8_bear",     y: 130, x: 30, r: 10 },

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


  requestAnimationFrame(function() {
    ScrollTrigger.refresh();
  });

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
// 4. Typography compensates against city scale so its
//    VISUAL size stays unchanged.
//
// 5. Homepage body width is a separate layout rule.
// =============================================================

function initHomeResponsiveScale() {

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

      phoneMin: 0.40,
      phoneMax: 0.52,

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
      outerBase: -600
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
      outerBase: -2230
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

      phoneMin: 0.40,
      phoneMax: 0.52,

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
    
      phoneMin: 0.40,
      phoneMax: 0.52,
    
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
// UNIVERSAL TYPOGRAPHY COMPENSATION
//
// Webflow controls the visual font size.
//
// CITY scaling changes the artwork size,
// but these text classes keep their Webflow visual size:
//
// .big_heading
// .section_heading
// .body_text
// ==========================================================

function applyCityTypography(city, scale) {

  var textElements =
    city.querySelectorAll(
      ".big_heading, .section_heading, .body_text"
    );


  textElements.forEach(function(el) {

    // Store the original Webflow font size ONCE
    if (!el.dataset.webflowFontSize) {

      var computed =
        window.getComputedStyle(el);

      var originalSize =
        parseFloat(computed.fontSize);


      if (!originalSize) return;


      el.dataset.webflowFontSize =
        originalSize;

    }


    var visualSize =
      parseFloat(
        el.dataset.webflowFontSize
      );


    // Counteract CITY scaling
    el.style.fontSize =
      (
        visualSize /
        scale
      ) +
      "px";

  });

}


  



  // ==========================================================
  // HOMEPAGE MOBILE BODY WIDTH
  //
  // IMPORTANT:
  // This affects HOMEPAGE ONLY.
  //
  // About Us is NOT touched.
  // ==========================================================

  function applyHomeBodyWidth(mode) {

    var homeBodyTexts =
      document.querySelectorAll(
        '[class*="home_section"] .body_text'
      );


    homeBodyTexts.forEach(
      function(el) {

        if (mode === "phone") {

          el.style.width = "68%";
          el.style.maxWidth = "68%";

        } else {

          el.style.width = "";
          el.style.maxWidth = "";

        }

      }
    );

  }



  // ==========================================================
  // APPLY EVERYTHING
  // ==========================================================

  function applyResponsiveCitySystem() {

    var width =
      document.documentElement.clientWidth;
    
    var height =
      document.documentElement.clientHeight;

// ==========================================================
// NAVBAR — REAL VIEWPORT WIDTH
// ==========================================================

var navbar =
  document.querySelector(".navbar_custom");

var navbarWrapper =
  document.querySelector(".navbar_wrapper");

if (navbar) {
  navbar.style.width =
    width + "px";

  navbar.style.maxWidth =
    width + "px";

  navbar.style.left =
    "0px";

  navbar.style.right =
    "auto";
}

if (navbarWrapper) {
  navbarWrapper.style.width =
    "100%";

  navbarWrapper.style.maxWidth =
    "100%";
}


    var mode =
      getResponsiveMode(
        width,
        height
      );


    document.documentElement.setAttribute(
      "data-responsive-mode",
      mode
    );



    // ========================================================
    // EACH CITY
    // ========================================================

    CITY_CONFIG.forEach(
      function(config) {

        var city =
          document.querySelector(
            config.city
          );


        var section =
          document.querySelector(
            config.section
          );


        if (!city) return;


        var scale =
          getCityScale(
            config,
            width,
            height
          );


        // ====================================================
        // SCALE CITY
        // ====================================================

        city.style.zoom =
          scale;




        

        // ====================================================
        // HORIZONTAL CENTRING
        //
        // Cross-browser version.
        //
        // IMPORTANT:
        // Do NOT measure the city after CSS zoom.
        // Keep the city's own coordinate system untouched.
        //
        // We center using the CITY element's UNSCALED layout width.
        // ====================================================
        
        city.style.left = "";
        city.style.marginLeft = "";
        city.style.transform = "";
        
        if (width < 1920) {
        
          var cityWidth =
            city.offsetWidth;
        
          var scaledCityWidth =
            cityWidth * scale;
        
        
          // Where the scaled city should begin
          // in viewport coordinates.
          var targetLeft =
            (
              width -
              scaledCityWidth
            ) / 2;
        
        
          // City's normal unscaled layout position
          var naturalLeft =
            city.offsetLeft;
        
        
          // Convert visual correction back into
          // the city's pre-zoom coordinate system.
          var visualCorrection =
            targetLeft -
            (
              naturalLeft * scale
            );
        
        
          var cityCorrection =
            visualCorrection /
            scale;
        
        
          city.style.left =
            cityCorrection +
            "px";
        
        }






        
        // ====================================================
        // TYPOGRAPHY COMPENSATION
        // ====================================================

        applyCityTypography(
          city,
          scale
        );



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

      }
    );



    // ========================================================
    // HOMEPAGE BODY WIDTH
    // ========================================================

    applyHomeBodyWidth(
      mode
    );



    // ========================================================
    // LENIS
    // ========================================================

    if (
      lenis &&
      lenis.resize
    ) {

      lenis.resize();

    }



    // ========================================================
    // SCROLLTRIGGER
    // ========================================================

    if (ScrollTrigger) {

      requestAnimationFrame(
        function() {

          ScrollTrigger.refresh();

        }
      );

    }

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



  
// ==========================================================
// TEMP ANDROID DEBUG PANEL
// DELETE AFTER TESTING
// ==========================================================

(function () {

  var panel = document.createElement("div");

  panel.style.cssText =
    "position:fixed;" +
    "top:140px;" +
    "left:5px;" +
    "z-index:99999999;" +
    "background:rgba(0,0,0,.85);" +
    "color:#00ff66;" +
    "font:11px/1.35 monospace;" +
    "padding:8px;" +
    "width:220px;" +
    "pointer-events:none;" +
    "white-space:pre-wrap;";

  document.body.appendChild(panel);


  function updateDebug() {

    var cw =
      document.documentElement.clientWidth;

    var ch =
      document.documentElement.clientHeight;

    var nav =
      document.querySelector(
        ".navbar_custom"
      );

    var navRect =
      nav
        ? nav.getBoundingClientRect()
        : null;

    var nativeScroll =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      0;

    var lenisScroll =
      (
        window.lenis &&
        typeof window.lenis.scroll === "number"
      )
        ? window.lenis.scroll
        : "NO";

    var triggers =
      window.ScrollTrigger
        ? window.ScrollTrigger.getAll().length
        : "NO";


    panel.textContent =
      "ANDROID DEBUG\n" +
      "----------------\n" +

      "innerW: " +
      window.innerWidth + "\n" +

      "clientW: " +
      cw + "\n" +

      "innerH: " +
      window.innerHeight + "\n" +

      "clientH: " +
      ch + "\n\n" +

      "nativeScroll: " +
      Math.round(nativeScroll) + "\n" +

      "lenisScroll: " +
      (
        typeof lenisScroll === "number"
          ? Math.round(lenisScroll)
          : lenisScroll
      ) +
      "\n\n" +

      "ScrollTriggers: " +
      triggers + "\n\n" +

      "navTop: " +
      (
        navRect
          ? Math.round(navRect.top)
          : "NO NAV"
      ) +
      "\n" +

      "navWidth: " +
      (
        navRect
          ? Math.round(navRect.width)
          : "NO NAV"
      );

    requestAnimationFrame(
      updateDebug
    );
  }


  updateDebug();

})();





})(window);

  

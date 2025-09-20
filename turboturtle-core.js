/* turboturtle-core.js
   - Lenis + ScrollTrigger wiring
   - Parallax tweens (guarded against missing DOM)
   - Jetplane arc (guarded)
   - Bigfly arc (jetplane-style, guarded)
   - Galaxy slow parallax (conditional pin if not fixed)
   - Video visibility play/pause
   - Dispatches 'TT:core-ready' when initialized
*/

(function (root) {
  if (!root) return;

  var isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  var gsap, ScrollTrigger;

  // Viewport units (only used where necessary; prefer %/yPercent)
  var vw = root.innerWidth / 100;
  var vh = root.innerHeight / 100;

  root.addEventListener("resize", function () {
    vw = root.innerWidth / 100;
    vh = root.innerHeight / 100;
    if (root.ScrollTrigger) root.ScrollTrigger.refresh();
  });

  function libsReady() {
    return !!(root.gsap && root.ScrollTrigger && root.Lenis);
  }

  function onDOMReady(fn) {
    if (document.readyState === "complete" || document.readyState === "interactive") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    }
  }

  function startWhenReady(tries) {
    if (libsReady()) {
      onDOMReady(startCore);
      return;
    }
    if (tries > 0) {
      setTimeout(function () { startWhenReady(tries - 1); }, 100);
    } else {
      console.error("[TT] Required libs not available (GSAP/ScrollTrigger/Lenis).");
    }
  }

  startWhenReady(120); // ~12s max

  function q(sel)   { return document.querySelector(sel); }
  function exists(s){ return !!q(s); }
  function tweenIf(sel, vars) { if (exists(sel)) gsap.to(sel, vars); }

  function startCore() {
    console.log("[TT] startCore entered");
    try {
      gsap = root.gsap;
      ScrollTrigger = root.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      // ─────────────────────────────────────
      // Lenis (smooth scrolling)
      // ─────────────────────────────────────
      var lenis = new root.Lenis({
        duration:         isMobile ? 6 : 4,
        easing:           function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
        smooth:           true,
        direction:        "vertical",
        gestureDirection: "vertical",
        mouseMultiplier:  1,
        touchMultiplier:  isMobile ? 0.2 : 2,
        infinite:         false
      });
      root.lenis = lenis;

      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);

      // Lenis ↔ ScrollTrigger bridge
      ScrollTrigger.scrollerProxy(window, {
        scrollTop: function (value) {
          if (arguments.length) {
            return lenis.scrollTo(value);
          }
          return (typeof lenis.scroll === "number") ? lenis.scroll : (root.pageYOffset || 0);
        },
        getBoundingClientRect: function () {
          return { top: 0, left: 0, width: innerWidth, height: innerHeight };
        },
        pinType: document.body.style.transform ? "transform" : "fixed"
      });

      lenis.on("scroll", ScrollTrigger.update);
      ScrollTrigger.addEventListener("refresh", function () { if (lenis.resize) lenis.resize(); });

      // Clear any transforms other systems may have applied before we start
      gsap.set([
        ".about_watermoon",
        ".about_planet",
        ".spacecats",
        ".about_saturn",
        ".satellitemove",
        ".about_section_1",
        ".about_section_2",
        ".lakeshrink",
        ".duckswim",
        ".about_rocket",
        ".about_turtle2",
        ".about_turtle1",
        ".about_nessie",
        ".about_giant_squid",
        ".about_flyduck",
        ".about_turtle3",
        ".about_chickenfish",
        ".about_octopus1",
        ".about_octopus2",
        ".about_bubble",
        ".about_bigbubble",
        ".about_bigfly",
        ".about_jetplane",
        ".about_galaxy"
      ], { clearProps: "transform" });

      // Initial refresh (after DOM/layout)
      ScrollTrigger.refresh();

      // ─────────────────────────────────────
      // Parallax & tweens (guarded)
      // ─────────────────────────────────────
      var parallaxTrigger = exists(".parallax-wrapper") ? ".parallax-wrapper" : "body";

      // Helper to apply common stable settings
      function stable(vars) {
        vars.overwrite = "auto";
        if (!vars.scrollTrigger) vars.scrollTrigger = {};
        vars.scrollTrigger.invalidateOnRefresh = true;
        return vars;
      }

      tweenIf(".about_planet", stable({
        y: () => 20 * vh,
        ease: "none",
        scrollTrigger: { trigger: parallaxTrigger, start: "top top", end: "bottom bottom", scrub: true }
      }));

      tweenIf(".spacecats", stable({
        x: () => -3 * vw,
        y: () => 55 * vh,
        rotation: 20, scale: 1.1, ease: "none",
        scrollTrigger: { trigger: parallaxTrigger, start: "top top", end: "bottom bottom", scrub: true }
      }));

      tweenIf(".about_saturn", stable({
        x: () => -2 * vw,
        y: () => 30 * vh,
        rotation: -25, scale: 0.9, ease: "none",
        scrollTrigger: { trigger: parallaxTrigger, start: "top top", end: "bottom bottom", scrub: true }
      }));

      tweenIf(".satellitemove", stable({
        x: () => 10 * vw,
        y: () => 50 * vh,
        rotation: 15, scale: 0.85, ease: "none",
        scrollTrigger: { trigger: parallaxTrigger, start: "top top", end: "bottom bottom", scrub: true }
      }));

      // ✅ FIXED: use yPercent instead of vh to avoid snapping on mobile UI/refresh
      tweenIf(".about_watermoon", stable({
        yPercent: 35,
        ease: "none",
        scrollTrigger: {
          trigger: ".about_watermoon",
          start: "-20% bottom",
          end: "bottom -20%",
          scrub: true
        }
      }));

      // Keep (guarded)
      tweenIf(".about_section_1", stable({
        y: () => -10 * vh,
        ease: "none",
        scrollTrigger: { trigger: parallaxTrigger, start: "top top", end: "bottom bottom", scrub: true }
      }));

      tweenIf(".about_section_2", stable({
        y: () => -10 * vh,
        ease: "none",
        scrollTrigger: { trigger: ".about_section_2", start: "top bottom", end: "bottom top", scrub: true }
      }));

      tweenIf(".lakeshrink", stable({
        scaleY: 0.4,
        ease: "none",
        scrollTrigger: { trigger: ".lakeshrink", start: "top bottom", end: "bottom top", scrub: true }
      }));

      tweenIf(".duckswim", stable({
        x: () => -5 * vw - 80,
        yPercent: -35,
        ease: "none",
        scrollTrigger: { trigger: ".duckswim", start: "top bottom", end: "bottom top", scrub: true }
      }));

      tweenIf(".about_rocket", stable({
        x: () => 130 * vw,
        y: () => -20 * vw,
        ease: "none",
        scrollTrigger: {
          trigger: parallaxTrigger,
          start: () => innerHeight * 0.4 + "px top",
          end:   () => innerHeight * 0.7 + "px top",
          scrub: true
        }
      }));

      tweenIf(".about_turtle2", stable({
        x: () => 30 * vw, y: () => 10 * vw, rotation: 6, ease: "none",
        scrollTrigger: { trigger: ".about_turtle2", start: "-20% bottom", end: "bottom -20%", scrub: true }
      }));

      tweenIf(".about_turtle1", stable({
        x: () => 28 * vw, y: () => -5 * vw, rotation: -5, ease: "none",
        scrollTrigger: { trigger: ".about_turtle1", start: "top bottom", end: "bottom top", scrub: true }
      }));

      tweenIf(".about_nessie", stable({
        x: () => 7 * vw, y: () => -13 * vw, rotation: -30, ease: "none",
        scrollTrigger: { trigger: ".about_nessie", start: "top bottom", end: "bottom top", scrub: true }
      }));

      tweenIf(".about_giant_squid", stable({
        x: () => 5 * vw, y: () => 60 * vh, rotation: -5, ease: "none",
        scrollTrigger: { trigger: ".about_giant_squid", start: "top bottom", end: "bottom -100%", scrub: true }
      }));

      tweenIf(".about_flyduck", stable({
        x: () => 120 * vw, y: () => -15 * vw, ease: "none",
        scrollTrigger: { trigger: ".about_flyduck", start: "top bottom", end: "bottom 80%", scrub: true }
      }));

      // (second watermoon tween consolidated/removed to avoid conflict)

      tweenIf(".about_turtle3", stable({
        x: () => 30 * vw, y: () => -5 * vh, ease: "none",
        scrollTrigger: { trigger: ".about_turtle3", start: "-20% bottom", end: "bottom -20%", scrub: true }
      }));

      tweenIf(".about_chickenfish", stable({
        x: () => 12 * vw, y: () => 5 * vh, ease: "none",
        scrollTrigger: { trigger: ".about_chickenfish", start: "top bottom", end: "bottom top", scrub: true }
      }));

      tweenIf(".about_octopus1", stable({
        x: () => 20 * vw, y: () => -15 * vh, rotation: -10, ease: "none",
        scrollTrigger: { trigger: ".about_octopus1", start: "top bottom", end: "bottom top", scrub: true }
      }));

      tweenIf(".about_octopus2", stable({
        x: () => 15 * vw, y: () => 25 * vh, rotation: 10, ease: "none",
        scrollTrigger: { trigger: ".about_octopus2", start: "-20% bottom", end: "bottom -20%", scrub: true }
      }));

      tweenIf(".about_bubble", stable({
        y: () => -500 * vh, x: () => 2 * vw, ease: "none",
        scrollTrigger: { trigger: ".about_bubble", start: "top bottom", end: "bottom -200%", scrub: true }
      }));

      tweenIf(".about_bigbubble", stable({
        y: () => -1400 * vh, x: () => 2 * vw, ease: "none",
        scrollTrigger: { trigger: ".about_bigbubble", start: "top bottom", end: "bottom -400%", scrub: true }
      }));

      // ─────────────────────────────────────
      // Jetplane — dip then climb + banking (guarded)
      // ─────────────────────────────────────
      (function initJetplane() {
        var jet = q(".about_jetplane");
        if (!jet) return;

        // clear any inline transform from previous runs
        jet.style.transform = "";

        ScrollTrigger.create({
          trigger: ".about_jetplane",
          start: "top 20%",
          end: "bottom 50%",
          scrub: true,
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
            var dDip = (t < dipEnd) ? (dipAmp * (Math.PI / dipEnd) * Math.cos(Math.PI * (t / dipEnd))) : 0;

            var dydt = dClimb + dDip;
            var dxdt = 130 * vw;
            var angleDeg = Math.atan2(dydt, dxdt) * (180 / Math.PI);
            if (t < 0.05) angleDeg *= t / 0.05;

            var targetRot = Math.max(-18, Math.min(angleDeg * 0.9, 0));
            var prevRot = parseFloat(jet.dataset.prevRot || "0");
            var smooth = prevRot + (targetRot - prevRot) * 0.15;
            jet.dataset.prevRot = smooth;

            jet.style.transform = "translate(" + x + "px," + y + "px) rotate(" + smooth + "deg)";
          }
        });
      })();

      // ─────────────────────────────────────
      // Bigfly — smooth arc with constant rotation (no dip)
      // ─────────────────────────────────────
      (function initBigfly() {
        var fly = q(".about_bigfly");
        if (!fly) return;
        fly.style.transform = "";

        ScrollTrigger.create({
          trigger: ".about_bigfly",
          start: "-20% bottom",
          end: "bottom -20%",
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: function (self) {
            var t = self.progress; // 0..1
            var x = 80 * vw * t;
            var arc = (isMobile ? 24 : 32) * vh;
            var climbY = -arc * Math.pow(t, 2.1);
            var baseY = -3 * vw;
            var y = baseY + climbY;
            var rot = -10;
            fly.style.transform = "translate(" + x + "px," + y + "px) rotate(" + rot + "deg)";
          }
        });
      })();

      // ─────────────────────────────────────
      // Galaxy ultra-slow parallax (moves UP, conditional pin)
      // ─────────────────────────────────────
      (function initGalaxy() {
        var el = q(".about_galaxy");
        if (!el) return;

        var isFixed = getComputedStyle(el).position === "fixed";
        var ratio = isMobile ? 0.015 : 0.025;

        gsap.set(el, { y: 0, force3D: true });

        ScrollTrigger.create({
          trigger: exists(".about_underwater") ? ".about_underwater" : parallaxTrigger,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.5,
          pin: isFixed ? false : el,
          pinSpacing: false,
          invalidateOnRefresh: true,
          onUpdate: function (self) {
            var y = -(self.scroll() - self.start) * ratio; // move up when scrolling down
            gsap.set(el, { y: y });
          }
        });

        ScrollTrigger.addEventListener("refresh", function () { gsap.set(el, { y: 0 }); });
      })();

      // ─────────────────────────────────────
      // Video visibility handling
      // ─────────────────────────────────────
      (function initVideos() {
        var vids = document.querySelectorAll(".about_onceupon video, video[data-pause-offscreen]");
        if (!vids.length) return;

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
            onEnterBack: function () { try { v.play && v.play(); } catch (e) {} }
          });

          ScrollTrigger.create({
            trigger: v,
            start: "bottom top",
            end: "top bottom",
            onLeave: function () { try { v.pause && v.pause(); } catch (e) {} },
            onLeaveBack: function () { try { v.pause && v.pause(); } catch (e) {} }
          });
        });

        document.addEventListener("visibilitychange", function () {
          vids.forEach(function (v) {
            try {
              if (document.hidden) { v.pause && v.pause(); }
              else {
                var r = v.getBoundingClientRect();
                var visible = (r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth);
                if (visible && v.play) v.play();
              }
            } catch (e) {}
          });
        });
      })();

      // Optional: stabilize stacking math (if you add this CSS)
      // .viewport_wrapper { position: relative; isolation: isolate; }

      // final refresh after all tweens created
      root.addEventListener("load", function(){ ScrollTrigger.refresh(); });

      console.log("[TT] startCore about to dispatch");
      root.dispatchEvent(new CustomEvent("TT:core-ready"));
      console.log("[TT] startCore dispatched");
    } catch (e) {
      console.error("[TT] startCore crashed", e);
    }
  }
})(window);

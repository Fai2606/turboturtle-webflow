/* turboturtle.js — project bootstrap
   - Lenis + GSAP ScrollTrigger wiring
   - Parallax tweens
   - Jetplane arc
   - Woman UFO chase + Akira trail
   - Galaxy slow parallax (masked)
   - Video visibility play/pause
*/

(function (root) {
  // ─────────────────────────────────────────
  // Guards
  // ─────────────────────────────────────────
  if (!root) return;

  // namespace (optional export)
  root.TT = root.TT || {};

  // ─────────────────────────────────────────
  // Short helpers
  // ─────────────────────────────────────────
  var isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  var vw = root.innerWidth  / 100;
  var vh = root.innerHeight / 100;

  function updateVUnits() {
    vw = root.innerWidth  / 100;
    vh = root.innerHeight / 100;
  }
  root.addEventListener("resize", updateVUnits);

  // ─────────────────────────────────────────
  // Boot when libs are ready
  // ─────────────────────────────────────────
  function libsReady() {
    return !!(root.gsap && root.ScrollTrigger && root.Lenis);
  }

  function onReady(fn) {
    if (document.readyState === "complete" || document.readyState === "interactive") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    }
  }

  waitForLibsAndStart(80);

  function waitForLibsAndStart(tries) {
    if (libsReady()) {
      onReady(startApp);
      return;
    }
    if (tries > 0) {
      setTimeout(function () { waitForLibsAndStart(tries - 1); }, 100);
    }
  }

  // ─────────────────────────────────────────
  // Main
  // ─────────────────────────────────────────
  function startApp() {
    var gsap          = root.gsap;
    var ScrollTrigger = root.ScrollTrigger;

    gsap.registerPlugin(ScrollTrigger);

    // Smooth scrolling
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
    // keep a ref in case other modules want it
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
        return lenis.scroll;
      },
      getBoundingClientRect: function () {
        return { top: 0, left: 0, width: innerWidth, height: innerHeight };
      },
      pinType: document.body.style.transform ? "transform" : "fixed"
    });

    lenis.on && lenis.on("scroll", ScrollTrigger.update);
    ScrollTrigger.addEventListener("refresh", function () { lenis.resize && lenis.resize(); });
    ScrollTrigger.refresh();

    // ───────────────────────────────────────
    // Parallax & element tweens
    // ───────────────────────────────────────
    gsap.to(".about_planet", {
      y:    20 * vh,
      ease: "none",
      scrollTrigger: {
        trigger: ".parallax-wrapper",
        start:   "top top",
        end:     "bottom bottom",
        scrub:   true
      }
    });

    gsap.to(".spacecats", {
      x:        -3 * vw,
      y:        55 * vh,
      rotation: 20,
      scale:    1.1,
      ease:     "none",
      scrollTrigger: {
        trigger: ".parallax-wrapper",
        start:   "top top",
        end:     "bottom bottom",
        scrub:   true
      }
    });

    gsap.to(".about_saturn", {
      x:        -2 * vw,
      y:        30 * vh,
      rotation: -25,
      scale:    0.9,
      ease:     "none",
      scrollTrigger: {
        trigger: ".parallax-wrapper",
        start:   "top top",
        end:     "bottom bottom",
        scrub:   true
      }
    });

    gsap.to(".satellitemove", {
      x:        10 * vw,
      y:        50 * vh,
      rotation: 15,
      scale:    0.85,
      ease:     "none",
      scrollTrigger: {
        trigger: ".parallax-wrapper",
        start:   "top top",
        end:     "bottom bottom",
        scrub:   true
      }
    });

    gsap.to(".about_watermoon", {
      y:    35 * vh,
      ease: "none",
      scrollTrigger: {
        trigger: ".parallax-wrapper",
        start:   "top top",
        end:     "bottom bottom",
        scrub:   true
      }
    });

    gsap.to(".about_section_1", {
      y:    -10 * vh,
      ease: "none",
      scrollTrigger: {
        trigger: ".parallax-wrapper",
        start:   "top top",
        end:     "bottom bottom",
        scrub:   true
      }
    });

    gsap.to(".about_section_2", {
      y:    -10 * vh,
      ease: "none",
      scrollTrigger: {
        trigger: ".about_section_2",
        start:   "top bottom",
        end:     "bottom top",
        scrub:   true
      }
    });

    gsap.to(".lakeshrink", {
      scaleY: 0.4,
      ease:   "none",
      scrollTrigger: {
        trigger: ".lakeshrink",
        start:   "top bottom",
        end:     "bottom top",
        scrub:   true
      }
    });

    gsap.to(".duckswim", {
      x:        -5 * vw - 80,
      yPercent: -35,
      ease:     "none",
      scrollTrigger: {
        trigger: ".duckswim",
        start:   "top bottom",
        end:     "bottom top",
        scrub:   true
      }
    });

    gsap.to(".about_rocket", {
      x:    130 * vw,
      y:    -20 * vw,
      ease: "none",
      scrollTrigger: {
        trigger:               ".parallax-wrapper",
        start:                 function () { return innerHeight * 0.4 + "px top"; },
        end:                   function () { return innerHeight * 0.7 + "px top"; },
        scrub:                 true,
        invalidateOnRefresh:   true
      }
    });

    gsap.to(".about_turtle2", {
      x:        30 * vw,
      y:        5 * vw,
      rotation: 5,
      ease:     "none",
      scrollTrigger: {
        trigger:             ".about_turtle2",
        start:               "top bottom",
        end:                 "bottom top",
        scrub:               true,
        invalidateOnRefresh: true
      }
    });

    gsap.to(".about_turtle1", {
      x:        28 * vw,
      y:        -5 * vw,
      rotation: -5,
      ease:     "none",
      scrollTrigger: {
        trigger:             ".about_turtle1",
        start:               "top bottom",
        end:                 "bottom top",
        scrub:               true,
        invalidateOnRefresh: true
      }
    });

    gsap.to(".about_nessie", {
      x:        7 * vw,
      y:        -13 * vw,
      rotation: -30,
      ease:     "none",
      scrollTrigger: {
        trigger:             ".about_nessie",
        start:               "top bottom",
        end:                 "bottom top",
        scrub:               true,
        invalidateOnRefresh: true
      }
    });

    gsap.to(".about_giant_squid", {
      x:        3 * vw,
      y:        7 * vw,
      rotation: -5,
      ease:     "none",
      scrollTrigger: {
        trigger:             ".about_giant_squid",
        start:               "top bottom",
        end:                 "bottom top",
        scrub:               true,
        invalidateOnRefresh: true
      }
    });

    gsap.to(".about_flyduck", {
      x:    120 * vw,
      y:    -15 * vw,
      ease: "none",
      scrollTrigger: {
        trigger:             ".about_flyduck",
        start:               "top bottom",
        end:                 "bottom 80%",
        scrub:               true,
        invalidateOnRefresh: true
      }
    });

    gsap.to(".about_watermoon", {
      y:    5 * vw,
      ease: "none",
      scrollTrigger: {
        trigger:             ".about_watermoon",
        start:               "top bottom",
        end:                 "bottom top",
        scrub:               true,
        invalidateOnRefresh: true
      }
    });

    // ───────────────────────────────────────
    // Jetplane — dip then strong climb + bank
    // ───────────────────────────────────────
    (function initJet() {
      var jet = document.querySelector(".about_jetplane");
      if (!jet) return;

      ScrollTrigger.create({
        trigger:             ".about_jetplane",
        start:               "top 50%",
        end:                 "bottom 30%",
        scrub:               true,
        invalidateOnRefresh: true,
        onUpdate: function (self) {
          var t = self.progress;                 // 0 → 1

          var x = 145 * vw * t;

          var arc     = (isMobile ? 26 : 36) * vh;
          var p       = 2.2;
          var climbY  = -arc * Math.pow(t, p);

          var dipEnd  = 0.18;
          var dipAmp  = (isMobile ? 6 : 9) * vh;
          var inDip   = t < dipEnd;
          var dipY    = inDip ? dipAmp * Math.sin(Math.PI * (t / dipEnd)) : 0;

          var y = -5 * vw + dipY + climbY;

          var dClimb   = -arc * p * Math.pow(Math.max(t, 0.0001), p - 1);
          var dDip     = inDip ? dipAmp * (Math.PI / dipEnd) * Math.cos(Math.PI * (t / dipEnd)) : 0;
          var dydt     = dClimb + dDip;
          var dxdt     = 130 * vw;
          var angleDeg = Math.atan2(dydt, dxdt) * (180 / Math.PI);

          if (t < 0.05) {
            angleDeg *= t / 0.05; // soften early tilt
          }

          var targetRot  = Math.max(-18, Math.min(angleDeg * 0.9, 0));
          var prevRot    = parseFloat(jet.dataset.prevRot || "0");
          var smoothed   = prevRot + (targetRot - prevRot) * 0.15;
          jet.dataset.prevRot = smoothed;

          jet.style.transform = "translate(" + x + "px," + y + "px) rotate(" + smoothed + "deg)";
        }
      });
    })();

    // ───────────────────────────────────────
    // Galaxy ultra-slow parallax (masked)
    // ───────────────────────────────────────
    (function initGalaxy() {
      var el = document.querySelector(".about_galaxy");
      if (!el) return;

      var ratio = isMobile ? 0.005 : 0.01; // tiny movement => deep space feel
      gsap.set(el, { y: 0, force3D: true });

      ScrollTrigger.create({
        trigger:   ".about_underwater",
        start:     "top bottom",
        end:       "bottom top",
        scrub:     0.35,
        pin:       el,        // transform pin => stays clipped by overflow hidden
        pinSpacing:false,
        onUpdate:  function (self) {
          var y = (self.scroll() - self.start) * ratio;
          gsap.set(el, { y: y });
        }
      });

      ScrollTrigger.addEventListener("refresh", function () { gsap.set(el, { y: 0 }); });
    })();

    // ───────────────────────────────────────
    // Video: play a bit before entering, pause when fully out
    // ───────────────────────────────────────
    (function initVideoVisibility() {
      var vids = document.querySelectorAll(".about_onceupon video, video[data-pause-offscreen]");
      if (!vids.length) return;

      vids.forEach(function (v) {
        v.setAttribute("playsinline", "");
        v.setAttribute("muted", "");
      });

      vids.forEach(function (v) {
        ScrollTrigger.create({
          trigger:    v,
          start:      "top 120%",
          end:        "bottom -20%",
          onEnter:    function () { try { v.play && v.play(); } catch (e) {} },
          onEnterBack:function () { try { v.play && v.play(); } catch (e) {} }
        });

        ScrollTrigger.create({
          trigger:     v,
          start:       "bottom top",
          end:         "top bottom",
          onLeave:     function () { try { v.pause && v.pause(); } catch (e) {} },
          onLeaveBack: function () { try { v.pause && v.pause(); } catch (e) {} }
        });
      });

      document.addEventListener("visibilitychange", function () {
        vids.forEach(function (v) {
          try {
            if (document.hidden) { v.pause && v.pause(); }
            else {
              var r = v.getBoundingClientRect();
              var onScreen = r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth;
              if (onScreen) { v.play && v.play(); }
            }
          } catch (e) {}
        });
      });
    })();

    // ───────────────────────────────────────
    // Woman UFO: chase + trail
    // ───────────────────────────────────────
// ───────────────────────────────────────
// Woman UFO: chase + trail (hardened)
// ───────────────────────────────────────
(function initUFO() {
  var ufoEl = document.querySelector(".about_womanufo");
  if (!ufoEl) return;

  // 1) Force the var-based transform so CSS custom props actually move it,
  //    even if the stylesheet rule was optimized away.
  //    This matches your original CSS exactly.
  ufoEl.style.transform =
    "translateX(var(--ufo-x, 0px)) " +
    "translateY(var(--ufo-y, 0px)) " +
    "rotate(var(--ufo-rot, 0deg))";
  ufoEl.style.willChange = "transform";

  var velocity   = isMobile ? 1 : 3;
  var maxAmpVal  = isMobile ? 20 * vh : 60 * vh;
  var tiltDiv    = isMobile ? 3 : 1;
  var chaseSpeed = isMobile ? 0.08 : 0.15;

  function getBaseY() { return (isMobile ? -10 : -20) * vh; }

  var targetState = { x: 0, y: getBaseY(), rot: 0 };
  var actualState = { x: 0, y: getBaseY(), rot: 0 };

  // Prime uniforms
  ufoEl.style.setProperty("--ufo-x",   actualState.x + "px");
  ufoEl.style.setProperty("--ufo-y",   actualState.y + "px");
  ufoEl.style.setProperty("--ufo-rot", actualState.rot + "deg");

  // 2) Horizontal driver via ScrollTrigger (with robust fallback trigger)
  var hasParallaxWrapper = !!document.querySelector(".parallax-wrapper");
  var triggerSel         = hasParallaxWrapper ? ".parallax-wrapper" : "body";

  var horizST = ScrollTrigger.create({
    trigger: triggerSel,
    start:   "top top",
    end:     isMobile
              ? (innerHeight * 0.25) + "px top"
              : (innerHeight * 0.5) + "px top",
    scrub:   true,
    onUpdate:function (self) {
      targetState.x = 130 * vw * self.progress;
      lastSTProgress = self.progress;
    }
  });

  // If ST progress never updates (rare timing/layout cases), use page ratio fallback.
  var lastSTProgress = 0;
  function fallBackX() {
    if (lastSTProgress > 0) return; // ST is working
    var doc = document.documentElement;
    var maxScroll = (doc.scrollHeight - innerHeight) || 1;
    var ratio = Math.max(0, Math.min(1, (root.pageYOffset || 0) / maxScroll));
    targetState.x = 130 * vw * ratio;
  }

  // 3) Bounce/tilt from scroll velocity (Lenis-aware)
  var lastScroll  = 0;
  var bouncePhase = 0;
  var idleFrames  = 0;
  var idleMax     = 30;

  function updateBounceTilt() {
    var scrollPos = (typeof lenis.scroll === "number") ? lenis.scroll : (root.pageYOffset || 0);
    var deltaY    = scrollPos - lastScroll;
    lastScroll    = scrollPos;

    // Keep horizontal moving even if ST didn't wire yet
    fallBackX();

    var amplitude   = Math.min(Math.abs(deltaY) * velocity, maxAmpVal);
    var horizontal  = targetState.x / vw;
    var bounceScale = (horizontal <= 30) ? 0 :
                      (horizontal >= 100) ? 1 :
                      (horizontal - 30) / 70;

    if (Math.abs(deltaY) < 1) {
      idleFrames++;
      if (idleFrames > idleMax) {
        gsap.to(targetState, {
          y:        getBaseY(),
          duration: 0.4,
          ease:     "power3.out"
        });
      }
    } else {
      idleFrames += 0;
      bouncePhase += 0.1;
      targetState.y = getBaseY() + Math.sin(bouncePhase) * amplitude * bounceScale;
    }

    var rawTilt = deltaY / tiltDiv;
    targetState.rot = Math.max(-20, Math.min(rawTilt, 20)) * bounceScale;

    requestAnimationFrame(updateBounceTilt);
  }
  requestAnimationFrame(updateBounceTilt);

  // 4) Trail canvas (Akira)
  var canvas = document.createElement("canvas");
  var ctx    = canvas.getContext("2d");
  Object.assign(canvas.style, {
    position:      "fixed",
    top:           0,
    left:          0,
    pointerEvents: "none",
    zIndex:        10,
    background:    "transparent"
  });
  canvas.id = "akiraMouseTrail";
  (document.querySelector(".fixed_screen_area") || document.body).appendChild(canvas);

  function resizeCanvas() {
    canvas.width  = innerWidth;
    canvas.height = innerHeight;
  }
  resizeCanvas();
  root.addEventListener("resize", resizeCanvas);

  var trailPoints = [];
  var trailMax    = 40;
  var fadeTime    = 800;

  function animateUFO() {
    // chase-to-target
    actualState.x   += (targetState.x   - actualState.x)   * chaseSpeed;
    actualState.y   += (targetState.y   - actualState.y)   * chaseSpeed;
    actualState.rot += (targetState.rot - actualState.rot) * chaseSpeed;

    // uniforms
    ufoEl.style.setProperty("--ufo-x",   actualState.x + "px");
    ufoEl.style.setProperty("--ufo-y",   actualState.y + "px");
    ufoEl.style.setProperty("--ufo-rot", actualState.rot + "deg");

    // trail sampling + draw
    var rect = ufoEl.getBoundingClientRect();
    trailPoints.push({
      x: rect.left + rect.width  / 2,
      y: rect.top  + rect.height / 2,
      t: performance.now()
    });
    if (trailPoints.length > trailMax) trailPoints.shift();

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var maxWidth = rect.height * 0.4;

    for (var i = 0; i < trailPoints.length - 1; i++) {
      var p1 = trailPoints[i];
      var p2 = trailPoints[i + 1];
      var dx = p2.x - p1.x;
      var dy = p2.y - p1.y;
      if (Math.hypot(dx, dy) < 1) continue;

      var age   = performance.now() - p1.t;
      var alpha = 1 - age / fadeTime;
      if (alpha <= 0) continue;

      ctx.strokeStyle = "rgba(225,255,0," + alpha + ")";
      ctx.lineWidth   = 10 + (maxWidth - 10) * alpha;
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.quadraticCurveTo(
        p1.x + dx * 0.5,
        p1.y + dy * 0.5,
        p2.x, p2.y
      );
      ctx.stroke();
    }

    requestAnimationFrame(animateUFO);
  }
  requestAnimationFrame(animateUFO);
})();

  }
})(window);

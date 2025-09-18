/* turboturtle.js — core site code
   - Lenis + GSAP ScrollTrigger wiring
   - Parallax tweens
   - Jetplane arc
   - Galaxy ultra-slow parallax (masked by .about_underwater, no pin)
   - Video visibility play/pause
*/

(function (root) {
  if (!root) return;

  var isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  var vw = root.innerWidth  / 100;
  var vh = root.innerHeight / 100;

  function updateVUnits() {
    vw = root.innerWidth  / 100;
    vh = root.innerHeight / 100;
  }
  root.addEventListener("resize", updateVUnits);

  function libsReady() {
    return !!(root.gsap && root.ScrollTrigger && root.Lenis);
  }

  function onDOMReady(fn) {
    if (document.readyState === "complete" || document.readyState === "interactive") fn();
    else document.addEventListener("DOMContentLoaded", fn, { once: true });
  }

  (function waitForLibs(tries){
    if (libsReady()) onDOMReady(start);
    else if (tries > 0) setTimeout(function(){ waitForLibs(tries-1); }, 100);
  })(80);

  function start() {
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
    root.lenis = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Lenis ↔ ScrollTrigger bridge (no global pinType forcing)
    ScrollTrigger.scrollerProxy(window, {
      scrollTop: function (value) {
        if (arguments.length) return lenis.scrollTo(value);
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
        trigger:             ".parallax-wrapper",
        start:               function () { return innerHeight * 0.4 + "px top"; },
        end:                 function () { return innerHeight * 0.7 + "px top"; },
        scrub:               true,
        invalidateOnRefresh: true
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
          var t = self.progress;

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

          if (t < 0.05) angleDeg *= t / 0.05;

          var targetRot  = Math.max(-18, Math.min(angleDeg * 0.9, 0));
          var prevRot    = parseFloat(jet.dataset.prevRot || "0");
          var smoothed   = prevRot + (targetRot - prevRot) * 0.15;
          jet.dataset.prevRot = smoothed;

          jet.style.transform = "translate(" + x + "px," + y + "px) rotate(" + smoothed + "deg)";
        }
      });
    })();

    // ───────────────────────────────────────
    // Galaxy ultra-slow parallax (masked by .about_underwater, NO pin)
    // ───────────────────────────────────────
    (function initGalaxy() {
      var el = document.querySelector(".about_galaxy");
      var host = document.querySelector(".about_underwater");
      if (!el || !host) return;

      // keep transforms GPU-friendly and keep host in a transform context
      gsap.set(host, { willChange: "transform", transform: "translateZ(0)" });
      gsap.set(el,   { willChange: "transform", force3D: true });

      // move MUCH slower than its parent section
      var ratio = isMobile ? 0.0015 : 0.0025; // tweak smaller to keep it on screen longer

      ScrollTrigger.create({
        trigger:   host,
        start:     "top bottom",
        end:       "bottom top",
        scrub:     0.35,
        onUpdate:  function (self) {
          // total scroll distance of this section through the viewport
          var total = self.end - self.start;
          // Counter the parent’s upward motion so net motion is slower
          // parent moves ~ -total; we move back up by (1 - ratio) * total * progress
          var y = - (1 - ratio) * total * self.progress;
          gsap.set(el, { y: y });
        }
      });

      ScrollTrigger.addEventListener("refresh", function () {
        gsap.set(el, { y: 0 });
      });
    })();

    // ───────────────────────────────────────
    // Video: play slightly before enter, pause fully out
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
          trigger:     v,
          start:       "top 120%",
          end:         "bottom -20%",
          onEnter:     function(){ try{ v.play && v.play(); }catch(e){} },
          onEnterBack: function(){ try{ v.play && v.play(); }catch(e){} }
        });

        ScrollTrigger.create({
          trigger:     v,
          start:       "bottom top",
          end:         "top bottom",
          onLeave:     function(){ try{ v.pause && v.pause(); }catch(e){} },
          onLeaveBack: function(){ try{ v.pause && v.pause(); }catch(e){} }
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
          } catch(e){}
        });
      });
    })();
  }
})(window);

/* turboturtle.js
   - Single-file app for TurboTurtle Webflow
   - Requires: gsap, ScrollTrigger, Lenis loaded before this file (see Webflow snippet)
   - Robust boot / guards; optional HUD controlled by window.TT_DEBUG
*/
(function (root) {
  if (!root) return;
  var doc = root.document;

  // small helpers
  var isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  var vw = root.innerWidth  / 100;
  var vh = root.innerHeight / 100;
  function updateV() { vw = root.innerWidth/100; vh = root.innerHeight/100; }
  root.addEventListener("resize", updateV);

  // wait for external libs (gsap, ScrollTrigger, Lenis)
  function libsReady() {
    return !!(root.gsap && root.ScrollTrigger && root.Lenis);
  }
  function onDOMReady(fn) {
    if (doc.readyState === "complete" || doc.readyState === "interactive") fn();
    else doc.addEventListener("DOMContentLoaded", fn, { once: true });
  }

  (function waitForLibs(tries) {
    if (libsReady()) {
      onDOMReady(startApp);
      return;
    }
    if (tries > 0) setTimeout(function(){ waitForLibs(tries-1); }, 120);
    else console.warn("[TT] libs not ready - start aborted");
  })(60);

  // small HUD helper
  function makeHUD() {
    if (!root.TT_DEBUG) return null;
    var d = doc.createElement("div");
    d.id = "tt-hud";
    d.style.cssText = "position:fixed;left:8px;bottom:8px;background:rgba(0,0,0,.6);color:#0f0;font:12px/1.2 monospace;padding:6px 8px;border-radius:6px;z-index:99999";
    doc.body.appendChild(d);
    return d;
  }

  // MAIN
  function startApp() {
    var gsap = root.gsap;
    var ScrollTrigger = root.ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);

    var hud = makeHUD();

    function hudSet(txt) { if (hud) hud.textContent = txt; }

    // == Lenis smooth scroll setup ==
    var lenis = new root.Lenis({
      duration:         isMobile ? 6 : 4,
      easing:           function(t){ return Math.min(1,1.001 - Math.pow(2, -10*t)); },
      smooth:           true,
      direction:        "vertical",
      gestureDirection: "vertical",
      mouseMultiplier:  1,
      touchMultiplier:  isMobile ? 0.2 : 2,
      infinite:         false
    });
    root.lenis = lenis;

    function raf(t) { lenis.raf(t); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);

    // Tell ScrollTrigger to use Lenis
    ScrollTrigger.scrollerProxy(window, {
      scrollTop: function(value){ return arguments.length ? lenis.scrollTo(value) : lenis.scroll; },
      getBoundingClientRect: function(){ return { top:0,left:0,width: innerWidth, height: innerHeight }; },
      pinType: doc.body.style.transform ? "transform" : "fixed"
    });
    lenis.on && lenis.on("scroll", ScrollTrigger.update);
    ScrollTrigger.addEventListener("refresh", function(){ lenis.resize && lenis.resize(); });
    ScrollTrigger.refresh();

    // == Parallax tweens (kept style-broken lines broken for readability) ==
    gsap.to(".about_planet", {
      y: 20 * vh,
      ease: "none",
      scrollTrigger: {
        trigger: ".parallax-wrapper",
        start: "top top",
        end: "bottom bottom",
        scrub: true
      }
    });

    gsap.to(".spacecats", {
      x: -3 * vw,
      y: 55 * vh,
      rotation: 20,
      scale: 1.1,
      ease: "none",
      scrollTrigger: {
        trigger: ".parallax-wrapper",
        start: "top top",
        end: "bottom bottom",
        scrub: true
      }
    });

    gsap.to(".about_saturn", {
      x: -2 * vw,
      y: 30 * vh,
      rotation: -25,
      scale: 0.9,
      ease: "none",
      scrollTrigger: {
        trigger: ".parallax-wrapper",
        start: "top top",
        end: "bottom bottom",
        scrub: true
      }
    });

    gsap.to(".satellitemove", {
      x: 10 * vw,
      y: 50 * vh,
      rotation: 15,
      scale: 0.85,
      ease: "none",
      scrollTrigger: {
        trigger: ".parallax-wrapper",
        start: "top top",
        end: "bottom bottom",
        scrub: true
      }
    });

    gsap.to(".about_watermoon", {
      y: 35 * vh,
      ease: "none",
      scrollTrigger: {
        trigger: ".parallax-wrapper",
        start: "top top",
        end: "bottom bottom",
        scrub: true
      }
    });

    gsap.to(".about_section_1", {
      y: -10 * vh,
      ease: "none",
      scrollTrigger: {
        trigger: ".parallax-wrapper",
        start: "top top",
        end: "bottom bottom",
        scrub: true
      }
    });

    gsap.to(".about_section_2", {
      y: -10 * vh,
      ease: "none",
      scrollTrigger: {
        trigger: ".about_section_2",
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });

    gsap.to(".lakeshrink", {
      scaleY: 0.4,
      ease: "none",
      scrollTrigger: {
        trigger: ".lakeshrink",
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });

    gsap.to(".duckswim", {
      x: -5 * vw - 80,
      yPercent: -35,
      ease: "none",
      scrollTrigger: {
        trigger: ".duckswim",
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });

    gsap.to(".about_rocket", {
      x: 130 * vw,
      y: -20 * vw,
      ease: "none",
      scrollTrigger: {
        trigger: ".parallax-wrapper",
        start: function(){ return innerHeight * 0.4 + "px top"; },
        end: function(){ return innerHeight * 0.7 + "px top"; },
        scrub: true,
        invalidateOnRefresh: true
      }
    });

    // ... other tweens omitted for brevity here (keep any other existing tweens you need)

    // == Jetplane custom arc (dip then steep climb) ==
    (function initJet() {
      var jet = doc.querySelector(".about_jetplane");
      if (!jet) return;
      ScrollTrigger.create({
        trigger: ".about_jetplane",
        start: "top 50%",
        end: "bottom 30%",
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: function(self) {
          var t = self.progress;
          var x = 145 * vw * t;
          var arc = (isMobile ? 26 : 36) * vh;
          var p   = 2.2;
          var climbY = -arc * Math.pow(t, p);
          var dipEnd = 0.18;
          var dipAmp = (isMobile ? 6 : 9) * vh;
          var dipY = (t < dipEnd) ? dipAmp * Math.sin(Math.PI * (t / dipEnd)) : 0;
          var y = -5 * vw + dipY + climbY;

          var dClimb = -arc * p * Math.pow(Math.max(t, 0.0001), p - 1);
          var dDip = (t < dipEnd) ? dipAmp * (Math.PI / dipEnd) * Math.cos(Math.PI * (t / dipEnd)) : 0;
          var dydt = dClimb + dDip;
          var dxdt = 130 * vw;
          var angleDeg = Math.atan2(dydt, dxdt) * (180 / Math.PI);

          if (t < 0.05) angleDeg *= t / 0.05;
          var targetRot = Math.max(-18, Math.min(angleDeg * 0.9, 0));
          var prevRot = parseFloat(jet.dataset.prevRot || "0");
          var smoothed = prevRot + (targetRot - prevRot) * 0.15;
          jet.dataset.prevRot = smoothed;

          jet.style.transform = "translate(" + x + "px, " + y + "px) rotate(" + smoothed + "deg)";
        }
      });
    })();

    // == Galaxy ultra-slow parallax (keeps mask/clipping) ==
    (function initGalaxy() {
      var el = doc.querySelector(".about_galaxy");
      if (!el) return;
      var ratio = isMobile ? 0.005 : 0.01; // very slow
      gsap.set(el, { y: 0, force3D: true });

      ScrollTrigger.create({
        trigger: ".about_underwater",
        start: "top bottom",
        end: "bottom top",
        scrub: 0.35,
        pin: el,               // transform-pinned so it's still clipped by parent overflow
        pinSpacing: false,
        onUpdate: function(self) {
          var y = (self.scroll() - self.start) * ratio;
          gsap.set(el, { y: y });
        }
      });

      ScrollTrigger.addEventListener("refresh", function(){ gsap.set(el, { y: 0 }); });
    })();

    // == Video play/pause near viewport ==
    (function initVideo() {
      var vids = doc.querySelectorAll(".about_onceupon video, video[data-pause-offscreen]");
      if (!vids || !vids.length) return;
      vids.forEach(function(v) {
        try { v.setAttribute("playsinline", ""); v.setAttribute("muted",""); } catch(e){}
      });

      vids.forEach(function(v) {
        ScrollTrigger.create({
          trigger: v,
          start: "top 120%",
          end: "bottom -20%",
          onEnter: function(){ try{ v.play && v.play(); }catch(e){} },
          onEnterBack: function(){ try{ v.play && v.play(); }catch(e){} }
        });
        ScrollTrigger.create({
          trigger: v,
          start: "bottom top",
          end: "top bottom",
          onLeave: function(){ try{ v.pause && v.pause(); }catch(e){} },
          onLeaveBack: function(){ try{ v.pause && v.pause(); }catch(e){} }
        });
      });

      doc.addEventListener("visibilitychange", function(){
        vids.forEach(function(v) {
          try {
            if (doc.hidden) { v.pause && v.pause(); }
            else {
              var r = v.getBoundingClientRect();
              var onScreen = r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth;
              if (onScreen) v.play && v.play();
            }
          } catch (e) {}
        });
      });
    })();

    // == Woman UFO: chase + trail (robust against Webflow transforms) ==
    (function initUFO() {
      // Defer initialization until Webflow IX / transforms might be applied.
      function boot(fn) {
        if (root.Webflow && typeof Webflow === "object" && typeof Webflow.push === "function") {
          Webflow.push(fn);
        } else {
          onDOMReady(fn);
          root.addEventListener("load", fn, { once: true });
        }
      }

      boot(function ufoBoot() {
        var host = doc.querySelector(".about_womanufo");
        if (!host) {
          hudSet("UFO: no .about_womanufo found");
          return;
        }

        // create a wrapper we control (so Webflow's own transforms won't stomp it)
        var outer = host.parentElement;
        if (!outer || !outer.classList.contains("ufo-outer")) {
          var wrapper = doc.createElement("div");
          wrapper.className = "ufo-outer";
          wrapper.style.position = "relative";
          wrapper.style.willChange = "transform";
          wrapper.style.transform = "translate3d(0,0,0)";
          host.parentElement.insertBefore(wrapper, host);
          wrapper.appendChild(host);
          outer = wrapper;
        } else {
          outer.style.willChange = "transform";
        }

        // choose sampleNode for trail (prefer visible art)
        var sampleNode = host.querySelector("img,svg,canvas,video") || host;

        // motion params
        var velocity = isMobile ? 1 : 3;
        var maxAmpVal = isMobile ? 20 * vh : 60 * vh;
        var tiltDiv = isMobile ? 3 : 1;
        var chaseSpeed = isMobile ? 0.08 : 0.15;

        function getBaseY() { return (isMobile ? -10 : -20) * vh; }

        var targetState = { x: 0, y: getBaseY(), rot: 0 };
        var actualState = { x: 0, y: getBaseY(), rot: 0 };

        // Horizontal driver via ScrollTrigger
        var triggerSel = doc.querySelector(".parallax-wrapper") ? ".parallax-wrapper" : "body";
        ScrollTrigger.create({
          trigger: triggerSel,
          start: "top top",
          end: isMobile ? innerHeight * 0.25 + "px top" : innerHeight * 0.5 + "px top",
          scrub: true,
          onUpdate: function(self) {
            targetState.x = 130 * vw * self.progress;
          }
        });

        // bounce/tilt from scroll velocity
        var lastScroll = 0, bouncePhase = 0, idleFrames = 0, idleMax = 30;
        function updateBounceTilt() {
          var scrollPos = (typeof root.lenis?.scroll === "number") ? root.lenis.scroll : (root.pageYOffset || 0);
          var deltaY = scrollPos - lastScroll;
          lastScroll = scrollPos;

          var amplitude = Math.min(Math.abs(deltaY) * velocity, maxAmpVal);
          var horizontal = targetState.x / vw;
          var bounceScale = horizontal <= 30 ? 0 : (horizontal >= 100 ? 1 : (horizontal - 30)/70);

          if (Math.abs(deltaY) < 1) {
            idleFrames++;
            if (idleFrames > idleMax) {
              gsap.to(targetState, { y: getBaseY(), duration: 0.4, ease: "power3.out" });
            }
          } else {
            idleFrames = 0;
            bouncePhase += 0.1;
            targetState.y = getBaseY() + Math.sin(bouncePhase) * amplitude * bounceScale;
          }

          var rawTilt = deltaY / tiltDiv;
          targetState.rot = Math.max(-20, Math.min(rawTilt, 20)) * bounceScale;

          requestAnimationFrame(updateBounceTilt);
        }
        requestAnimationFrame(updateBounceTilt);

        // Trail canvas
        var canvas = doc.getElementById("akiraMouseTrail");
        if (!canvas) {
          canvas = doc.createElement("canvas");
          canvas.id = "akiraMouseTrail";
          Object.assign(canvas.style, {
            position: "fixed",
            top: 0,
            left: 0,
            pointerEvents: "none",
            zIndex: 10,
            background: "transparent"
          });
          (doc.querySelector(".fixed_screen_area") || doc.body).appendChild(canvas);
        }
        var ctx = canvas.getContext && canvas.getContext("2d");
        function resizeCanvas() { canvas.width = innerWidth; canvas.height = innerHeight; }
        resizeCanvas(); root.addEventListener("resize", resizeCanvas);

        var trailPoints = [], trailMax = 40, fadeTime = 800;

        // adaptive move node (outer preferred; fallback to host if overridden)
        var moveNode = outer;
        var fallbackTried = false;
        var frameCount = 0;
        var lastCenterX = 0;

        function centerXOf(node) {
          var r = node.getBoundingClientRect();
          return r.left + r.width/2;
        }

        // main render loop
        function animate() {
          frameCount++;

          actualState.x += (targetState.x - actualState.x) * chaseSpeed;
          actualState.y += (targetState.y - actualState.y) * chaseSpeed;
          actualState.rot += (targetState.rot - actualState.rot) * chaseSpeed;

          // apply transform to moveNode (translate3d for GPU)
          try {
            moveNode.style.transform = "translate3d(" + actualState.x + "px," + actualState.y + "px,0) rotate(" + actualState.rot + "deg)";
          } catch(e){}

          // sample for trail from sampleNode bounds
          try {
            var rs = sampleNode.getBoundingClientRect();
            trailPoints.push({ x: rs.left + rs.width/2, y: rs.top + rs.height/2, t: performance.now() });
            if (trailPoints.length > trailMax) trailPoints.shift();

            if (ctx) {
              ctx.clearRect(0,0,canvas.width,canvas.height);
              var maxWidth = rs.height * 0.4;
              for (var i=0;i<trailPoints.length-1;i++) {
                var p1 = trailPoints[i], p2 = trailPoints[i+1];
                var dx = p2.x - p1.x, dy = p2.y - p1.y;
                if (Math.hypot(dx,dy) < 1) continue;
                var age = performance.now() - p1.t;
                var alpha = 1 - age / fadeTime;
                if (alpha <= 0) continue;
                ctx.strokeStyle = "rgba(225,255,0," + alpha + ")";
                ctx.lineWidth = 10 + (maxWidth - 10) * alpha;
                ctx.beginPath();
                ctx.moveTo(p1.x,p1.y);
                ctx.quadraticCurveTo(p1.x + dx*0.5, p1.y + dy*0.5, p2.x, p2.y);
                ctx.stroke();
              }
            }
          } catch(e) {}

          // fallback detection: if our center X doesn't move while target increases, switch to host
          if (!fallbackTried && frameCount % 10 === 0) {
            try {
              var cx = centerXOf(sampleNode);
              var movedEnough = Math.abs(cx - lastCenterX) > 0.5;
              var targetBig = targetState.x > 30;
              if (targetBig && !movedEnough) {
                moveNode = host;
                host.style.willChange = "transform";
                fallbackTried = true;
                if (root.TT_DEBUG) console.warn("[TT] UFO fallback -> host");
              }
              lastCenterX = cx;
            } catch(e){}
          }

          // HUD
          hudSet("UFO node:" + (moveNode===outer ? "outer" : "host") +
                 " x:" + actualState.x.toFixed(1) + " y:" + actualState.y.toFixed(1) +
                 " rot:" + actualState.rot.toFixed(1));

          requestAnimationFrame(animate);
        }

        requestAnimationFrame(animate);
      }); // boot
    })(); // initUFO end

    // final HUD note
    hudSet("TT: loaded, booted");
    if (root.TT_DEBUG) console.log("[TT] started");
  } // startApp end

})(window);

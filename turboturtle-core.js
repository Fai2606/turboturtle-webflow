/* turboturtle-combined.js
   - Core Lenis + GSAP ScrollTrigger
   - Parallax tweens & Config-based City Layer Reveals
   - City Buildings Fast Pop-up Growth (0.1s + 0.02s Stagger)
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
      tweenIf(".about_watermoon", stable({ yPercent: 35, ease: "none", scrollTrigger: { trigger: ".about_watermoon", start: "-20% bottom", end: "bottom -20%", scrub: true } }));
      tweenIf(".about_section_1", stable({ y: () => -10 * vh, ease: "none", scrollTrigger: { trigger: parallaxTrigger, start: "top top", end: "bottom bottom", scrub: true } }));
      tweenIf(".about_section_2", stable({ y: () => -10 * vh, ease: "none", scrollTrigger: { trigger: ".about_section_2", start: "top bottom", end: "bottom top", scrub: true } }));
      tweenIf(".lakeshrink", stable({ scaleY: 0.2, ease: "none", scrollTrigger: { trigger: ".lakeshrink", start: "top bottom", end: "bottom top", scrub: true } }));
      tweenIf(".duckswim", stable({ x: () => -5 * vw - 80, yPercent: -35, ease: "none", scrollTrigger: { trigger: ".duckswim", start: "top bottom", end: "bottom top", scrub: true } }));
      tweenIf(".about_turtle2", stable({ x: () => 60 * vw, y: () => 10 * vw, rotation: 6, ease: "none", scrollTrigger: { trigger: ".about_turtle2", start: "-20% bottom", end: "bottom -20%", scrub: true } }));
      tweenIf(".about_turtle1", stable({ x: () => 28 * vw, y: () => -5 * vw, rotation: -5, ease: "none", scrollTrigger: { trigger: ".about_turtle1", start: "top bottom", end: "bottom top", scrub: true } }));
      tweenIf(".about_nessie", stable({ x: () => 7 * vw, y: () => -13 * vw, rotation: -30, ease: "none", scrollTrigger: { trigger: ".about_nessie", start: "top bottom", end: "bottom top", scrub: true } }));
      tweenIf(".about_giant_squid", stable({ x: () => 15 * vw, y: () => 100 * vh, rotation: -5, ease: "none", scrollTrigger: { trigger: ".about_giant_squid", start: "top bottom", end: "bottom -250%", scrub: true } }));
      tweenIf(".about_bigbigfly", stable({ x: () => 220 * vw, y: () => -4 * vw, rotation: -5, ease: "none", scrollTrigger: { trigger: ".about_bigbigfly", start: "top bottom", end: "bottom -10%", scrub: true } }));
      tweenIf(".about_turtle3", stable({ x: () => 30 * vw, y: () => -5 * vh, ease: "none", scrollTrigger: { trigger: ".about_turtle3", start: "-20% bottom", end: "bottom -20%", scrub: true } }));
      tweenIf(".about_turtle4", stable({ x: () => 20 * vw, y: () => 8 * vh, ease: "none", scrollTrigger: { trigger: ".about_turtle4", start: "-20% bottom", end: "bottom -20%", scrub: true } }));
      tweenIf(".about_chickenfish", stable({ x: () => 12 * vw, y: () => 5 * vh, ease: "none", scrollTrigger: { trigger: ".about_chickenfish", start: "top bottom", end: "bottom top", scrub: true } }));
      tweenIf(".about_flyduck", stable({ x: () => 140 * vw, y: () => 5 * vh, ease: "none", scrollTrigger: { trigger: ".about_flyduck", start: "top bottom", end: "bottom top", scrub: true } }));
      tweenIf(".about_octopus1", stable({ x: () => 20 * vw, y: () => -15 * vh, rotation: -10, ease: "none", scrollTrigger: { trigger: ".about_octopus1", start: "top bottom", end: "bottom top", scrub: true } }));
      tweenIf(".about_octopus2", stable({ x: () => 15 * vw, y: () => 25 * vh, rotation: 10, ease: "none", scrollTrigger: { trigger: ".about_octopus2", start: "-20% bottom", end: "bottom -20%", scrub: true } }));
      tweenIf(".about_bubble", stable({ y: () => -400 * vh, x: () => 2 * vw, ease: "none", scrollTrigger: { trigger: ".about_bubble", start: "top bottom", end: "bottom -200%", scrub: true } }));
      tweenIf(".about_bigbubble", stable({ y: () => -1400 * vh, x: () => 2 * vw, ease: "none", scrollTrigger: { trigger: ".about_bigbubble", start: "top bottom", end: "bottom -400%", scrub: true } }));
      tweenIf(".about_small_planet1", stable({ y: () => 10 * vh, ease: "none", scrollTrigger: { trigger: ".about_small_planet1", start: "top bottom", end: "bottom top", scrub: true } }));
      tweenIf(".about_small_planet2", stable({ y: () => 15 * vh, ease: "none", scrollTrigger: { trigger: ".about_small_planet2", start: "top bottom", end: "bottom top", scrub: true } }));
      tweenIf(".footer_ask", stable({ y: () => -10 * vh, ease: "none", scrollTrigger: { trigger: ".footer_ask", start: "top bottom", end: "bottom top", scrub: true } }));

// --- 2.4. CITY LAYER REVEALS ENGINE (SCRUB-BASED) ---
      var cityReveals = [
        { sel: ".about_cityqueen", from: { y: "30vh" }, to: { y: "0vh" }, start: "100%", end: "40%" },
        { sel: ".about_doggod",    from: { x: "3vw" },  to: { x: "0vw" }, start: "100%", end: "20%" },
        { sel: ".about_crystal",   from: { y: "10vh" }, to: { y: "0vh" }, start: "80%",  end: "30%" },
        { sel: ".about_frog",   from: { y: "10vh" }, to: { y: "0vh" }, start: "80%",  end: "30%" },
         
         
        { sel: ".about_citybuilding_1", from: { y: "-4vh" }, to: { y: "0vh" }, start: "100%", end: "55%" },
        { sel: ".about_citybuilding_4",    from: { y: "-8vh" },  to: { y: "0vh" }, start: "100%", end: "55%" },
        { sel: ".about_citybuilding_3",   from: { y: "-12vh" }, to: { y: "0vh" }, start: "80%",  end: "55%" },
        { sel: ".about_citybuilding_6", from: { y: "-16vh" }, to: { y: "0vh" }, start: "100%", end: "55%" },
        { sel: ".about_citybuilding_5",    from: { y: "-20vh" },  to: { y: "0vh" }, start: "100%", end: "55%" },
        { sel: ".about_citybuilding_2",   from: { y: "-24vh" }, to: { y: "0vh" }, start: "100%",  end: "55%" },
        { sel: ".about_backlayer",    from: { y: "-28vh" },  to: { y: "0vh" }, start: "100%", end: "55%" },
        { sel: ".about_moutain",   from: { y: "-32vh" }, to: { y: "0vh" }, start: "100%",  end: "55%" }
      ];

      cityReveals.forEach(function (item) {
        if (exists(item.sel)) {
          gsap.fromTo(item.sel, item.from, Object.assign({}, item.to, {
            ease: "none",
            scrollTrigger: {
              trigger: item.sel,
              start: "top " + (item.start || "100%"),
              end: "top " + (item.end || "30%"),
              scrub: true
            }
          }));
        }
      });


// --- 2.46. CITY ROCKET LAUNCH (1s TIME-BASED WITH EASING) ---
      if (exists(".about_cityrocket")) {
        gsap.fromTo(".about_cityrocket",
          { y: "30vh" },
          {
            y: "0vh",
            duration: 1.0,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".about_cityrocket",
              start: "top 80%",
              toggleActions: "play reverse play reverse"
            }
          }
        );
      }

// --- 2.5. BLACK HIGHLIGHT ANIMATION ---
      gsap.utils.toArray(".black_highlight").forEach(function (el) {
        ScrollTrigger.create({
          trigger: el, start: "top 85%", end: "bottom 0%",
          onEnter: function () { el.style.setProperty("--highlight-scale", "1"); },
          onLeave: function () { el.style.setProperty("--highlight-scale", "0"); },
          onEnterBack: function () { el.style.setProperty("--highlight-scale", "1"); },
          onLeaveBack: function () { el.style.setProperty("--highlight-scale", "0"); }
        });
      });

// --- 2.6. REUSABLE FADEUP ANIMATION ---
      gsap.utils.toArray(".fadeup").forEach(function (el) {
        gsap.fromTo(el, { opacity: 0, y: 40 }, {
          opacity: 1, y: 0, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 80%", end: "top 10%", toggleActions: "play reverse play reverse" }
        });
      });

// --- 3. JETMAN & SURPRISED DOLPHIN ANIMATION ---
      var jetman = q(".about_jetman");
      var dolphin = q(".about_dolphin");

      if (jetman) {
        var hoverTween;
        function startHover() { hoverTween = gsap.to(jetman, { y: "-=15", duration: 1, ease: "sine.inOut", yoyo: true, repeat: -1 }); }
        startHover();

        ScrollTrigger.create({
          trigger: jetman, start: "top 75%",
          onEnter: function () {
            gsap.killTweensOf(jetman); if (hoverTween) hoverTween.kill(); if (dolphin) gsap.killTweensOf(dolphin);
            gsap.to(jetman, { x: "100vw", y: () => -100 * Math.tan(45 * Math.PI / 180) + "vw", rotation: -50, duration: 1.1, ease: "power2.in" });
            if (dolphin) gsap.to(dolphin, { rotation: -20, duration: 0.4, delay: 0.2, ease: "back.out(1.7)" });
          },
          onLeaveBack: function () {
            gsap.killTweensOf(jetman); if (hoverTween) hoverTween.kill(); if (dolphin) gsap.killTweensOf(dolphin);
            gsap.set(jetman, { rotation: 180 });
            gsap.to(jetman, { x: 0, y: 0, rotation: 0, duration: 1.4, ease: "power2.out", onComplete: startHover });
            if (dolphin) gsap.to(dolphin, { rotation: 0, duration: 0.8, ease: "power2.out" });
          }
        });
      }

// --- 4. COMPLEX FLIGHT PATHS ---
      var jet = q(".about_jetplane");
      if (jet) {
        ScrollTrigger.create({
          trigger: ".about_jetplane", start: "top 20%", end: "bottom 50%", scrub: true, invalidateOnRefresh: true,
          onUpdate: function (self) {
            var t = self.progress; var x = 145 * vw * t;
            var arc = (isMobile ? 26 : 36) * vh; var climbY = -arc * Math.pow(t, 2.2);
            var dipEnd = 0.18; var dipAmp = (isMobile ? 6 : 9) * vh;
            var dipY = (t < dipEnd) ? dipAmp * Math.sin(Math.PI * (t / dipEnd)) : 0;
            var y = -5 * vw + dipY + climbY;
            var dClimb = -arc * 2.2 * Math.pow(Math.max(t, 0.0001), 1.2);
            var dDip = (t < dipEnd) ? (dipAmp * (Math.PI / dipEnd) * Math.cos(Math.PI * (t / dipEnd))) : 0;
            var dydt = dClimb + dDip; var dxdt = 130 * vw;
            var angleDeg = Math.atan2(dydt, dxdt) * (180 / Math.PI);
            if (t < 0.05) angleDeg *= t / 0.05;
            var targetRot = Math.max(-18, Math.min(angleDeg * 0.9, 0));
            var prevRot = parseFloat(jet.dataset.prevRot || "0");
            var smooth = prevRot + (targetRot - prevRot) * 0.15;
            jet.dataset.prevRot = smooth;
            jet.style.transform = "translate(" + x + "px," + y + "px) rotate(" + smooth + "deg)";
          }
        });
      }

      var fly = q(".about_bigfly");
      if (fly) {
        ScrollTrigger.create({
          trigger: ".about_bigfly", start: "-20% bottom", end: "bottom -20%", scrub: true, invalidateOnRefresh: true,
          onUpdate: function (self) {
            var t = self.progress; var x = 80 * vw * t;
            var arc = (isMobile ? 24 : 32) * vh; var climbY = -arc * Math.pow(t, 2.1);
            var y = -3 * vw + climbY;
            fly.style.transform = "translate(" + x + "px," + y + "px) rotate(-10deg)";
          }
        });
      }

      var galaxy = q(".about_galaxy");
      if (galaxy) {
        var isFixed = getComputedStyle(galaxy).position === "fixed";
        var ratio = isMobile ? 0.015 : 0.025;
        gsap.set(galaxy, { y: 0, force3D: true });
        ScrollTrigger.create({
          trigger: exists(".about_underwater") ? ".about_underwater" : parallaxTrigger, start: "top bottom", end: "bottom top",
          scrub: 0.5, pin: isFixed ? false : galaxy, pinSpacing: false, invalidateOnRefresh: true,
          onUpdate: function (self) { gsap.set(galaxy, { y: -(self.scroll() - self.start) * ratio }); }
        });
        ScrollTrigger.addEventListener("refresh", function () { gsap.set(galaxy, { y: 0 }); });
      }

// --- 5. VIDEO VISIBILITY ---
      var vids = document.querySelectorAll(".about_onceupon video, video[data-pause-offscreen]");
      if (vids.length) {
        vids.forEach(function (v) { v.setAttribute("playsinline", ""); v.setAttribute("muted", ""); });
        vids.forEach(function (v) {
          ScrollTrigger.create({
            trigger: v, start: "top 120%", end: "bottom -20%",
            onEnter: function () { try { v.play && v.play(); } catch (e) {} },
            onEnterBack: function () { try { v.play && v.play(); } catch (e) {} },
            onLeave: function () { try { v.pause && v.pause(); } catch (e) {} },
            onLeaveBack: function () { try { v.pause && v.pause(); } catch (e) {} }
          });
        });
      }

      root.addEventListener("load", function(){ ScrollTrigger.refresh(); });
      console.log("[TT] Booting UFO...");
      bootUFO();

    } catch (e) { console.error("[TT] startCore crashed", e); }
  }

  // --- 6. UFO MODULE ---
  function bootUFO() {
    var host = document.querySelector(".about_womanufo");
    if (!host) { console.warn("[TT] UFO: .about_womanufo not found"); return; }

    var velocity = isMobile ? 1 : 3;
    var maxAmpVal = isMobile ? 20 * vh : 80 * vh;
    var tiltDiv = 3;
    var chaseSpeed = isMobile ? 0.08 : 0.15;

    function getBaseY() { return -5 * vh; }

    var target = { x: 0, y: getBaseY(), rot: 0 };
    var actual = { x: 0, y: getBaseY(), rot: 0 };

    var lastProgress = 0;
    if (root.ScrollTrigger) {
      root.ScrollTrigger.create({
        trigger: ".parallax-wrapper", start: "top top", end: (isMobile ? innerHeight * 0.25 : innerHeight * 0.5) + "px top",
        scrub: true, onUpdate: function (self) { lastProgress = self.progress; target.x = 130 * vw * self.progress; }
      });
    }

    function ensureX() {
      if (lastProgress > 0) return;
      var max = (document.documentElement.scrollHeight - innerHeight) || 1;
      target.x = 130 * vw * Math.max(0, Math.min(1, (root.pageYOffset || 0) / max));
    }

    var lastScroll = 0, bouncePhase = 0, idleFrames = 0, idleMax = 30;
    function updateBounceTilt() {
      var scrollPos = (typeof lenis?.scroll === "number") ? lenis.scroll : (root.pageYOffset || 0);
      var deltaY = scrollPos - lastScroll;
      lastScroll = scrollPos;
      ensureX();

      var amplitude = Math.min(Math.abs(deltaY) * velocity, maxAmpVal);
      var horizontal = target.x / vw;
      var scale = (horizontal <= 30) ? 0 : (horizontal >= 100) ? 1 : (horizontal - 30) / 70;

      if (Math.abs(deltaY) < 1) {
        idleFrames++;
        if (idleFrames > idleMax) {
          if (gsap) gsap.to(target, { y: getBaseY(), duration: 0.4, ease: "power3.out" });
          else target.y = getBaseY();
        }
      } else {
        idleFrames = 0; bouncePhase += 0.1;
        target.y = getBaseY() + Math.sin(bouncePhase) * amplitude * scale;
      }
      target.rot = Math.max(-20, Math.min(deltaY / tiltDiv, 20)) * scale;
      requestAnimationFrame(updateBounceTilt);
    }
    requestAnimationFrame(updateBounceTilt);

    var canvas = document.getElementById("akiraMouseTrail");
    if (!canvas) {
      canvas = document.createElement("canvas"); 
      canvas.id = "akiraMouseTrail";
      Object.assign(canvas.style, { position: "fixed", top: 0, left: 0, pointerEvents: "none", zIndex: 10, background: "transparent" });
      (document.querySelector(".fixed_screen_area") || document.body).appendChild(canvas);
    }
    var ctx = canvas.getContext("2d");
    function resizeCanvas() { canvas.width = innerWidth; canvas.height = innerHeight; }
    resizeCanvas(); root.addEventListener("resize", resizeCanvas);

    var trail = [], trailMax = 40, fadeTime = 800;
    function loop() {
      actual.x += (target.x - actual.x) * chaseSpeed;
      actual.y += (target.y - actual.y) * chaseSpeed;
      actual.rot += (target.rot - actual.rot) * chaseSpeed;
      host.style.transform = "translate3d(" + actual.x + "px," + actual.y + "px,0) rotate(" + actual.rot + "deg)";

      var r = host.getBoundingClientRect();
      trail.push({ x: r.left + r.width/2, y: r.top + r.height/2, t: performance.now() });
      if (trail.length > trailMax) trail.shift();

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      var maxW = r.height * 0.4;
      for (var i = 0; i < trail.length - 1; i++) {
        var p1 = trail[i], p2 = trail[i+1], dx = p2.x - p1.x, dy = p2.y - p1.y;
        if (Math.hypot(dx,dy) < 1) continue;
        var alpha = 1 - (performance.now() - p1.t) / fadeTime;
        if (alpha <= 0) continue;
        ctx.strokeStyle = "rgba(225,255,0," + alpha + ")"; ctx.lineWidth = 10 + (maxW - 10) * alpha;
        ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.quadraticCurveTo(p1.x + dx * 0.5, p1.y + dy * 0.5, p2.x, p2.y); ctx.stroke();
      }
      requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);
    console.log("[TT] UFO booted");
  }

})(window);

/* turboturtle-combined.js - Optimized & Integrated Version */
(function (root) {
  if (!root) return;

  var isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  var gsap, ScrollTrigger, lenis, MorphSVGPlugin;

  var vw = root.innerWidth / 100;
  var vh = root.innerHeight / 100;
  var lastWidth = root.innerWidth;

  root.addEventListener("resize", function () {
    if (Math.abs(root.innerWidth - lastWidth) > 50) {
      vw = root.innerWidth / 100;
      vh = root.innerHeight / 100;
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

  function q(sel) { return document.querySelector(sel); }
  function exists(s){ return !!q(s); }
  function tweenIf(sel, vars) { if (exists(sel)) gsap.to(sel, vars); }

  function startCore() {
    try {
      gsap = root.gsap;
      ScrollTrigger = root.ScrollTrigger;
      MorphSVGPlugin = root.MorphSVGPlugin;

      if (MorphSVGPlugin) {
        gsap.registerPlugin(ScrollTrigger, MorphSVGPlugin);
      } else {
        gsap.registerPlugin(ScrollTrigger);
      }

      // Disable GSAP touch intervention on mobile native scroll
      ScrollTrigger.config({ ignoreMobileResize: true, syncInterval: 999 });

      // Configured Lenis for zero-lag mobile momentum
      lenis = new root.Lenis({
        lerp: isMobile ? 0.12 : 0.08,
        smoothWheel: true,
        smoothTouch: false, // Prevents scroll jumping on mobile fling
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
        getBoundingClientRect: function () { return { top: 0, left: 0, width: innerWidth, height: innerHeight }; },
        pinType: "transform"
      });

      lenis.on("scroll", ScrollTrigger.update);
      ScrollTrigger.addEventListener("refresh", function () { if (lenis.resize) lenis.resize(); });

      var parallaxTrigger = exists(".parallax-wrapper") ? ".parallax-wrapper" : "body";

      // 效能穩定強化設置（包含微幅物理緩衝 scrub: 1 與動態 GPU 記憶體控制）
      function stable(vars) {
        vars.overwrite = "auto";
        vars.force3D = true;
        if (!vars.scrollTrigger) vars.scrollTrigger = {};
        
        // 預設將 scrub 改為 1（增加 1 秒平滑緩衝，消除微小 Jitter）
        if (vars.scrollTrigger.scrub === true) vars.scrollTrigger.scrub = 1;
        
        // 提前在視窗外 20% 預熱，避免踏入當下突然 Paint 卡頓
        if (!vars.scrollTrigger.start) vars.scrollTrigger.start = "top 120%";
        
        vars.scrollTrigger.invalidateOnRefresh = true;
        vars.scrollTrigger.fastScrollEnd = true;
        
        // 動態控制 GPU 加速：進場開啟，離場關閉以釋放 Mobile 記憶體
        var userOnToggle = vars.scrollTrigger.onToggle;
        vars.scrollTrigger.onToggle = function(self) {
          if (vars.targetEl) {
            var els = typeof vars.targetEl === "string" ? document.querySelectorAll(vars.targetEl) : [vars.targetEl];
            els.forEach(function(el) {
              el.style.willChange = self.isActive ? "transform" : "auto";
            });
          }
          if (userOnToggle) userOnToggle(self);
        };

        return vars;
      }

      // -------------------------------------------------------------
      // Liquid Morphing Animation (原本獨立的 Drip 腳本整合進來)
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

      // Parallax Tweens
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
        gsap.fromTo(".about_balloon",
          { y: "0vh", yPercent: 0 },
          {
            y: "50vh", yPercent: 50, ease: "none",
            scrollTrigger: { trigger: ".about_balloon", start: "top 120%", end: "bottom top", scrub: 1, fastScrollEnd: true }
          }
        );
      }

      // City Layer Reveals (卡頓重點區塊：優化 start 點，並自動切換 GPU 加速)
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
        if (exists(item.sel)) {
          gsap.set(item.sel, Object.assign({ force3D: true }, item.from));
          gsap.fromTo(item.sel, item.from, Object.assign({}, item.to, {
            ease: "power2.out",
            immediateRender: false,
            scrollTrigger: {
              trigger: mountainTrigger,
              start: "top " + (item.start || "120%"),
              end: "top " + (item.end || "40%"),
              scrub: 1,
              fastScrollEnd: true,
              invalidateOnRefresh: true,
              onToggle: function(self) {
                var el = q(item.sel);
                if (el) el.style.willChange = self.isActive ? "transform" : "auto";
              }
            }
          }));
        }
      });

      // Rocket Triggers
      var launchTargets = [
        { sel: ".about_cityqueen", from: { y: "35vh" }, to: { y: "0vh" }, start: "80%" },
        { sel: ".about_doggod", from: { x: "4.6vw" }, to: { x: "0vw" }, start: "70%" },
        { sel: ".about_frog", from: { y: "15vh" }, to: { y: "0vh" }, start: "80%" },
        { sel: ".about_violincat", from: { x: "3vw" }, to: { x: "0vw" }, start: "80%" },
        { sel: ".about_cityrocket", from: { y: "30vh" }, to: { y: "0vh" }, start: "80%" },
        { sel: ".about_cityrocket_2", from: { y: "20vh" }, to: { y: "0vh" }, start: "75%" }
      ];

      launchTargets.forEach(function (item) {
        if (exists(item.sel)) {
          gsap.set(item.sel, Object.assign({ force3D: true }, item.from));
          gsap.fromTo(item.sel, item.from, Object.assign({}, item.to, {
            duration: 1.0,
            ease: "power3.out",
            immediateRender: false,
            scrollTrigger: {
              trigger: item.sel,
              start: "top " + (item.start || "80%"),
              toggleActions: "play reverse play reverse",
              invalidateOnRefresh: true
            }
          }));
        }
      });

      // Highlight Animation
      gsap.utils.toArray(".black_highlight").forEach(function (el) {
        ScrollTrigger.create({
          trigger: el, start: "top 85%", end: "bottom 0%",
          onEnter: function () { el.style.setProperty("--highlight-scale", "1"); },
          onLeave: function () { el.style.setProperty("--highlight-scale", "0"); },
          onEnterBack: function () { el.style.setProperty("--highlight-scale", "1"); },
          onLeaveBack: function () { el.style.setProperty("--highlight-scale", "0"); }
        });
      });

      // Fadeup Animation
      gsap.utils.toArray(".fadeup").forEach(function (el) {
        gsap.fromTo(el, { opacity: 0, y: 40 }, {
          opacity: 1, y: 0, duration: 1, ease: "power3.out", force3D: true,
          immediateRender: false,
          scrollTrigger: { trigger: el, start: "top 80%", end: "top 10%", toggleActions: "play reverse play reverse" }
        });
      });

      // Jetman & Dolphin
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

      // Jetplane
      var jet = q(".about_jetplane");
      if (jet) {
        ScrollTrigger.create({
          trigger: ".about_jetplane", start: "top 20%", end: "bottom 50%", scrub: 1, invalidateOnRefresh: true,
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
            jet.style.transform = "translate3d(" + x + "px," + y + "px, 0) rotate(" + smooth + "deg)";
          }
        });
      }

      // Big Fly
      var fly = q(".about_bigfly");
      if (fly) {
        ScrollTrigger.create({
          trigger: ".about_bigfly", start: "-20% bottom", end: "bottom -20%", scrub: 1, invalidateOnRefresh: true,
          onUpdate: function (self) {
            var t = self.progress; var x = 80 * vw * t;
            var arc = (isMobile ? 24 : 32) * vh; var climbY = -arc * Math.pow(t, 2.1);
            var y = -3 * vw + climbY;
            fly.style.transform = "translate3d(" + x + "px," + y + "px, 0) rotate(-10deg)";
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

      // Offscreen Video Auto Pause
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

      bootUFO();

    } catch (e) { console.error("[TT] startCore crashed", e); }
  }

  // UFO Trail Engine
  function bootUFO() {
    var host = document.querySelector(".about_womanufo");
    if (!host) return;

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
        scrub: 1, onUpdate: function (self) { lastProgress = self.progress; target.x = 130 * vw * self.progress; }
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
    resizeCanvas();

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
  }

})(window);

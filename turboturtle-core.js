/* turboturtle-combined.js
   - Core Lenis + GSAP ScrollTrigger
   - Parallax tweens
   - Highlight Reveal trigger
   - Reusable Fadeup trigger
   - Jetplane & Bigfly arcs
   - Jetman & Surprised Dolphin launch
   - UFO chase + Akira trail
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

      // Stop dynamic Safari toolbars from breaking ScrollTriggers
      ScrollTrigger.config({ ignoreMobileResize: true });

// --- 1. LENIS (Smooth Scroll) ---
      lenis = new root.Lenis({
        lerp: 0.1,
        smoothWheel: true,
        smoothTouch: false,
        wheelMultiplier: 1,
        touchMultiplier: 1,
        infinite: false
      });
      root.lenis = lenis;

      gsap.ticker.add(function (time) {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);

      ScrollTrigger.scrollerProxy(window, {
        scrollTop: function (value) {
          if (arguments.length) return lenis.scrollTo(value);
          return (typeof lenis.scroll === "number") ? lenis.scroll : (root.pageYOffset || 0);
        },
        getBoundingClientRect: function () {
          return { top: 0, left: 0, width: innerWidth, height: innerHeight };
        },
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
      tweenIf(".about_rocket", stable({ x: () => 130 * vw, y: () => -20 * vw, ease: "none", scrollTrigger: { trigger: parallaxTrigger, start: () => innerHeight * 0.4 + "px top", end: () => innerHeight * 0.7 + "px top", scrub: true } }));
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

// --- 2.5. BLACK HIGHLIGHT ANIMATION ---
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

// --- 2.6. REUSABLE FADEUP ANIMATION ---
      gsap.utils.toArray(".fadeup").forEach(function (el) {
        gsap.fromTo(el, 
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 80%",
              end: "top 10%",
              toggleActions: "play reverse play reverse"
            }
          }
        );
      });
       
// --- 2.7. HERO BIG HEADING WARP TEXT (OGL / WEBGL) ---
(function initWarpText() {
  var headingEl = q(".big_heading");
  if (!headingEl) return;

  function bootWarp() {
    if (!root.OGL) {
      setTimeout(bootWarp, 50);
      return;
    }

    var OGL = root.OGL;
    var Renderer = OGL.Renderer;
    var Program = OGL.Program;
    var Mesh = OGL.Mesh;
    var Triangle = OGL.Triangle;
    var Texture = OGL.Texture;

    // 取得原始文字 (支援換行)
    var targetText = headingEl.innerText.trim() || "Curiously\nBlended";
    headingEl.innerHTML = "";
    headingEl.style.position = "relative";
    headingEl.style.display = "block";
    headingEl.style.minHeight = "220px";

    var vertexShader = `#version 300 es
    in vec2 position;
    in vec2 uv;
    out vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 0.0, 1.0);
    }`;

    var fragmentShader = `#version 300 es
    precision highp float;
    uniform sampler2D uTextTexture;
    uniform vec2 uResolution;
    uniform vec2 uPointer;
    uniform float uPointerActive;
    uniform float uTime;
    uniform float uWarpStrength;
    uniform float uWarpScale;
    uniform float uSpeed;
    uniform float uPointerInfluence;
    uniform float uPointerStrength;
    uniform float uRefraction;
    uniform float uRipple;
    uniform float uMotion;

    in vec2 vUv;
    out vec4 fragColor;

    float hash(vec2 p) {
      p = fract(p * vec2(123.34, 456.21));
      p += dot(p, p + 45.32);
      return fract(p.x * p.y);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
    }

    float fbm(vec2 p) {
      float value = 0.0;
      float amplitude = 0.5;
      for (int i = 0; i < 4; i++) {
        value += amplitude * noise(p);
        p *= 2.02;
        amplitude *= 0.5;
      }
      return value;
    }

    vec4 sampleText(vec2 uv) {
      if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) return vec4(0.0);
      return texture(uTextTexture, uv);
    }

    void main() {
      vec2 uv = vUv;
      float aspect = uResolution.x / max(uResolution.y, 1.0);
      float time = uTime * uSpeed;
      float scale = max(uWarpScale, 0.001);

      vec2 drift = vec2(time * 0.055, -time * 0.045);
      float n1 = fbm(uv * scale * 3.1 + drift);
      float n2 = fbm((uv + 19.17) * scale * 3.4 - drift.yx);
      vec2 ambient = (vec2(n1, n2) - 0.5) * uWarpStrength * 0.045 * uMotion;

      vec2 pointerDelta = uv - uPointer;
      vec2 aspectDelta = vec2(pointerDelta.x * aspect, pointerDelta.y);
      float dist = length(aspectDelta);
      float radius = max(uPointerInfluence, 0.001);
      float t = clamp(dist / radius, 0.0, 1.0);
      float lens = smoothstep(radius, 0.0, dist) * uPointerActive;
      float bulge = t * (1.0 - t) * (1.0 - t) * 6.75 * uPointerActive;
      vec2 dir = dist > 0.0001 ? vec2(aspectDelta.x / aspect, aspectDelta.y) / dist : vec2(0.0);

      float rippleWave = sin(dist * 28.0 - time * 4.2) * 0.5 + 0.5;
      float rippleRing = (rippleWave - 0.5) * uRipple;
      vec2 pointerWarp = -dir * bulge * uPointerStrength * 0.045;
      pointerWarp += dir * rippleRing * bulge * uPointerStrength * 0.016;

      vec2 displaced = uv + ambient + pointerWarp;
      vec2 splitDir = ambient + pointerWarp;
      float splitLen = length(splitDir);
      splitDir = splitLen > 0.00001 ? splitDir / splitLen : vec2(0.7071, 0.7071);
      vec2 split = splitDir * uRefraction * 0.16 * (0.35 + lens * 1.65);

      vec4 base = sampleText(displaced);
      float r = sampleText(displaced + split).r;
      float g = base.g;
      float b = sampleText(displaced - split).b;
      float a = max(max(sampleText(displaced + split).a, base.a), sampleText(displaced - split).a);

      vec3 color = vec3(r, g, b) + lens * base.a * 0.055;
      fragColor = vec4(color, a);
    }`;

    // 參數設定 (可在此微調)
    var props = {
      text: targetText,
      color: "#000000",          // 文字顏色 (配合你原本的黑字)
      fontSize: "clamp(3rem, 7vw, 6rem)",
      fontWeight: 800,
      fontFamily: "inherit",
      letterSpacing: -2,
      lineHeight: 0.95,
      warpStrength: 0.08,
      warpScale: 1.7,
      speed: 0.55,
      pointerInfluence: 0.42,
      pointerStrength: 0.38,
      refraction: 0.018,
      ripple: true
    };

    var renderer = new Renderer({ webgl: 2, alpha: true, antialias: true, dpr: Math.min(root.devicePixelRatio || 1, 2) });
    var gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);

    var canvas = gl.canvas;
    Object.assign(canvas.style, {
      position: "absolute",
      inset: "0",
      width: "100%",
      height: "100%",
      display: "block"
    });
    headingEl.appendChild(canvas);

    var texture = new Texture(gl, { generateMipmaps: false, minFilter: gl.LINEAR, magFilter: gl.LINEAR, wrapS: gl.CLAMP_TO_EDGE, wrapT: gl.CLAMP_TO_EDGE });
    var geometry = new Triangle(gl);

    var program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        uTextTexture: { value: texture },
        uResolution: { value: new Float32Array([1, 1]) },
        uPointer: { value: new Float32Array([0.5, 0.5]) },
        uPointerActive: { value: 0 },
        uTime: { value: 0 },
        uWarpStrength: { value: props.warpStrength },
        uWarpScale: { value: props.warpScale },
        uSpeed: { value: props.speed },
        uPointerInfluence: { value: props.pointerInfluence },
        uPointerStrength: { value: props.pointerStrength },
        uRefraction: { value: props.refraction },
        uRipple: { value: props.ripple ? 1 : 0 },
        uMotion: { value: 1 }
      }
    });

    var mesh = new Mesh(gl, { geometry: geometry, program: program });

    function measureLine(ctx, line, spacing) {
      var chars = Array.from(line);
      var w = chars.reduce(function(acc, c) { return acc + ctx.measureText(c).width; }, 0);
      return w + Math.max(0, chars.length - 1) * spacing;
    }

    function buildTextCanvas(w, h, dpr) {
      var c = document.createElement('canvas');
      c.width = Math.max(1, Math.floor(w * dpr));
      c.height = Math.max(1, Math.floor(h * dpr));
      var ctx = c.getContext('2d');
      if (!ctx) return c;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = props.color;

      var lines = props.text.split('\n');
      var fontSizePx = Math.min(w * 0.12, 90);
      var lineHeight = fontSizePx * props.lineHeight;

      ctx.font = props.fontWeight + ' ' + fontSizePx + 'px ' + window.getComputedStyle(headingEl).fontFamily;

      var startY = h / 2 - (lineHeight * (lines.length - 1)) / 2;
      lines.forEach(function(line, idx) {
        ctx.fillText(line, w / 2, startY + idx * lineHeight);
      });
      return c;
    }

    function rasterize() {
      var rect = headingEl.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      var dpr = Math.min(root.devicePixelRatio || 1, 2);
      texture.image = buildTextCanvas(rect.width, rect.height, dpr);
      texture.needsUpdate = true;
    }

    function resize() {
      var rect = headingEl.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      renderer.setSize(rect.width, rect.height);
      program.uniforms.uResolution.value[0] = gl.drawingBufferWidth;
      program.uniforms.uResolution.value[1] = gl.drawingBufferHeight;
      rasterize();
    }

    var pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, active: 0, activeTarget: 0 };
    canvas.addEventListener('pointermove', function(e) {
      var rect = canvas.getBoundingClientRect();
      pointer.tx = (e.clientX - rect.left) / rect.width;
      pointer.ty = 1 - (e.clientY - rect.top) / rect.height;
      pointer.activeTarget = 1;
    });
    canvas.addEventListener('pointerleave', function() { pointer.activeTarget = 0; });

    var startTime = performance.now();
    function loop(now) {
      var elapsed = (now - startTime) * 0.001;
      var targetX = pointer.activeTarget > 0 ? pointer.tx : 0.5 + Math.sin(elapsed * 0.33) * 0.12;
      var targetY = pointer.activeTarget > 0 ? pointer.ty : 0.5 + Math.cos(elapsed * 0.27) * 0.1;

      pointer.x += (targetX - pointer.x) * 0.1;
      pointer.y += (targetY - pointer.y) * 0.2;
      pointer.active += ((pointer.activeTarget > 0 ? 1 : 0.18) - pointer.active) * 0.06;

      program.uniforms.uPointer.value[0] = pointer.x;
      program.uniforms.uPointer.value[1] = pointer.y;
      program.uniforms.uPointerActive.value = pointer.active;
      program.uniforms.uTime.value = elapsed;

      renderer.render({ scene: mesh });
      requestAnimationFrame(loop);
    }

    root.addEventListener('resize', resize);
    resize();
    requestAnimationFrame(loop);
  }

  bootWarp();
})();

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

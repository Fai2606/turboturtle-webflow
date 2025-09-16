/* turboturtle.js — site animations
   NOTE: this file is plain JS (no <script> tags).
*/
(function () {
  console.info("[turboturtle] boot v13 start");
  // signal for the Webflow loader
  window.__TT_BOOTED__ = false;

  // ---- Guards for libraries ----
  if (!window.gsap) { console.error("[turboturtle] GSAP missing"); return; }
  if (!window.ScrollTrigger) { console.error("[turboturtle] ScrollTrigger missing"); return; }
  if (!window.Lenis) { console.error("[turboturtle] Lenis missing"); return; }

  gsap.registerPlugin(ScrollTrigger);

  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  // responsive vw/vh helpers
  let vw = window.innerWidth / 100;
  let vh = window.innerHeight / 100;
  window.addEventListener("resize", () => {
    vw = window.innerWidth / 100;
    vh = window.innerHeight / 100;
  });

  // Will-change / promote video wrapper
  (function () {
    const videoWrapper = document.querySelector(".about_onceupon");
    if (videoWrapper) {
      videoWrapper.style.willChange = "transform, opacity";
      videoWrapper.style.transform = "translateZ(0)";
    }
    gsap.set(".about_underwater", { willChange: "transform", transform: "translateZ(0)" });
  })();

  // ---- Lenis smooth scroll + tie to ScrollTrigger ----
  const lenis = new Lenis({
    duration: isMobile ? 6 : 4,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    direction: "vertical",
    gestureDirection: "vertical",
    mouseMultiplier: 1,
    touchMultiplier: isMobile ? 0.2 : 2,
    infinite: false
  });

  function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);

  ScrollTrigger.scrollerProxy(window, {
    scrollTop(value) {
      return arguments.length ? lenis.scrollTo(value) : lenis.scroll;
    },
    getBoundingClientRect() {
      return { top: 0, left: 0, width: innerWidth, height: innerHeight };
    },
    pinType: document.body.style.transform ? "transform" : "fixed"
  });
  lenis.on("scroll", () => ScrollTrigger.update());
  ScrollTrigger.addEventListener("refresh", () => lenis.resize());
  ScrollTrigger.refresh();

  // ---- Video: play slightly before entering, pause only when fully off ----
  (function () {
    const vids = document.querySelectorAll(".about_onceupon video, video[data-pause-offscreen]");
    vids.forEach(v => {
      try { v.setAttribute("playsinline", ""); v.muted = true; } catch {}
      ScrollTrigger.create({
        trigger: v,
        start: "top 120%",
        end: "bottom -20%",
        onEnter:     () => { try{ v.play && v.play().catch(()=>{});}catch{} },
        onEnterBack: () => { try{ v.play && v.play().catch(()=>{});}catch{} }
      });
      ScrollTrigger.create({
        trigger: v,
        start: "bottom top",
        end:   "top bottom",
        onLeave:     () => { try{ v.pause && v.pause(); }catch{} },
        onLeaveBack: () => { try{ v.pause && v.pause(); }catch{} }
      });
    });
    document.addEventListener("visibilitychange", () => {
      vids.forEach(v => {
        if (document.hidden) { try{ v.pause(); }catch{}; return; }
        const r = v.getBoundingClientRect();
        const onScreen = r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth;
        if (onScreen) try{ v.play && v.play().catch(()=>{});}catch{}
      });
    });
  })();

  // ---- Parallax / element tweens (kept minimal but equivalent) ----
  const ST_FULL = { trigger: ".parallax-wrapper", start: "top top", end: "bottom bottom", scrub: true };
  gsap.to(".about_planet",     { y: 20 * vh,  ease: "none", scrollTrigger: ST_FULL });
  gsap.to(".spacecats",        { x: -3*vw, y: 55*vh, rotation: 20, scale: 1.1, ease: "none", scrollTrigger: ST_FULL });
  gsap.to(".about_saturn",     { x: -2*vw, y: 30*vh, rotation: -25, scale: .9, ease: "none", scrollTrigger: ST_FULL });
  gsap.to(".satellitemove",    { x: 10*vw, y: 50*vh, rotation: 15, scale: .85, ease: "none", scrollTrigger: ST_FULL });
  gsap.to(".about_watermoon",  { y: 35*vh,  ease: "none", scrollTrigger: ST_FULL });
  gsap.to(".about_section_1",  { y: -10*vh, ease: "none", scrollTrigger: ST_FULL });

  gsap.to(".about_section_2", {
    y: -10 * vh, ease: "none",
    scrollTrigger: { trigger: ".about_section_2", start: "top bottom", end: "bottom top", scrub: true }
  });
  gsap.to(".lakeshrink", {
    scaleY: 0.4, ease: "none",
    scrollTrigger: { trigger: ".lakeshrink", start: "top bottom", end: "bottom top", scrub: true }
  });
  gsap.to(".duckswim", {
    x: -5*vw - 80, yPercent: -35, ease: "none",
    scrollTrigger: { trigger: ".duckswim", start: "top bottom", end: "bottom top", scrub: true }
  });
  gsap.to(".about_rocket", {
    x: 130*vw, y: -20*vw, ease: "none",
    scrollTrigger: { trigger: ".parallax-wrapper", start: () => `${innerHeight*0.4}px top`, end: () => `${innerHeight*0.7}px top`, scrub: true, invalidateOnRefresh: true }
  });
  gsap.to(".about_turtle2", {
    x: 30*vw, y: 5*vw, rotation: 5, ease: "none",
    scrollTrigger: { trigger: ".about_turtle2", start: "top bottom", end: "bottom top", scrub: true, invalidateOnRefresh: true }
  });
  gsap.to(".about_turtle1", {
    x: 28*vw, y: -5*vw, rotation: -5, ease: "none",
    scrollTrigger: { trigger: ".about_turtle1", start: "top bottom", end: "bottom top", scrub: true, invalidateOnRefresh: true }
  });
  gsap.to(".about_nessie", {
    x: 7*vw, y: -13*vw, rotation: -30, ease: "none",
    scrollTrigger: { trigger: ".about_nessie", start: "top bottom", end: "bottom top", scrub: true, invalidateOnRefresh: true }
  });
  gsap.to(".about_giant_squid", {
    x: 3*vw, y: 7*vw, rotation: -5, ease: "none",
    scrollTrigger: { trigger: ".about_giant_squid", start: "top bottom", end: "bottom top", scrub: true, invalidateOnRefresh: true }
  });
  gsap.to(".about_flyduck", {
    x: 120*vw, y: -15*vw, ease: "none",
    scrollTrigger: { trigger: ".about_flyduck", start: "top bottom", end: "bottom 80%", scrub: true, invalidateOnRefresh: true }
  });
  gsap.to(".about_watermoon", {
    y: 5*vw, ease: "none",
    scrollTrigger: { trigger: ".about_watermoon", start: "top bottom", end: "bottom top", scrub: true, invalidateOnRefresh: true }
  });

  // ---- Galaxy: very slow upward drift while clipped by .about_underwater ----
  (function () {
    const el = document.querySelector(".about_galaxy");
    if (!el) return;
    const ratio = isMobile ? 0.004 : 0.006; // smaller = slower
    gsap.set(el, { y: 0, force3D: true });
    ScrollTrigger.create({
      trigger: ".about_underwater",
      start: "top bottom",
      end: "bottom top",
      scrub: 0.35,
      pin: el,
      pinSpacing: false,
      onUpdate(self) {
        const y = (self.scroll() - self.start) * ratio;
        gsap.set(el, { y });
      }
    });
    ScrollTrigger.addEventListener("refresh", () => gsap.set(el, { y: 0 }));
  })();

  // ---- Jetplane: dip then strong climb + bank with smoothing ----
  (function () {
    const jet = document.querySelector(".about_jetplane");
    if (!jet) return;

    ScrollTrigger.create({
      trigger: ".about_jetplane",
      start: "top 50%",
      end: "bottom 30%",
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate(self) {
        const t = self.progress;              // 0..1
        const x = 145 * vw * t;

        const arc = (isMobile ? 26 : 36) * vh;
        const p = 2.2;
        const climbY = -arc * Math.pow(t, p);

        const dipEnd = 0.18, dipAmp = (isMobile ? 6 : 9) * vh;
        const inDip = t < dipEnd;
        const dipY = inDip ? dipAmp * Math.sin(Math.PI * (t / dipEnd)) : 0;

        const y = -5 * vw + dipY + climbY;

        const dClimb = -arc * p * Math.pow(Math.max(t, 0.0001), p - 1);
        const dDip = inDip ? dipAmp * (Math.PI / dipEnd) * Math.cos(Math.PI * (t / dipEnd)) : 0;
        const dydt = dClimb + dDip;
        const dxdt = 130 * vw;
        let angleDeg = Math.atan2(dydt, dxdt) * (180 / Math.PI);

        if (t < 0.05) angleDeg *= t / 0.05;          // soften first frames
        const targetRot = Math.max(-18, Math.min(angleDeg * 0.9, 0));
        const prevRot = parseFloat(jet.dataset.prevRot || "0");
        const smoothedRot = prevRot + (targetRot - prevRot) * 0.15;
        jet.dataset.prevRot = smoothedRot;

        jet.style.transform = `translate(${x}px, ${y}px) rotate(${smoothedRot}deg)`;
      }
    });
  })();

  // ---- WOMAN UFO: chase + trail (unchanged logic, guarded) ----
  (function () {
    const ufoEl = document.querySelector(".about_womanufo");
    if (!ufoEl) return;

    const velocity = isMobile ? 1 : 3;
    const maxAmpVal = isMobile ? 20 * vh : 60 * vh;
    const tiltDiv = isMobile ? 3 : 1;
    const chaseSpeed = isMobile ? 0.08 : 0.15;

    function getBaseY() { return (isMobile ? -10 : -20) * vh; }
    const target = { x: 0, y: getBaseY(), rot: 0 };
    const actual = { x: 0, y: getBaseY(), rot: 0 };

    ufoEl.style.setProperty("--ufo-x", `${actual.x}px`);
    ufoEl.style.setProperty("--ufo-y", `${actual.y}px`);
    ufoEl.style.setProperty("--ufo-rot", `${actual.rot}deg`);

    ScrollTrigger.create({
      trigger: ".parallax-wrapper",
      start: "top top",
      end: isMobile ? `${innerHeight * 0.25}px top` : `${innerHeight * 0.5}px top`,
      scrub: true,
      onUpdate(self) { target.x = 130 * vw * self.progress; }
    });

    let lastScroll = 0, phase = 0, idle = 0;
    const idleMax = 30;

    function updateBounceTilt() {
      const scrollPos = lenis.scroll;
      const deltaY = scrollPos - lastScroll; lastScroll = scrollPos;

      const amplitude = Math.min(Math.abs(deltaY) * velocity, maxAmpVal);
      const horizontal = target.x / vw;
      const scale = horizontal <= 30 ? 0 : horizontal >= 100 ? 1 : (horizontal - 30) / 70;

      if (Math.abs(deltaY) < 1) {
        idle++;
        if (idle > idleMax) gsap.to(target, { y: getBaseY(), duration: 0.4, ease: "power3.out" });
      } else {
        idle = 0; phase += 0.1;
        target.y = getBaseY() + Math.sin(phase) * amplitude * scale;
      }
      const rawTilt = deltaY / tiltDiv;
      target.rot = Math.max(-20, Math.min(rawTilt, 20)) * scale;

      requestAnimationFrame(updateBounceTilt);
    }
    updateBounceTilt();

    // Trail canvas
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    let points = [];
    const trailMax = 40, fadeTime = 800;

    Object.assign(canvas.style, { position: "fixed", top: 0, left: 0, pointerEvents: "none", zIndex: 10, background: "transparent" });
    canvas.id = "akiraMouseTrail";
    (document.querySelector(".fixed_screen_area") || document.body).appendChild(canvas);

    function resizeCanvas() { canvas.width = innerWidth; canvas.height = innerHeight; }
    resizeCanvas(); window.addEventListener("resize", resizeCanvas);

    function animateUFO() {
      actual.x += (target.x - actual.x) * chaseSpeed;
      actual.y += (target.y - actual.y) * chaseSpeed;
      actual.rot += (target.rot - actual.rot) * chaseSpeed;
      ufoEl.style.setProperty("--ufo-x", `${actual.x}px`);
      ufoEl.style.setProperty("--ufo-y", `${actual.y}px`);
      ufoEl.style.setProperty("--ufo-rot", `${actual.rot}deg`);

      const r = ufoEl.getBoundingClientRect();
      points.push({ x: r.left + r.width/2, y: r.top + r.height/2, t: performance.now() });
      if (points.length > trailMax) points.shift();

      ctx.clearRect(0,0,canvas.width,canvas.height);
      const maxW = r.height * 0.4;
      for (let i=0;i<points.length-1;i++){
        const p1=points[i], p2=points[i+1];
        const dx=p2.x-p1.x, dy=p2.y-p1.y;
        if (Math.hypot(dx,dy)<1) continue;
        const age=performance.now()-p1.t, alpha=1-age/fadeTime;
        if (alpha<=0) continue;
        const lw=10+(maxW-10)*alpha;
        ctx.strokeStyle=`rgba(225,255,0,${alpha})`;
        ctx.lineWidth=lw;
        ctx.beginPath();
        ctx.moveTo(p1.x,p1.y);
        ctx.quadraticCurveTo(p1.x+dx*0.5, p1.y+dy*0.5, p2.x,p2.y);
        ctx.stroke();
      }
      requestAnimationFrame(animateUFO);
    }
    animateUFO();
  })();

  // finished
  window.__TT_BOOTED__ = true;
  console.info("[turboturtle] boot v13 ready ✅");
})();

console.info('[turboturtle] script loaded and running...');
window.__TT_BOOTED__ = false;

window.turboturtleBoot = function turboturtleBoot() {
  try {
    //──────────────────────────────────────────
    // SETUP
    //──────────────────────────────────────────
    gsap.registerPlugin(ScrollTrigger);

    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    // responsive viewport units
    let vw = window.innerWidth / 100;
    let vh = window.innerHeight / 100;
    window.addEventListener("resize", () => {
      vw = window.innerWidth / 100;
      vh = window.innerHeight / 100;
    });

    // Lenis smooth scroll
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
    function runLenis(time) {
      lenis.raf(time);
      requestAnimationFrame(runLenis);
    }
    requestAnimationFrame(runLenis);

    // ScrollTrigger scroller proxy
    ScrollTrigger.scrollerProxy(window, {
      scrollTop(value) {
        return arguments.length ? lenis.scrollTo(value) : lenis.scroll;
      },
      getBoundingClientRect() {
        return { top: 0, left: 0, width: innerWidth, height: innerHeight };
      },
      pinType: document.body.style.transform ? "transform" : "fixed"
    });
    ScrollTrigger.addEventListener("refresh", () => lenis.resize());
    ScrollTrigger.refresh();

    //──────────────────────────────────────────
    // PARALLAX elements (planet, saturn, moon, etc.)
    //──────────────────────────────────────────
    gsap.to(".about_planet", {
      y: 20 * vh,
      ease: "none",
      scrollTrigger: { trigger: ".parallax-wrapper", start: "top top", end: "bottom bottom", scrub: true }
    });

    gsap.to(".spacecats", {
      x: -3 * vw, y: 55 * vh, rotation: 20, scale: 1.1,
      ease: "none",
      scrollTrigger: { trigger: ".parallax-wrapper", start: "top top", end: "bottom bottom", scrub: true }
    });

    gsap.to(".about_saturn", {
      x: -2 * vw, y: 30 * vh, rotation: -25, scale: 0.9,
      ease: "none",
      scrollTrigger: { trigger: ".parallax-wrapper", start: "top top", end: "bottom bottom", scrub: true }
    });

    gsap.to(".satellitemove", {
      x: 10 * vw, y: 50 * vh, rotation: 15, scale: 0.85,
      ease: "none",
      scrollTrigger: { trigger: ".parallax-wrapper", start: "top top", end: "bottom bottom", scrub: true }
    });

    gsap.to(".about_watermoon", {
      y: 35 * vh, ease: "none",
      scrollTrigger: { trigger: ".parallax-wrapper", start: "top top", end: "bottom bottom", scrub: true }
    });

    //──────────────────────────────────────────
    // Jetplane arc path
    //──────────────────────────────────────────
    (() => {
      const jet = document.querySelector(".about_jetplane");
      if (!jet) return;

      const powEase = (t, p = 2.2) => Math.pow(t, p);

      ScrollTrigger.create({
        trigger: ".about_jetplane",
        start: "top 50%",
        end: "bottom 30%",
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate(self) {
          const t = self.progress;
          const x = 145 * vw * t;

          // vertical path
          const arc = (isMobile ? 26 : 36) * vh;
          const p = 2.2;
          const climbY = -arc * Math.pow(t, p);

          const dipEnd = 0.18;
          const dipAmp = (isMobile ? 6 : 9) * vh;
          const inDip = t < dipEnd;
          const dipY = inDip ? dipAmp * Math.sin(Math.PI * (t / dipEnd)) : 0;

          const y = -5 * vw + dipY + climbY;

          // rotation
          const dClimb = -arc * p * Math.pow(Math.max(t, 0.0001), p - 1);
          const dDip = inDip ? dipAmp * (Math.PI / dipEnd) * Math.cos(Math.PI * (t / dipEnd)) : 0;
          const dydt = dClimb + dDip;
          const dxdt = 130 * vw;

          let angleDeg = Math.atan2(dydt, dxdt) * (180 / Math.PI);

          if (t < 0.05) angleDeg *= t / 0.05;

          const targetRot = Math.max(-18, Math.min(angleDeg * 0.9, 0));
          const prevRot = parseFloat(jet.dataset.prevRot || "0");
          const smoothedRot = prevRot + (targetRot - prevRot) * 0.15;
          jet.dataset.prevRot = smoothedRot;

          jet.style.transform = `translate(${x}px, ${y}px) rotate(${smoothedRot}deg)`;
        }
      });
    })();

    //──────────────────────────────────────────
    // Woman UFO + Trail
    //──────────────────────────────────────────
    const ufoEl = document.querySelector(".about_womanufo");
    if (ufoEl) {
      const velocity = isMobile ? 1 : 3;
      const maxAmpVal = isMobile ? 20 * vh : 60 * vh;
      const tiltDiv = isMobile ? 3 : 1;
      const chaseSpeed = isMobile ? 0.08 : 0.15;

      function getBaseY() { return (isMobile ? -10 : -20) * vh; }
      const targetState = { x: 0, y: getBaseY(), rot: 0 };
      const actualState = { ...targetState };

      ufoEl.style.setProperty("--ufo-x", `${actualState.x}px`);
      ufoEl.style.setProperty("--ufo-y", `${actualState.y}px`);
      ufoEl.style.setProperty("--ufo-rot", `${actualState.rot}deg`);

      ScrollTrigger.create({
        trigger: ".parallax-wrapper",
        start: "top top",
        end: isMobile ? `${innerHeight * 0.25}px top` : `${innerHeight * 0.5}px top`,
        scrub: true,
        onUpdate(self) { targetState.x = 130 * vw * self.progress; }
      });

      let lastScroll = 0, bouncePhase = 0, idleFrames = 0;
      const idleMax = 30;

      function updateBounceTilt() {
        const scrollPos = lenis.scroll;
        const deltaY = scrollPos - lastScroll;
        lastScroll = scrollPos;

        const amplitude = Math.min(Math.abs(deltaY) * velocity, maxAmpVal);
        const horizontal = targetState.x / vw;
        const bounceScale = horizontal <= 30 ? 0 :
                            horizontal >= 100 ? 1 :
                            (horizontal - 30) / 70;

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

        const rawTilt = deltaY / tiltDiv;
        targetState.rot = Math.max(-20, Math.min(rawTilt, 20)) * bounceScale;

        requestAnimationFrame(updateBounceTilt);
      }
      updateBounceTilt();

      // Trail
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      let trailPoints = [];
      const trailMax = 40;
      const fadeTime = 800;

      Object.assign(canvas.style, {
        position: "fixed", top: 0, left: 0,
        pointerEvents: "none", zIndex: 10, background: "transparent"
      });
      canvas.id = "akiraMouseTrail";
      document.querySelector(".fixed_screen_area").appendChild(canvas);

      function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
      resizeCanvas();
      window.addEventListener("resize", resizeCanvas);

      function animateUFO() {
        actualState.x += (targetState.x - actualState.x) * chaseSpeed;
        actualState.y += (targetState.y - actualState.y) * chaseSpeed;
        actualState.rot += (targetState.rot - actualState.rot) * chaseSpeed;

        ufoEl.style.setProperty("--ufo-x", `${actualState.x}px`);
        ufoEl.style.setProperty("--ufo-y", `${actualState.y}px`);
        ufoEl.style.setProperty("--ufo-rot", `${actualState.rot}deg`);

        const rect = ufoEl.getBoundingClientRect();
        trailPoints.push({ x: rect.left + rect.width/2, y: rect.top + rect.height/2, t: performance.now() });
        if (trailPoints.length > trailMax) trailPoints.shift();

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const maxWidth = rect.height * 0.4;
        trailPoints.forEach((p1, i) => {
          const p2 = trailPoints[i+1];
          if (!p2) return;
          const dx = p2.x - p1.x, dy = p2.y - p1.y;
          if (Math.hypot(dx, dy) < 1) return;

          const age = performance.now() - p1.t;
          const alpha = 1 - age / fadeTime;
          if (alpha <= 0) return;

          const lineW = 10 + (maxWidth - 10) * alpha;
          ctx.strokeStyle = `rgba(225,255,0,${alpha})`;
          ctx.lineWidth = lineW;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.quadraticCurveTo(p1.x + dx*0.5, p1.y + dy*0.5, p2.x, p2.y);
          ctx.stroke();
        });

        requestAnimationFrame(animateUFO);
      }
      animateUFO();
    }

    //──────────────────────────────────────────
    // Galaxy slow parallax
    //──────────────────────────────────────────
    (() => {
      const el = document.querySelector(".about_galaxy");
      if (!el) return;
      const ratio = isMobile ? 0.01 : 0.015; // very slow drift
      gsap.set(el, { y: 0, force3D: true });
      ScrollTrigger.create({
        trigger: ".about_underwater",
        start: "top bottom",
        end: "bottom top",
        scrub: 0.35,
        onUpdate(self) {
          const y = (self.scroll() - self.start) * ratio;
          gsap.set(el, { y });
        }
      });
    })();

  } catch (err) {
    console.error('[turboturtle] Boot failed ❌', err);
  }
};

// auto-run
window.turboturtleBoot();

// mark boot complete
window.__TT_BOOTED__ = true;
console.info('[turboturtle] Boot complete ✅');


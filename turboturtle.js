<script src="https://unpkg.com/lenis@1.3.11/dist/lenis.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>

<script>
  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  let vw = window.innerWidth / 100;
  let vh = window.innerHeight / 100;

  window.addEventListener("resize", () => {
    vw = window.innerWidth / 100;
    vh = window.innerHeight / 100;
  });

  const lenis = new Lenis({
    duration: 4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    direction: 'vertical',
    gestureDirection: 'vertical',
    mouseMultiplier: 1,
    touchMultiplier: isMobile ? 0.2 : 2,
    infinite: false
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  gsap.registerPlugin(ScrollTrigger);

  // Parallax layers
  gsap.to(".about_planet", { y: 20 * vh, ease: "none", scrollTrigger: { trigger: ".parallax-wrapper", start: "top top", end: "bottom bottom", scrub: true } });
  gsap.to(".spacecats", { x: -3 * vw, y: 55 * vh, rotation: 20, scale: 1.1, ease: "none", scrollTrigger: { trigger: ".parallax-wrapper", start: "top top", end: "bottom bottom", scrub: true } });
  gsap.to(".about_saturn", { x: -2 * vw, y: 30 * vh, rotation: -25, scale: 0.9, ease: "none", scrollTrigger: { trigger: ".parallax-wrapper", start: "top top", end: "bottom bottom", scrub: true } });
  gsap.to(".satellitemove", { x: 10 * vw, y: 50 * vh, rotation: 15, scale: 0.85, ease: "none", scrollTrigger: { trigger: ".parallax-wrapper", start: "top top", end: "bottom bottom", scrub: true } });
  gsap.to(".about_moon", { y: 70 * vh, ease: "none", scrollTrigger: { trigger: ".parallax-wrapper", start: "top top", end: "bottom bottom", scrub: true } });
  gsap.to(".about_section_1", { y: -10 * vh, ease: "none", scrollTrigger: { trigger: ".parallax-wrapper", start: "top top", end: "bottom bottom", scrub: true } });

  // Object-specific triggers
  gsap.to(".lakeshrink", { scaleY: 0.4, ease: "none", scrollTrigger: { trigger: ".lakeshrink", start: "top bottom", end: "bottom top", scrub: true } });
  gsap.to(".duckswim", { x: -5 * vw - 80, yPercent: -35, ease: "none", scrollTrigger: { trigger: ".duckswim", start: "top bottom", end: "bottom top", scrub: true } });

  // Woman UFO horizontal movement
  const ufo = document.querySelector(".about_womanufo");

  gsap.to(ufo, {
    x: 130 * vw,
    ease: "none",
    scrollTrigger: {
      trigger: ".parallax-wrapper",
      start: "top top",
      end: isMobile
        ? `${window.innerHeight * 0.25}px top`
        : `${window.innerHeight * 0.5}px top`,
      scrub: true
    }
  });

  // Zigzag vertical motion with scroll velocity + idle detection
  let zigzagAmplitude = 0;
  let zigzagPhase = 0;
  let idleFrames = 0;
  const idleThreshold = 10;
  const idleFrameLimit = 30;

  gsap.ticker.add(() => {
    const velocity = ScrollTrigger.getVelocity();

    if (Math.abs(velocity) < idleThreshold) {
      idleFrames++;
      if (idleFrames > idleFrameLimit) {
        zigzagAmplitude = 0;
      }
    } else {
      idleFrames = 0;
      zigzagAmplitude = Math.min(Math.abs(velocity) / 10, 40 * vh);
    }

    zigzagPhase += 0.3; // Increased frequency
    const offsetY = Math.sin(zigzagPhase) * zigzagAmplitude;
    const baseY = isMobile ? -10 * vh : -20 * vh;
    gsap.set(ufo, { y: baseY + offsetY });

    updateTrail(); // Sync trail update to frame
  });

  // Akira-style trail
  const canvas = document.createElement("canvas");
  canvas.id = "akiraMouseTrail";
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "10";
  canvas.style.background = "transparent";
  document.querySelector(".fixed_screen_area").appendChild(canvas);

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.width = canvas.width + "px";
    canvas.style.height = canvas.height + "px";
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  const ctx = canvas.getContext("2d");
  let trail = [];
  const maxTrailLength = 40;
  const fadeDuration = 800;

  function updateTrail() {
    const dot = document.querySelector(".akira_light_dot");
    if (!dot) return;

    const rect = dot.getBoundingClientRect();
    const offsetX = gsap.getProperty(dot, "x") || 0;
    const offsetY = gsap.getProperty(dot, "y") || 0;

    const x = rect.left + rect.width / 2 + offsetX;
    const y = rect.top + rect.height / 2 + offsetY;

    trail.push({ x, y, time: performance.now() });
    if (trail.length > maxTrailLength) trail.shift();
  }

  function drawTrail() {
    const now = performance.now();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const ufoHeight = ufo?.getBoundingClientRect().height || 100;
    const maxWidth = ufoHeight * 0.4;

    for (let i = 0; i < trail.length - 1; i++) {
      const p1 = trail[i];
      const p2 = trail[i + 1];
      const age = now - p1.time;
      const alpha = 1 - age / fadeDuration;
      if (alpha <= 0) continue;

      const minWidth = 10;
      const lineWidth = minWidth + (maxWidth - minWidth) * alpha;

      ctx.strokeStyle = `rgba(225, 255, 0, ${alpha})`;
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);

      const cpX = (p1.x + p2.x) / 2;
      const cpY = (p1.y + p2.y) / 2;

      ctx.quadraticCurveTo(cpX, cpY, p2.x, p2.y);
      ctx.stroke();
    }

    trail = trail.filter(p => now - p.time < fadeDuration);
    requestAnimationFrame(drawTrail);
  }

  drawTrail();
</script>

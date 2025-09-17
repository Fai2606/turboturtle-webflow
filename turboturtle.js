/* turboturtle.js — project bootstrap
   - Lenis + GSAP ScrollTrigger wiring
   - Parallax tweens
   - Jetplane arc
   - Woman UFO chase + Akira trail (GSAP owns transform fully)
   - Galaxy slow parallax
   - Video visibility play/pause
*/

(function (root) {
  if (!root) return;
  root.TT = root.TT || {};

  var isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  var vw = root.innerWidth / 100;
  var vh = root.innerHeight / 100;
  root.addEventListener("resize", () => {
    vw = root.innerWidth / 100;
    vh = root.innerHeight / 100;
  });

  // Wait for libs
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
    if (libsReady()) { onReady(startApp); return; }
    if (tries > 0) setTimeout(() => waitForLibsAndStart(tries - 1), 100);
  }

  // ───────────────────────────────
  // Main
  // ───────────────────────────────
  function startApp() {
    var gsap = root.gsap;
    var ScrollTrigger = root.ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);

    // Lenis smooth scroll
    var lenis = new root.Lenis({
      duration: isMobile ? 6 : 4,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      direction: "vertical",
      gestureDirection: "vertical",
      mouseMultiplier: 1,
      touchMultiplier: isMobile ? 0.2 : 2,
      infinite: false
    });
    root.lenis = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
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
    lenis.on?.("scroll", ScrollTrigger.update);
    ScrollTrigger.addEventListener("refresh", () => lenis.resize?.());
    ScrollTrigger.refresh();

    // ───────────────────────────────
    // Parallax samples (planet, saturn, etc.)
    // ───────────────────────────────
    gsap.to(".about_planet", {
      y: 20 * vh,
      ease: "none",
      scrollTrigger: { trigger: ".parallax-wrapper", start: "top top", end: "bottom bottom", scrub: true }
    });
    gsap.to(".spacecats", {
      x: -3 * vw,
      y: 55 * vh,
      rotation: 20,
      scale: 1.1,
      ease: "none",
      scrollTrigger: { trigger: ".parallax-wrapper", start: "top top", end: "bottom bottom", scrub: true }
    });
    // … (keep all your parallax gsap.to() calls here, same structure)

    // ───────────────────────────────
    // Jetplane
    // ───────────────────────────────
    (function initJet() {
      var jet = document.querySelector(".about_jetplane");
      if (!jet) return;
      ScrollTrigger.create({
        trigger: ".about_jetplane",
        start: "top 50%",
        end: "bottom 30%",
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate(self) {
          var t = self.progress;
          var x = 145 * vw * t;
          var arc = (isMobile ? 26 : 36) * vh;
          var climbY = -arc * Math.pow(t, 2.2);
          var dipEnd = 0.18;
          var dipAmp = (isMobile ? 6 : 9) * vh;
          var dipY = t < dipEnd ? dipAmp * Math.sin(Math.PI * (t / dipEnd)) : 0;
          var y = -5 * vw + dipY + climbY;

          var dClimb = -arc * 2.2 * Math.pow(Math.max(t, 0.0001), 1.2);
          var dDip = t < dipEnd ? dipAmp * (Math.PI / dipEnd) * Math.cos(Math.PI * (t / dipEnd)) : 0;
          var dydt = dClimb + dDip;
          var dxdt = 130 * vw;
          var angleDeg = Math.atan2(dydt, dxdt) * (180 / Math.PI);
          if (t < 0.05) angleDeg *= t / 0.05;

          var targetRot = Math.max(-18, Math.min(angleDeg * 0.9, 0));
          var prevRot = parseFloat(jet.dataset.prevRot || "0");
          var smoothed = prevRot + (targetRot - prevRot) * 0.15;
          jet.dataset.prevRot = smoothed;
          jet.style.transform = `translate(${x}px,${y}px) rotate(${smoothed}deg)`;
        }
      });
    })();

    // ───────────────────────────────
    // Galaxy ultra slow parallax
    // ───────────────────────────────
    (function initGalaxy() {
      var el = document.querySelector(".about_galaxy");
      if (!el) return;
      var ratio = isMobile ? 0.005 : 0.01;
      gsap.set(el, { y: 0, force3D: true });
      ScrollTrigger.create({
        trigger: ".about_underwater",
        start: "top bottom",
        end: "bottom top",
        scrub: 0.35,
        pin: el,
        pinSpacing: false,
        onUpdate(self) {
          var y = (self.scroll() - self.start) * ratio;
          gsap.set(el, { y });
        }
      });
      ScrollTrigger.addEventListener("refresh", () => gsap.set(el, { y: 0 }));
    })();

    // ───────────────────────────────
    // Video visibility
    // ───────────────────────────────
    (function initVideos() {
      var vids = document.querySelectorAll(".about_onceupon video, video[data-pause-offscreen]");
      if (!vids.length) return;
      vids.forEach(v => { v.setAttribute("playsinline", ""); v.setAttribute("muted", ""); });
      vids.forEach(v => {
        ScrollTrigger.create({
          trigger: v,
          start: "top 120%",
          end: "bottom -20%",
          onEnter: () => v.play?.(),
          onEnterBack: () => v.play?.()
        });
        ScrollTrigger.create({
          trigger: v,
          start: "bottom top",
          end: "top bottom",
          onLeave: () => v.pause?.(),
          onLeaveBack: () => v.pause?.()
        });
      });
      document.addEventListener("visibilitychange", () => {
        vids.forEach(v => {
          if (document.hidden) v.pause?.();
          else {
            var r = v.getBoundingClientRect();
            if (r.bottom > 0 && r.top < innerHeight) v.play?.();
          }
        });
      });
    })();

    // ───────────────────────────────
    // Woman UFO (no Webflow transforms!)
    // ───────────────────────────────
    (function initUFO() {
      var host = document.querySelector(".about_womanufo");
      if (!host) return;

      var velocity = isMobile ? 1 : 3;
      var maxAmpVal = isMobile ? 20 * vh : 60 * vh;
      var tiltDiv = isMobile ? 3 : 1;
      var chaseSpeed = isMobile ? 0.08 : 0.15;
      function getBaseY() { return (isMobile ? -10 : -20) * vh; }

      var target = { x: 0, y: getBaseY(), rot: 0 };
      var actual = { ...target };

      ScrollTrigger.create({
        trigger: ".parallax-wrapper",
        start: "top top",
        end: isMobile ? innerHeight * 0.25 + "px top" : innerHeight * 0.5 + "px top",
        scrub: true,
        onUpdate(self) { target.x = 130 * vw * self.progress; }
      });

      var lastScroll = 0, bouncePhase = 0, idleFrames = 0;
      function updateBounceTilt() {
        var scrollPos = root.lenis?.scroll ?? window.pageYOffset;
        var deltaY = scrollPos - lastScroll;
        lastScroll = scrollPos;
        var amplitude = Math.min(Math.abs(deltaY) * velocity, maxAmpVal);
        var bounceScale = target.x / vw <= 30 ? 0 : target.x / vw >= 100 ? 1 : (target.x / vw - 30) / 70;
        if (Math.abs(deltaY) < 1) {
          if (++idleFrames > 30) gsap.to(target, { y: getBaseY(), duration: 0.4, ease: "power3.out" });
        } else {
          idleFrames = 0;
          bouncePhase += 0.1;
          target.y = getBaseY() + Math.sin(bouncePhase) * amplitude * bounceScale;
        }
        target.rot = Math.max(-20, Math.min(deltaY / tiltDiv, 20)) * bounceScale;
        requestAnimationFrame(updateBounceTilt);
      }
      requestAnimationFrame(updateBounceTilt);

      var canvas = document.getElementById("akiraMouseTrail");
      if (!canvas) {
        canvas = document.createElement("canvas");
        canvas.id = "akiraMouseTrail";
        Object.assign(canvas.style, { position: "fixed", top: 0, left: 0, pointerEvents: "none", zIndex: 10 });
        (document.querySelector(".fixed_screen_area") || document.body).appendChild(canvas);
      }
      var ctx = canvas.getContext("2d");
      function resizeCanvas() { canvas.width = innerWidth; canvas.height = innerHeight; }
      resizeCanvas(); window.addEventListener("resize", resizeCanvas);

      var trail = [];
      var trailMax = 40;
      var fadeTime = 800;

      function animateUFO() {
        actual.x += (target.x - actual.x) * chaseSpeed;
        actual.y += (target.y - actual.y) * chaseSpeed;
        actual.rot += (target.rot - actual.rot) * chaseSpeed;
        host.style.transform = `translate3d(${actual.x}px,${actual.y}px,0) rotate(${actual.rot}deg)`;

        var r = host.getBoundingClientRect();
        trail.push({ x: r.left + r.width/2, y: r.top + r.height/2, t: performance.now() });
        if (trail.length > trailMax) trail.shift();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        var maxW = r.height * 0.4;
        for (var i=0;i<trail.length-1;i++) {
          var p1 = trail[i], p2 = trail[i+1];
          var dx = p2.x - p1.x, dy = p2.y - p1.y;
          if (Math.hypot(dx,dy)<1) continue;
          var alpha = 1 - (performance.now()-p1.t)/fadeTime;
          if (alpha<=0) continue;
          ctx.strokeStyle = `rgba(225,255,0,${alpha})`;
          ctx.lineWidth = 10+(maxW-10)*alpha;
          ctx.beginPath();
          ctx.moveTo(p1.x,p1.y);
          ctx.quadraticCurveTo(p1.x+dx*0.5,p1.y+dy*0.5,p2.x,p2.y);
          ctx.stroke();
        }
        requestAnimationFrame(animateUFO);
      }
      requestAnimationFrame(animateUFO);
    })();
  }
})(window);

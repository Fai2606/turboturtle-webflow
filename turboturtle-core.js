// ───────────────────────────────────────
// Woman UFO: chase + trail (drive CSS variables on .about_womanufo)
// ───────────────────────────────────────
(function bootUFOWhenReady() {
  function afterWebflowIX(fn) {
    if (window.Webflow && typeof Webflow.push === "function") {
      Webflow.push(fn);
    } else if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      requestAnimationFrame(fn);
    }
    window.addEventListener("load", fn, { once: true });
  }

  afterWebflowIX(initUFO);

  function initUFO() {
    var host = document.querySelector(".about_womanufo");
    if (!host) return;

    // HUD (always create when TT_DEBUG true)
    var HUD = null;
    if (window.TT_DEBUG) {
      HUD = document.createElement("div");
      HUD.style.cssText =
        "position:fixed;left:8px;bottom:8px;padding:6px 8px;background:rgba(0,0,0,.6);color:#0f0;font:12px/1.2 monospace;z-index:99999;border-radius:4px";
      HUD.textContent = "UFO HUD…";
      document.body.appendChild(HUD);
    }

    // prefer sampling an inner art node (trail anchor)
    var sampleNode = host.querySelector("img,svg,canvas,video") || host;

    // viewport units
    var _vw = window.innerWidth / 100;
    var _vh = window.innerHeight / 100;
    window.addEventListener("resize", function () {
      _vw = window.innerWidth / 100;
      _vh = window.innerHeight / 100;
    });

    // params (same feel)
    var isMobile   = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    var velocity   = isMobile ? 1 : 3;
    var maxAmpVal  = isMobile ? 20 * _vh : 60 * _vh;
    var tiltDiv    = isMobile ? 3 : 1;
    var chaseSpeed = isMobile ? 0.08 : 0.15;

    function baseY() { return (isMobile ? -10 : -20) * _vh; }

    var targetState = { x: 0, y: baseY(), rot: 0 };
    var actualState = { x: 0, y: baseY(), rot: 0 };

    // Horizontal driver via ScrollTrigger (updates targetState.x)
    var lastSTProgress = 0;
    var triggerSel = document.querySelector(".parallax-wrapper") ? ".parallax-wrapper" : "body";
    ScrollTrigger.create({
      trigger:   triggerSel,
      start:     "top top",
      end:       (isMobile ? innerHeight * 0.25 : innerHeight * 0.5) + "px top",
      scrub:     true,
      onUpdate:  function (self) {
        lastSTProgress = self.progress;
        targetState.x  = 130 * _vw * self.progress;
      }
    });

    // ensure some horizontal progress even if ST hasn’t run yet
    function ensureHorizontalProgress() {
      if (lastSTProgress > 0) return;
      var doc = document.documentElement;
      var maxScroll = (doc.scrollHeight - innerHeight) || 1;
      var ratio = Math.max(0, Math.min(1, (window.pageYOffset || 0) / maxScroll));
      targetState.x = 130 * _vw * ratio;
    }

    // Bounce & tilt based on scroll velocity (Lenis-aware)
    var lastScroll  = 0;
    var bouncePhase = 0;
    var idleFrames  = 0;
    var idleMax     = 30;

    function updateBounceTilt() {
      var s = (typeof window.lenis?.scroll === "number") ? window.lenis.scroll : (window.pageYOffset || 0);
      var dY = s - lastScroll;
      lastScroll = s;

      ensureHorizontalProgress();

      var amp = Math.min(Math.abs(dY) * velocity, maxAmpVal);
      var horizontal = targetState.x / _vw;
      var bounceScale = (horizontal <= 30) ? 0 : (horizontal >= 100) ? 1 : (horizontal - 30) / 70;

      if (Math.abs(dY) < 1) {
        idleFrames++;
        if (idleFrames > idleMax) {
          gsap.to(targetState, { y: baseY(), duration: 0.4, ease: "power3.out" });
        }
      } else {
        idleFrames = 0;
        bouncePhase += 0.1;
        targetState.y = baseY() + Math.sin(bouncePhase) * amp * bounceScale;
      }

      var rawTilt = dY / tiltDiv;
      targetState.rot = Math.max(-20, Math.min(rawTilt, 20)) * bounceScale;

      requestAnimationFrame(updateBounceTilt);
    }
    requestAnimationFrame(updateBounceTilt);

    // Akira trail canvas (once)
    var canvas = document.getElementById("akiraMouseTrail");
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.id = "akiraMouseTrail";
      Object.assign(canvas.style, {
        position:       "fixed",
        top:            0,
        left:           0,
        pointerEvents:  "none",
        zIndex:         10,
        background:     "transparent"
      });
      (document.querySelector(".fixed_screen_area") || document.body).appendChild(canvas);
    }
    var ctx = canvas.getContext("2d");
    function resizeCanvas() {
      canvas.width  = innerWidth;
      canvas.height = innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    var trailPoints = [];
    var trailMax    = 40;
    var fadeTime    = 800;

    // Render loop — drives CSS variables on the host (matches your CSS)
    function animateUFO() {
      // chase target
      actualState.x   += (targetState.x   - actualState.x)   * chaseSpeed;
      actualState.y   += (targetState.y   - actualState.y)   * chaseSpeed;
      actualState.rot += (targetState.rot - actualState.rot) * chaseSpeed;

      // apply CSS variables (THIS is the key change)
      host.style.setProperty("--ufo-x",   actualState.x.toFixed(3) + "px");
      host.style.setProperty("--ufo-y",   actualState.y.toFixed(3) + "px");
      host.style.setProperty("--ufo-rot", actualState.rot.toFixed(3) + "deg");

      // trail from the visible art
      var rs = sampleNode.getBoundingClientRect();
      trailPoints.push({ x: rs.left + rs.width / 2, y: rs.top + rs.height / 2, t: performance.now() });
      if (trailPoints.length > trailMax) trailPoints.shift();

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      var maxWidth = rs.height * 0.4;
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
        ctx.quadraticCurveTo(p1.x + dx * 0.5, p1.y + dy * 0.5, p2.x, p2.y);
        ctx.stroke();
      }

      if (HUD) {
        HUD.textContent =
          "UFO x:" + actualState.x.toFixed(1) +
          "  y:"   + actualState.y.toFixed(1) +
          "  rot:" + actualState.rot.toFixed(1);
      }

      requestAnimationFrame(animateUFO);
    }
    requestAnimationFrame(animateUFO);
  }
})();

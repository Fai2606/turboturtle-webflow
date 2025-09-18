/* ufo-patch.js
   Standalone fix for .about_womanufo:
   - Injects a child mover so Webflow transforms on the parent no longer block us
   - Drives motion with ScrollTrigger + Lenis velocity
   - Restores the Akira trail
   - Optional HUD when window.TT_DEBUG = true
*/
(function (root) {
  if (!root) return;

  // make a small namespace
  root.TT = root.TT || {};

  // expose boot so we can call it from console if needed
  root.TT.bootUFO = bootUFOWhenReady;

  // kick off
  bootUFOWhenReady();

  // ─────────────────────────────────────────
  // helpers
  // ─────────────────────────────────────────
  function onAfterWebflow(fn) {
    // If Webflow exists, wait for it to run interactions; else fallback to DOM ready
    if (root.Webflow && typeof root.Webflow.push === "function") {
      root.Webflow.push(fn);
      return;
    }
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      // run next frame to let Webflow finish any inline work
      requestAnimationFrame(fn);
    }
  }

  function clamp(n, a, b) {
    return Math.max(a, Math.min(b, n));
  }

  function hudInit() {
    if (!root.TT_DEBUG) return null;
    var hud = document.createElement("div");
    hud.style.cssText = [
      "position:fixed",
      "left:8px",
      "bottom:8px",
      "z-index:99999",
      "background:rgba(0,0,0,.6)",
      "color:#0f0",
      "font:12px/1.2 monospace",
      "padding:6px 8px",
      "border-radius:4px"
    ].join(";");
    document.body.appendChild(hud);
    return hud;
  }

  // ─────────────────────────────────────────
  // main boot
  // ─────────────────────────────────────────
  function bootUFOWhenReady() {
    onAfterWebflow(function () {
      try {
        var gsap = root.gsap;
        var ST   = root.ScrollTrigger;
        if (!gsap || !ST) return; // wait until main lib is there

        var host = document.querySelector(".about_womanufo");
        if (!host) return;

        // If we already patched, bail
        if (host.querySelector(".ufo-mover")) return;

        // ensure the host can position the mover
        host.style.position = host.style.position || "relative";
        host.style.willChange = "transform";

        // Create mover (absolute child we control)
        var mover = document.createElement("div");
        mover.className = "ufo-mover";
        mover.style.position = "absolute";
        mover.style.left = "0";
        mover.style.top  = "0";
        mover.style.willChange = "transform";
        mover.style.transform  = "translate3d(0,0,0)";

        // Move the visible art into mover (img/svg/canvas/video), else clone contents
        var art = host.querySelector("img,svg,canvas,video");
        if (art && art.parentElement === host) {
          mover.appendChild(art);
        } else {
          // fallback: move all children into mover
          while (host.firstChild) mover.appendChild(host.firstChild);
        }
        host.appendChild(mover);

        // Trail canvas (global singleton)
        var canvas = document.getElementById("akiraMouseTrail");
        if (!canvas) {
          canvas = document.createElement("canvas");
          canvas.id = "akiraMouseTrail";
          Object.assign(canvas.style, {
            position: "fixed",
            top: "0",
            left: "0",
            pointerEvents: "none",
            background: "transparent",
            zIndex: 10
          });
          (document.querySelector(".fixed_screen_area") || document.body).appendChild(canvas);
        }
        var ctx = canvas.getContext("2d");
        function resizeCanvas() {
          canvas.width  = root.innerWidth;
          canvas.height = root.innerHeight;
        }
        resizeCanvas();
        root.addEventListener("resize", resizeCanvas);

        // state
        var isMobile   = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        var vw         = root.innerWidth  / 100;
        var vh         = root.innerHeight / 100;
        root.addEventListener("resize", function () {
          vw = root.innerWidth  / 100;
          vh = root.innerHeight / 100;
        });

        var velocity   = isMobile ? 1 : 3;
        var maxAmpVal  = isMobile ? 20 * vh : 60 * vh;
        var tiltDiv    = isMobile ? 3 : 1;
        var chaseSpeed = isMobile ? 0.08 : 0.15;

        function baseY() {
          return (isMobile ? -10 : -20) * vh;
        }

        var target = { x: 0, y: baseY(), rot: 0 };
        var actual = { x: 0, y: baseY(), rot: 0 };

        // HUD
        var hud = hudInit();

        // Horizontal driver (use .parallax-wrapper if present)
        var triggerSel = document.querySelector(".parallax-wrapper") ? ".parallax-wrapper" : "body";
        var lastSTProgress = 0;

        ST.create({
          trigger: triggerSel,
          start:   "top top",
          end:     (isMobile ? root.innerHeight * 0.25 : root.innerHeight * 0.5) + "px top",
          scrub:   true,
          onUpdate: function (self) {
            lastSTProgress = self.progress;
            target.x = 130 * vw * self.progress;
          }
        });

        // Bounce/tilt based on scroll speed (Lenis aware)
        var lastScroll = 0;
        var bouncePhase = 0;
        var idleFrames = 0;
        var idleMax    = 30;

        function updateBounceTilt() {
          var l = root.lenis;
          var scrollPos = (l && typeof l.scroll === "number") ? l.scroll : (root.pageYOffset || 0);
          var deltaY    = scrollPos - lastScroll;
          lastScroll    = scrollPos;

          // if ST didn’t run yet, approximate horizontal with page ratio
          if (lastSTProgress === 0 && (document.documentElement.scrollHeight - innerHeight) > 0) {
            var maxScroll = document.documentElement.scrollHeight - innerHeight;
            var ratio = clamp(scrollPos / maxScroll, 0, 1);
            target.x = 130 * vw * ratio;
          }

          var amplitude   = Math.min(Math.abs(deltaY) * velocity, maxAmpVal);
          var horizontal  = target.x / vw;
          var bounceScale = (horizontal <= 30) ? 0 : (horizontal >= 100) ? 1 : (horizontal - 30) / 70;

          if (Math.abs(deltaY) < 1) {
            idleFrames++;
            if (idleFrames > idleMax) {
              root.gsap.to(target, {
                y:        baseY(),
                duration: 0.4,
                ease:     "power3.out"
              });
            }
          } else {
            idleFrames = 0;
            bouncePhase += 0.1;
            target.y = baseY() + Math.sin(bouncePhase) * amplitude * bounceScale;
          }

          var rawTilt  = deltaY / tiltDiv;
          target.rot   = clamp(rawTilt, -20, 20) * bounceScale;

          requestAnimationFrame(updateBounceTilt);
        }
        requestAnimationFrame(updateBounceTilt);

        // trail points
        var trail = [];
        var trailMax = 40;
        var fadeTime = 800;

        // render loop
        function tick() {
          // chase
          actual.x   += (target.x   - actual.x)   * chaseSpeed;
          actual.y   += (target.y   - actual.y)   * chaseSpeed;
          actual.rot += (target.rot - actual.rot) * chaseSpeed;

          // apply to mover (NOT the host) to avoid Webflow transforms collision
          mover.style.transform =
            "translate3d(" + actual.x + "px," + actual.y + "px,0) rotate(" + actual.rot + "deg)";

          // sample center from mover
          var r = mover.getBoundingClientRect();
          trail.push({
            x: r.left + r.width  * 0.5,
            y: r.top  + r.height * 0.5,
            t: performance.now()
          });
          if (trail.length > trailMax) trail.shift();

          // draw trail
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          var maxW = r.height * 0.4;
          for (var i = 0; i < trail.length - 1; i++) {
            var p1 = trail[i];
            var p2 = trail[i + 1];
            var dx = p2.x - p1.x;
            var dy = p2.y - p1.y;
            if (Math.hypot(dx, dy) < 1) continue;

            var age   = performance.now() - p1.t;
            var alpha = 1 - age / fadeTime;
            if (alpha <= 0) continue;

            ctx.strokeStyle = "rgba(225,255,0," + alpha + ")";
            ctx.lineWidth   = 10 + (maxW - 10) * alpha;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.quadraticCurveTo(
              p1.x + dx * 0.5,
              p1.y + dy * 0.5,
              p2.x, p2.y
            );
            ctx.stroke();
          }

          if (hud) {
            hud.textContent =
              "UFO mover | x:" + actual.x.toFixed(1) +
              " y:" + actual.y.toFixed(1) +
              " rot:" + actual.rot.toFixed(1);
          }

          requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);

      } catch (e) {
        console.error("[TT UFO] boot failed:", e);
      }
    });
  }
})(window);

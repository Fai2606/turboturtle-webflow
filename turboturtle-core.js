// --- 3. JETMAN & SURPRISED DOLPHIN ANIMATION (OFF-CENTER THRUSTER & BEHIND LAYER FIX) ---
var jetman = q(".about_jetman");
var dolphin = q(".about_dolphin");

if (jetman) {
  var hoverTween;
  var jTrail = [], jTrailMax = 18, jFadeTime = 350;
  var jCanvas = document.getElementById("jetmanTrailCanvas");
  var trailDelayTimeout;

  // Ensure Jetman sits above any child/sibling elements in his parent block
  jetman.style.zIndex = "2";

  if (!jCanvas) {
    jCanvas = document.createElement("canvas");
    jCanvas.id = "jetmanTrailCanvas";
    Object.assign(jCanvas.style, {
      position: "fixed",
      top: "0px",
      left: "0px",
      width: "100vw",
      height: "100vh",
      pointerEvents: "none",
      zIndex: "1", // Sits under Jetman (zIndex 2)
      background: "transparent"
    });
    // Inject canvas directly into Jetman's parent wrapper right before him
    if (jetman.parentNode) {
      jetman.parentNode.insertBefore(jCanvas, jetman);
    } else {
      document.body.appendChild(jCanvas);
    }
  }
  var jCtx = jCanvas.getContext("2d");
  function resizeJCanvas() { 
    jCanvas.width = root.innerWidth; 
    jCanvas.height = root.innerHeight; 
  }
  resizeJCanvas();
  root.addEventListener("resize", resizeJCanvas);

  var isJetmanFlying = false;

  function resetTrailState() {
    isJetmanFlying = false;
    clearTimeout(trailDelayTimeout);
    jTrail = [];
    if (jCtx) jCtx.clearRect(0, 0, jCanvas.width, jCanvas.height);
  }

  function renderJetmanTrail() {
    jCtx.clearRect(0, 0, jCanvas.width, jCanvas.height);

    if (isJetmanFlying) {
      var r = jetman.getBoundingClientRect();
      var centerX = r.left + r.width / 2;
      var centerY = r.top + r.height / 2;

      // Calculate rotated offset so trail emits strictly from his bottom-left thrusters
      var currentRot = (gsap.getProperty(jetman, "rotation") || 0) * (Math.PI / 180);
      var offsetX = -r.width * 0.25; // Shift left toward thruster
      var offsetY = r.height * 0.35;  // Shift down toward thruster

      var thrusterX = centerX + (offsetX * Math.cos(currentRot) - offsetY * Math.sin(currentRot));
      var thrusterY = centerY + (offsetX * Math.sin(currentRot) + offsetY * Math.cos(currentRot));

      jTrail.push({ 
        x: thrusterX, 
        y: thrusterY, 
        t: performance.now() 
      });
      if (jTrail.length > jTrailMax) jTrail.shift();
    } else if (jTrail.length > 0) {
      jTrail.shift();
    }

    for (var i = 0; i < jTrail.length - 1; i++) {
      var p1 = jTrail[i], p2 = jTrail[i + 1];
      var dx = p2.x - p1.x, dy = p2.y - p1.y;
      if (Math.hypot(dx, dy) < 1) continue;
      var alpha = 1 - (performance.now() - p1.t) / jFadeTime;
      if (alpha <= 0) continue;

      jCtx.strokeStyle = "rgba(225,255,0," + alpha + ")";
      jCtx.lineWidth = 5 + (12 - 5) * alpha; // 1.2x width
      jCtx.beginPath();
      jCtx.moveTo(p1.x, p1.y);
      jCtx.quadraticCurveTo(p1.x + dx * 0.5, p1.y + dy * 0.5, p2.x, p2.y);
      jCtx.stroke();
    }
    requestAnimationFrame(renderJetmanTrail);
  }
  requestAnimationFrame(renderJetmanTrail);

  function startHover() {
    hoverTween = gsap.to(jetman, {
      y: "-=15",
      duration: 1,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1
    });
  }
  startHover();

  ScrollTrigger.create({
    trigger: jetman,
    start: "top 75%",
    onEnter: function () {
      gsap.killTweensOf(jetman);
      if (hoverTween) hoverTween.kill();
      if (dolphin) gsap.killTweensOf(dolphin);
      resetTrailState();

      trailDelayTimeout = setTimeout(function () {
        isJetmanFlying = true;
      }, 120);

      gsap.to(jetman, {
        x: "100vw",
        y: () => -100 * Math.tan(45 * Math.PI / 180) + "vw",
        rotation: -50,
        duration: 1.1,
        ease: "power2.in",
        onComplete: function () {
          isJetmanFlying = false;
        }
      });

      if (dolphin) {
        gsap.to(dolphin, {
          rotation: -20,
          duration: 0.4,
          delay: 0.2,
          ease: "back.out(1.7)"
        });
      }
    },
    onLeaveBack: function () {
      gsap.killTweensOf(jetman);
      if (dolphin) gsap.killTweensOf(dolphin);
      resetTrailState();

      isJetmanFlying = true;
      gsap.set(jetman, { rotation: 180 });

      gsap.to(jetman, {
        x: 0,
        y: 0,
        rotation: 0,
        duration: 1.4,
        ease: "power2.out",
        onComplete: function () {
          resetTrailState();
          startHover();
        }
      });

      if (dolphin) {
        gsap.to(dolphin, { rotation: 0, duration: 0.8, ease: "power2.out" });
      }
    }
  });
}

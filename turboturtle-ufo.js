(function (root) {
  if (!root) return;
  var started = false;

  function boot() {
    if (started) return; started = true;
    var host = document.querySelector(".about_womanufo");
    if (!host) return;

    var isMobile  = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    var gsap      = root.gsap;
    var lenis     = root.lenis;

    var vw = root.innerWidth / 100, vh = root.innerHeight / 100;
    root.addEventListener("resize", function(){ vw = root.innerWidth / 100; vh = root.innerHeight / 100; });

    var velocity = isMobile ? 1 : 3, maxAmpVal = isMobile ? 20*vh : 60*vh, tiltDiv = isMobile ? 3 : 1, chaseSpeed = isMobile ? 0.08 : 0.15;
    function getBaseY(){ return (isMobile ? -10 : -20) * vh; }

    var target = { x:0, y:getBaseY(), rot:0 }, actual = { x:0, y:getBaseY(), rot:0 };

    var lastProgress = 0;
    if (root.ScrollTrigger) {
      root.ScrollTrigger.create({
        trigger: ".parallax-wrapper", start: "top top",
        end: (isMobile ? innerHeight*0.25 : innerHeight*0.5) + "px top",
        scrub: true,
        onUpdate: function (self){ lastProgress = self.progress; target.x = 130 * vw * self.progress; }
      });
    }
    function ensureX(){
      if (lastProgress > 0) return;
      var doc = document.documentElement, max = (doc.scrollHeight - innerHeight) || 1;
      var ratio = Math.max(0, Math.min(1, (root.pageYOffset || 0) / max));
      target.x = 130 * vw * ratio;
    }

    var lastScroll = 0, bouncePhase = 0, idleFrames = 0, idleMax = 30;
    function updateBounceTilt() {
      var scrollPos = (typeof lenis?.scroll === "number") ? lenis.scroll : (root.pageYOffset || 0);
      var deltaY = scrollPos - lastScroll; lastScroll = scrollPos;
      ensureX();

      var amplitude = Math.min(Math.abs(deltaY) * velocity, maxAmpVal);
      var horizontal = target.x / vw;
      var scale = (horizontal <= 30) ? 0 : (horizontal >= 100) ? 1 : (horizontal - 30) / 70;

      if (Math.abs(deltaY) < 1) {
        idleFrames++; if (idleFrames > idleMax) gsap.to(target, { y:getBaseY(), duration:0.4, ease:"power3.out" });
      } else {
        idleFrames = 0; bouncePhase += 0.1; target.y = getBaseY() + Math.sin(bouncePhase) * amplitude * scale;
      }
      target.rot = Math.max(-20, Math.min(deltaY / tiltDiv, 20)) * scale;
      requestAnimationFrame(updateBounceTilt);
    }
    requestAnimationFrame(updateBounceTilt);

    // Akira trail (unchanged)
    var canvas = document.getElementById("akiraMouseTrail");
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.id = "akiraMouseTrail";
      Object.assign(canvas.style, { position:"fixed", top:0, left:0, pointerEvents:"none", zIndex:10, background:"transparent" });
      (document.querySelector(".fixed_screen_area") || document.body).appendChild(canvas);
    }
    var ctx = canvas.getContext("2d");
    function resizeCanvas(){ canvas.width = innerWidth; canvas.height = innerHeight; }
    resizeCanvas(); root.addEventListener("resize", resizeCanvas);

    var trail = [], trailMax = 40, fadeTime = 800;
    function loop(){
      actual.x += (target.x - actual.x) * chaseSpeed;
      actual.y += (target.y - actual.y) * chaseSpeed;
      actual.rot += (target.rot - actual.rot) * chaseSpeed;

      host.style.transform = "translate3d(" + actual.x + "px," + actual.y + "px,0) rotate(" + actual.rot + "deg)";

      var r = host.getBoundingClientRect();
      trail.push({ x:r.left + r.width/2, y:r.top + r.height/2, t:performance.now() });
      if (trail.length > trailMax) trail.shift();

      ctx.clearRect(0,0,canvas.width,canvas.height);
      var maxW = r.height * 0.4;
      for (var i=0;i<trail.length-1;i++){
        var p1=trail[i], p2=trail[i+1], dx=p2.x-p1.x, dy=p2.y-p1.y;
        if (Math.hypot(dx,dy) < 1) continue;
        var alpha = 1 - (performance.now() - p1.t)/fadeTime; if (alpha <= 0) continue;
        ctx.strokeStyle = "rgba(225,255,0," + alpha + ")"; ctx.lineWidth = 10 + (maxW - 10) * alpha;
        ctx.beginPath(); ctx.moveTo(p1.x,p1.y); ctx.quadraticCurveTo(p1.x+dx*0.5,p1.y+dy*0.5,p2.x,p2.y); ctx.stroke();
      }
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }

  try { root.addEventListener("TT:core-ready", boot, { once:true }); } catch(e){}
  setTimeout(function(){ if (root.gsap && root.lenis) boot(); }, 2000);
})(window);

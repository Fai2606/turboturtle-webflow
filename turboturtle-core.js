/* turboturtle-core.js
   - Lenis + ScrollTrigger wiring
   - Parallax tweens (unchanged)
   - Jetplane arc (unchanged)
   - Galaxy: NO movement; just reparent into .about_underwater so it’s clipped
   - Video visibility
   - Dispatches 'TT:core-ready'
*/
(function (root) {
  if (!root) return;

  var isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  var gsap, ScrollTrigger;

  var vw = root.innerWidth / 100;
  var vh = root.innerHeight / 100;
  root.addEventListener("resize", function () {
    vw = root.innerWidth / 100;
    vh = root.innerHeight / 100;
  });

  function libsReady() { return !!(root.gsap && root.ScrollTrigger && root.Lenis); }
  function onDOMReady(fn) {
    if (document.readyState === "complete" || document.readyState === "interactive") fn();
    else document.addEventListener("DOMContentLoaded", fn, { once: true });
  }
  (function startWhenReady(tries){
    if (libsReady()) { onDOMReady(startCore); return; }
    if (tries > 0) setTimeout(function(){ startWhenReady(tries-1); }, 100);
  })(100);

  function startCore() {
    gsap = root.gsap;
    ScrollTrigger = root.ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);

    // Lenis
    var lenis = new root.Lenis({
      duration: isMobile ? 6 : 4,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
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
      scrollTop: function (value) { return arguments.length ? lenis.scrollTo(value) : lenis.scroll; },
      getBoundingClientRect: function () { return { top: 0, left: 0, width: innerWidth, height: innerHeight }; },
      pinType: document.body.style.transform ? "transform" : "fixed"
    });
    lenis.on && lenis.on("scroll", ScrollTrigger.update);
    ScrollTrigger.addEventListener("refresh", function(){ lenis.resize && lenis.resize(); });
    ScrollTrigger.refresh();

    // ─────────────────────────────────────
    // Parallax & tweens (your originals)
    // ─────────────────────────────────────
    gsap.to(".about_planet", { y: 20*vh, ease:"none",
      scrollTrigger:{ trigger: ".parallax-wrapper", start:"top top", end:"bottom bottom", scrub:true }});
    gsap.to(".spacecats", { x:-3*vw, y:55*vh, rotation:20, scale:1.1, ease:"none",
      scrollTrigger:{ trigger: ".parallax-wrapper", start:"top top", end:"bottom bottom", scrub:true }});
    gsap.to(".about_saturn", { x:-2*vw, y:30*vh, rotation:-25, scale:0.9, ease:"none",
      scrollTrigger:{ trigger: ".parallax-wrapper", start:"top top", end:"bottom bottom", scrub:true }});
    gsap.to(".satellitemove", { x:10*vw, y:50*vh, rotation:15, scale:0.85, ease:"none",
      scrollTrigger:{ trigger: ".parallax-wrapper", start:"top top", end:"bottom bottom", scrub:true }});
    gsap.to(".about_watermoon", { y:35*vh, ease:"none",
      scrollTrigger:{ trigger: ".parallax-wrapper", start:"top top", end:"bottom bottom", scrub:true }});
    gsap.to(".about_section_1", { y:-10*vh, ease:"none",
      scrollTrigger:{ trigger: ".parallax-wrapper", start:"top top", end:"bottom bottom", scrub:true }});
    gsap.to(".about_section_2", { y:-10*vh, ease:"none",
      scrollTrigger:{ trigger: ".about_section_2", start:"top bottom", end:"bottom top", scrub:true }});
    gsap.to(".lakeshrink", { scaleY:0.4, ease:"none",
      scrollTrigger:{ trigger: ".lakeshrink", start:"top bottom", end:"bottom top", scrub:true }});
    gsap.to(".duckswim", { x:-5*vw-80, yPercent:-35, ease:"none",
      scrollTrigger:{ trigger: ".duckswim", start:"top bottom", end:"bottom top", scrub:true }});
    gsap.to(".about_rocket", { x:130*vw, y:-20*vw, ease:"none",
      scrollTrigger:{ trigger: ".parallax-wrapper",
        start:function(){ return innerHeight*0.4+"px top"; },
        end:function(){ return innerHeight*0.7+"px top"; },
        scrub:true, invalidateOnRefresh:true }});
    gsap.to(".about_turtle2", { x:30*vw, y:5*vw, rotation:5, ease:"none",
      scrollTrigger:{ trigger: ".about_turtle2", start:"top bottom", end:"bottom top", scrub:true, invalidateOnRefresh:true }});
    gsap.to(".about_turtle1", { x:28*vw, y:-5*vw, rotation:-5, ease:"none",
      scrollTrigger:{ trigger: ".about_turtle1", start:"top bottom", end:"bottom top", scrub:true, invalidateOnRefresh:true }});
    gsap.to(".about_nessie", { x:7*vw, y:-13*vw, rotation:-30, ease:"none",
      scrollTrigger:{ trigger: ".about_nessie", start:"top bottom", end:"bottom top", scrub:true, invalidateOnRefresh:true }});
    gsap.to(".about_giant_squid", { x:3*vw, y:7*vw, rotation:-5, ease:"none",
      scrollTrigger:{ trigger: ".about_giant_squid", start:"top bottom", end:"bottom top", scrub:true, invalidateOnRefresh:true }});
    gsap.to(".about_flyduck", { x:120*vw, y:-15*vw, ease:"none",
      scrollTrigger:{ trigger: ".about_flyduck", start:"top bottom", end:"bottom 80%", scrub:true, invalidateOnRefresh:true }});
    gsap.to(".about_watermoon", { y:5*vw, ease:"none",
      scrollTrigger:{ trigger: ".about_watermoon", start:"top bottom", end:"bottom top", scrub:true, invalidateOnRefresh:true }});

    // ─────────────────────────────────────
    // Jetplane — dip then climb + banking (unchanged)
    // ─────────────────────────────────────
    (function initJetplane() {
      var jet = document.querySelector(".about_jetplane");
      if (!jet) return;

      ScrollTrigger.create({
        trigger: ".about_jetplane",
        start: "top 50%",
        end: "bottom 30%",
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: function (self) {
          var t = self.progress;
          var x = 145 * vw * t;
          var arc = (isMobile ? 26 : 36) * vh;
          var climbY = -arc * Math.pow(t, 2.2);
          var dipEnd = 0.18;
          var dipAmp = (isMobile ? 6 : 9) * vh;
          var dipY   = t < dipEnd ? dipAmp * Math.sin(Math.PI * (t / dipEnd)) : 0;
          var y = -5 * vw + dipY + climbY;
          var dClimb   = -arc * 2.2 * Math.pow(Math.max(t, 0.0001), 1.2);
          var dDip     = t < dipEnd ? dipAmp * (Math.PI / dipEnd) * Math.cos(Math.PI * (t / dipEnd)) : 0;
          var dydt     = dClimb + dDip;
          var dxdt     = 130 * vw;
          var angleDeg = Math.atan2(dydt, dxdt) * (180 / Math.PI);
          if (t < 0.05) angleDeg *= t / 0.05;
          var targetRot = Math.max(-18, Math.min(angleDeg * 0.9, 0));
          var prevRot   = parseFloat(jet.dataset.prevRot || "0");
          var smooth    = prevRot + (targetRot - prevRot) * 0.15;
          jet.dataset.prevRot = smooth;
          jet.style.transform = "translate(" + x + "px," + y + "px) rotate(" + smooth + "deg)";
        }
      });
    })();

    // ─────────────────────────────────────
    // GALAXY: reparent into .about_underwater and stop all movement
    // ─────────────────────────────────────
    (function mountGalaxyInsideUnderwater() {
      var galaxy = document.querySelector(".about_galaxy");
      var underwater = document.querySelector(".about_underwater");
      if (!galaxy || !underwater) return;

      // If galaxy is already inside, skip
      if (galaxy.parentElement !== underwater) {
        // Move galaxy to be the FIRST child so all other underwater elements draw above it
        underwater.insertBefore(galaxy, underwater.firstChild);
      }

      // Ensure our “mask-by-container” sizing is applied even if external CSS changes
      galaxy.style.position = "absolute";
      galaxy.style.top = "0"; galaxy.style.right = "0"; galaxy.style.bottom = "0"; galaxy.style.left = "0";
      galaxy.style.pointerEvents = "none";
      galaxy.style.zIndex = "0";

      // Remove any previous GSAP ScrollTrigger pinning on galaxy (if it existed)
      if (root.ScrollTrigger) {
        root.ScrollTrigger.getAll().forEach(function(st){
          if (st && st.vars && (st.vars.pin === galaxy || st.vars.trigger === galaxy)) {
            try { st.kill(); } catch(e){}
          }
        });
        // After killing, refresh to clear spacers if any
        root.ScrollTrigger.refresh();
      }
    })();

    // ─────────────────────────────────────
    // Video visibility (unchanged)
    // ─────────────────────────────────────
    (function initVideos() {
      var vids = document.querySelectorAll(".about_onceupon video, video[data-pause-offscreen]");
      if (!vids.length) return;

      vids.forEach(function (v) {
        v.setAttribute("playsinline", "");
        v.setAttribute("muted", "");
      });

      vids.forEach(function (v) {
        ScrollTrigger.create({
          trigger: v,
          start: "top 120%",
          end: "bottom -20%",
          onEnter: function(){ try { v.play && v.play(); } catch(e){} },
          onEnterBack: function(){ try { v.play && v.play(); } catch(e){} }
        });
        ScrollTrigger.create({
          trigger: v,
          start: "bottom top",
          end: "top bottom",
          onLeave: function(){ try { v.pause && v.pause(); } catch(e){} },
          onLeaveBack: function(){ try { v.pause && v.pause(); } catch(e){} }
        });
      });

      document.addEventListener("visibilitychange", function () {
        vids.forEach(function (v) {
          try {
            if (document.hidden) v.pause && v.pause();
            else {
              var r = v.getBoundingClientRect();
              if (r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth) {
                v.play && v.play();
              }
            }
          } catch(e){}
        });
      });
    })();

    // Signal to UFO module
    try { root.dispatchEvent(new CustomEvent("TT:core-ready")); } catch(e){}
  }
})(window);

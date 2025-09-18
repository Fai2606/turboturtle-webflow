/* turboturtle-core.js (only the GALAXY section changed from your current working version) */
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

    // … your Lenis / ScrollTrigger proxy setup …
    // … your original parallax tweens …
    // … your jetplane + videos …
    // (all unchanged – keep exactly what’s working now)

    // ─────────────────────────────────────
    // GALAXY: keep pin/parallax, but enforce clip-path on both the element
    // and its pin-spacer wrapper (Safari/Chrome quirk). Also set -webkit- prop.
    // ─────────────────────────────────────
    (function initGalaxy() {
      var el = document.querySelector(".about_galaxy");
      var underwater = document.querySelector(".about_underwater");
      if (!el || !underwater) return;

      var ratio = isMobile ? 0.003 : 0.006;

      // Utility: apply clip-path to a node (standard + webkit)
      function setClip(node, value) {
        if (!node) return;
        node.style.clipPath = value;
        node.style.webkitClipPath = value;      // Safari/Chrome
        node.style.willChange = "clip-path";    // hint for better stability
      }

      // Compute viewport intersection -> CSS inset()
      function computeInsetFromRect(r) {
        var x1 = Math.max(0, r.left);
        var y1 = Math.max(0, r.top);
        var x2 = Math.min(innerWidth,  r.right);
        var y2 = Math.min(innerHeight, r.bottom);
        if (x2 <= x1 || y2 <= y1) return "inset(100% 0 0 100%)";  // fully hidden
        var top = y1, left = x1, right = innerWidth - x2, bottom = innerHeight - y2;
        return "inset(" + top + "px " + right + "px " + bottom + "px " + left + "px)";
      }

      // We’ll clip both the element AND (if exists) the ST pin-spacer parent.
      var pinSpacer = null;

      // Create ST pin just like you had (no spacing)
      ScrollTrigger.create({
        trigger: ".about_underwater",
        start:   "top bottom",
        end:     "bottom top",
        scrub:   0.4,
        pin:     el,
        pinSpacing: false,
        onRefreshInit: function(self){
          // ST may rebuild wrappers; re-grab pin-spacer each time
          pinSpacer = el.parentNode && el.parentNode.classList && el.parentNode.classList.contains("pin-spacer")
            ? el.parentNode
            : null;
        },
        onUpdate: function (self) {
          var y = (self.scroll() - self.start) * ratio;
          gsap.set(el, { y: y });
          requestClipUpdate();
        }
      });

      ScrollTrigger.addEventListener("refresh", function(){
        gsap.set(el, { y: 0 });
        // pinSpacer might have changed after refresh
        pinSpacer = el.parentNode && el.parentNode.classList && el.parentNode.classList.contains("pin-spacer")
          ? el.parentNode
          : null;
        requestClipUpdate();
      });

      var ticking = false;
      function requestClipUpdate(){
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function(){
          ticking = false;
          var r = underwater.getBoundingClientRect();
          var clip = computeInsetFromRect(r);
          setClip(el, clip);
          if (pinSpacer) setClip(pinSpacer, clip);
        });
      }

      var lenis = root.lenis;
      if (lenis && lenis.on) lenis.on("scroll", requestClipUpdate);
      root.addEventListener("resize", requestClipUpdate);

      // Initial sync (after current call stack to ensure pin is applied)
      setTimeout(requestClipUpdate, 0);
    })();

    // Signal
    try { root.dispatchEvent(new CustomEvent("TT:core-ready")); } catch(e){}
  }
})(window);

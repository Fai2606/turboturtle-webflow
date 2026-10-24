<!-- TURBO TURTLE — FIXED LOGO INNER IMAGE HANDOFF -->
<!-- Replace the entire Webflow Before </body> code with this file. -->
<!-- Core JS pinned at 202c52d. -->

<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/MorphSVGPlugin.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/SplitText.min.js"></script>
<script src="https://unpkg.com/lenis@1.3.11/dist/lenis.min.js"></script>
 
<script>
  var commitSHA = "e66d731";
  var coreScript = document.createElement("script");
  coreScript.src = "https://cdn.jsdelivr.net/gh/Fai2606/turboturtle-webflow@" +
    commitSHA + "/turboturtle-core.js";
  document.body.appendChild(coreScript);
</script>

<!-- Hide the ball during loading; let it emerge under the moving preloader edge. -->
<style>
  html.tt-loading:not(.tt-revealing) .circle_text_base { opacity: 0 !important; }
</style>

<script>
(function () {
  "use strict";
  var MINIMUM_TIME = 1200;
  var FAKE_COUNT_TIME = 1200;
  var SLIDE_DURATION = 1.75; // preloader and site wrapper reveal duration
  var KV_DURATION = 2.40; // KV slow-in and blur-in duration
  var SLIDE_EASE = "power3.inOut";
  var NAV_START = SLIDE_DURATION + 0.30; // DIAGNOSTIC: begin after wrapper cleanup
  var NAV_DURATION = 0.85; // slide in from above with ease-out
  var html = document.documentElement;
  var loader = document.querySelector(".tt_preloader");
  var site = document.querySelector(".site_wrapper");
  var percentageEl = document.querySelector(".preloader_text");
  var startTime = window.ttPreloaderStart || performance.now();
  var fakeFrame = null;
  var fakeDone = false;
  var finished = false;
  var revealing = false;
  var complete = false;
  // Hold initial scrolling until 0.5s after the wrapper reveal finishes.
  // Prevent early wheel/touch events from fighting the preloader transforms.
  var INITIAL_SCROLL_HOLD_MS = 500;
  var scrollUnlocked = false;
  var originalRestoration = null;

  function blockInitialWheel(e) {
    if (scrollUnlocked || !e.cancelable) return;
    e.preventDefault();
    e.stopImmediatePropagation();
  }
  function blockInitialTouch(e) {
    if (scrollUnlocked || !e.cancelable || (e.touches && e.touches.length > 1)) return;
    e.preventDefault();
    e.stopImmediatePropagation();
  }
  function blockInitialKeys(e) {
    if (scrollUnlocked || e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey) return;
    var target = e.target;
    if (target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))) return;
    if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " ", "Spacebar"].indexOf(e.key) !== -1) {
      e.preventDefault();
    }
  }
  // Capture before Lenis receives input; do not alter html/body overflow,
  // because that can shift fixed elements and trigger a layout jump.
  window.addEventListener("wheel", blockInitialWheel, { capture: true, passive: false });
  window.addEventListener("touchmove", blockInitialTouch, { capture: true, passive: false });
  window.addEventListener("keydown", blockInitialKeys, true);

  function releaseInitialScroll() {
    if (scrollUnlocked) return;
    scrollUnlocked = true;
    window.removeEventListener("wheel", blockInitialWheel, true);
    window.removeEventListener("touchmove", blockInitialTouch, true);
    window.removeEventListener("keydown", blockInitialKeys, true);
    updateNoOffense();
  }

  if ("scrollRestoration" in history) {
    originalRestoration = history.scrollRestoration;
    history.scrollRestoration = "manual";
  }
  window.scrollTo(0, 0);

  function updateFakePercentage() {
    if (fakeDone) return;
    var elapsed = Math.max(0, performance.now() - startTime);
    var percent = Math.min(99, Math.max(1,
      Math.floor(1 + (elapsed / FAKE_COUNT_TIME) * 98)));
    if (percentageEl) percentageEl.textContent = "DROPPING " + percent + "%";
    fakeFrame = requestAnimationFrame(updateFakePercentage);
  }
  if (percentageEl) {
    percentageEl.textContent = "DROPPING 1%";
    fakeFrame = requestAnimationFrame(updateFakePercentage);
  }
  function finishFakePercentage() {
    fakeDone = true;
    if (fakeFrame !== null) cancelAnimationFrame(fakeFrame);
    fakeFrame = null;
    if (percentageEl) percentageEl.textContent = "DROPPING 100%";
  }

  if (loader) {
    html.classList.add("tt-loading");
    loader.style.display = "flex";
    loader.style.visibility = "visible";
    loader.style.opacity = "1";
    loader.style.pointerEvents = "auto";
    loader.style.position = "fixed";
    loader.style.inset = "0";
    loader.style.transform = "translate3d(0,0,0)";
  }

  // KV DEPTH REVEAL — stage only after GSAP is confirmed ready.
  // Keep the original Webflow wrapper and the core JS untouched.
  var KV_DEPTH = 100; // visible depth difference during the reveal
  var KV_BLUR = 10; // blur radius in pixels at reveal start

  function updateNoOffense() {
    var w = document.documentElement.clientWidth;
    var h = document.documentElement.clientHeight;
    var landscape = w > h && h <= 500;
    html.classList.toggle("tt-no-offense", landscape);
    if (window.lenis) {
      if (landscape || !complete || !scrollUnlocked) {
        if (window.lenis.stop) window.lenis.stop();
      } else if (window.lenis.start) {
        window.lenis.start();
      }
    }
  }
  updateNoOffense();
  window.addEventListener("resize", updateNoOffense);
  window.addEventListener("orientationchange", function () {
    setTimeout(updateNoOffense, 100);
  });

  function completePreloader() {
    if (complete) return;
    complete = true;
    if (loader) {
      loader.style.setProperty("display", "none", "important");
      loader.style.setProperty("visibility", "hidden", "important");
      loader.style.pointerEvents = "none";
      loader.style.transform = "";
    }
    if (site && window.gsap) {
      // CRITICAL: .fixed_logo is position:fixed inside .site_wrapper.
      // Even translate3d(0,0,0) makes fixed descendants relative to the
      // wrapper instead of the viewport on mobile. End at y=0 and REMOVE
      // the transform so the logo stays fixed when the user scrolls.
      window.gsap.set(site, { x: 0, y: 0 });
      // The fixed container changes containing block when the wrapper transform
      // disappears. Keep the container clean and preserve the actual image center.
      var fixedLogo = site.querySelector(".fixed_logo");
      var logoImage = fixedLogo && fixedLogo.querySelector(".logo_img");
      var imageBefore = logoImage ? logoImage.getBoundingClientRect() : null;
      window.gsap.set(site, { clearProps: "transform,willChange" });
      if (logoImage && imageBefore) {
        var imageAfter = logoImage.getBoundingClientRect();
        var beforeCenterX = imageBefore.left + imageBefore.width / 2;
        var beforeCenterY = imageBefore.top + imageBefore.height / 2;
        var afterCenterX = imageAfter.left + imageAfter.width / 2;
        var afterCenterY = imageAfter.top + imageAfter.height / 2;
        var correctionX = beforeCenterX - afterCenterX;
        var correctionY = beforeCenterY - afterCenterY;
        // Apply only to the inner image, NOT .fixed_logo, whose width must
        // continue to follow the viewport and whose fixed positioning stays native.
        if (Math.abs(correctionX) > 0.01 || Math.abs(correctionY) > 0.01) {
          var imageX = Number(window.gsap.getProperty(logoImage, "x")) || 0;
          var imageY = Number(window.gsap.getProperty(logoImage, "y")) || 0;
          window.gsap.set(logoImage, {
            x: imageX + correctionX,
            y: imageY + correctionY,
            force3D: false
          });
        }
      }
    }
    html.classList.remove("tt-loading", "tt-revealing");
    html.style.overflow = "";
    document.body.style.overflow = "";
    document.body.style.touchAction = "";
    if (originalRestoration !== null) {
      history.scrollRestoration = originalRestoration;
    }
    updateNoOffense();
    // One brief post-reveal hold: scroll unlocks as the moon begins bouncing.
    window.setTimeout(releaseInitialScroll, INITIAL_SCROLL_HOLD_MS);
    // Do not refresh ScrollTrigger while the yellow ball and KV are still
    // animating: a synchronous refresh here can stall BOTH on the same frame.
    // Navbar ends at 2.90s, KV at 2.40s; reveal ends at 1.75s.
    window.setTimeout(function () {
      if (document.documentElement.classList.contains("tt-page-exiting")) return;
      if (window.lenis && window.lenis.resize) window.lenis.resize();
      if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    }, 1450);
  }

  function startReveal() {
    if (revealing || complete) return;
    revealing = true;
    finishFakePercentage();
    html.classList.add("tt-revealing");
    updateNoOffense();
    window.scrollTo(0, 0);
    document.querySelectorAll("body > *:not(.tt_preloader)").forEach(function (el) {
      el.style.visibility = "visible";
    });
    if (!loader || !site || !window.gsap ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      completePreloader();
      return;
    }

    var gsap = window.gsap;
    var h = document.documentElement.clientHeight;
    gsap.set(site, { clearProps: "transform" });
    var naturalTop = site.getBoundingClientRect().top;
    var progress = { offset: 0 };
    var setLoaderY = gsap.quickSetter(loader, "y", "px");
    var setSiteY = gsap.quickSetter(site, "y", "px");
    var startingSiteY = h - naturalTop;
    setLoaderY(0);
    setSiteY(startingSiteY);

    var yellowBall = document.querySelector(".circle_text_base");
    if (yellowBall) {
      gsap.killTweensOf(yellowBall);
      var ballRect = yellowBall.getBoundingClientRect();
      var fromRight = Math.max(0, document.documentElement.clientWidth - ballRect.left + ballRect.width + 40);
      gsap.set(yellowBall, { x: fromRight, rotation: 500, opacity: 0, transformOrigin: "50% 50%" });
      gsap.to(yellowBall, {
        x: 0, rotation: 0, opacity: 1,
        delay: Math.max(0, SLIDE_DURATION - 0.70),
        duration: 1.05,
        ease: "power3.out",
        overwrite: "auto",
        onComplete: function () {
          // Mobile: preserve the final compositor transform instead of
          // removing it at the exact frame the rolling animation stops.
          if (window.matchMedia("(max-width: 767px)").matches) {
            gsap.set(yellowBall, {
              x: 0, rotation: 0, opacity: 1,
              transformOrigin: "50% 50%", force3D: true
            });
          } else {
            gsap.set(yellowBall, { clearProps: "x,rotation,opacity,transformOrigin" });
          }
        }
      });
    }

    // KV starts exactly when the wrapper starts, but runs 30% longer.
    // Its depth, blur and opacity are controlled by ONE shared KV progress.
    var kvSlowWrapper = document.querySelector(".kv_slowin");
    var setKvY = null;
    var setKvBlur = null;
    var setKvOpacity = null;
    var kvNaturalY = 0;
    var kvMobileBlurFix = window.matchMedia("(max-width: 767px)").matches;
    if (kvSlowWrapper) {
      gsap.killTweensOf(kvSlowWrapper);
      kvNaturalY = Number(gsap.getProperty(kvSlowWrapper, "y")) || 0;
      setKvY = gsap.quickSetter(kvSlowWrapper, "y", "px");
      setKvBlur = gsap.quickSetter(kvSlowWrapper, "filter");
      setKvOpacity = gsap.quickSetter(kvSlowWrapper, "opacity");
      setKvY(kvNaturalY + KV_DEPTH);
      setKvBlur("blur(" + KV_BLUR + "px)");
      setKvOpacity(0);
    } else {
      console.warn("[TT KV] .kv_slowin not found in published page");
    }

    // DIAGNOSTIC: Navbar starts 0.30s AFTER wrapper reveal finishes.
    // Isolates navbar transform from the moving site_wrapper transform.
    var navbar = document.querySelector(".navbar_custom");
    var navNaturalY = 0;
    if (navbar) {
      gsap.killTweensOf(navbar);
      navNaturalY = Number(gsap.getProperty(navbar, "y")) || 0;
      if (window.matchMedia("(max-width: 767px)").matches) {
        navNaturalY = Math.round(navNaturalY * window.devicePixelRatio) / window.devicePixelRatio;
      }
      // Stage navbar before the timeline begins, keeping opacity constant.
      // This avoids starting a transform + opacity compositing transition together.
      gsap.set(navbar, {
        y: navNaturalY - Math.max(80, navbar.getBoundingClientRect().height + 35),
        opacity: 1,
        force3D: true
      });
    }

    // A single timeline ensures the reveal, KV and navbar share the same start clock.
    var revealTimeline = gsap.timeline();
    revealTimeline.to(progress, {
      offset: -h,
      duration: SLIDE_DURATION,
      ease: SLIDE_EASE,
      onUpdate: function () {
        setLoaderY(progress.offset);
        // Animate from offscreen to exact zero, not to -naturalTop.
        // This prevents a final snap when mobile cleanup sets y back to 0.
        var revealFraction = Math.max(0, Math.min(1, -progress.offset / h));
        setSiteY(startingSiteY * (1 - revealFraction));
      },
      onComplete: function () {
        setLoaderY(-h);
        setSiteY(0);
        completePreloader();
      }
    }, 0);

    if (navbar) {
      revealTimeline.to(navbar, {
        y: navNaturalY,
        duration: NAV_DURATION,
        ease: "power3.out",
        force3D: true,
        overwrite: "auto",
        onComplete: function () {
          // Preserve the composited transform at the end on mobile.
          // Do not clearProps transform or opacity here.
          gsap.set(navbar, { y: navNaturalY, opacity: 1, force3D: true });
        }
      }, NAV_START);
    }

    if (setKvY) {
      var kvProgress = { value: 0 };
      revealTimeline.to(kvProgress, {
        value: 1,
        duration: KV_DURATION,
        ease: SLIDE_EASE,
        onUpdate: function () {
          var moved = Math.max(0, Math.min(1, kvProgress.value));
          setKvY(kvNaturalY + KV_DEPTH * (1 - moved * moved));
          // Mobile: complete blur removal before the animation ends.
          // Keep an explicit blur(0px) to avoid a final-frame filter layer switch.
          var blurAmount = KV_BLUR * (1 - moved);
          if (kvMobileBlurFix) {
            var blurT = Math.min(1, moved / 0.78);
            blurAmount = KV_BLUR * Math.pow(1 - blurT, 2);
            if (blurAmount < 0.03) blurAmount = 0;
          }
          setKvBlur("blur(" + blurAmount + "px)");
          setKvOpacity(moved);
        },
        onComplete: function () {
          setKvY(kvNaturalY);
          setKvBlur("blur(0px)");
          setKvOpacity(1);
          if (kvMobileBlurFix) {
            // Keep mobile's final transform/filter/opacity explicitly set.
            // Clearing transform can switch text rasterization/compositing
            // on the final frame, creating a tiny visual jump.
            gsap.set(kvSlowWrapper, {
              y: kvNaturalY,
              filter: "blur(0px)",
              opacity: 1
            });
          } else {
            gsap.set(kvSlowWrapper, { clearProps: "filter,opacity" });
            if (kvNaturalY === 0) gsap.set(kvSlowWrapper, { clearProps: "transform" });
          }
        }
      }, 0);
    }

  }

  function finishPreloader() {
    if (finished) return;
    finished = true;
    var remaining = Math.max(0, MINIMUM_TIME - (performance.now() - startTime));
    window.setTimeout(function () {
      requestAnimationFrame(function () {
        requestAnimationFrame(startReveal);
      });
    }, remaining);
  }

  // Keep the existing window-load/GSAP timing, but do not reveal the site
  // until the randomly chosen preloader image is ready (or its 5s fallback).
  function finishAfterImageReady() {
    var imageReady = window.ttLoaderImageReady || Promise.resolve();
    Promise.resolve(imageReady).then(finishPreloader, finishPreloader);
  }
  if (document.readyState === "complete") finishAfterImageReady();
  else window.addEventListener("load", finishAfterImageReady, { once: true });
})();
</script>

<!-- NAVBAR LOGO -->
<script>
(function () {
  function updateNavbarLogo() {
    document.documentElement.classList.toggle("navbar-scrolled", window.scrollY > 5);
  }
  window.addEventListener("scroll", updateNavbarLogo, { passive: true });
  updateNavbarLogo();
})();
</script>


<!-- TURBO TURTLE — INTERNAL PAGE EXIT / FADE TO WHITE -->
<script>
(function () {
  "use strict";
  var EXIT_MS = 500;
  var exiting = false;
  var overlay = document.createElement("div");
  overlay.id = "tt-page-exit";
  overlay.setAttribute("aria-hidden", "true");
  document.body.appendChild(overlay);

  function resetExit() {
    exiting = false;
    document.documentElement.classList.remove("tt-page-exiting");
  }
  // Restore the page if it is brought back from the browser's back-forward cache.
  window.addEventListener("pageshow", resetExit);

  document.addEventListener("click", function (event) {
    if (event.defaultPrevented || exiting || event.button !== 0 ||
        event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    var link = event.target.closest && event.target.closest("a[href]");
    if (!link || link.hasAttribute("download") ||
        (link.target && link.target.toLowerCase() !== "_self") ||
        link.hasAttribute("data-no-page-transition")) return;

    var dest;
    try { dest = new URL(link.href, window.location.href); }
    catch (e) { return; }
    if ((dest.protocol !== "http:" && dest.protocol !== "https:") ||
        dest.origin !== window.location.origin) return;

    // Let in-page hash navigation happen normally.
    if (dest.pathname === window.location.pathname &&
        dest.search === window.location.search &&
        (dest.hash || dest.href === window.location.href)) return;

    event.preventDefault();
    exiting = true;
    document.documentElement.classList.add("tt-page-exiting");
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(function () {
      window.location.assign(dest.href);
    }, reduced ? 20 : EXIT_MS);
  });
})();
</script>

<!-- TURBO TURTLE — iOS CHROME ONE-TIME VIEWPORT REFRESH EXPERIMENT -->
<!-- Isolated test: no scroll compensation, no element positioning changes. -->
<script>
(function () {
  "use strict";
  var ua = navigator.userAgent || "";
  if (!/CriOS/.test(ua) || !/iPhone|iPad|iPod/.test(ua)) return;

  var ran = false;
  function refreshOnce() {
    if (ran || document.hidden) return;
    if (document.documentElement.classList.contains("tt-loading") ||
        document.documentElement.classList.contains("tt-revealing")) return;
    ran = true;

    // Force a contained, temporary layout invalidation, not a viewport offset.
    // This is an experiment; it cannot invoke Chrome's native tab reinitialization.
    var probe = document.createElement("div");
    probe.setAttribute("aria-hidden", "true");
    probe.style.cssText = "position:absolute;left:0;top:0;width:1px;height:1px;" +
      "visibility:hidden;pointer-events:none;contain:layout style paint;";
    document.body.appendChild(probe);
    void probe.offsetHeight;
    probe.style.width = "2px";
    void probe.offsetHeight;
    probe.remove();

    // Request one ordinary resize pass after the preloader/nav entrance.
    // No ScrollTrigger refresh: it can disturb active scroll animations.
    window.dispatchEvent(new Event("resize"));
    if (window.lenis && typeof window.lenis.resize === "function") {
      window.lenis.resize();
    }
    window.ttChromeViewportRefreshResult = {
      attempted: true,
      at: Math.round(performance.now()),
      innerHeight: window.innerHeight,
      visualHeight: window.visualViewport ? window.visualViewport.height : null
    };
  }

  function waitUntilReady() {
    if (ran) return;
    if (document.documentElement.classList.contains("tt-loading") ||
        document.documentElement.classList.contains("tt-revealing")) {
      setTimeout(waitUntilReady, 150);
      return;
    }
    // Original reveal lasts 1.75s; navbar finishes ~2.90s from reveal start.
    // Wait an additional 1.3s after the preloader class clears.
    setTimeout(function () {
      requestAnimationFrame(function () {
        requestAnimationFrame(refreshOnce);
      });
    }, 1300);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", waitUntilReady, { once: true });
  } else {
    waitUntilReady();
  }
})();
</script>

<!-- GLOBAL SHADER — LAST BODY CHILD FOR SAME-Z STACK ORDER -->
<script>
(function () {
  "use strict";
  function placeShaderLast() {
    var shader = document.querySelector(".shader");
    if (!shader || !document.body) return;
    if (shader.parentElement !== document.body ||
        shader !== document.body.lastElementChild) {
      document.body.appendChild(shader);
    }
  }
  // This footer runs after Webflow's body markup and the page-exit overlay.
  placeShaderLast();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", placeShaderLast, { once: true });
  }
})();
</script>

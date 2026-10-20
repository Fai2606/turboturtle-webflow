<!-- TURBO TURTLE: COMPLETE WEBFLOW BEFORE </body> CUSTOM CODE -->
<!-- HEAD CODE: NO CHANGES REQUIRED -->
<!-- TRANSITION: only preloader slides UP; site_wrapper stays stationary underneath. -->

    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>

    <script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/MorphSVGPlugin.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/SplitText.min.js"></script>

    <script src="https://unpkg.com/lenis@1.3.11/dist/lenis.min.js"></script>


    <script>
      var commitSHA = "202c52d";

      var coreScript = document.createElement("script");

      coreScript.src =
        "https://cdn.jsdelivr.net/gh/Fai2606/turboturtle-webflow@" +
        commitSHA +
        "/turboturtle-core.js";

      document.body.appendChild(coreScript);
    </script>



<script>
(function () {
  var MINIMUM_TIME = 1000;
  var FAKE_COUNT_TIME = 1000;
  var LOADER_SLIDE_DURATION = 1.1; // seconds

  var html = document.documentElement;
  var startTime = window.ttPreloaderStart || performance.now();
  var loader = document.querySelector(".tt_preloader");
  var percentageEl = document.querySelector(".preloader_text");
  var finished = false;
  var fakeCountFinished = false;
  var fakeCountFrame = null;

  function updateFakePercentage() {
    if (fakeCountFinished) return;
    var elapsed = Math.max(0, performance.now() - startTime);
    var percent = Math.min(99, Math.max(1,
      Math.floor(1 + (elapsed / FAKE_COUNT_TIME) * 98)));
    if (percentageEl) percentageEl.textContent = "LOADING " + percent + "%";
    fakeCountFrame = requestAnimationFrame(updateFakePercentage);
  }

  if (percentageEl) {
    percentageEl.textContent = "LOADING 1%";
    fakeCountFrame = requestAnimationFrame(updateFakePercentage);
  }

  function finishFakePercentage() {
    fakeCountFinished = true;
    if (fakeCountFrame !== null) {
      cancelAnimationFrame(fakeCountFrame);
      fakeCountFrame = null;
    }
    if (percentageEl) percentageEl.textContent = "LOADING 100%";
  }

  if (loader) {
    html.classList.add("tt-loading");
    loader.style.display = "flex";
    loader.style.visibility = "visible";
    loader.style.opacity = "1";
    loader.style.pointerEvents = "auto";
    loader.style.position = "fixed";
    loader.style.inset = "0";
    loader.style.zIndex = "2147483647";
  }

  function updateNoOffense() {
    var width = document.documentElement.clientWidth;
    var height = document.documentElement.clientHeight;
    var phoneLandscape = width > height && height <= 500;
    html.classList.toggle("tt-no-offense", phoneLandscape);
    if (window.lenis) {
      if (phoneLandscape || html.classList.contains("tt-loading") ||
          html.classList.contains("tt-revealing")) {
        if (window.lenis.stop) window.lenis.stop();
      } else {
        if (window.lenis.start) window.lenis.start();
      }
    }
  }

  updateNoOffense();
  window.addEventListener("resize", updateNoOffense);
  window.addEventListener("orientationchange", function () {
    setTimeout(updateNoOffense, 100);
  });

  function completePreloader() {
    if (loader) {
      // Stop Webflow/CSS from displaying the loader again.
      loader.style.display = "none";
      loader.style.visibility = "hidden";
      loader.style.opacity = "";
      loader.style.transform = "";
      loader.style.pointerEvents = "none";
    }

    html.classList.remove("tt-loading", "tt-revealing");
    html.style.overflow = "";
    document.body.style.overflow = "";
    document.body.style.touchAction = "";
    updateNoOffense();

    if (window.lenis) {
      if (window.lenis.resize) window.lenis.resize();
      if (!html.classList.contains("tt-no-offense") && window.lenis.start) {
        window.lenis.start();
      }
    }
    if (window.ScrollTrigger) window.ScrollTrigger.refresh();
  }

  function startReveal() {
    finishFakePercentage();

    // Keep the page in its natural position throughout the transition.
    // Neither .site_wrapper nor .circle_text_base is transformed.
    document.querySelectorAll("body > *:not(.tt_preloader)").forEach(function (el) {
      el.style.visibility = "visible";
    });

    html.classList.add("tt-revealing");
    updateNoOffense();

    if (!loader || !window.gsap ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      completePreloader();
      return;
    }

    // Keep tt-loading in place during the slide: its HEAD CSS guarantees
    // that the loader stays visible above the stationary website.
    window.gsap.fromTo(loader,
      { yPercent: 0 },
      {
        yPercent: -100,
        duration: LOADER_SLIDE_DURATION,
        ease: "power3.inOut",
        overwrite: "auto",
        onComplete: completePreloader
      }
    );
  }

  function finishPreloader() {
    if (finished) return;
    finished = true;
    var elapsed = performance.now() - startTime;
    var remaining = Math.max(0, MINIMUM_TIME - elapsed);
    window.setTimeout(startReveal, remaining);
  }

  if (document.readyState === "complete") {
    finishPreloader();
  } else {
    window.addEventListener("load", finishPreloader, { once: true });
  }
})();
</script>


    <!-- ============================================================
     NAVBAR LOGO
============================================================ -->

    <script>
      (function() {

        function updateNavbarLogo() {

          document.documentElement.classList.toggle(
            "navbar-scrolled",
            window.scrollY > 5
          );

        }

        window.addEventListener(
          "scroll",
          updateNavbarLogo, {
            passive: true
          }
        );

        updateNavbarLogo();

      })();
    </script>

/* Opt-in homepage diagnostic. Never changes the normal site or stored assets. */
(function () {
  'use strict';
  if (new URLSearchParams(location.search).get('tt-mobile-test') !== '1' ||
      location.pathname !== '/' || window.ttMobileComparison) return;

  function init() {
    var stopped = false, busy = false, ready = false, mode = 'original';
    var entries = [], objectURLs = [], cache = new Map();
    var abort = new AbortController();
    var panel = document.createElement('section');
    panel.id = 'tt-mobile-comparison';
    panel.setAttribute('aria-label', 'Mobile scrolling comparison');
    panel.style.cssText = 'position:fixed!important;left:8px!important;bottom:8px!important;' +
      'z-index:2147483647!important;background:#fff!important;color:#111!important;' +
      'border:1px solid #111!important;border-radius:8px!important;padding:10px!important;' +
      'font:12px/1.4 system-ui,sans-serif!important;width:260px!important;' +
      'max-width:calc(100vw - 36px)!important;box-shadow:0 2px 12px #0002!important;';
    var title = document.createElement('strong');
    title.textContent = 'Scrolling comparison';
    var status = document.createElement('p');
    status.style.cssText = 'font:12px/1.4 system-ui,sans-serif;margin:6px 0;';
    status.setAttribute('role', 'status');
    status.textContent = 'Scroll through once, then prepare the comparison.';
    var buttons = document.createElement('div');
    buttons.style.cssText = 'display:flex;gap:6px;flex-wrap:wrap;';
    function button(text) {
      var b = document.createElement('button');
      b.type = 'button'; b.textContent = text;
      b.style.cssText = 'font:12px system-ui,sans-serif!important;padding:7px 9px!important;' +
        'border:1px solid #111!important;border-radius:4px!important;color:#111!important;' +
        'background:#fff!important;cursor:pointer!important;';
      buttons.appendChild(b); return b;
    }
    var prepareButton = button('Prepare comparison');
    var originalButton = button('Original');
    var lighterButton = button('Lighter images');
    var closeButton = button('End test');
    originalButton.disabled = lighterButton.disabled = true;
    panel.append(title, status, buttons); document.body.appendChild(panel);

    function setAttributeOrRemove(el, key, value) {
      if (value === null) el.removeAttribute(key); else el.setAttribute(key, value);
    }
    function restore(entry) {
      setAttributeOrRemove(entry.img, 'srcset', entry.srcset);
      setAttributeOrRemove(entry.img, 'src', entry.src);
      entry.img.style.aspectRatio = entry.aspectRatio;
    }
    function isStaticWebP(buffer) {
      var bytes = new Uint8Array(buffer), view = new DataView(buffer);
      function tag(i) { return String.fromCharCode.apply(null, bytes.subarray(i, i + 4)); }
      if (bytes.length < 20 || tag(0) !== 'RIFF' || tag(8) !== 'WEBP') return false;
      for (var i = 12; i + 8 <= bytes.length;) {
        var chunk = tag(i), size = view.getUint32(i + 4, true);
        if (i + 8 + size > bytes.length) return false;
        if (chunk === 'ANIM' || chunk === 'ANMF') return false;
        if (chunk === 'VP8X' && size >= 1 && (bytes[i + 8] & 2)) return false;
        i += 8 + size + (size & 1);
      }
      return true;
    }
    async function makeCopy(url) {
      var response = await fetch(url, { mode: 'cors', credentials: 'omit', signal: abort.signal });
      if (!response.ok) throw Error('Image unavailable');
      var buffer = await response.arrayBuffer();
      if (!isStaticWebP(buffer)) return null; // Verify bytes; never flatten animations.
      var bitmap = await createImageBitmap(new Blob([buffer], { type: 'image/webp' }));
      try {
        if (bitmap.width * bitmap.height <= 60000) return null;
        var w = Math.max(1, Math.round(bitmap.width / 2));
        var h = Math.max(1, Math.round(bitmap.height / 2));
        var canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(bitmap, 0, 0, w, h);
        var blob = await new Promise(function (resolve, reject) {
          canvas.toBlob(function (result) { result ? resolve(result) : reject(Error('Encoding unavailable')); }, 'image/webp', 1);
        });
        if (stopped) return null;
        var objectURL = URL.createObjectURL(blob); objectURLs.push(objectURL);
        return { url: objectURL, width: bitmap.width, height: bitmap.height };
      } finally { bitmap.close(); }
    }
    async function prepare() {
      if (stopped || busy || ready) return;
      if (typeof createImageBitmap !== 'function') {
        status.textContent = 'This browser cannot prepare the test. Please use Chrome.'; return;
      }
      busy = true; prepareButton.disabled = true;
      var candidates = Array.from(document.images).filter(function (img) {
        if (!img.classList.contains('img_100x100') || !img.closest('[class*="home_section"]')) return false;
        try {
          var url = new URL(img.currentSrc || img.src);
          return url.hostname === 'cdn.prod.website-files.com' && /\.webp$/i.test(url.pathname);
        } catch (_) { return false; }
      });
      var index = 0, completed = 0, failed = 0;
      async function worker() {
        while (!stopped && index < candidates.length) {
          var img = candidates[index++], url = img.currentSrc || img.src;
          try {
            if (!cache.has(url)) cache.set(url, makeCopy(url));
            var copy = await cache.get(url);
            if (copy && !stopped) entries.push({ img: img, copy: copy,
              src: img.getAttribute('src'), srcset: img.getAttribute('srcset'),
              aspectRatio: img.style.aspectRatio,
              ratio: img.naturalWidth && img.naturalHeight
                ? img.naturalWidth + ' / ' + img.naturalHeight
                : copy.width + ' / ' + copy.height });
          } catch (_) { if (!stopped) failed++; }
          completed++;
          if (!stopped) status.textContent = 'Preparing ' + completed + ' / ' + candidates.length + '. Please wait.';
          await new Promise(function (resolve) { setTimeout(resolve, 0); });
        }
      }
      await Promise.all([worker(), worker()]);
      busy = false;
      if (stopped) return;
      ready = entries.length > 0;
      originalButton.disabled = lighterButton.disabled = !ready;
      prepareButton.hidden = ready;
      status.textContent = ready ? 'Ready. Original selected. Compare scrolling and image detail.'
        : 'No images could be prepared. Original images are unchanged.';
      if (failed) status.textContent += ' ' + failed + ' unavailable images kept original.';
      originalButton.setAttribute('aria-pressed', 'true');
      lighterButton.setAttribute('aria-pressed', 'false');
      if (!ready) prepareButton.disabled = false;
    }
    async function setMode(next) {
      if (stopped || busy || !ready || (next !== 'original' && next !== 'lighter')) return;
      busy = true;
      originalButton.disabled = lighterButton.disabled = true;
      status.textContent = 'Switching images. Please wait.';
      entries.forEach(function (entry) {
        if (next === 'lighter') {
          entry.img.style.aspectRatio = entry.ratio;
          entry.img.removeAttribute('srcset'); entry.img.src = entry.copy.url;
        } else restore(entry);
      });
      var decoding = Promise.all(entries.map(function (entry) {
        return typeof entry.img.decode === 'function' ? entry.img.decode().catch(function () {}) : Promise.resolve();
      }));
      await Promise.race([decoding, new Promise(function (resolve) { setTimeout(resolve, 2500); })]);
      if (stopped) return;
      mode = next; busy = false;
      document.documentElement.setAttribute('data-tt-mobile-comparison', mode);
      originalButton.disabled = lighterButton.disabled = false;
      originalButton.setAttribute('aria-pressed', String(mode === 'original'));
      lighterButton.setAttribute('aria-pressed', String(mode === 'lighter'));
      originalButton.style.background = mode === 'original' ? '#e4f643' : '#fff';
      lighterButton.style.background = mode === 'lighter' ? '#e4f643' : '#fff';
      status.textContent = (mode === 'original' ? 'Original images.' : 'Lighter images; some fine detail may be softer.') +
        ' Scroll through once, then compare.';
    }
    function dispose() {
      if (stopped) return;
      stopped = true; abort.abort(); entries.forEach(restore);
      objectURLs.forEach(function (url) { URL.revokeObjectURL(url); });
      panel.remove(); document.documentElement.removeAttribute('data-tt-mobile-comparison');
      var url = new URL(location.href); url.searchParams.delete('tt-mobile-test');
      history.replaceState(history.state, '', url.pathname + url.search + url.hash);
      delete window.ttMobileComparison;
    }
    prepareButton.addEventListener('click', prepare);
    originalButton.addEventListener('click', function () { setMode('original'); });
    lighterButton.addEventListener('click', function () { setMode('lighter'); });
    closeButton.addEventListener('click', dispose);
    window.ttMobileComparison = { prepare: prepare, setMode: setMode, dispose: dispose,
      get state() { return { ready: ready, busy: busy, mode: mode, count: entries.length }; } };
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();

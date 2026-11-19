/* TT_ANDROID_IMAGE_DELIVERY_20261119 — original Designer sources retained. */
(function () {
  "use strict";
  var production = true;
  var params = new URLSearchParams(window.location.search);
  if (params.get("tt-android-images") === "off" || params.get("tt-mobile-test") === "1") return;
  var preview = params.get("tt-android-images") === "test";
  if ((!production && !preview) || !/Android/i.test(navigator.userAgent)) return;
  var media = window.matchMedia("(min-width: 320px) and (max-width: 479px) and (min-resolution: 2.5dppx)");
  var prefix = "https://cdn.prod.website-files.com/68bdbd1783cadc0f01060f9d/";
  var files = {"6a8db85e2d3a7cf97069b06d":"6afec6de0fd331ec4ded77c6_tt-mobile-6a8db85e2d3a7cf97069b06d-200w.webp","6a8db85e4c52226c5ac56233":"6afec6ded7006f0bbf4b51c6_tt-mobile-6a8db85e4c52226c5ac56233-336w.webp","6a8db85e9067f1cf995507b3":"6afec6dfb5f808f01fcd3475_tt-mobile-6a8db85e9067f1cf995507b3-160w.webp","6a8db85e9788bb8f7c181b0a":"6afec6e0440fe1429d72ab76_tt-mobile-6a8db85e9788bb8f7c181b0a-56w.webp","6a8db85ed1893a0fa645abe5":"6afec6e0f79e463e1d350a1d_tt-mobile-6a8db85ed1893a0fa645abe5-256w.webp","6a8db85ed706c2004fa0c0f7":"6afec6e0d9af2b0e23382b9f_tt-mobile-6a8db85ed706c2004fa0c0f7-136w.webp","6a8db85f3c35da2ebf4b3d13":"6afec6e0bc75861ea63f7a27_tt-mobile-6a8db85f3c35da2ebf4b3d13-168w.webp","6a8db85f3c35da2ebf4b3d19":"6a8db85f3c35da2ebf4b3d19_Egypt%20Dog%20God-p-500.webp","6a8db85f55874f47fd94f0ee":"6afec6e1440fe1429d72ac34_tt-mobile-6a8db85f55874f47fd94f0ee-192w.webp","6a8db85f69eb6d5e94aa2847":"6afec6e1c7eb888eb946c634_tt-mobile-6a8db85f69eb6d5e94aa2847-592w.webp","6a8db85f88906dd7f71c6897":"6a8db85f88906dd7f71c6897_Egypt%20God-p-500.webp","6a8db85fe7b7eee42a0567e4":"6a8db85fe7b7eee42a0567e4_building-2-p-500.webp","6a8db85ff270e35ae95380d4":"6a8db85ff270e35ae95380d4_building%202-p-500.webp","6a8db862c2f201be319a4af0":"6afec6e1b5f808f01fcd3559_tt-mobile-6a8db862c2f201be319a4af0-160w.webp","6aa4cc905b2d3f7f3c738b44":"6afec6e2b0391c2ce8fda0c6_tt-mobile-6aa4cc905b2d3f7f3c738b44-296w.webp","6aa4cc9067c9f6de9832aed4":"6afec6e270e0c125f56506a5_tt-mobile-6aa4cc9067c9f6de9832aed4-224w.webp","6aa4cc9074020678a588ae07":"6aa4cc9074020678a588ae07_home2-spacecat-p-500.webp","6aa4cc909365cab3f8103c3f":"6aa4cc909365cab3f8103c3f_home2-Triangle-p-500.webp","6aa4cc91ed5eeea13b1bef34":"6afec6e3093bc6ee8e8bce9e_tt-mobile-6aa4cc91ed5eeea13b1bef34-640w.webp","6aa9235d304f72edf39ab732":"6afec6e3440fe1429d72ac6f_tt-mobile-6aa9235d304f72edf39ab732-152w.webp","6aa9235e25483970bb44e3fd":"6afec6e3093bc6ee8e8bcf3b_tt-mobile-6aa9235e25483970bb44e3fd-432w.webp","6aa9235e5755fa1089786e7a":"6afec6e38b0a78d1d09b32d9_tt-mobile-6aa9235e5755fa1089786e7a-160w.webp","6aa9235e5f4c0af2b1da2762":"6afec6e46534b8680851752e_tt-mobile-6aa9235e5f4c0af2b1da2762-152w.webp","6aa9235e7bff8b1eb71a9136":"6aa9235e7bff8b1eb71a9136_home3-Dolphin-p-500.webp","6aa978f33d2a8405e21711eb":"6afec6e4e653209363e90e1f_tt-mobile-6aa978f33d2a8405e21711eb-632w.webp","6aa978f3f0e0cc954673ea48":"6afec6e4f568692e756a2bda_tt-mobile-6aa978f3f0e0cc954673ea48-16w.webp","6aa9b5dc06c1d471cef9da61":"6afec6e5c5b11499ee83ba31_tt-mobile-6aa9b5dc06c1d471cef9da61-112w.webp","6aa9b5dc07077162f472c596":"6afec6fd76e152d4f096bffc_tt-mobile-6aa9b5dc07077162f472c596-104w.webp","6aa9b5dc34814b05f599420f":"6afec6fe6534b86808517d52_tt-mobile-6aa9b5dc34814b05f599420f-184w.webp","6aa9b5dc8b5b49f76480c562":"6afec6fe4f0c6da2137dddf4_tt-mobile-6aa9b5dc8b5b49f76480c562-32w.webp","6aa9b5dc9f4c2bac6217ba74":"6afec6fe1c78ce8feb592f93_tt-mobile-6aa9b5dc9f4c2bac6217ba74-72w.webp","6aa9b5dd556c69081cfbe6c5":"6aa9b5dd556c69081cfbe6c5_home5-jupiter-p-500.webp","6aa9b5dd556c69081cfbe6c8":"6aa9b5dd556c69081cfbe6c8_home5-satellite-p-500.webp","6aaa50f122ca8de561fdc5e1":"6afec6ff701907c146fa2e9f_tt-mobile-6aaa50f122ca8de561fdc5e1-280w.webp","6aaa50f12a3a2eeaf4333482":"6afec6ff642eba9d0364bb96_tt-mobile-6aaa50f12a3a2eeaf4333482-200w.webp","6aaa50f12b0210db69325667":"6afec7003630b8346445e2b8_tt-mobile-6aaa50f12b0210db69325667-176w.webp","6aaa50f12b0210db693256dd":"6afec70276e152d4f096c1ec_tt-mobile-6aaa50f12b0210db693256dd-96w.webp","6aaa50f1e1da0245f6100bfb":"6afec702fb0d26735ed42229_tt-mobile-6aaa50f1e1da0245f6100bfb-432w.webp","6aaa50f1feb255745f4dee7e":"6afec703701907c146fa2fce_tt-mobile-6aaa50f1feb255745f4dee7e-96w.webp","6aaa50f2f73d6cb8dd6dc87a":"6afec703cf6a28c0795c9320_tt-mobile-6aaa50f2f73d6cb8dd6dc87a-72w.webp","6aaa50f360f89a9ca5ff8182":"6afec70370e0c125f5650d83_tt-mobile-6aaa50f360f89a9ca5ff8182-200w.webp","6aaa50f42b0210db69325f56":"6afec703642eba9d0364bdb5_tt-mobile-6aaa50f42b0210db69325f56-200w.webp","6aaac40faed586032a1918dc":"6afec70476e152d4f096c229_tt-mobile-6aaac40faed586032a1918dc-328w.webp","6aaac75d45b7b730d6343417":"6afec70476e152d4f096c279_tt-mobile-6aaac75d45b7b730d6343417-160w.webp","6aae4d31efd182c8cdb9188b":"6afec7057e778c8f99fce257_tt-mobile-6aae4d31efd182c8cdb9188b-96w.webp","6ab108946bdfe2bdfc1d6429":"6afec7054f0c6da2137ddff5_tt-mobile-6ab108946bdfe2bdfc1d6429-40w.webp","6ab108948b78e7524ad162c9":"6afec7050667c960e35a4415_tt-mobile-6ab108948b78e7524ad162c9-312w.webp","6ab10894e85326a22d124b70":"6afec705701907c146fa305c_tt-mobile-6ab10894e85326a22d124b70-160w.webp","6ab10894f25fa32ad3072e4f":"6afec706701907c146fa3078_tt-mobile-6ab10894f25fa32ad3072e4f-200w.webp","6ab10894f344a15a2b01f9ca":"6ab10894f344a15a2b01f9ca_Tree-p-500.webp","6abbbc7a2791fb35d4959d4a":"6afec709d9af2b0e2338396c_tt-mobile-6abbbc7a2791fb35d4959d4a-272w.webp","6abd130d3a5a8dfb35aa1580":"6afec7094f0c6da2137de143_tt-mobile-6abd130d3a5a8dfb35aa1580-248w.webp","6abd1d6d6c5f30351c5d8082":"6afec70a3630b8346445e6d7_tt-mobile-6abd1d6d6c5f30351c5d8082-152w.webp","6ac2b62fcb6c196f53c51030":"6ac2b62fcb6c196f53c51030_Fish%20hero%204-p-500.webp","6ac3bfd912b9f8c364939d28":"6afec70ac5b11499ee83c9ac_tt-mobile-6ac3bfd912b9f8c364939d28-320w.webp","6ac5adcbcd7347671d5c504a":"6ac5adcbcd7347671d5c504a_home6-Sphere-p-500.webp","6ac5d0084aa5883319bf13fc":"6afec70a56e0c3c88716d1b4_tt-mobile-6ac5d0084aa5883319bf13fc-160w.webp","6ac61b0ac0bfaa92484a138e":"6afec70ba366bf116368f940_tt-mobile-6ac61b0ac0bfaa92484a138e-96w.webp","6ac66c044a3a9fe0428d5b1e":"6afec70bc78b2b8ce651867f_tt-mobile-6ac66c044a3a9fe0428d5b1e-592w.webp","6ac66f7a6e3c53a2c6d7ea82":"6afec70bd9af2b0e23383a94_tt-mobile-6ac66f7a6e3c53a2c6d7ea82-512w.webp","6ac66fe272000dcedc79769b":"6afec70c679b3e9b996c6b82_tt-mobile-6ac66fe272000dcedc79769b-280w.webp","6ac7076edf5c35271ee177d5":"6afec70cd9af2b0e23383ada_tt-mobile-6ac7076edf5c35271ee177d5-40w.webp","6ac76e33c1f7305782b4119d":"6afec70c443d5ed785caaceb_tt-mobile-6ac76e33c1f7305782b4119d-584w.webp","6ac76e8775f59687c09749ee":"6afec70c56e0c3c88716d231_tt-mobile-6ac76e8775f59687c09749ee-264w.webp","6ac76e90c1f7305782b44ac6":"6afec70dd9af2b0e23383b45_tt-mobile-6ac76e90c1f7305782b44ac6-584w.webp","6ac7daea40df6cb2ebb0e803":"6afec70dcf6a28c0795c96b2_tt-mobile-6ac7daea40df6cb2ebb0e803-264w.webp","6ac7db12f8cd9cf07198a1d7":"6afec70dd8218c0f710bca3a_tt-mobile-6ac7db12f8cd9cf07198a1d7-16w.webp","6ac7db9ff8cd9cf07198f521":"6afec70df568692e756a3093_tt-mobile-6ac7db9ff8cd9cf07198f521-120w.webp","6ac87923e5e5a1b977d6286d":"6afec70e679b3e9b996c6c15_tt-mobile-6ac87923e5e5a1b977d6286d-280w.webp","6ac87a735c7cb0f9ed7bb8ea":"6afec70ebc4d6ba700f2cc0e_tt-mobile-6ac87a735c7cb0f9ed7bb8ea-40w.webp","6ac8ff363273d8c5ce506175":"6ac8ff363273d8c5ce506175_home5-planet5-p-500.webp","6ac8ff364f5d430a03f879c8":"6ac8ff364f5d430a03f879c8_home5-planet4-p-500.webp","6ac8ff36b594bb71ba64b93e":"6ac8ff36b594bb71ba64b93e_home5-planet1-p-500.webp","6ac8ff36bae50a0c3bbb4ee7":"6ac8ff36bae50a0c3bbb4ee7_home5-planet2-p-500.webp","6ac8ff36f3f44766e36a3497":"6ac8ff36f3f44766e36a3497_home5-planet3-p-500.webp","6acbb8a6da442e046e230d8f":"6afec70e0bc1afa3bfecf526_tt-mobile-6acbb8a6da442e046e230d8f-120w.webp","6ad1f8fe59d17ee0dba7a2ec":"6afec710e653209363e920bf_tt-mobile-6ad1f8fe59d17ee0dba7a2ec-392w.webp","6ad1f8feec332e936c9257e7":"6afec8021a0b7e4c07b2eb53_tt-mobile-6ad1f8feec332e936c9257e7-112w.webp","6ad20f84f86725674eb5563d":"6afec802642eba9d03653893_tt-mobile-6ad20f84f86725674eb5563d-160w.webp","6ad20f8508de9ccb3a28ea27":"6afec803cf6a28c0795ccc90_tt-mobile-6ad20f8508de9ccb3a28ea27-200w.webp","6ad21fcd651fae0b74e9b3fa":"6afec803c78b2b8ce651d1d7_tt-mobile-6ad21fcd651fae0b74e9b3fa-176w.webp","6ad22449a0ec85b68fdd941f":"6afec804fb0c3818041b3ea6_tt-mobile-6ad22449a0ec85b68fdd941f-608w.webp","6ad2257ed89877e86ad70618":"6afec8048c7995c9d64168bf_tt-mobile-6ad2257ed89877e86ad70618-208w.webp","6ad226a8b523248b54d8bf7c":"6afec8051a0b7e4c07b2ec1c_tt-mobile-6ad226a8b523248b54d8bf7c-128w.webp","6ad226a9b523248b54d8bf82":"6afec8053630b83464464841_tt-mobile-6ad226a9b523248b54d8bf82-112w.webp","6ad22727a0ec85b68fdfa64f":"6afec80570e0c125f5654e8a_tt-mobile-6ad22727a0ec85b68fdfa64f-160w.webp","6ad22c0436b083b864cb17ab":"6afec806cf6a28c0795ccda4_tt-mobile-6ad22c0436b083b864cb17ab-48w.webp","6ad2350921db29f3ea3b4988":"6afec8068c7995c9d6416966_tt-mobile-6ad2350921db29f3ea3b4988-128w.webp","6ad235093df50bba4571352e":"6afec806fb0c3818041b3f5e_tt-mobile-6ad235093df50bba4571352e-136w.webp","6ad23509dacde0d3b78cf187":"6afec806bc75861ea63fb980_tt-mobile-6ad23509dacde0d3b78cf187-608w.webp","6ad23d408099ef1a6505a2a1":"6afec807443d5ed785caf981_tt-mobile-6ad23d408099ef1a6505a2a1-136w.webp","6ad2f2d9bae5cb565b669430":"6ad2f2d9bae5cb565b669430_home6-monsterlight2-p-500.webp","6ad3ab898e2f9c9e731d60f9":"6afec807d7006f0bbf4b72c3_tt-mobile-6ad3ab898e2f9c9e731d60f9-184w.webp","6ad3aedeec3b0daebff005b0":"6afec8088b0a78d1d09b92a6_tt-mobile-6ad3aedeec3b0daebff005b0-184w.webp","6ad3b5ef2924c50952915f0b":"6ad3b5ef2924c50952915f0b_Dinosaur_trim-p-500.webp","6ad5ca60421632ee085ce58a":"6afec8083630b834644648d6_tt-mobile-6ad5ca60421632ee085ce58a-632w.webp","6ad66b5ef836f2bb30eabf08":"6afec808b5f808f01fcd87d5_tt-mobile-6ad66b5ef836f2bb30eabf08-632w.webp","6ad6d0013bd4b353a2f2ad5b":"6afec809642eba9d0365398f_tt-mobile-6ad6d0013bd4b353a2f2ad5b-512w.webp","6ae387b303bc1f4446fd3952":"6afec809a366bf1163694f66_tt-mobile-6ae387b303bc1f4446fd3952-184w.webp","6ae387b3dbd9381f548674da":"6afec812c5b11499ee841d99_tt-mobile-6ae387b3dbd9381f548674da-96w.webp","6ae3aa6a3b28231faa4b2510":"6afec812bc75861ea63fbc5d_tt-mobile-6ae3aa6a3b28231faa4b2510-232w.webp","6ae447c4fcf6b9e32bb7f607":"6afec812c5b11499ee841e1a_tt-mobile-6ae447c4fcf6b9e32bb7f607-32w.webp","6ae62f90c68664c0232285f5":"6ae62f90c68664c0232285f5_home2_float_building-p-500.webp","6ae6ea8efce9fb7f348476df":"6afec8133630b83464464beb_tt-mobile-6ae6ea8efce9fb7f348476df-64w.webp","6ae6eff41fa9082820ef484d":"6afec8131c78ce8feb59825d_tt-mobile-6ae6eff41fa9082820ef484d-520w.webp","6afc8f53af0db6c9f4ca2232":"6afc8f53af0db6c9f4ca2232_about-zebrafish-p-500.webp","6afc8f545912d01a81490a16":"6afc8f545912d01a81490a16_about-spacejet-p-500.webp","6afc8f54e5d0ef22c2060e82":"6afc8f54e5d0ef22c2060e82_about-watermoon-p-500.webp","6afc8f5570c2b472795f23aa":"6afec8130859c47d7376c5c0_tt-mobile-6afc8f5570c2b472795f23aa-80w.webp","6afc8f55c38c398a3a0048c9":"6afec8146534b8680851b960_tt-mobile-6afc8f55c38c398a3a0048c9-128w.webp","6afc8f55ffed63c95423b6c4":"6afec81479a1a96b37d45de1_tt-mobile-6afc8f55ffed63c95423b6c4-80w.webp","6afc8f56c194dda4999c4ded":"6afc8f56c194dda4999c4ded_about-dolphin-p-500.webp","6afc8f7a267c3cedd519943b":"6afec8140fd331ec4dedb49f_tt-mobile-6afc8f7a267c3cedd519943b-672w.webp","6afc8f7cf9be1ab18575e66f":"6afec814d9af2b0e23388e7b_tt-mobile-6afc8f7cf9be1ab18575e66f-320w.webp","6afc8f7d10614bf0dd890c85":"6afec8153630b83464464c65_tt-mobile-6afc8f7d10614bf0dd890c85-112w.webp","6afc8f7d2398806e8074ecbc":"6afec815c78b2b8ce651d2e7_tt-mobile-6afc8f7d2398806e8074ecbc-184w.webp","6afc8f7de5d0ef22c2061f8a":"6afec815e653209363e964a1_tt-mobile-6afc8f7de5d0ef22c2061f8a-296w.webp","6afc8f7e75bca6c74bbc09a4":"6afec81776e152d4f09726dc_tt-mobile-6afc8f7e75bca6c74bbc09a4-632w.webp","6afc8f7f16d1cf23d511a3ea":"6afec8170667c960e35a8982_tt-mobile-6afc8f7f16d1cf23d511a3ea-576w.webp","6afc8f7f267c3cedd519959b":"6afec818b5f808f01fcd8cac_tt-mobile-6afc8f7f267c3cedd519959b-64w.webp","6afc8f7f5c8b652bf82d4b52":"6afec8180667c960e35a89c0_tt-mobile-6afc8f7f5c8b652bf82d4b52-200w.webp","6afc8fafdc1ccf18926ef7c5":"6afec818c7eb888eb9471501_tt-mobile-6afc8fafdc1ccf18926ef7c5-128w.webp","6afc8fb0bdcfb8525802efb8":"6afec819d9af2b0e23389026_tt-mobile-6afc8fb0bdcfb8525802efb8-784w.webp","6afc8fb1af0db6c9f4ca4999":"6afc8fb1af0db6c9f4ca4999_home3-Fish3-p-500.webp","6afc8fb22398806e8074ff5c":"6afc8fb22398806e8074ff5c_home6-monsterlight2-p-500.webp","6afc8fb28000b0ccfd36408c":"6afec819d9af2b0e23389055_tt-mobile-6afc8fb28000b0ccfd36408c-224w.webp","6afc8fb38000b0ccfd364139":"6afec822cf6a28c0795cd6bb_tt-mobile-6afc8fb38000b0ccfd364139-24w.webp","6afc8fb3b0b9087f70e424ed":"6afec822f79e463e1d35544e_tt-mobile-6afc8fb3b0b9087f70e424ed-640w.webp"};
  var states = new Map();
  function setAttribute(image, name, value) {
    if (value === null) image.removeAttribute(name);
    else image.setAttribute(name, value);
  }
  function restore(state) {
    if (!state.active) return;
    state.active = false;
    setAttribute(state.image, "src", state.src);
    setAttribute(state.image, "srcset", state.srcset);
    setAttribute(state.image, "decoding", state.decoding);
  }
  function inCity(image) {
    var node = image.parentElement;
    while (node && node !== document.body) {
      if (node.hasAttribute("data-tt-home6-ufo-afterimages")) return false;
      if (typeof node.className === "string" && /(?:^| )[^ ]+_city(?: |$)/.test(node.className)) return true;
      node = node.parentElement;
    }
    return false;
  }
  function apply(image) {
    var state = states.get(image);
    if (!state) {
      var src = image.getAttribute("src");
      if (!src || src.indexOf(prefix) !== 0 || !inCity(image)) return;
      var id = src.slice(prefix.length).match(/^([a-f\d]{24})_/);
      if (!id || !files[id[1]]) return;
      state = { image: image, src: src, srcset: image.getAttribute("srcset"), decoding: image.getAttribute("decoding"), mobile: prefix + files[id[1]], active: false, failed: false };
      states.set(image, state);
      image.addEventListener("error", function () {
        if (state.active) { state.failed = true; restore(state); }
      });
    }
    if (!media.matches || state.failed) { restore(state); return; }
    if (state.active) return;
    state.active = true;
    image.setAttribute("decoding", "async");
    image.setAttribute("src", state.mobile);
    image.removeAttribute("srcset");
  }
  function scan(root) {
    if (root.nodeType !== 1 && root.nodeType !== 9) return;
    if (root.tagName === "IMG") apply(root);
    root.querySelectorAll("img").forEach(apply);
  }
  function sync() {
    states.forEach(function (state, image) {
      if (!image.isConnected) states.delete(image);
      else apply(image);
    });
    scan(document);
  }
  var observer = new MutationObserver(function (records) {
    records.forEach(function (record) { record.addedNodes.forEach(scan); });
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
  scan(document);
  function parsed() { observer.disconnect(); scan(document); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", parsed, { once: true });
  else parsed();
  if (media.addEventListener) media.addEventListener("change", sync);
  else media.addListener(sync);
  window.addEventListener("pageshow", sync);
  window.ttAndroidImages = {
    version: "2026-11-19",
    status: function () {
      var active = 0, failed = 0;
      states.forEach(function (state) { if (state.active) active++; if (state.failed) failed++; });
      return { eligible: states.size, active: active, failed: failed, matches: media.matches };
    }
  };
})();

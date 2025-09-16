console.info('[turboturtle] file fetched & executing – v3');

/* turboturtle.js — waits for libs, then boots once */

(function(){
  // guard but DON'T mark booted until success
  if (window.__TT_BOOTING__) return;
  window.__TT_BOOTING__ = true;

  function whenReady(callback){
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
    } else callback();
  }

  // Poll for libs to exist (Lenis, gsap, ScrollTrigger)
  function waitForLibs(maxWaitMs = 8000, intervalMs = 50){
    const start = performance.now();
    return new Promise((resolve, reject) => {
      (function tick(){
        const ok = !!(window.Lenis && window.gsap && window.ScrollTrigger);
        if (ok) return resolve();
        if (performance.now() - start > maxWaitMs) return reject(new Error("libs not loaded"));
        setTimeout(tick, intervalMs);
      })();
    });
  }

  async function boot(){
    await waitForLibs().catch(() => {});
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    const Lenis = window.Lenis;

    if (!gsap || !ScrollTrigger || !Lenis) {
      console.warn("[turboturtle] Required libs missing; aborting init.");
      window.__TT_BOOTING__ = false;
      return;
    }

    if (window.__TT_BOOTED__) return; // final double-guard
    window.__TT_BOOTED__ = true;
    window.__TT_BOOTING__ = false;

    gsap.registerPlugin(ScrollTrigger);

    // Perf nudges
    try {
      const videoWrapper = document.querySelector(".about_onceupon");
      if (videoWrapper){
        videoWrapper.style.willChange = "transform, opacity";
        videoWrapper.style.transform = "translateZ(0)";
      }
      gsap.set(".about_underwater", { willChange:"transform", transform:"translateZ(0)" });
    } catch(e){}

    // Units + device
    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    let vw = innerWidth/100, vh = innerHeight/100;
    addEventListener("resize", () => { vw = innerWidth/100; vh = innerHeight/100; });

    // Lenis
    const lenis = new Lenis({
      duration: isMobile ? 6 : 4,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10*t)),
      smooth: true,
      direction: "vertical",
      gestureDirection: "vertical",
      mouseMultiplier: 1,
      touchMultiplier: isMobile ? 0.2 : 2,
      infinite: false
    });
    function raf(time){ try{ lenis.raf(time); }catch(e){} requestAnimationFrame(raf); }
    requestAnimationFrame(raf);

    // Bridge Lenis <-> ScrollTrigger
    if (typeof lenis.on === "function") lenis.on("scroll", ScrollTrigger.update);
    ScrollTrigger.scrollerProxy(window, {
      scrollTop(value){
        if (arguments.length) {
          try { return lenis.scrollTo(value); } catch(e){ scrollTo(0, value); }
        }
        return (typeof lenis.scroll === "number") ? lenis.scroll : (scrollY||pageYOffset||0);
      },
      getBoundingClientRect(){ return { top:0, left:0, width:innerWidth, height:innerHeight }; },
      pinType: document.body && document.body.style && document.body.style.transform ? "transform" : "fixed"
    });
    ScrollTrigger.addEventListener("refresh", ()=>{ try{ lenis.resize(); }catch(e){} });
    ScrollTrigger.refresh();

    /* ========= Videos: play slightly before entering, pause when fully out ========= */
    (function setupVideos(){
      const vids = document.querySelectorAll(".about_onceupon video, video[data-pause-offscreen]");
      if (!vids.length) return;
      vids.forEach(v => { v.setAttribute("playsinline",""); v.setAttribute("muted",""); });
      vids.forEach(v => {
        ScrollTrigger.create({
          trigger: v, start:"top 120%", end:"bottom -20%",
          onEnter: ()=>{ try{ v.play(); }catch(e){} },
          onEnterBack: ()=>{ try{ v.play(); }catch(e){} }
        });
        ScrollTrigger.create({
          trigger: v, start:"bottom top", end:"top bottom",
          onLeave: ()=>{ try{ v.pause(); }catch(e){} },
          onLeaveBack: ()=>{ try{ v.pause(); }catch(e){} }
        });
      });
      document.addEventListener("visibilitychange", ()=>{
        vids.forEach(v=>{
          try{
            if (document.hidden) v.pause();
            else {
              const r=v.getBoundingClientRect();
              const visible = r.bottom>0 && r.top<innerHeight && r.right>0 && r.left<innerWidth;
              if (visible) v.play().catch(()=>{});
            }
          }catch(e){}
        });
      });
    })();

    /* ========= Parallax tweens ========= */
    gsap.to(".about_planet",{y:20*vh,ease:"none",scrollTrigger:{trigger:".parallax-wrapper",start:"top top",end:"bottom bottom",scrub:true}});
    gsap.to(".spacecats",{x:-3*vw,y:55*vh,rotation:20,scale:1.1,ease:"none",scrollTrigger:{trigger:".parallax-wrapper",start:"top top",end:"bottom bottom",scrub:true}});
    gsap.to(".about_saturn",{x:-2*vw,y:30*vh,rotation:-25,scale:0.9,ease:"none",scrollTrigger:{trigger:".parallax-wrapper",start:"top top",end:"bottom bottom",scrub:true}});
    gsap.to(".satellitemove",{x:10*vw,y:50*vh,rotation:15,scale:0.85,ease:"none",scrollTrigger:{trigger:".parallax-wrapper",start:"top top",end:"bottom bottom",scrub:true}});
    gsap.to(".about_watermoon",{y:35*vh,ease:"none",scrollTrigger:{trigger:".parallax-wrapper",start:"top top",end:"bottom bottom",scrub:true}});
    gsap.to(".about_section_1",{y:-10*vh,ease:"none",scrollTrigger:{trigger:".parallax-wrapper",start:"top top",end:"bottom bottom",scrub:true}});
    gsap.to(".about_section_2",{y:-10*vh,ease:"none",scrollTrigger:{trigger:".about_section_2",start:"top bottom",end:"bottom top",scrub:true}});
    gsap.to(".lakeshrink",{scaleY:0.4,ease:"none",scrollTrigger:{trigger:".lakeshrink",start:"top bottom",end:"bottom top",scrub:true}});
    gsap.to(".duckswim",{x:-5*vw-80,yPercent:-35,ease:"none",scrollTrigger:{trigger:".duckswim",start:"top bottom",end:"bottom top",scrub:true}});
    gsap.to(".about_rocket",{x:130*vw,y:-20*vw,ease:"none",scrollTrigger:{trigger:".parallax-wrapper",start:()=>`${innerHeight*0.4}px top`,end:()=>`${innerHeight*0.7}px top`,scrub:true,invalidateOnRefresh:true}});
    gsap.to(".about_turtle2",{x:30*vw,y:5*vw,rotation:5,ease:"none",scrollTrigger:{trigger:".about_turtle2",start:"top bottom",end:"bottom top",scrub:true,invalidateOnRefresh:true}});
    gsap.to(".about_turtle1",{x:28*vw,y:-5*vw,rotation:-5,ease:"none",scrollTrigger:{trigger:".about_turtle1",start:"top bottom",end:"bottom top",scrub:true,invalidateOnRefresh:true}});
    gsap.to(".about_nessie",{x:7*vw,y:-13*vw,rotation:-30,ease:"none",scrollTrigger:{trigger:".about_nessie",start:"top bottom",end:"bottom top",scrub:true,invalidateOnRefresh:true}});
    gsap.to(".about_giant_squid",{x:3*vw,y:7*vw,rotation:-5,ease:"none",scrollTrigger:{trigger:".about_giant_squid",start:"top bottom",end:"bottom top",scrub:true,invalidateOnRefresh:true}});
    gsap.to(".about_flyduck",{x:120*vw,y:-15*vw,ease:"none",scrollTrigger:{trigger:".about_flyduck",start:"top bottom",end:"bottom 80%",scrub:true,invalidateOnRefresh:true}});

    /* ========= Galaxy ultra-slow drift ========= */
    (function galaxySlow(){
      const el = document.querySelector(".about_galaxy");
      if (!el) return;
      const keepRatio = isMobile ? 0.002 : 0.005; // tiny movement
      gsap.set(el,{ y:0, force3D:true });
      ScrollTrigger.create({
        trigger: ".about_underwater",
        start: "top bottom",
        end:   "bottom top",
        scrub: 0.35,
        invalidateOnRefresh: true,
        onUpdate(self){
          const delta = self.scroll() - self.start; // px inside section
          const y = delta * keepRatio;
          gsap.set(el, { y });
        },
        onRefreshInit(){ gsap.set(el, { y:0 }); }
      });
    })();

    /* ========= Jetplane path (dip then uproar, smoothed banking) ========= */
    (function jetplane(){
      const jet = document.querySelector(".about_jetplane");
      if (!jet) return;
      ScrollTrigger.create({
        trigger: ".about_jetplane",
        start: "top 50%",
        end:   "bottom 30%",
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate(self){
          const t = self.progress;
          const x = 145*vw*t;

          const arc = (isMobile?26:36)*vh;
          const climbY = -arc*Math.pow(t,2.2);

          const dipEnd=0.18, dipAmp=(isMobile?6:9)*vh;
          const dipY = t<dipEnd ? dipAmp*Math.sin(Math.PI*(t/dipEnd)) : 0;

          const y = -5*vw + dipY + climbY;

          const dClimb = -arc*2.2*Math.pow(Math.max(t,0.0001),1.2);
          const dDip   = t<dipEnd ? dipAmp*(Math.PI/dipEnd)*Math.cos(Math.PI*(t/dipEnd)) : 0;
          const dydt   = dClimb + dDip;
          const dxdt   = 130*vw;
          let angleDeg = Math.atan2(dydt, dxdt) * (180/Math.PI);
          if (t < 0.05) angleDeg *= t/0.05;
          const targetRot = Math.max(-18, Math.min(angleDeg*0.9, 0));
          const prevRot = parseFloat(jet.dataset.prevRot || "0");
          const smoothed = prevRot + (targetRot - prevRot) * 0.15;
          jet.dataset.prevRot = smoothed;

          jet.style.transform = `translate(${x}px, ${y}px) rotate(${smoothed}deg)`;
        }
      });
    })();

    /* ========= Woman UFO chase + Akira trail ========= */
    (function ufo(){
      const ufoEl = document.querySelector(".about_womanufo");
      const host  = document.querySelector(".fixed_screen_area") || document.body;
      if (!ufoEl) return;

      const velocity   = isMobile ? 1 : 3;
      const maxAmpVal  = isMobile ? 20*vh : 60*vh;
      const tiltDiv    = isMobile ? 3 : 1;
      const chaseSpeed = isMobile ? 0.08 : 0.15;

      function getBaseY(){ return (isMobile ? -10 : -20) * vh; }
      const target = { x:0, y:getBaseY(), rot:0 };
      const actual = { x:0, y:getBaseY(), rot:0 };

      ufoEl.style.setProperty("--ufo-x",  `${actual.x}px`);
      ufoEl.style.setProperty("--ufo-y",  `${actual.y}px`);
      ufoEl.style.setProperty("--ufo-rot",`${actual.rot}deg`);

      ScrollTrigger.create({
        trigger: ".parallax-wrapper",
        start: "top top",
        end:   isMobile ? `${innerHeight*0.25}px top` : `${innerHeight*0.5}px top`,
        scrub: true,
        onUpdate(self){ target.x = 130*vw*self.progress; }
      });

      let lastScroll = (typeof lenis.scroll === "number") ? lenis.scroll : (scrollY||0);
      let bouncePhase = 0, idleFrames = 0;

      function updateBounceTilt(){
        const currentScroll = (typeof lenis.scroll === "number") ? lenis.scroll : (scrollY||0);
        const deltaY = currentScroll - lastScroll;
        lastScroll = currentScroll;

        const amplitude   = Math.min(Math.abs(deltaY)*velocity, maxAmpVal);
        const horizontal  = target.x / vw;
        const bounceScale = horizontal <= 30 ? 0 : (horizontal >= 100 ? 1 : (horizontal - 30) / 70);

        if (Math.abs(deltaY) < 1) {
          idleFrames++;
          if (idleFrames > 30) gsap.to(target,{ y:getBaseY(), duration:0.4, ease:"power3.out" });
        } else {
          idleFrames = 0;
          bouncePhase += 0.1;
          target.y = getBaseY() + Math.sin(bouncePhase)*amplitude*bounceScale;
        }

        target.rot = Math.max(-20, Math.min(deltaY/tiltDiv, 20)) * bounceScale;
        requestAnimationFrame(updateBounceTilt);
      }
      requestAnimationFrame(updateBounceTilt);

      // Trail
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      Object.assign(canvas.style,{position:"fixed",top:0,left:0,pointerEvents:"none",zIndex:10,background:"transparent"});
      canvas.id = "akiraMouseTrail";
      host.appendChild(canvas);
      function resizeCanvas(){ canvas.width = innerWidth; canvas.height = innerHeight; }
      resizeCanvas(); addEventListener("resize", resizeCanvas);

      let trail = []; const TRAIL_MAX=40, FADE_MS=800;

      function render(){
        actual.x   += (target.x   - actual.x)   * chaseSpeed;
        actual.y   += (target.y   - actual.y)   * chaseSpeed;
        actual.rot += (target.rot - actual.rot) * chaseSpeed;

        ufoEl.style.setProperty("--ufo-x",  `${actual.x}px`);
        ufoEl.style.setProperty("--ufo-y",  `${actual.y}px`);
        ufoEl.style.setProperty("--ufo-rot",`${actual.rot}deg`);

        const r = ufoEl.getBoundingClientRect();
        trail.push({ x:r.left + r.width/2, y:r.top + r.height/2, t:performance.now() });
        if (trail.length > TRAIL_MAX) trail.shift();

        ctx.clearRect(0,0,canvas.width,canvas.height);
        const maxW = r.height*0.4;
        for (let i=0;i<trail.length-1;i++){
          const p1=trail[i], p2=trail[i+1];
          const dx=p2.x-p1.x, dy=p2.y-p1.y;
          if (dx*dx+dy*dy<1) continue;
          const age = performance.now()-p1.t;
          const alpha = 1 - age/FADE_MS;
          if (alpha<=0) continue;
          const lineW = 10 + (maxW-10)*alpha;
          ctx.strokeStyle = `rgba(225,255,0,${alpha})`;
          ctx.lineWidth = lineW;
          ctx.beginPath();
          ctx.moveTo(p1.x,p1.y);
          ctx.quadraticCurveTo(p1.x+dx*0.5,p1.y+dy*0.5,p2.x,p2.y);
          ctx.stroke();
        }
        requestAnimationFrame(render);
      }
      requestAnimationFrame(render);
    })();
  }

  // expose manual boot if needed
  window.turboturtleBoot = function(){
    if (!window.__TT_BOOTED__) boot();
  };

  whenReady(boot);
})();


// --- mark boot success ---
window.__TT_BOOTED__ = true;
console.info('[turboturtle] Boot complete ✅');


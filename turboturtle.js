console.log("[turboturtle] v14 – starting…");

const libs = {
  hasGSAP: !!window.gsap,
  hasLenis: !!window.Lenis,
  hasST: !!window.ScrollTrigger
};
console.log("[turboturtle] libs:", libs);

if (!libs.hasGSAP || !libs.hasST) {
  throw new Error("ScrollTrigger missing on page");
}


/* turboturtle.js — diagnostic build v14 */
(function () {
  console.info("[turboturtle] v14 — starting…");
  // Default to false; only flip to true at the very end if all good.
  window.__TT_BOOTED__ = false;

  try {
    // ---- sanity checks (these are the #1 cause of 'not booted')
    const hasGSAP = !!window.gsap;
    const hasST   = !!window.ScrollTrigger;
    const hasLenis= !!window.Lenis;
    console.info("[turboturtle] libs:", { hasGSAP, hasST, hasLenis });

    if (!hasGSAP)  throw new Error("GSAP missing on page");
    if (!hasST)    throw new Error("ScrollTrigger missing on page");
    if (!hasLenis) throw new Error("Lenis missing on page");

    gsap.registerPlugin(ScrollTrigger);

    // ------------------------------------------------------------------
    // 0) Small pre-style
    // ------------------------------------------------------------------
    (function prep(){
      try {
        const videoWrapper = document.querySelector(".about_onceupon");
        if (videoWrapper) {
          videoWrapper.style.willChange = "transform, opacity";
          videoWrapper.style.transform = "translateZ(0)";
        }
        gsap.set(".about_underwater", { willChange: "transform", transform: "translateZ(0)" });
      } catch(e){ console.warn("[turboturtle] prep warn:", e); }
    })();

    // ------------------------------------------------------------------
    // 1) Globals
    // ------------------------------------------------------------------
    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    let vw = innerWidth / 100, vh = innerHeight / 100;
    addEventListener("resize", () => { vw = innerWidth / 100; vh = innerHeight / 100; });

    // ------------------------------------------------------------------
    // 2) Lenis + ScrollTrigger wiring
    // ------------------------------------------------------------------
    console.info("[turboturtle] init Lenis");
    const lenis = new Lenis({
      duration: isMobile ? 6 : 4,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      direction: "vertical",
      gestureDirection: "vertical",
      mouseMultiplier: 1,
      touchMultiplier: isMobile ? 0.2 : 2,
      infinite: false
    });

    function raf(time){ lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);

    console.info("[turboturtle] wire ScrollTrigger scrollerProxy");
    ScrollTrigger.scrollerProxy(window, {
      scrollTop(v){ return arguments.length ? lenis.scrollTo(v) : lenis.scroll; },
      getBoundingClientRect(){ return { top:0, left:0, width:innerWidth, height:innerHeight }; },
      pinType: document.body.style.transform ? "transform" : "fixed"
    });
    lenis.on("scroll", () => ScrollTrigger.update());
    ScrollTrigger.addEventListener("refresh", () => lenis.resize());
    ScrollTrigger.refresh();

    // ------------------------------------------------------------------
    // 3) Video play/pause by visibility
    // ------------------------------------------------------------------
    console.info("[turboturtle] videos");
    (function () {
      const vids = document.querySelectorAll(".about_onceupon video, video[data-pause-offscreen]");
      vids.forEach(v => {
        try { v.setAttribute("playsinline",""); v.muted = true; } catch {}
        ScrollTrigger.create({
          trigger: v,
          start: "top 120%",
          end:   "bottom -20%",
          onEnter:     () => { try{ v.play && v.play().catch(()=>{});}catch{} },
          onEnterBack: () => { try{ v.play && v.play().catch(()=>{});}catch{} }
        });
        ScrollTrigger.create({
          trigger: v,
          start: "bottom top",
          end:   "top bottom",
          onLeave:     () => { try{ v.pause && v.pause(); }catch{} },
          onLeaveBack: () => { try{ v.pause && v.pause(); }catch{} }
        });
      });
      document.addEventListener("visibilitychange", () => {
        vids.forEach(v => {
          if (document.hidden) { try{ v.pause(); }catch{}; return; }
          const r = v.getBoundingClientRect();
          const on = r.bottom>0 && r.top<innerHeight && r.right>0 && r.left<innerWidth;
          if (on) try{ v.play && v.play().catch(()=>{});}catch{}
        });
      });
    })();

    // ------------------------------------------------------------------
    // 4) Parallax tweens
    // ------------------------------------------------------------------
    console.info("[turboturtle] parallax tweens");
    const ST_FULL = { trigger: ".parallax-wrapper", start: "top top", end: "bottom bottom", scrub: true, invalidateOnRefresh:true };
    gsap.to(".about_planet",     { y: 20*vh, ease:"none", scrollTrigger: ST_FULL });
    gsap.to(".spacecats",        { x:-3*vw, y:55*vh, rotation:20, scale:1.1, ease:"none", scrollTrigger: ST_FULL });
    gsap.to(".about_saturn",     { x:-2*vw, y:30*vh, rotation:-25, scale:.9, ease:"none", scrollTrigger: ST_FULL });
    gsap.to(".satellitemove",    { x:10*vw, y:50*vh, rotation:15, scale:.85, ease:"none", scrollTrigger: ST_FULL });
    gsap.to(".about_watermoon",  { y:35*vh, ease:"none", scrollTrigger: ST_FULL });
    gsap.to(".about_section_1",  { y:-10*vh, ease:"none", scrollTrigger: ST_FULL });

    gsap.to(".about_section_2", {
      y:-10*vh, ease:"none",
      scrollTrigger:{ trigger:".about_section_2", start:"top bottom", end:"bottom top", scrub:true, invalidateOnRefresh:true }
    });
    gsap.to(".lakeshrink", {
      scaleY:.4, ease:"none",
      scrollTrigger:{ trigger:".lakeshrink", start:"top bottom", end:"bottom top", scrub:true, invalidateOnRefresh:true }
    });
    gsap.to(".duckswim", {
      x:-5*vw-80, yPercent:-35, ease:"none",
      scrollTrigger:{ trigger:".duckswim", start:"top bottom", end:"bottom top", scrub:true, invalidateOnRefresh:true }
    });
    gsap.to(".about_rocket", {
      x:130*vw, y:-20*vw, ease:"none",
      scrollTrigger:{ trigger:".parallax-wrapper", start:() => `${innerHeight*.4}px top`, end:() => `${innerHeight*.7}px top`, scrub:true, invalidateOnRefresh:true }
    });
    gsap.to(".about_turtle2", {
      x:30*vw, y:5*vw, rotation:5, ease:"none",
      scrollTrigger:{ trigger:".about_turtle2", start:"top bottom", end:"bottom top", scrub:true, invalidateOnRefresh:true }
    });
    gsap.to(".about_turtle1", {
      x:28*vw, y:-5*vw, rotation:-5, ease:"none",
      scrollTrigger:{ trigger:".about_turtle1", start:"top bottom", end:"bottom top", scrub:true, invalidateOnRefresh:true }
    });
    gsap.to(".about_nessie", {
      x:7*vw, y:-13*vw, rotation:-30, ease:"none",
      scrollTrigger:{ trigger:".about_nessie", start:"top bottom", end:"bottom top", scrub:true, invalidateOnRefresh:true }
    });
    gsap.to(".about_giant_squid", {
      x:3*vw, y:777*vw, rotation:-5, ease:"none",
      scrollTrigger:{ trigger:".about_giant_squid", start:"top bottom", end:"bottom top", scrub:true, invalidateOnRefresh:true }
    });
    gsap.to(".about_flyduck", {
      x:120*vw, y:-15*vw, ease:"none",
      scrollTrigger:{ trigger:".about_flyduck", start:"top bottom", end:"bottom 80%", scrub:true, invalidateOnRefresh:true }
    });
    gsap.to(".about_watermoon", {
      y:5*vw, ease:"none",
      scrollTrigger:{ trigger:".about_watermoon", start:"top bottom", end:"bottom top", scrub:true, invalidateOnRefresh:true }
    });
    gsap.to(".about_section_2", {
      y:550*vh, ease:"none",
      scrollTrigger:{ trigger:".about_section_2", start:"top bottom", end:"bottom top", scrub:true, invalidateOnRefresh:true }
    });

    

    // ------------------------------------------------------------------
    // 5) Galaxy ultra-slow drift (pinned, still clipped)
    // ------------------------------------------------------------------
    (function(){
      const el=document.querySelector(".about_galaxy"); if(!el) return;
      const ratio = isMobile ? 0.004 : 0.006; // smaller = slower
      gsap.set(el,{ y:0, force3D:true });
      ScrollTrigger.create({
        trigger: ".about_underwater",
        start: "top bottom",
        end:   "bottom top",
        scrub: 0.35,
        pin:   el,
        pinSpacing: false,
        onUpdate(self){
          const y = (self.scroll() - self.start) * ratio;
          gsap.set(el,{ y });
        }
      });
      ScrollTrigger.addEventListener("refresh", () => gsap.set(el, { y: 0 }));
    })();

    // ------------------------------------------------------------------
    // 6) Jetplane arc + banking
    // ------------------------------------------------------------------
    (function(){
      const jet=document.querySelector(".about_jetplane"); if(!jet) return;
      ScrollTrigger.create({
        trigger: ".about_jetplane",
        start: "top 50%",
        end:   "bottom 30%",
        scrub: true,
        invalidateOnRefresh:true,
        onUpdate(self){
          const t=self.progress, x=145*vw*t;
          const arc=(isMobile?26:36)*vh, p=2.2, climbY=-arc*Math.pow(t,p);
          const dipEnd=.18, dipAmp=(isMobile?6:9)*vh, inDip=t<dipEnd;
          const dipY=inDip? dipAmp*Math.sin(Math.PI*(t/dipEnd)) : 0;
          const y=-5*vw + dipY + climbY;
          const dClimb=-arc*p*Math.pow(Math.max(t,.0001), p-1);
          const dDip=inDip? dipAmp*(Math.PI/dipEnd)*Math.cos(Math.PI*(t/dipEnd)) : 0;
          const dydt=dClimb+dDip, dxdt=130*vw;
          let angleDeg=Math.atan2(dydt,dxdt)*(180/Math.PI);
          if(t<.05) angleDeg*=t/.05;
          const targetRot=Math.max(-18, Math.min(angleDeg*.9, 0));
          const prev=parseFloat(jet.dataset.prevRot||"0");
          const rot=prev+(targetRot-prev)*.15; jet.dataset.prevRot=rot;
          jet.style.transform=`translate(${x}px, ${y}px) rotate(${rot}deg)`;
        }
      });
    })();

    // ------------------------------------------------------------------
    // 7) Woman UFO with canvas trail
    // ------------------------------------------------------------------
    (function(){
      const ufo=document.querySelector(".about_womanufo"); if(!ufo) return;
      const velocity=isMobile?1:3, maxAmp=isMobile?20*vh:60*vh, tiltDiv=isMobile?3:1, chase=.08;
      function baseY(){ return (isMobile?-10:-20)*vh; }
      const target={ x:0,y:baseY(),rot:0 }, actual={ x:0,y:baseY(),rot:0 };
      ufo.style.setProperty("--ufo-x",`${actual.x}px`);
      ufo.style.setProperty("--ufo-y",`${actual.y}px`);
      ufo.style.setProperty("--ufo-rot",`${actual.rot}deg`);
      ScrollTrigger.create({
        trigger: ".parallax-wrapper",
        start:"top top",
        end: isMobile? `${innerHeight*.25}px top` : `${innerHeight*.5}px top`,
        scrub:true,
        onUpdate(self){ target.x=130*vw*self.progress; }
      });
      let last=0, phase=0, idle=0, idleMax=30;
      (function update(){
        const pos=lenis.scroll, dY=pos-last; last=pos;
        const amp=Math.min(Math.abs(dY)*velocity, maxAmp);
        const horizontal=target.x/vw;
        const scale=horizontal<=30?0: (horizontal>=100?1: (horizontal-30)/70);
        if(Math.abs(dY)<1){ idle++; if(idle>idleMax) gsap.to(target,{y:baseY(), duration:.4, ease:"power3.out"}); }
        else { idle=0; phase+=.1; target.y=baseY()+Math.sin(phase)*amp*scale; }
        target.rot=Math.max(-20, Math.min(dY/tiltDiv,20))*scale;
        requestAnimationFrame(update);
      })();
      const c=document.createElement("canvas"), ctx=c.getContext("2d");
      let pts=[], max=40, fade=800;
      Object.assign(c.style,{ position:"fixed", top:0, left:0, pointerEvents:"none", zIndex:10, background:"transparent" });
      c.id="akiraMouseTrail"; (document.querySelector(".fixed_screen_area")||document.body).appendChild(c);
      function resize(){ c.width=innerWidth; c.height=innerHeight; } resize(); addEventListener("resize", resize);
      (function loop(){
        actual.x+=(target.x-actual.x)*chase; actual.y+=(target.y-actual.y)*chase; actual.rot+=(target.rot-actual.rot)*chase;
        ufo.style.setProperty("--ufo-x",`${actual.x}px`); ufo.style.setProperty("--ufo-y",`${actual.y}px`); ufo.style.setProperty("--ufo-rot",`${actual.rot}deg`);
        const r=ufo.getBoundingClientRect(); pts.push({ x:r.left+r.width/2, y:r.top+r.height/2, t:performance.now() }); if(pts.length>max) pts.shift();
        ctx.clearRect(0,0,c.width,c.height);
        const mw=r.height*.4;
        for(let i=0;i<pts.length-1;i++){
          const p1=pts[i], p2=pts[i+1], dx=p2.x-p1.x, dy=p2.y-p1.y; if(Math.hypot(dx,dy)<1) continue;
          const a=1-(performance.now()-p1.t)/fade; if(a<=0) continue;
          const lw=10+(mw-10)*a; ctx.strokeStyle=`rgba(225,255,0,${a})`; ctx.lineWidth=lw;
          ctx.beginPath(); ctx.moveTo(p1.x,p1.y); ctx.quadraticCurveTo(p1.x+dx*.5, p1.y+dy*.5, p2.x,p2.y); ctx.stroke();
        }
        requestAnimationFrame(loop);
      })();
    })();https://github.com/Fai2606/turboturtle-webflow/blob/main/turboturtle.js

    // finally, if we got here, we’re good
    window.__TT_BOOTED__ = true;
    console.info("[turboturtle] v14 booted ✅");
  } catch (err) {
    // Any early error gets surfaced clearly
    console.error("[turboturtle] FATAL:", err && (err.stack || err.message || err));
    window.__TT_BOOTED__ = false;
  }
  // at the very end of turboturtle.js
  window.TT_BOOTED = true;
  console.log("[turboturtle] booted ✅");
})();

(function bootTurboTurtle() {
  // Wait until DOM ready
  function onReady(fn){
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      fn();
    }
  }

  // Auto-load missing libraries
  function load(src){
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = src;
      s.async = true;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  // Ensure GSAP + ScrollTrigger + Lenis
  async function ensureLibs(){
    if (!window.Lenis)        await load("https://unpkg.com/lenis@1.3.11/dist/lenis.min.js");
    if (!window.gsap)         await load("https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js");
    if (!window.ScrollTrigger)await load("https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js");
  }

  onReady(async () => {
    try {
      await ensureLibs();
      gsap.registerPlugin(ScrollTrigger);

      // ──────────────────────────────────────
      // 1) Lenis smooth scroll
      // ──────────────────────────────────────
      const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      let vw = window.innerWidth  / 100;
      let vh = window.innerHeight / 100;
      window.addEventListener("resize", () => {
        vw = window.innerWidth  / 100;
        vh = window.innerHeight / 100;
      });

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
      function runLenis(time) {
        lenis.raf(time);
        requestAnimationFrame(runLenis);
      }
      requestAnimationFrame(runLenis);

      ScrollTrigger.scrollerProxy(window, {
        scrollTop(value) {
          return arguments.length ? lenis.scrollTo(value) : lenis.scroll;
        },
        getBoundingClientRect() {
          return { top: 0, left: 0, width: innerWidth, height: innerHeight };
        },
        pinType: document.body.style.transform ? "transform" : "fixed"
      });
      ScrollTrigger.addEventListener("refresh", () => lenis.resize());
      ScrollTrigger.refresh();

      // ──────────────────────────────────────
      // 2) Video play/pause only onscreen
      // ──────────────────────────────────────
      var vids = document.querySelectorAll(".about_onceupon video, video[data-pause-offscreen]");
      vids.forEach(function (v) {
        v.setAttribute("playsinline", "");
        v.setAttribute("muted", "");
      });
      vids.forEach(function (v) {
        ScrollTrigger.create({
          trigger: v,
          start: "top 120%",
          end: "bottom -20%",
          onEnter:     () => { try { v.play(); } catch(e){} },
          onEnterBack: () => { try { v.play(); } catch(e){} }
        });
        ScrollTrigger.create({
          trigger: v,
          start: "bottom top",
          end: "top bottom",
          onLeave:     () => { try { v.pause(); } catch(e){} },
          onLeaveBack: () => { try { v.pause(); } catch(e){} }
        });
      });
      document.addEventListener("visibilitychange", function(){
        vids.forEach(function (v) {
          if (document.hidden) v.pause();
          else {
            const r = v.getBoundingClientRect();
            if (r.bottom > 0 && r.top < window.innerHeight) v.play().catch(()=>{});
          }
        });
      });

      // ──────────────────────────────────────
      // 3) Parallax elements
      // ──────────────────────────────────────
      gsap.to(".about_planet", { y: 20*vh, ease: "none",
        scrollTrigger:{trigger:".parallax-wrapper",start:"top top",end:"bottom bottom",scrub:true}});
      gsap.to(".spacecats", {x:-3*vw,y:55*vh,rotation:20,scale:1.1,ease:"none",
        scrollTrigger:{trigger:".parallax-wrapper",start:"top top",end:"bottom bottom",scrub:true}});
      gsap.to(".about_saturn",{x:-2*vw,y:30*vh,rotation:-25,scale:0.9,ease:"none",
        scrollTrigger:{trigger:".parallax-wrapper",start:"top top",end:"bottom bottom",scrub:true}});
      gsap.to(".satellitemove",{x:10*vw,y:50*vh,rotation:15,scale:0.85,ease:"none",
        scrollTrigger:{trigger:".parallax-wrapper",start:"top top",end:"bottom bottom",scrub:true}});
      gsap.to(".about_watermoon",{y:35*vh,ease:"none",
        scrollTrigger:{trigger:".parallax-wrapper",start:"top top",end:"bottom bottom",scrub:true}});
      gsap.to(".about_section_1",{y:-10*vh,ease:"none",
        scrollTrigger:{trigger:".parallax-wrapper",start:"top top",end:"bottom bottom",scrub:true}});
      gsap.to(".about_section_2",{y:-10*vh,ease:"none",
        scrollTrigger:{trigger:".about_section_2",start:"top bottom",end:"bottom top",scrub:true}});
      gsap.to(".lakeshrink",{scaleY:0.4,ease:"none",
        scrollTrigger:{trigger:".lakeshrink",start:"top bottom",end:"bottom top",scrub:true}});
      gsap.to(".duckswim",{x:-5*vw-80,yPercent:-35,ease:"none",
        scrollTrigger:{trigger:".duckswim",start:"top bottom",end:"bottom top",scrub:true}});
      gsap.to(".about_rocket",{x:130*vw,y:-20*vw,ease:"none",
        scrollTrigger:{trigger:".parallax-wrapper",start:()=>`${innerHeight*0.4}px top`,end:()=>`${innerHeight*0.7}px top`,scrub:true,invalidateOnRefresh:true}});
      gsap.to(".about_turtle2",{x:30*vw,y:5*vw,rotation:5,ease:"none",
        scrollTrigger:{trigger:".about_turtle2",start:"top bottom",end:"bottom top",scrub:true,invalidateOnRefresh:true}});
      gsap.to(".about_turtle1",{x:28*vw,y:-5*vw,rotation:-5,ease:"none",
        scrollTrigger:{trigger:".about_turtle1",start:"top bottom",end:"bottom top",scrub:true,invalidateOnRefresh:true}});
      gsap.to(".about_nessie",{x:7*vw,y:-13*vw,rotation:-30,ease:"none",
        scrollTrigger:{trigger:".about_nessie",start:"top bottom",end:"bottom top",scrub:true,invalidateOnRefresh:true}});
      gsap.to(".about_giant_squid",{x:3*vw,y:7*vw,rotation:-5,ease:"none",
        scrollTrigger:{trigger:".about_giant_squid",start:"top bottom",end:"bottom top",scrub:true,invalidateOnRefresh:true}});
      gsap.to(".about_flyduck",{x:120*vw,y:-15*vw,ease:"none",
        scrollTrigger:{trigger:".about_flyduck",start:"top bottom",end:"bottom 80%",scrub:true,invalidateOnRefresh:true}});

      // ──────────────────────────────────────
      // 4) Galaxy slow parallax (super slow drift, mask-safe)
      // ──────────────────────────────────────
      (() => {
        const el = document.querySelector(".about_galaxy");
        if (!el) return;
        const speed = isMobile ? 0.02 : 0.04; // adjust for slower drift
        gsap.set(el, { y: 0, force3D: true });
        ScrollTrigger.create({
          trigger: ".about_underwater",
          start: "top bottom",
          end: "bottom top",
          scrub: 0.35,
          invalidateOnRefresh: true,
          onUpdate(self) {
            const delta = self.scroll() - self.start;
            const y = delta * (1 - speed);
            gsap.set(el, { y });
          },
          onRefreshInit() { gsap.set(el, { y: 0 }); }
        });
      })();

      // ──────────────────────────────────────
      // 5) Jetplane arc flight
      // ──────────────────────────────────────
      (() => {
        const jet = document.querySelector(".about_jetplane");
        if (!jet) return;
        ScrollTrigger.create({
          trigger: ".about_jetplane",
          start: "top 50%",
          end: "bottom 30%",
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate(self) {
            const t = self.progress;
            const x = 145*vw*t;
            const arc = (isMobile ? 26 : 36)*vh;
            const climbY = -arc*Math.pow(t,2.2);
            const dipEnd=0.18,dipAmp=(isMobile?6:9)*vh;
            const dipY = t<dipEnd?dipAmp*Math.sin(Math.PI*(t/dipEnd)):0;
            const y=-5*vw+dipY+climbY;
            const dClimb=-arc*2.2*Math.pow(Math.max(t,0.0001),1.2);
            const dDip=t<dipEnd?dipAmp*(Math.PI/dipEnd)*Math.cos(Math.PI*(t/dipEnd)):0;
            const dydt=dClimb+dDip;
            const dxdt=130*vw;
            let angleDeg=Math.atan2(dydt,dxdt)*(180/Math.PI);
            if(t<0.05) angleDeg*=t/0.05;
            const targetRot=Math.max(-18,Math.min(angleDeg*0.9,0));
            const prevRot=parseFloat(jet.dataset.prevRot||"0");
            const smoothedRot=prevRot+(targetRot-prevRot)*0.15;
            jet.dataset.prevRot=smoothedRot;
            jet.style.transform=`translate(${x}px,${y}px) rotate(${smoothedRot}deg)`;
          }
        });
      })();

      // ──────────────────────────────────────
      // 6) Woman UFO chase + trail
      // ──────────────────────────────────────
      (() => {
        const ufoEl=document.querySelector(".about_womanufo");
        if(!ufoEl) return;
        const velocity=isMobile?1:3, maxAmpVal=isMobile?20*vh:60*vh, tiltDiv=isMobile?3:1, chaseSpeed=isMobile?0.08:0.15;
        function getBaseY(){return(isMobile?-10:-20)*vh;}
        const targetState={x:0,y:getBaseY(),rot:0}, actualState={...targetState};
        ufoEl.style.setProperty("--ufo-x",`${actualState.x}px`);
        ufoEl.style.setProperty("--ufo-y",`${actualState.y}px`);
        ufoEl.style.setProperty("--ufo-rot",`${actualState.rot}deg`);
        ScrollTrigger.create({trigger:".parallax-wrapper",start:"top top",
          end:isMobile?`${innerHeight*0.25}px top`:`${innerHeight*0.5}px top`,scrub:true,
          onUpdate(self){targetState.x=130*vw*self.progress;}});
        let lastScroll=0,bouncePhase=0,idleFrames=0;
        function updateBounceTilt(){
          const scrollPos=lenis.scroll,deltaY=scrollPos-lastScroll;lastScroll=scrollPos;
          const amplitude=Math.min(Math.abs(deltaY)*velocity,maxAmpVal);
          const horizontal=targetState.x/vw;
          const bounceScale=horizontal<=30?0:horizontal>=100?1:(horizontal-30)/70;
          if(Math.abs(deltaY)<1){
            idleFrames++;
            if(idleFrames>30) gsap.to(targetState,{y:getBaseY(),duration:0.4,ease:"power3.out"});
          } else {
            idleFrames=0;
            bouncePhase+=0.1;
            targetState.y=getBaseY()+Math.sin(bouncePhase)*amplitude*bounceScale;
          }
          targetState.rot=Math.max(-20,Math.min(deltaY/tiltDiv,20))*bounceScale;
          requestAnimationFrame(updateBounceTilt);
        }
        updateBounceTilt();
        const canvas=document.createElement("canvas"),ctx=canvas.getContext("2d");
        let trailPoints=[],trailMax=40,fadeTime=800;
        Object.assign(canvas.style,{position:"fixed",top:0,left:0,pointerEvents:"none",zIndex:10,background:"transparent"});
        canvas.id="akiraMouseTrail";document.querySelector(".fixed_screen_area").appendChild(canvas);
        function resizeCanvas(){canvas.width=window.innerWidth;canvas.height=window.innerHeight;}
        resizeCanvas();window.addEventListener("resize",resizeCanvas);
        function animateUFO(){
          actualState.x+=(targetState.x-actualState.x)*chaseSpeed;
          actualState.y+=(targetState.y-actualState.y)*chaseSpeed;
          actualState.rot+=(targetState.rot-actualState.rot)*chaseSpeed;
          ufoEl.style.setProperty("--ufo-x",`${actualState.x}px`);
          ufoEl.style.setProperty("--ufo-y",`${actualState.y}px`);
          ufoEl.style.setProperty("--ufo-rot",`${actualState.rot}deg`);
          const rect=ufoEl.getBoundingClientRect();
          trailPoints.push({x:rect.left+rect.width/2,y:rect.top+rect.height/2,t:performance.now()});
          if(trailPoints.length>trailMax) trailPoints.shift();
          ctx.clearRect(0,0,canvas.width,canvas.height);
          const maxWidth=rect.height*0.4;
          trailPoints.forEach((p1,i)=>{
            const p2=trailPoints[i+1];if(!p2)return;
            const dx=p2.x-p1.x,dy=p2.y-p1.y;if(Math.hypot(dx,dy)<1)return;
            const age=performance.now()-p1.t,alpha=1-age/fadeTime;if(alpha<=0)return;
            const lineW=10+(maxWidth-10)*alpha;
            ctx.strokeStyle=`rgba(225,255,0,${alpha})`;ctx.lineWidth=lineW;
            ctx.beginPath();ctx.moveTo(p1.x,p1.y);
            ctx.quadraticCurveTo(p1.x+dx*0.5,p1.y+dy*0.5,p2.x,p2.y);ctx.stroke();
          });
          requestAnimationFrame(animateUFO);
        }
        animateUFO();
      })();

    } catch(err) {
      console.warn("[TurboTurtle] boot error:", err);
    }
  });
})();

(async function(){
"use strict";
if(document.readyState==="loading")await new Promise(r=>document.addEventListener("DOMContentLoaded",r,{once:true}));
var readyStart=performance.now();while(!window.ttCoreReady||document.documentElement.classList.contains("tt-loading")||document.hidden){if(performance.now()-readyStart>120000)throw Error("Foreground/core readiness timed out");await new Promise(r=>setTimeout(r,200));}
(function(){
  window.__vtResults=[];
  var token='TT-'+window.__ttVerifiedProbe.mode,events={touchstart:0,touchmove:0,touchend:0,wheel:0,pointerTouch:0,pointerMouse:0};
  ['touchstart','touchmove','touchend','wheel','pointerdown'].forEach(function(type){addEventListener(type,function(e){if(!e.isTrusted)return;if(type==='pointerdown')events[e.pointerType==='touch'?'pointerTouch':'pointerMouse']++;else events[type]++},{passive:true})});
  document.getElementById('tt-proof-7Q4')?.remove();
  var badge=document.createElement('button');badge.id='tt-verified-probe';badge.textContent='TT probe · waiting';badge.style.cssText='position:fixed;left:8px;top:60px;width:205px;z-index:2147483647;background:#e4f643;color:#000;font:bold 12px monospace;padding:6px;border:1px solid black';document.body.appendChild(badge);
  window.__vtRun=async function(label,manual){
    if(!window.ttCoreReady||document.documentElement.classList.contains('tt-loading'))throw Error('Page is not ready');
    var start=performance.now(),prev=start,frames=[],gaps=[],long=[],refreshes=[],resizes=[],hidden=0,maxDrift=0,minY=scrollY,maxY=scrollY,firstY=scrollY,counts={...events},lastBadge=0;
    var loadedBefore=[...document.images].filter(i=>i.complete&&i.naturalWidth).length;
    var h=document.documentElement.scrollHeight,limit=h-innerHeight,viewport=[innerWidth,innerHeight];
    var sections=[...document.querySelectorAll('[class]')].filter(e=>[...e.classList].some(c=>/^home_section[0-9-]+$/.test(c))).map(e=>({name:[...e.classList].find(c=>/^home_section[0-9-]+$/.test(c)),top:e.getBoundingClientRect().top+scrollY,bottom:e.getBoundingClientRect().bottom+scrollY}));
    var obs=new PerformanceObserver(l=>l.getEntries().forEach(e=>long.push({duration:e.duration,start:e.startTime-start,y:scrollY})));obs.observe({type:'longtask',buffered:false});
    function refresh(){refreshes.push({t:performance.now()-start,y:scrollY})}function resize(){resizes.push({t:performance.now()-start,w:innerWidth,h:innerHeight})}function scroll(){maxDrift=Math.max(maxDrift,Math.abs(lenis.scroll-scrollY))}
    ScrollTrigger.addEventListener('refresh',refresh);addEventListener('resize',resize);addEventListener('scroll',scroll,{passive:true});
    var duration=manual?20000:12000;
    await new Promise(resolve=>{function f(now){
      var dt=now-prev;prev=now;frames.push(dt);if(document.hidden)hidden++;minY=Math.min(minY,scrollY);maxY=Math.max(maxY,scrollY);
      if(dt>34)gaps.push({dt,y:scrollY,sections:sections.filter(s=>s.bottom>scrollY&&s.top<scrollY+innerHeight).map(s=>s.name)});
      var p=(now-start)/duration;
      if(now-lastBadge>750){badge.textContent=token+' '+label+' '+Math.min(100,Math.round(p*100))+'%';lastBadge=now}
      if(!manual)window.scrollTo(0,Math.max(0,Math.min(limit,limit*(p<.5?p*2:2-p*2))));
      if(p<1)requestAnimationFrame(f);else resolve();
    }requestAnimationFrame(f)});
    obs.disconnect();ScrollTrigger.removeEventListener('refresh',refresh);removeEventListener('resize',resize);removeEventListener('scroll',scroll);
    var sorted=frames.slice().sort((a,b)=>a-b),input={};Object.keys(events).forEach(k=>input[k]=events[k]-counts[k]);
    var r={loadedBefore,staticCount:window.__vtStaticCount||0,hiddenStatic:document.documentElement.classList.contains("tt-vt-static-off"),token,label,manual:!!manual,elapsed:performance.now()-start,frames:frames.length,p50:sorted[Math.floor(sorted.length*.5)],p95:sorted[Math.floor(sorted.length*.95)],p99:sorted[Math.floor(sorted.length*.99)],over34:gaps.length,over50:frames.filter(x=>x>50.5).length,max:Math.max(...frames),longTaskMs:long.reduce((a,b)=>a+b.duration,0),longTasks:long,hiddenFrames:hidden,maxDrift,firstY,minY,maxY,viewport,endViewport:[innerWidth,innerHeight],height:h,endHeight:document.documentElement.scrollHeight,refreshes,resizes,input,gaps,source:[...document.scripts].map(s=>s.src).filter(s=>s.includes('/turboturtle-core.js')),delivery:window.ttAndroidImages?.status(),loadedImages:[...document.images].filter(i=>i.complete&&i.naturalWidth).length,failedImages:[...document.images].filter(i=>i.complete&&!i.naturalWidth).length};
    __vtResults.push(r);badge.textContent=token+' '+label+' done · '+r.over34+' stalls';console.log('VTP_RESULT '+JSON.stringify(r));return r;
  };
  badge.onclick=function(e){window.__vtNativeConfirmed=e.isTrusted;badge.textContent='7Q4 · native confirmed';};
  console.log('VTP_INSTALLED',JSON.stringify({token,ua:navigator.userAgent,dpr:devicePixelRatio,viewport:[innerWidth,innerHeight],version:window.lenisVersion||"1.3.11",settings:{syncTouch:lenis.options.syncTouch,smoothWheel:lenis.options.smoothWheel},hidden:document.hidden}));
})();

(()=>{const ids=["6a8db85e2d3a7cf97069b06d","6a8db85e4c52226c5ac56233","6a8db85e9067f1cf995507b3","6a8db85e9788bb8f7c181b0a","6a8db85ed1893a0fa645abe5","6a8db85ed706c2004fa0c0f7","6a8db85f3c35da2ebf4b3d13","6a8db85f3c35da2ebf4b3d19","6a8db85f55874f47fd94f0ee","6a8db85f69eb6d5e94aa2847","6a8db85f88906dd7f71c6897","6a8db85fe7b7eee42a0567e4","6a8db85ff270e35ae95380d4","6a8db862c2f201be319a4af0","6aa4cc905b2d3f7f3c738b44","6aa4cc9067c9f6de9832aed4","6aa4cc9074020678a588ae07","6aa4cc909365cab3f8103c3f","6aa4cc91ed5eeea13b1bef34","6aa9235d304f72edf39ab732","6aa9235e25483970bb44e3fd","6aa9235e5755fa1089786e7a","6aa9235e5f4c0af2b1da2762","6aa9235e7bff8b1eb71a9136","6aa978f33d2a8405e21711eb","6aa978f3f0e0cc954673ea48","6aa9b5dc06c1d471cef9da61","6aa9b5dc07077162f472c596","6aa9b5dc34814b05f599420f","6aa9b5dc8b5b49f76480c562","6aa9b5dc9f4c2bac6217ba74","6aa9b5dd556c69081cfbe6c5","6aa9b5dd556c69081cfbe6c8","6aaa50f122ca8de561fdc5e1","6aaa50f12a3a2eeaf4333482","6aaa50f12b0210db69325667","6aaa50f12b0210db693256dd","6aaa50f1e1da0245f6100bfb","6aaa50f1feb255745f4dee7e","6aaa50f2f73d6cb8dd6dc87a","6aaa50f360f89a9ca5ff8182","6aaa50f42b0210db69325f56","6aaac40faed586032a1918dc","6aaac75d45b7b730d6343417","6aae4d31efd182c8cdb9188b","6ab108946bdfe2bdfc1d6429","6ab108948b78e7524ad162c9","6ab10894e85326a22d124b70","6ab10894f25fa32ad3072e4f","6ab10894f344a15a2b01f9ca","6abbbc7a2791fb35d4959d4a","6abd130d3a5a8dfb35aa1580","6abd1d6d6c5f30351c5d8082","6ac2b62fcb6c196f53c51030","6ac3bfd912b9f8c364939d28","6ac5adcbcd7347671d5c504a","6ac5d0084aa5883319bf13fc","6ac61b0ac0bfaa92484a138e","6ac66c044a3a9fe0428d5b1e","6ac66f7a6e3c53a2c6d7ea82","6ac66fe272000dcedc79769b","6ac7076edf5c35271ee177d5","6ac76e33c1f7305782b4119d","6ac76e8775f59687c09749ee","6ac76e90c1f7305782b44ac6","6ac7daea40df6cb2ebb0e803","6ac7db12f8cd9cf07198a1d7","6ac7db9ff8cd9cf07198f521","6ac87923e5e5a1b977d6286d","6ac87a735c7cb0f9ed7bb8ea","6ac8ff363273d8c5ce506175","6ac8ff364f5d430a03f879c8","6ac8ff36b594bb71ba64b93e","6ac8ff36bae50a0c3bbb4ee7","6ac8ff36f3f44766e36a3497","6acbb8a6da442e046e230d8f","6ad1f8fe59d17ee0dba7a2ec","6ad1f8feec332e936c9257e7","6ad20f84f86725674eb5563d","6ad20f8508de9ccb3a28ea27","6ad21fcd651fae0b74e9b3fa","6ad22449a0ec85b68fdd941f","6ad2257ed89877e86ad70618","6ad226a8b523248b54d8bf7c","6ad226a9b523248b54d8bf82","6ad22727a0ec85b68fdfa64f","6ad22c0436b083b864cb17ab","6ad2350921db29f3ea3b4988","6ad235093df50bba4571352e","6ad23509dacde0d3b78cf187","6ad23d408099ef1a6505a2a1","6ad2f2d9bae5cb565b669430","6ad3ab898e2f9c9e731d60f9","6ad3aedeec3b0daebff005b0","6ad3b5ef2924c50952915f0b","6ad5ca60421632ee085ce58a","6ad66b5ef836f2bb30eabf08","6ad6d0013bd4b353a2f2ad5b","6ae387b303bc1f4446fd3952","6ae387b3dbd9381f548674da","6ae3aa6a3b28231faa4b2510","6ae447c4fcf6b9e32bb7f607","6ae62f90c68664c0232285f5","6ae6ea8efce9fb7f348476df","6ae6eff41fa9082820ef484d","6afc8f53af0db6c9f4ca2232","6afc8f545912d01a81490a16","6afc8f54e5d0ef22c2060e82","6afc8f5570c2b472795f23aa","6afc8f55c38c398a3a0048c9","6afc8f55ffed63c95423b6c4","6afc8f56c194dda4999c4ded","6afc8f7a267c3cedd519943b","6afc8f7cf9be1ab18575e66f","6afc8f7d10614bf0dd890c85","6afc8f7d2398806e8074ecbc","6afc8f7de5d0ef22c2061f8a","6afc8f7e75bca6c74bbc09a4","6afc8f7f16d1cf23d511a3ea","6afc8f7f267c3cedd519959b","6afc8f7f5c8b652bf82d4b52","6afc8fafdc1ccf18926ef7c5","6afc8fb0bdcfb8525802efb8","6afc8fb1af0db6c9f4ca4999","6afc8fb22398806e8074ff5c","6afc8fb28000b0ccfd36408c","6afc8fb38000b0ccfd364139","6afc8fb3b0b9087f70e424ed"];let n=0;for(const im of document.images){const u=im.currentSrc+" "+im.src;if(ids.some(id=>u.includes(id))){im.setAttribute("data-vt-static","");n++}}const style=document.createElement("style");style.id="vt-static-isolation";style.textContent="html.tt-vt-static-off img[data-vt-static]{visibility:hidden!important}";document.head.appendChild(style);window.__vtStaticCount=n;window.__vtSetStaticPaint=show=>document.documentElement.classList.toggle("tt-vt-static-off",!show);console.log("VTP_STATIC_TARGETS",n);})();
var cfg=window.__ttVerifiedProbe;
var report={id:Date.now().toString(36),mode:cfg.mode,date:new Date().toISOString(),ua:navigator.userAgent,dpr:devicePixelRatio,viewport:[innerWidth,innerHeight],href:location.href,rows:[]};
function persist(){try{localStorage.setItem('tt-vtp-v1-'+cfg.mode,JSON.stringify(report))}catch(e){}}
function read(mode){try{return JSON.parse(localStorage.getItem('tt-vtp-v1-'+mode)||'null')}catch(e){return null}}
var start=performance.now();
while(!window.ttCoreReady||document.documentElement.classList.contains('tt-loading')||document.hidden){
 if(performance.now()-start>120000)throw Error('Entrance/foreground readiness timed out');
 await new Promise(r=>setTimeout(r,200));
}
report.core=[...document.scripts].map(s=>s.src).find(s=>s.includes('/turboturtle-core.js'));
var expected=cfg.mode==='old'?'111e5331d075fc93d080ba6ec5dd001ea411779c':'28651c60d6b22477a92e497b1140675f6c0909e6';
if(!report.core?.includes(expected))throw Error('Unexpected core version');
var warm=await __vtRun('warm');report.rows.push(warm);persist();
// Allow deferred image requests initiated by the full traversal to settle.
for(var checks=0,stable=0,last=-1;checks<30&&stable<3;checks++){
 var loaded=[...document.images].filter(i=>i.complete&&i.naturalWidth).length;
 stable=loaded===last?stable+1:0;last=loaded;await new Promise(r=>setTimeout(r,1000));
}
for(var label of (cfg.mode==='now'?['normal1','normal2','noStatic1','noStatic2','return1','return2']:['normal1','normal2'])){
 __vtSetStaticPaint(!label.startsWith('noStatic'));
 var row=await __vtRun(label);report.rows.push(row);persist();
}
__vtSetStaticPaint(true);report.complete=true;persist();
var box=document.createElement('div');box.id='tt-device-report';
box.style.cssText='position:fixed;inset:24px 8px 12px;z-index:2147483647;background:white;color:black;border:2px solid #111;padding:10px;overflow:auto;font:12px/1.3 monospace;box-sizing:border-box;touch-action:pan-y';
var title=document.createElement('h3');title.textContent='TT device probe · '+report.id;title.style.cssText='font:bold 15px monospace;margin:0 0 8px';box.appendChild(title);
var info=document.createElement('div');info.textContent=cfg.mode.toUpperCase()+' · '+innerWidth+'×'+innerHeight+' · DPR '+devicePixelRatio+'\nCore '+expected.slice(0,8)+' · foreground only\nRAF scheduling, not presented FPS';info.style.whiteSpace='pre-wrap';box.appendChild(info);
var table=document.createElement('table');table.style.cssText='width:100%;border-collapse:collapse;font:11px monospace;color:black;background:white;margin:8px 0';
var tr=document.createElement('tr');for(var txt of ['Mode/run','frames','>34ms','max ms']){var th=document.createElement('th');th.textContent=txt;th.style.cssText='border:1px solid #aaa;padding:5px 2px;text-align:left';tr.appendChild(th)}table.appendChild(tr);
var all=[read('now'),read('old')].filter(Boolean);if(!all.some(r=>r.id===report.id))all.push(report);
for(var record of all){for(var row of record.rows.filter(r=>r.label!=='warm')){var tr=document.createElement('tr');var valid=!row.hiddenFrames&&row.height===row.endHeight&&JSON.stringify(row.viewport)===JSON.stringify(row.endViewport)&&row.failedImages===0&&row.loadedBefore===row.loadedImages;for(var txt of [record.mode+'/'+row.label+(valid?'':' !'),row.frames,row.over34,row.max.toFixed(1)]){var td=document.createElement('td');td.textContent=txt;td.style.cssText='border:1px solid #aaa;padding:5px 2px';tr.appendChild(td)}table.appendChild(tr)}}box.appendChild(table);
var note=document.createElement('div');note.textContent='! = changed/invalid conditions. Hidden frames '+report.rows.reduce((n,r)=>n+r.hiddenFrames,0)+'. Static targets '+window.__vtStaticCount+'. Source height '+report.rows[0].height+'. Images '+report.rows.at(-1).loadedImages+'/'+document.images.length+'. No artwork/source settings saved.';box.appendChild(note);
var link=document.createElement('a');var other=cfg.mode==='now'?'old':'now';link.href='/?ttv='+other;link.textContent='Run '+other.toUpperCase()+' comparison';link.style.cssText='display:block;background:#e4f643;color:#000;font:bold 14px monospace;padding:12px;margin:10px 0;text-align:center';box.appendChild(link);
var raw=document.createElement('details'),summary=document.createElement('summary'),pre=document.createElement('pre');summary.textContent='Full report JSON';pre.textContent=JSON.stringify(report,null,2);pre.style.cssText='font:9px monospace;white-space:pre-wrap;word-break:break-all';raw.append(summary,pre);box.appendChild(raw);
var close=document.createElement('a');close.href='/';close.textContent='Return to ordinary website';close.style.cssText='display:block;margin-top:12px;color:black';box.appendChild(close);
document.body.appendChild(box);document.getElementById('tt-verified-probe').remove();

})().catch(function(error){console.error("TT device probe failed",error);var b=document.getElementById("tt-verified-probe");if(b)b.textContent="Probe failed: "+error.message;document.documentElement.classList.remove("tt-vt-static-off");});

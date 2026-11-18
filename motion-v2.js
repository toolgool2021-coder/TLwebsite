"use strict";
(() => {
 const root=document.documentElement;
 const reduced=matchMedia("(prefers-reduced-motion: reduce)");
 const fine=matchMedia("(hover:hover) and (pointer:fine)");
 const enabled=()=>!reduced.matches&&!root.classList.contains("no-effects");
 const ticker=document.querySelector(".tl-ticker-track");
 if(ticker){
   const original=ticker.innerHTML;
   ticker.innerHTML='<span class="tl-ticker-half">'+original+'</span><span class="tl-ticker-half" aria-hidden="true">'+original+'</span>';
   ticker.classList.add("tl-ticker-loop");
 }
 const sections=[...document.querySelectorAll(".section-heading,.hero-copy,.tl-hero-metrics,.closing,.posts-heading")];
 sections.forEach((el)=>el.classList.add("tl-cinema-reveal"));
 const observer="IntersectionObserver" in window?new IntersectionObserver(entries=>{
  for(const entry of entries){if(entry.isIntersecting){entry.target.classList.add("tl-cinema-visible");observer.unobserve(entry.target)}}
 },{threshold:.09,rootMargin:"0px 0px -35px 0px"}):null;
 sections.forEach(el=>observer?observer.observe(el):el.classList.add("tl-cinema-visible"));
 const animated=new WeakSet();
 const cardObserver="IntersectionObserver" in window?new IntersectionObserver(entries=>{
  entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("tl-card-visible");cardObserver.unobserve(entry.target)}})
 },{threshold:.08,rootMargin:"0px 0px -25px 0px"}):null;
 function prepareCards(){
  document.querySelectorAll(".project,.social-card,.team-card,.post-item").forEach((card,index)=>{
   if(animated.has(card))return;
   animated.add(card);card.classList.add("tl-cinema-card");
   card.style.setProperty("--tl-delay",Math.min(index%6*65,325)+"ms");
   if(cardObserver)cardObserver.observe(card);else card.classList.add("tl-card-visible");
  });
 }
 prepareCards();
 for(const id of ["teamGrid","postsContainer"]){const el=document.getElementById(id);if(el)new MutationObserver(prepareCards).observe(el,{childList:true,subtree:true})}
 const halo=document.createElement("div");halo.className="tl-cursor-glow";halo.setAttribute("aria-hidden","true");document.body.append(halo);
 let raf=0,px=0,py=0;
 if(fine.matches){
  addEventListener("pointermove",e=>{px=e.clientX;py=e.clientY;if(raf)return;raf=requestAnimationFrame(()=>{halo.style.setProperty("--glow-x",px+"px");halo.style.setProperty("--glow-y",py+"px");raf=0})},{passive:true});
  document.querySelectorAll(".tl-hero .button,.project,.social-card,.team-card").forEach(card=>{
   card.addEventListener("pointermove",e=>{
    if(!enabled())return;
    const rect=card.getBoundingClientRect(),x=e.clientX-rect.left,y=e.clientY-rect.top;
    card.style.setProperty("--shine-x",x+"px");card.style.setProperty("--shine-y",y+"px");
    if(card.classList.contains("button")){card.style.setProperty("--magnet-x",((x/rect.width)-.5)*7+"px");card.style.setProperty("--magnet-y",((y/rect.height)-.5)*5+"px")}
   },{passive:true});
   card.addEventListener("pointerleave",()=>{card.style.removeProperty("--magnet-x");card.style.removeProperty("--magnet-y")})
  })
 }
 const sync=()=>{root.classList.toggle("tl-cinema-off",!enabled());if(!enabled()){sections.forEach(el=>el.classList.add("tl-cinema-visible"));document.querySelectorAll(".tl-cinema-card").forEach(el=>el.classList.add("tl-card-visible"))}};
 new MutationObserver(sync).observe(root,{attributes:true,attributeFilter:["class"]});
 reduced.addEventListener("change",sync);sync();
})();
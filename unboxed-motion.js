/* Unboxed Thinking — shared intro + Three.js r128 Warp Field, streaks variant */
(function(){
 "use strict";
 var CONFIG={variant:"streaks",speed:15.0,streakOpacity:0.60,tileOpacity:0.90,fov:75,hue:0,saturation:1.00,brightness:1.00};
 var currentFile=(window.location.pathname.split("/").pop()||"index.html").toLowerCase();
 var navEntry=window.performance&&performance.getEntriesByType?performance.getEntriesByType("navigation")[0]:null;
 var shouldPlayIntro=currentFile==="index.html"||(navEntry&&navEntry.type==="reload");
 try{if(sessionStorage.getItem("ut-intro-target")===currentFile){shouldPlayIntro=true;sessionStorage.removeItem("ut-intro-target");}}catch(e){}
 if(currentFile==="web-development.html"){
  document.addEventListener("click",function(e){var link=e.target.closest("a.website-choice,a.landing-choice");if(!link)return;try{sessionStorage.setItem("ut-intro-target",link.getAttribute("href").split("/").pop().toLowerCase());}catch(err){};});
 }
 var overlay=null;
 if(shouldPlayIntro){
  overlay=document.createElement("div");
  overlay.className="ut-intro";
  overlay.innerHTML='<div class="ut-intro-grid"></div><div class="ut-intro-copy"><div class="ut-kicker">INDEPENDENT THINKING · UNCOMMON OUTCOMES</div><div class="ut-stage"><span class="ut-word first">UNBOXED</span><span class="ut-word second">THINKING<span>.</span></span><span class="ut-word combined"><span class="combined-unboxed">UNBOXED</span> <span class="combined-thinking">THINKING</span><span>.</span></span></div></div><div class="ut-bottom"><span>— IDEAS WITHOUT A BOX</span><span>THINK DIFFERENTLY</span></div>';
  document.body.classList.add("ut-loading");
  document.body.insertBefore(overlay,document.body.firstChild);
 }
 var words=overlay?overlay.querySelectorAll(".ut-word"):[],reduced=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
 function show(n){words.forEach(function(el,i){el.classList.toggle("show",i===n);el.classList.toggle("hide",i<n);});}
 var start=performance.now(),loaded=document.readyState==="complete",finished=false;
 window.addEventListener("load",function(){loaded=true;tryOpen();},{once:true});
 setTimeout(function(){show(0);},120);
 setTimeout(function(){show(1);},reduced?120:920);
 setTimeout(function(){show(2);},reduced?120:1720);
 function open(){if(finished)return;finished=true;if(!overlay)return;overlay.classList.add("exit");document.body.classList.remove("ut-loading");setTimeout(function(){if(window.__utIntroWarp)window.__utIntroWarp.destroy();overlay.remove();},950);}
 function tryOpen(){if(loaded&&performance.now()-start>=(reduced?500:2850))open();}
 setTimeout(tryOpen,reduced?500:2850);setTimeout(open,9000);

 function makeWarp(container,opts){
  if(!container||!window.THREE)return {destroy:function(){}};
  var THREE=window.THREE,options=Object.assign({},CONFIG,opts||{}),host=document.createElement("div");
  host.className="ut-warp-layer";host.setAttribute("aria-hidden","true");
  var canvas=document.createElement("canvas");host.appendChild(canvas);container.insertBefore(host,container.firstChild);
  canvas.style.filter="hue-rotate("+options.hue+"deg) saturate("+options.saturation+") brightness("+options.brightness+")";
  var scene=new THREE.Scene();scene.background=new THREE.Color(132106);scene.fog=new THREE.FogExp2(132106,0.001);
  var camera=new THREE.PerspectiveCamera(options.fov,1,0.1,2000);camera.position.z=0;
  var renderer;
  try{renderer=new THREE.WebGLRenderer({canvas:canvas,alpha:true,antialias:true,powerPreference:"high-performance"});}
  catch(e){host.style.background="radial-gradient(ellipse at 50% 45%,rgba(150,20,30,.3),transparent 55%),#050505";return {destroy:function(){host.remove();}};}
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
  var group=new THREE.Group();scene.add(group);
  var count=400,positions=new Float32Array(count*6),colors=new Float32Array(count*6);
  var palette=[1096065,366185,3462041,16777215].map(function(hex){return new THREE.Color(hex);});
  for(var i=0;i<count;i++){
   var angle=Math.random()*Math.PI*2,radius=Math.random()*800+20,x=Math.cos(angle)*radius,y=Math.sin(angle)*radius,z=(Math.random()-.5)*2000,length=Math.random()*150+50,c=palette[Math.floor(Math.random()*palette.length)];
   positions[i*6]=x;positions[i*6+1]=y;positions[i*6+2]=z;positions[i*6+3]=x;positions[i*6+4]=y;positions[i*6+5]=z+length;
   for(var k=0;k<2;k++){colors[i*6+k*3]=c.r;colors[i*6+k*3+1]=c.g;colors[i*6+k*3+2]=c.b;}
  }
  var geometry=new THREE.BufferGeometry();geometry.setAttribute("position",new THREE.BufferAttribute(positions,3));geometry.setAttribute("color",new THREE.BufferAttribute(colors,3));
  var lineMaterial=new THREE.LineBasicMaterial({vertexColors:true,transparent:true,opacity:options.streakOpacity,blending:THREE.AdditiveBlending});
  group.add(new THREE.LineSegments(geometry,lineMaterial));
  var tileGeometry=new THREE.PlaneGeometry(8,20),tiles=[];
  for(var j=0;j<40;j++){
   var material=new THREE.MeshBasicMaterial({color:(Math.random()>0.6?11006928:(Math.random()>0.5?13761253:16777215)),transparent:true,opacity:options.tileOpacity,side:THREE.DoubleSide});
   var tile=new THREE.Mesh(tileGeometry,material),a=Math.random()*Math.PI*2,r=Math.random()*400+100;
   tile.position.set(Math.cos(a)*r,Math.sin(a)*r,(Math.random()-.5)*2000);tile.lookAt(0,0,tile.position.z+100);
   var scale=Math.random()*1.5+.5;tile.scale.set(scale,scale,scale);group.add(tile);tiles.push(tile);
  }
  var active=true,frame=0,disposed=false,last=performance.now();
  function resize(){var b=host.getBoundingClientRect(),w=Math.max(1,b.width),h=Math.max(1,b.height);camera.aspect=w/h;camera.fov=options.fov;camera.updateProjectionMatrix();renderer.setSize(w,h,false);}
  function render(){if(disposed)return;frame=0;if(!active||document.hidden)return;var now=performance.now(),dt=Math.min((now-last)/16.667,2);last=now;var step=options.speed*dt;
   for(var n=0;n<count;n++){positions[n*6+2]+=step;positions[n*6+5]+=step;if(positions[n*6+2]>200){var len=positions[n*6+5]-positions[n*6+2];positions[n*6+2]=-1800;positions[n*6+5]=-1800+len;}}
   geometry.attributes.position.needsUpdate=true;
   tiles.forEach(function(t){t.position.z+=step;if(t.position.z>200)t.position.z=-1800;});
   renderer.render(scene,camera);frame=requestAnimationFrame(render);
  }
  var ro=window.ResizeObserver?new ResizeObserver(resize):null;if(ro)ro.observe(host);else window.addEventListener("resize",resize);
  var io=window.IntersectionObserver?new IntersectionObserver(function(entries){active=!!(entries[0]&&entries[0].isIntersecting);if(active&&!frame){last=performance.now();frame=requestAnimationFrame(render);}else if(!active&&frame){cancelAnimationFrame(frame);frame=0;}}):null;
  if(io)io.observe(host);
  function onVisibility(){if(document.hidden&&frame){cancelAnimationFrame(frame);frame=0;}else if(!document.hidden&&active&&!frame){last=performance.now();frame=requestAnimationFrame(render);}}
  document.addEventListener("visibilitychange",onVisibility);resize();frame=requestAnimationFrame(render);
  return {update:function(next){Object.assign(options,next||{});lineMaterial.opacity=options.streakOpacity;tiles.forEach(function(t){t.material.opacity=options.tileOpacity;});canvas.style.filter="hue-rotate("+options.hue+"deg) saturate("+options.saturation+") brightness("+options.brightness+")";resize();},destroy:function(){if(disposed)return;disposed=true;if(frame)cancelAnimationFrame(frame);if(ro)ro.disconnect();else window.removeEventListener("resize",resize);if(io)io.disconnect();document.removeEventListener("visibilitychange",onVisibility);geometry.dispose();lineMaterial.dispose();tileGeometry.dispose();tiles.forEach(function(t){t.material.dispose();});renderer.dispose();host.remove();}};
 }
 function mountAll(){
  if(!window.THREE){return;}
  if(overlay)window.__utIntroWarp=makeWarp(overlay,CONFIG);
  document.querySelectorAll(".hero,.page-hero,.hero-section").forEach(function(hero){
   if(hero.querySelector(".ut-warp-layer"))return;
   if(getComputedStyle(hero).position==="static")hero.style.position="relative";
   hero.style.isolation="isolate";
   makeWarp(hero,CONFIG);
   Array.prototype.forEach.call(hero.children,function(child){if(!child.classList.contains("ut-warp-layer")){if(getComputedStyle(child).position==="static")child.style.position="relative";child.style.zIndex="2";}});
  });
 }
 function loadThree(){
  if(window.THREE){mountAll();return;}
  var script=document.createElement("script");script.src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";script.async=true;
  script.onload=mountAll;script.onerror=function(){overlay.style.background="radial-gradient(ellipse,rgba(140,15,25,.2),transparent 55%),#050505";};
  document.head.appendChild(script);
 }
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",loadThree,{once:true});else loadThree();
})();
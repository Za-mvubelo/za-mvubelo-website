/* Use frames from the real animation video instead of a generic headshot as its poster.
   No uploads, proxies, third-party services or extra credits required. */
(()=>{'use strict';
const targets=Array.from(document.querySelectorAll('video[data-animation-preview]'));
if(!targets.length)return;
const ref=targets[0];
const url=ref.currentSrc||ref.src;
if(!url)return;
const probe=document.createElement('video');
probe.muted=true;probe.playsInline=true;probe.preload='auto';
probe.crossOrigin='anonymous';
const samples=[0.35,2.8,7.5,15,27,43];
let timer=0,dead=false,reference=null,best=null,bestChange=-1;
function stopped(){dead=true;clearTimeout(timer);probe.removeAttribute('src');probe.load()}
function sampleFrame(){
 const canvas=document.createElement('canvas');
 const vw=probe.videoWidth,vh=probe.videoHeight;
 if(!vw||!vh)return null;
 const w=Math.min(650,vw),h=Math.max(1,Math.round(w*vh/vw));
 canvas.width=w;canvas.height=h;
 const ctx=canvas.getContext('2d',{willReadFrequently:true});
 ctx.drawImage(probe,0,0,w,h);
 const small=document.createElement('canvas');
 small.width=40;small.height=24;
 const g=small.getContext('2d',{willReadFrequently:true});
 g.drawImage(canvas,0,0,40,24);
 const pixels=g.getImageData(0,0,40,24).data;
 return {poster:canvas.toDataURL('image/jpeg',.90),pixels:Array.from(pixels)};
}
function diff(a,b){let total=0;for(let i=0;i<a.length;i+=4){total+=Math.abs(a[i]-b[i])+Math.abs(a[i+1]-b[i+1])+Math.abs(a[i+2]-b[i+2])}return total/(a.length/4*3)}
function setPoster(src){if(!src)return;targets.forEach(v=>{if(v.paused&&!v.currentTime)v.poster=src})}
function run(){
 if(dead)return;
 const duration=probe.duration;
 let places=samples.filter(t=>!Number.isFinite(duration)||t<duration-.2);
 if(!places.length)places=[.1];
 let i=0;
 function next(){
  if(dead)return;
  if(i>=places.length){setPoster(best?.poster);stopped();return}
  const stamp=places[i++];
  let finished=false;
  const finish=()=>{
   if(finished||dead)return;finished=true;clearTimeout(timer);
   try{
    const frame=sampleFrame();
    if(frame){
     if(!reference){reference=frame.pixels;best=frame}
     else{
      const change=diff(reference,frame.pixels);
      if(change>bestChange){bestChange=change;best=frame}
      // First obviously different scene, not a slightly shifted talking-head frame.
      if(change>=23){setPoster(frame.poster);stopped();return}
     }
    }
   }catch(e){/* fall back to the video player's own thumbnail */}
   next();
  };
  probe.addEventListener('seeked',finish,{once:true});
  timer=setTimeout(finish,2800);
  try{probe.currentTime=Math.min(stamp,Math.max(0,probe.duration-.15))}catch(e){finish()}
 }
 next();
}
probe.addEventListener('loadedmetadata',run,{once:true});
probe.addEventListener('error',()=>stopped(),{once:true});
setTimeout(()=>{if(!dead)stopped()},21000);
try{probe.src=url;probe.load()}catch(e){stopped()}
})();
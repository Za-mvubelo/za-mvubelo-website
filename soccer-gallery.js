(()=>{'use strict';
const gallery=document.getElementById('soccer-photos');if(!gallery)return;
const images=[
{src:'/soccer-season/cast.jpg',label:'Soccer Season · Cast moment'},
{src:'/soccer-season/muzi.jpg',label:'Muzi · On location'},
{src:'/soccer-season/filming.jpg',label:'Cameras rolling · Football field'},
{src:'/soccer-season/locker.jpg',label:'Soccer Season · Locker-room scene'}
];
const el=(tag,cls,txt)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(txt!==undefined)n.textContent=txt;return n};
const overlay=el('div','soccer-lightbox');overlay.hidden=true;overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-label','Soccer Season photo gallery');
const panel=el('div','soccer-lightbox-panel');const bar=el('div','soccer-lightbox-header');const heading=el('span','', 'SOCCER SEASON · PRODUCTION STILLS');const close=el('button','soccer-close','CLOSE ✕');close.type='button';bar.append(heading,close);
const viewer=el('div','soccer-lightbox-viewer');const img=el('img','soccer-large-image');img.alt='';img.decoding='async';viewer.append(img);
const foot=el('div','soccer-lightbox-footer');const prev=el('button','','← PREVIOUS');const caption=el('span');const next=el('button','','NEXT →');for(const btn of [prev,next])btn.type='button';foot.append(prev,caption,next);panel.append(bar,viewer,foot);overlay.append(panel);document.body.append(overlay);
let current=0,focusBefore=null;
function display(i){current=(i+images.length)%images.length;img.src=images[current].src;img.alt=images[current].label;caption.textContent=(current+1)+' / '+images.length+' · '+images[current].label}
function open(i,btn){focusBefore=btn;display(i);overlay.hidden=false;document.body.classList.add('no-scroll');close.focus()}
function hide(){overlay.hidden=true;document.body.classList.remove('no-scroll');img.removeAttribute('src');if(focusBefore)focusBefore.focus()}
gallery.querySelectorAll('[data-soccer-index]').forEach(btn=>btn.addEventListener('click',()=>open(Number(btn.dataset.soccerIndex)||0,btn)));
close.addEventListener('click',hide);prev.addEventListener('click',()=>display(current-1));next.addEventListener('click',()=>display(current+1));overlay.addEventListener('click',e=>{if(e.target===overlay)hide()});
document.addEventListener('keydown',e=>{if(overlay.hidden)return;if(e.key==='Escape'){e.preventDefault();hide()}if(e.key==='ArrowLeft'){e.preventDefault();display(current-1)}if(e.key==='ArrowRight'){e.preventDefault();display(current+1)}if(e.key==='Tab'){const seq=[close,prev,next],idx=seq.indexOf(document.activeElement);if(e.shiftKey&&idx===0){next.focus();e.preventDefault()}else if(!e.shiftKey&&idx===2){close.focus();e.preventDefault()}}});
})();
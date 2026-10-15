/* ZA Mvubelo public media catalogue: structured metadata, no privileged credentials. */
(()=>{'use strict';
const $=s=>document.querySelector(s);
const E=(tag,cls,txt)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(txt!==undefined)el.textContent=txt;return el};
function videoId(raw){try{const u=new URL(raw,'https://www.youtube.com');if(u.hostname==='youtu.be')return /^[\w-]{11}$/.test(u.pathname.slice(1))?u.pathname.slice(1):null;if(!['youtube.com','www.youtube.com','m.youtube.com','youtube-nocookie.com','www.youtube-nocookie.com'].includes(u.hostname))return null;let id=u.searchParams.get('v')||u.pathname.match(/\/(?:shorts|embed|live)\/([\w-]{11})/)?.[1];return id&&/^[\w-]{11}$/.test(id)?id:null}catch(e){return null}}
function validFile(url){if(!url)return null;try{let u=new URL(url,location.href);if(u.protocol!=='https:'||!/\.(mp4|webm|ogg)(?:$|\?)/i.test(u.pathname+u.search))return null;return u.href}catch(e){return null}}
function labelCat(categories,id){return categories.find(x=>x.id===id)?.label||'Channel video'}
function videoCard(item,categories){const article=E('article','catalogue-card');const player=E('div','catalogue-player');const kind=E('span','catalogue-type',labelCat(categories,item.category));const name=E('h3','',item.title||'Untitled video');const desc=E('p','',item.subtitle||'');const body=E('div','catalogue-body');body.append(kind,name,desc);article.append(player,body);
if(item.type==='youtube'){const id=videoId(item.url);if(!id)return null;const button=E('button','catalogue-trigger','▶');button.type='button';button.setAttribute('aria-label','Play '+name.textContent);button.style.backgroundImage='linear-gradient(0deg, #0b0d0ca0, #0b0d0c44),url("https://i.ytimg.com/vi/'+id+'/hqdefault.jpg")';button.onclick=()=>{const frame=E('iframe');frame.src='https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&rel=0';frame.title=item.title||'YouTube video';frame.allow='accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture;web-share';frame.referrerPolicy='strict-origin-when-cross-origin';frame.allowFullscreen=true;player.replaceChildren(frame)};player.append(button);const fallback=E('a','catalogue-direct','OPEN DIRECTLY ON YOUTUBE ↗');fallback.href='https://www.youtube.com/watch?v='+id;fallback.target='_blank';fallback.rel='noopener noreferrer';body.append(fallback)}
else if(item.type==='file'){const url=validFile(item.url);if(!url)return null;const v=E('video');v.controls=true;v.preload='none';v.playsInline=true;if(item.thumbnail&&item.thumbnail.startsWith('/'))v.poster=item.thumbnail;v.src=url;player.append(v)}
else return null;return article}
function init(data){
const categories=Array.isArray(data.videoCategories)?data.videoCategories:[];
const videos=(Array.isArray(data.videos)?data.videos:[]).filter(x=>x.visible&&((x.type==='youtube'&&videoId(x.url))||(x.type==='file'&&validFile(x.url))));
const library=$('.youtube-grid');if(!library)return;
const bar=E('div','catalogue-filters');bar.setAttribute('role','group');bar.setAttribute('aria-label','Filter portfolio video clips by category');
const buttons=[{id:'all',label:'All clips'},...categories];let selected='all';const note=E('p','catalogue-note');
function draw(){library.replaceChildren();let list=videos.filter(x=>selected==='all'||x.category===selected);list.forEach(item=>{const c=videoCard(item,categories);if(c)library.append(c)});if(!list.length){const p=E('div','catalogue-empty','No publicly cleared video has been assigned to this category yet. You can still explore the official channel below.');library.append(p)}note.textContent=list.length+' playable '+(list.length===1?'recording':'recordings')+' in '+(selected==='all'?'the portfolio':labelCat(categories,selected))+'.';bar.querySelectorAll('button').forEach(b=>{b.classList.toggle('selected',b.dataset.filter===selected);b.setAttribute('aria-pressed',String(b.dataset.filter===selected))})}
buttons.forEach(item=>{const btn=E('button','catalogue-filter',item.label);btn.type='button';btn.dataset.filter=item.id;btn.setAttribute('aria-pressed',String(item.id===selected));btn.onclick=()=>{selected=item.id;draw()};bar.append(btn)});
library.parentNode.insertBefore(bar,library);library.insertAdjacentElement('afterend',note);draw();
const projects=Array.isArray(data.featuredProjects)?data.featuredProjects:[];const mapped=new Map(videos.map(x=>[x.id,x]));
function projectMedia(project,slot,context){if(!slot)return;const vid=mapped.get(project.videoId);if(!vid)return;const video=videoCard(vid,categories);if(!video)return;const wrap=E('div','assigned-media');const heading=E('span','eyebrow',context);wrap.append(heading,video);slot.append(wrap)}
const filmSlot=$('.film-top');projectMedia(projects.find(x=>x.id==='soccer-season')||{},filmSlot,'MUZI · FILM CLIP');
projectMedia(projects.find(x=>x.id==='adobe')||{},filmSlot,'ADOBE · COMMERCIAL CLIP');
const improv=$('.improv-media');videos.filter(x=>x.category==='improv').forEach(x=>{const card=videoCard(x,categories);if(card)improv?.append(card)});
const artisan=projects.find(x=>x.id==='artisan');projectMedia(artisan||{},$('.artisan-voice'),'ARTISAN OF DRAMA · PERFORMANCE');
const salesman=projects.find(x=>x.id==='salesman');projectMedia(salesman||{},$('.tapes-flex'),'DEATH OF A SALESMAN · MONOLOGUE');
const phone=data.profile?.phone;if(phone){const target=$('.contact-list a[href^="tel:"]');if(target){const clean=phone.replace(/[^\d+]/g,'');target.href='tel:'+clean;const label=target.querySelector('strong');if(label)label.textContent=phone}}
const personal=data.profile?.email?.trim();if(personal && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personal)){const contact=$('.contact-list');if(contact){const link=E('a');link.href='mailto:'+personal;const lbl=E('small','', 'PERSONAL EMAIL');const strong=E('strong','',personal);const arrow=E('span','','↗');link.append(lbl,strong,arrow);contact.insertBefore(link,contact.firstChild)}}}
const instagram=data.profile?.instagram?.trim();const existing=$('.contact-list a[href*="instagram.com"]');if(existing){if(instagram&&/^https:\/\/(www\.)?instagram\.com\/[A-Za-z0-9_.]+\/?$/.test(instagram)){existing.href=instagram;existing.querySelector('strong').textContent='@'+instagram.replace(/\/$/,'').split('/').pop()}else existing.remove()}
}
fetch('/site-content.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('media catalogue unavailable');return r.json()}).then(init).catch(err=>{console.warn('Static gallery remains available:',err.message)});
})();

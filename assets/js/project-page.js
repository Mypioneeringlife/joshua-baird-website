(() => {
  const root = document.querySelector('[data-project-key]');
  if (!root || !window.PROJECT_CONTENT) return;
  const key = root.dataset.projectKey;
  const project = window.PROJECT_CONTENT.projects?.[key];
  if (!project) return;

  document.body.classList.add(`project-theme-${project.theme || 'default'}`);
  const setText = (sel, val) => { const el=document.querySelector(sel); if(el && val!=null) el.textContent=val; };
  setText('[data-project-eyebrow]', project.eyebrow);
  setText('[data-project-name]', project.name);
  setText('[data-project-tagline]', project.tagline);
  setText('[data-project-intro]', project.intro);

  const logo=document.querySelector('[data-project-logo]');
  if(logo){ logo.src=project.logo; logo.alt=`${project.name} logo`; }
  const channelLinks=document.querySelectorAll('[data-project-channel]');
  channelLinks.forEach(a=>{a.href=project.channelUrl;});
  const siteLink=document.querySelector('[data-project-site]');
  if(siteLink){
    if(project.siteUrl){siteLink.href=project.siteUrl;siteLink.hidden=false;} else siteLink.hidden=true;
  }

  const story=document.querySelector('[data-project-story]');
  if(story){
    story.replaceChildren(...(project.story||[]).map((p,i)=>{
      const wrap=document.createElement('div'); wrap.className='project-story-block reveal';
      const n=document.createElement('span'); n.className='project-story-num'; n.textContent=String(i+1).padStart(2,'0');
      const t=document.createElement('p'); t.textContent=p;
      wrap.append(n,t); return wrap;
    }));
  }

  const focus=document.querySelector('[data-project-focus]');
  if(focus){
    focus.replaceChildren(...(project.focus||[]).map(v=>{const s=document.createElement('span');s.textContent=v;return s;}));
  }

  const videos=document.querySelector('[data-project-videos]');
  const empty=document.querySelector('[data-project-empty]');
  const count=document.querySelector('[data-project-video-count]');
  if(count) count.textContent = (project.videos?.length || 0) ? `${project.videos.length} recent video${project.videos.length===1?'':'s'}` : 'Video archive ready';
  if(videos){
    videos.replaceChildren();
    const list=project.videos||[];
    if(!list.length){ if(empty) empty.hidden=false; }
    else {
      if(empty) empty.hidden=true;
      for(const v of list){
        const card=document.createElement('article'); card.className='project-video-card reveal';
        const media=document.createElement('a'); media.className='project-video-thumb'; media.href=v.url; media.target='_blank'; media.rel='noopener';
        const img=document.createElement('img'); img.src=v.thumbnail; img.alt=v.title; img.loading='lazy'; media.append(img);
        const copy=document.createElement('div'); copy.className='project-video-copy';
        const meta=document.createElement('div'); meta.className='project-video-meta'; meta.textContent=formatDate(v.publishedAt);
        const title=document.createElement('h3'); title.textContent=v.title;
        const excerpt=document.createElement('p'); excerpt.className='project-video-description'; excerpt.textContent=firstParagraphs(v.description,2);
        const details=document.createElement('details'); details.className='project-video-details';
        const summary=document.createElement('summary'); summary.textContent='Full YouTube description';
        const full=document.createElement('div'); full.className='project-video-full';
        for(const para of String(v.description||'').split(/\n\s*\n/).filter(Boolean)){
          const p=document.createElement('p'); p.textContent=para; full.append(p);
        }
        details.append(summary,full);
        const watch=document.createElement('a'); watch.className='project-watch-link'; watch.href=v.url; watch.target='_blank'; watch.rel='noopener'; watch.textContent='Watch on YouTube →';
        copy.append(meta,title,excerpt,details,watch);
        card.append(media,copy); videos.append(card);
      }
    }
  }

  const updated=document.querySelector('[data-project-updated]');
  if(updated && window.PROJECT_CONTENT.updatedAt){updated.textContent=`Content checked ${formatDate(window.PROJECT_CONTENT.updatedAt)}`;}

  function formatDate(s){
    if(!s) return '';
    try{return new Intl.DateTimeFormat('en-US',{year:'numeric',month:'long',day:'numeric'}).format(new Date(s));}catch{return s;}
  }
  function firstParagraphs(text,n){
    return String(text||'').split(/\n\s*\n/).filter(Boolean).slice(0,n).join(' ');
  }
})();

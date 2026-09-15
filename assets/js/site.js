
document.addEventListener('DOMContentLoaded',()=>{
  const btn=document.querySelector('.menu-btn'), links=document.querySelector('.nav-links');
  if(btn&&links){btn.addEventListener('click',()=>links.classList.toggle('mobile-open'));}
  const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.08});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

  loadLiveContent();
  loadMilestones();
  loadRecipePage();
  loadArticlePage();
  setupArchiveSearch();
});

async function getJSON(path){const r=await fetch(path,{cache:'no-store'}); if(!r.ok) throw new Error(path); return r.json();}

async function loadLiveContent(){
  try{
    const d=window.LIVE_CONTENT || await getJSON('data/live-content.json');
    for(const key of ['mypioneeringlife','corruptedchronicle']){
      const v=d.youtube?.[key]?.latest; if(!v) continue;
      document.querySelectorAll(`[data-live-video-title="${key}"]`).forEach(el=>el.textContent=v.title);
      document.querySelectorAll(`[data-live-video-thumb="${key}"]`).forEach(el=>{el.src=v.thumbnail;el.alt=v.title});
      document.querySelectorAll(`[data-live-video-card="${key}"]`).forEach(el=>el.href=v.url);
    }
    for(const key of ['blog','substack']){
      const item=d[key]; if(!item) continue;
      document.querySelectorAll(`[data-live-image="${key}"]`).forEach(el=>{if(item.image) el.src=item.image});
      document.querySelectorAll(`[data-live-title="${key}"]`).forEach(el=>{if(item.latestTitle) el.textContent=item.latestTitle});
      document.querySelectorAll(`[data-live-link="${key}"]`).forEach(el=>{if(item.url) el.href=item.url});
    }
  }catch(e){console.info('Live content fallback in use.');}
}

async function loadMilestones(){
  const host=document.querySelector('[data-milestones]'); if(!host) return;
  try{
    const d=window.MILESTONES_DATA || await getJSON('data/milestones.json');
    host.innerHTML=(d.milestones||[]).map((m,i)=>`<article class="timeline-card ${m.image?'has-image':'text-only'}">${m.image?`<img src="${m.image}" alt="${escapeHtml(m.title)}">`:`<div class="timeline-number">${String(i+1).padStart(2,'0')}</div>`}<div class="timeline-card-copy"><span>${escapeHtml(m.date)}</span><h3>${escapeHtml(m.title)}</h3><p>${escapeHtml(m.text)}</p></div></article>`).join('');
  }catch(e){}
}

async function loadRecipePage(){
  const host=document.querySelector('[data-recipe-page]'); if(!host) return;
  let key=new URLSearchParams(location.search).get('drink')||'negroni';
  if(key==='breakdown') key='peach-basil';
  try{
    const d=window.RECIPES_DATA || await getJSON('data/recipes.json'); const r=d.recipes?.[key];
    if(!r){document.querySelector('[data-recipe-name]').textContent='Recipe not found'; return;}
    document.title=`${r.name} — Joshua Baird`;
    q('[data-recipe-name]').textContent=r.name; q('[data-recipe-type]').textContent=r.type;
    q('[data-recipe-story]').textContent=r.deck||r.story||''; q('[data-recipe-method]').textContent=r.method;
    q('[data-recipe-image]').src=r.image; q('[data-recipe-image]').alt=r.name;
    q('[data-recipe-ingredients]').innerHTML=(r.ingredients||[]).map(x=>`<li>${escapeHtml(x)}</li>`).join('');
    const article=q('[data-recipe-article]');
    if(article){article.innerHTML=(r.sections||[]).map((section,i)=>`<article class="recipe-story-section ${i%2?'story-shift':''}"><div class="recipe-story-number">${String(i+1).padStart(2,'0')}</div><div><h2>${escapeHtml(section.title)}</h2>${(section.body||[]).map(p=>`<p>${escapeHtml(p)}</p>`).join('')}</div></article>`).join('');}
    const status=q('[data-recipe-status]');
    const labels={
      'verified-classic':'Classic spec shown. The story and photograph are Joshua’s.',
      'verified-original':'Original Barman’s Covenant specification recovered.',
      'archive-confirmed-partial':'Original archive confirms the concept and key ingredients; some measurements remain to be recovered.',
      'original-spec-partial':'Original cocktail. Confirmed ingredients shown; missing measurements are intentionally not invented.',
      'awaiting-original':'Original recipe pending Joshua’s archived spec.',
      'archive-link':'Original recipe is being restored from the Barman’s Covenant archive.'
    };
    status.textContent=labels[r.status]||'Archive recipe.';
    const archive=q('[data-recipe-archive]');
    if(archive && (r.archiveNote||r.archiveImage||r.archiveDate)){
      archive.hidden=false;
      const at=q('[data-recipe-archive-title]'); if(at) at.textContent=r.archiveTitle||'From the archive';
      const ad=q('[data-recipe-archive-date]'); if(ad) ad.textContent=r.archiveDate||'';
      const an=q('[data-recipe-archive-note]'); if(an) an.textContent=r.archiveNote||'';
      const fig=q('[data-recipe-archive-figure]'); const ai=q('[data-recipe-archive-image]');
      if(r.archiveImage && fig && ai){fig.hidden=false; ai.src=r.archiveImage; ai.alt=(r.name||'Drink')+' archive presentation';}
    }
  }catch(e){}
}

async function loadArticlePage(){
  const host=document.querySelector('[data-article-page]'); if(!host) return;
  const id=new URLSearchParams(location.search).get('id');
  try{
    const d=window.JOURNALISM_DATA || await getJSON('data/journalism.json'); const a=(d.articles||[]).find(x=>x.id===id);
    if(!a){q('[data-article-title]').textContent='Article not found'; return;}
    document.title=`${a.title} — The Baird Archive`;
    q('[data-article-title]').textContent=a.title; q('[data-article-category]').textContent=a.category;
    q('[data-article-date]').textContent=a.date; q('[data-article-summary]').textContent=a.summary;
    const author=q('[data-article-author]'); if(author) author.textContent='By '+((a.authors||['Joshua Baird']).join(' & '));
    const body=q('[data-article-body]');
    if(body){
      const raw=(a.rawText||'').trim();
      if(raw){body.innerHTML=`<p>${escapeHtml(raw).replace(/\r?\n/g,'<br>')}</p>`;}
      else{body.innerHTML='<p>The archive transcription for this clipping is not yet complete. The original scan below remains the primary source.</p>';}
    }
    const backup=q('[data-article-text-backup]'); if(backup) backup.href=a.textBackup||'#';
    for(const sel of ['[data-article-image]','[data-article-source-image]']){q(sel).src=a.image;q(sel).alt=a.title;}
    q('[data-article-source-link]').href=a.image;
    q('[data-article-image]').addEventListener('click',()=>window.open(a.image,'_blank'));
  }catch(e){}
}

function setupArchiveSearch(){
  const input=q('[data-archive-search]'); if(!input) return;
  const cards=[...document.querySelectorAll('.clip-sheet')];
  const count=q('[data-archive-count]');
  const update=()=>{
    const needle=input.value.trim().toLowerCase(); let shown=0;
    cards.forEach(card=>{
      const hay=(card.textContent+' '+(card.dataset.search||'')).toLowerCase();
      const match=!needle||hay.includes(needle); card.hidden=!match; if(match) shown++;
    });
    if(count) count.textContent=`${shown} ${shown===1?'story':'stories'}`;
  };
  input.addEventListener('input',update); update();
}

function q(s){return document.querySelector(s)}
function escapeHtml(s=''){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}

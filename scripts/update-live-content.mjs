import fs from 'node:fs/promises';

const FILE=new URL('../data/live-content.json',import.meta.url);
const JSFILE=new URL('../data/live-content.js',import.meta.url);
const current=JSON.parse(await fs.readFile(FILE,'utf8'));
const PROJECT_FILE=new URL('../data/project-content.json',import.meta.url);
const PROJECT_JSFILE=new URL('../data/project-content.js',import.meta.url);
const projects=JSON.parse(await fs.readFile(PROJECT_FILE,'utf8'));

async function latestYouTube(channelId){
  const url=`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
  const xml=await (await fetch(url,{headers:{'user-agent':'Mozilla/5.0'}})).text();
  const entry=(xml.match(/<entry>[\s\S]*?<\/entry>/)||[])[0]; if(!entry) throw new Error('No YouTube entry');
  const videoId=(entry.match(/<yt:videoId>(.*?)<\/yt:videoId>/)||[])[1];
  const title=decode((entry.match(/<title>([\s\S]*?)<\/title>/)||[])[1]||'');
  const publishedAt=(entry.match(/<published>(.*?)<\/published>/)||[])[1]||'';
  return {videoId,title,publishedAt,url:`https://www.youtube.com/watch?v=${videoId}`,thumbnail:`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`};
}

async function recentYouTube(channelId,limit=6){
  const url=`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
  const res=await fetch(url,{headers:{'user-agent':'Mozilla/5.0'}});
  if(!res.ok) throw new Error(`YouTube feed ${res.status}`);
  const xml=await res.text();
  const entries=xml.match(/<entry>[\s\S]*?<\/entry>/g)||[];
  return entries.slice(0,limit).map(entry=>{
    const videoId=text(entry,'yt:videoId');
    const title=decode(text(entry,'title'));
    const publishedAt=text(entry,'published');
    const desc=decode(text(entry,'media:description'));
    const thumb=(entry.match(/<media:thumbnail\s+url=["']([^"']+)["']/i)||[])[1]||`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
    return {videoId,title,publishedAt,thumbnail:decode(thumb),url:`https://www.youtube.com/watch?v=${videoId}`,description:desc};
  }).filter(v=>v.videoId);
}
function text(xml,tag){
  const safe=tag.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  const m=xml.match(new RegExp(`<${safe}[^>]*>([\\s\\S]*?)<\\/${safe}>`,'i'));
  return m ? m[1].replace(/^<!\[CDATA\[/,'').replace(/\]\]>$/,'').trim() : '';
}

async function openGraph(url){
  const res=await fetch(url,{redirect:'follow',headers:{'user-agent':'Mozilla/5.0'}});
  const text=await res.text();
  const image=meta(text,'property','og:image')||meta(text,'name','twitter:image');
  const title=meta(text,'property','og:title')||titleTag(text);
  return {url:res.url||url,image,title};
}
function meta(t,attr,key){
  const tags=t.match(/<meta\b[^>]*>/gi)||[];
  for(const tag of tags){
    if(new RegExp(`${attr}=["']${escapeRe(key)}["']`,'i').test(tag)){
      const m=tag.match(/content=["']([^"']+)["']/i); if(m) return decode(m[1]);
    }
  } return '';
}
function titleTag(t){return decode(((t.match(/<title[^>]*>([\s\S]*?)<\/title>/i)||[])[1]||'').trim())}
function decode(s){return String(s||'').replace(/&amp;/g,'&').replace(/&quot;/g,'\"').replace(/&#39;|&apos;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(Number(n)))}
function escapeRe(s){return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}

for(const key of ['mypioneeringlife','corruptedchronicle']){
  try{current.youtube[key].latest=await latestYouTube(current.youtube[key].channelId)}catch(e){console.warn(key,e.message)}
}
try{
  const b=await openGraph('https://mypioneeringlife.com');
  current.blog={...current.blog,...b,latestTitle:b.title||current.blog.latestTitle};
}catch(e){console.warn('blog',e.message)}
try{
  const s=await openGraph('https://substack.com/@mypioneeringlife');
  current.substack={...current.substack,...s,latestTitle:s.title||current.substack.latestTitle};
}catch(e){console.warn('substack',e.message)}

for(const [key,project] of Object.entries(projects.projects||{})){
  if(!project.channelId) continue;
  try{project.videos=await recentYouTube(project.channelId,6)}
  catch(e){console.warn(`project:${key}`,e.message)}
}
projects.updatedAt=new Date().toISOString();
await fs.writeFile(PROJECT_FILE,JSON.stringify(projects,null,2)+'\n');
await fs.writeFile(PROJECT_JSFILE,'window.PROJECT_CONTENT = '+JSON.stringify(projects,null,2)+';\n');

current.updatedAt=new Date().toISOString();
await fs.writeFile(FILE,JSON.stringify(current,null,2)+'\n');
await fs.writeFile(JSFILE,'window.LIVE_CONTENT = '+JSON.stringify(current,null,2)+';\n');
console.log('Updated',current.updatedAt);

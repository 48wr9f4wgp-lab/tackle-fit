// COMBAT HUB — GitHub Standalone / Personal
// Scriptable 1本で UFC / RIZIN / ONE / BOXING / K-1 を表示
// Home Screen Widget Parameter: UFC / RIZIN / ONE / BOXING / K1
// v7.0.0-github — unified visual pass + live-first auto update / no Vercel

(async()=>{
const VERSION='7.0.0-github';
const MODE_MAP={UFC:'ufc',RIZIN:'rizin',ONE:'one',BOXING:'boxing',K1:'k1'};
const LABELS=['UFC','RIZIN','ONE','BOXING','K-1'];
const PARAMS=['UFC','RIZIN','ONE','BOXING','K1'];
const norm=v=>String(v||'').trim().toUpperCase().replace(/[\s_-]+/g,'');
let MODE=norm(args.widgetParameter);
if(!MODE_MAP[MODE]&&!config.runsInWidget){const a=new Alert();a.title='COMBAT HUB';a.message='プレビューする団体';LABELS.forEach(x=>a.addAction(x));a.addCancelAction('キャンセル');const i=await a.presentSheet();if(i<0){Script.complete();return;}MODE=PARAMS[i];}
if(!MODE_MAP[MODE])MODE='UFC';
const KEY=MODE_MAP[MODE];

const SERIES={
 ufc:{label:'UFC',accent:'#F23B35',listing:'https://jp.ufc.com/events',detail:/\/event\//i},
 rizin:{label:'RIZIN',accent:'#5CE68A',listing:'https://jp.rizinff.com/',detail:/(?:\/_ct\/|\/_tags\/)/i},
 one:{label:'ONE',accent:'#F4D54A',listing:'https://www.onefc.com/jp/events/',detail:/\/events\//i},
 boxing:{label:'BOXING',accent:'#4BA3FF',listing:'https://www.ringmagazine.com/events',detail:/(?:\/events\/|\/news\/)/i},
 k1:{label:'K-1',accent:'#FF8C3A',listing:'https://www.k-1.co.jp/schedule',detail:/\/schedule\/\d+/i}
};
const S=SERIES[KEY], C={text:'#F7F8FA',sub:'#CDD2D9',muted:'#8B929D'};

const VISUAL={
 ufc:{heroShade:.69,posterShade:.60,headerShade:.18,mainShade:.17,footShade:.25,veil:.018,gap:17,mainSize:11.7,division:7.3},
 rizin:{heroShade:.72,posterShade:.62,headerShade:.20,mainShade:.19,footShade:.28,veil:.018,gap:17,mainSize:11.4,division:7.2},
 one:{heroShade:.70,posterShade:.46,headerShade:.24,mainShade:.23,footShade:.27,veil:.030,gap:19,mainSize:11.7,division:7.3},
 boxing:{heroShade:.70,posterShade:.54,headerShade:.26,mainShade:.28,footShade:.34,veil:.020,gap:18,mainSize:11.8,division:7.2},
 k1:{heroShade:.72,posterShade:.39,headerShade:.31,mainShade:.27,footShade:.34,veil:.060,gap:18,mainSize:11.9,division:7.3}
};
const V=VISUAL[KEY];

const SNAPSHOT={
 ufc:{startAt:'2026-08-29T10:00:00.000Z',location:'上海',name:'UFC Shanghai',main:{a:'NURMAGOMEDOV',b:'SONG',context:'BANTAMWEIGHT'},support:[{label:'CO-MAIN',a:'ヤン・シャオナン',b:'デニージ・ゴミス'},{label:'FEATURED',a:'アオリ・チロン',b:'朝倉 海'}],source:'https://jp.ufc.com/event/ufc-fight-night-august-29-2026'},
 rizin:{startAt:'2026-09-10T16:00:00+09:00',location:'大阪',name:'超RIZIN.5',main:{a:'ラジャブアリ・シェイドゥラエフ',b:'AJ・マッキー',context:'フェザー級タイトル戦'},support:[{label:'CO-MAIN',a:'朝倉未来',b:'青木真也'},{label:'FEATURED',a:'ホベルト・サトシ・ソウザ',b:'野村駿太'}],source:'https://jp.rizinff.com/_tags/%E8%B6%85RIZIN5'},
 one:{startAt:'2026-08-28T20:30:00+09:00',location:'バンコク',name:'ONE Friday Fights 168',cardTba:true,main:{a:'対戦カード',b:'発表待ち',context:'ONE Friday Fights 168'},support:[],source:'https://www.onefc.com/jp/events/one-friday-fights-168/'},
 boxing:{startAt:'2026-09-12T12:00:00-07:00',displayDate:'9/12 (土)',location:'ラスベガス',name:'Garcia vs Benn',timeTba:true,main:{a:'ライアン・ガルシア',b:'コナー・ベン',context:'WBC ウェルター級タイトル戦'},support:[],source:'https://www.ringmagazine.com/news/ryan-garcia-vs-conor-benn-set-for-sept-12-in-las-vegas-2lAAiNVusWH1ZYNPUFQdQo'},
 k1:{startAt:'2026-09-12T12:00:00+09:00',location:'東京・代々木第二',name:'K-1 WORLD MAX 2026',main:{a:'金子晃大',b:'璃明武',context:'スーパー・バンタム級タイトル戦'},support:[{label:'TITLE FIGHT',a:'朝久泰央',b:'アラッサン・カマラ'},{label:'TITLE FIGHT',a:'里見柚己',b:'永澤サムエル聖光'}],source:'https://www.k-1.co.jp/schedule/16669'}
};

const fm=FileManager.local(),DOC=fm.documentsDirectory();
function fnt(z,w='regular'){if(w==='black'&&Font.blackSystemFont)return Font.blackSystemFont(z);if(w==='bold')return Font.boldSystemFont(z);if(w==='semibold')return Font.semiboldSystemFont(z);return Font.systemFont(z);}
function tx(st,s,z,c,w='regular',n=1){const t=st.addText(String(s??''));t.font=fnt(z,w);t.textColor=c;t.lineLimit=n;t.minimumScaleFactor=.42;return t;}
function divider(st){const d=st.addStack();d.size=new Size(0,1);d.backgroundColor=new Color('#FFFFFF',.075);}
function stripHTML(s){return String(s||'').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,' ').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/&nbsp;/gi,' ').replace(/&amp;/gi,'&').replace(/&quot;/gi,'"').replace(/&#39;/gi,"'").replace(/\s+/g,' ').trim();}
function safeKey(s){let h=2166136261;for(const ch of String(s||'')){h^=ch.charCodeAt(0);h=Math.imul(h,16777619);}return(h>>>0).toString(16);}
function absoluteURL(url,base){if(!url)return null;if(/^https?:\/\//i.test(url))return url;if(url.startsWith('//'))return'https:'+url;const m=String(base||'').match(/^(https?:\/\/[^/]+)/i);return(m?m[1]:'')+(url.startsWith('/')?url:'/'+url);}
async function reqText(url,timeout=10){const r=new Request(url);r.timeoutInterval=timeout;r.headers={'User-Agent':'Mozilla/5.0','Cache-Control':'no-cache'};return await r.loadString();}
function metaImage(html,base){for(const tag of html.match(/<meta\b[^>]*>/gi)||[]){if(!/property=["']og:image["']/i.test(tag)&&!/name=["']twitter:image["']/i.test(tag))continue;const m=tag.match(/content=["']([^"']+)["']/i);if(m)return absoluteURL(m[1].replace(/&amp;/g,'&'),base);}return null;}
function attr(tag,name){const m=tag.match(new RegExp(`${name}=["']([^"']+)["']`,'i'));return m?m[1].replace(/&amp;/g,'&'):null;}
function cacheFile(name){return fm.joinPath(DOC,name);}
function readJSON(path){try{return fm.fileExists(path)?JSON.parse(fm.readString(path)):null;}catch(_){return null;}}
function writeJSON(path,v){try{fm.writeString(path,JSON.stringify(v));}catch(_){}}
async function cachedImage(url,ns='auto'){if(!url)return null;const path=cacheFile(`combat-${ns}-${safeKey(url)}.jpg`);if(fm.fileExists(path)){try{return fm.readImage(path);}catch(_){}}try{const r=new Request(url);r.timeoutInterval=10;r.headers={'User-Agent':'Mozilla/5.0'};const img=await r.loadImage();fm.writeImage(path,img);return img;}catch(_){return null;}}

function jsonLdEvents(html,base){const out=[];for(const m of html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)){try{const root=JSON.parse(m[1]);const stack=Array.isArray(root)?[...root]:[root];while(stack.length){const x=stack.pop();if(!x||typeof x!=='object')continue;if(Array.isArray(x)){stack.push(...x);continue;}if(x['@graph'])stack.push(x['@graph']);const type=Array.isArray(x['@type'])?x['@type'].join(' '):String(x['@type']||'');if(/Event/i.test(type)&&x.startDate)out.push({name:String(x.name||''),startAt:String(x.startDate),location:ldLocation(x.location),source:absoluteURL(x.url||base,base)});}}catch(_){}}return out;}
function ldLocation(v){if(!v)return'';if(typeof v==='string')return v;if(Array.isArray(v))return v.map(ldLocation).filter(Boolean).join(' · ');const a=v.address||{};return [v.name,a.addressLocality,a.addressRegion,a.addressCountry].filter(Boolean).join(' · ');}
function dateFromHTML(html){let m=html.match(/<time[^>]+datetime=["']([^"']+)["']/i);if(m)return m[1];m=html.match(/(?:startDate|datePublished)["']?\s*[:=]\s*["'](20\d\d-[^"']+)["']/i);if(m)return m[1];m=stripHTML(html).match(/(20\d{2})年\s*(\d{1,2})月\s*(\d{1,2})日/);if(m)return`${m[1]}-${m[2].padStart(2,'0')}-${m[3].padStart(2,'0')}T12:00:00+09:00`;return null;}
function links(html,base,re){const out=[],seen=new Set();for(const m of html.matchAll(/href=["']([^"'#]+)["']/gi)){const u=absoluteURL(m[1],base);if(!u||seen.has(u)||!re.test(u))continue;seen.add(u);out.push(u);}return out;}
function cleanName(s){return stripHTML(s).replace(/^(?:MAIN EVENT|CO-?MAIN|FEATURED|TITLE FIGHT)\s*/i,'').replace(/\s+/g,' ').trim();}
function splitFight(s){const t=cleanName(s);const m=t.match(/^(.{2,48}?)\s+(?:vs\.?|VS|対)\s+(.{2,48})$/i);return m?{a:cleanName(m[1]),b:cleanName(m[2])}:null;}
function fightPairs(html){const out=[],seen=new Set();for(const m of html.matchAll(/<h[1-4][^>]*>([\s\S]*?)<\/h[1-4]>/gi)){const p=splitFight(m[1]);if(p){const k=p.a+'|'+p.b;if(!seen.has(k)){seen.add(k);out.push(p);}}}if(!out.length){const title=(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)||[])[1];const p=splitFight(title||'');if(p)out.push(p);}return out.slice(0,6);}
function titleText(html){return cleanName((html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)||[])[1]||(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)||[])[1]||'');}
function shortLoc(s){const v=String(s||'');if(/Shanghai|Pudong|China|上海/i.test(v))return'上海';if(/Osaka|大阪/i.test(v))return'大阪';if(/Bangkok|Lumpinee|バンコク|ルンピニー/i.test(v))return'バンコク';if(/Las Vegas|ラスベガス/i.test(v))return'ラスベガス';if(/代々木|Yoyogi/i.test(v))return'東京・代々木第二';if(/Tokyo|東京/i.test(v))return'東京';return v.length>14?v.slice(0,13)+'…':v;}
function sameDay(a,b){const x=new Date(a),y=new Date(b);return Math.abs(x-y)<20*3600000;}
function eventScore(e){const t=new Date(e.startAt).getTime();if(!Number.isFinite(t))return 1e18;return t;}

async function discoverLive(){
 const snap=SNAPSHOT[KEY];
 try{
  const listing=await reqText(S.listing);
  let candidates=jsonLdEvents(listing,S.listing).map(x=>({...x,html:null}));
  const urls=links(listing,S.listing,S.detail).slice(0,10);
  for(const u of urls){try{const html=await reqText(u,8);const lds=jsonLdEvents(html,u);if(lds.length)candidates.push(...lds.map(x=>({...x,html,source:u})));else{const d=dateFromHTML(html);if(d)candidates.push({name:titleText(html),startAt:d,location:'',source:u,html});}}catch(_){}}
  const now=Date.now()-4*3600000;
  candidates=candidates.filter(e=>eventScore(e)>=now).sort((a,b)=>eventScore(a)-eventScore(b));
  if(!candidates.length)throw new Error('no future event');
  const ev=candidates[0];
  let html=ev.html; if(!html&&ev.source)try{html=await reqText(ev.source,8);}catch(_){}
  const pairs=html?fightPairs(html):[];
  const same=sameDay(ev.startAt,snap.startAt);
  let main,support,cardTba=false;
  if(pairs.length){main={a:pairs[0].a,b:pairs[0].b,context:same?snap.main.context:''};support=pairs.slice(1,3).map((p,i)=>({label:i?'FEATURED':'CO-MAIN',a:p.a,b:p.b}));}
  else if(same){main=snap.main;support=snap.support||[];cardTba=!!snap.cardTba;}
  else{main={a:'対戦カード',b:'発表待ち',context:ev.name||S.label};support=[];cardTba=true;}
  return {...snap,...ev,name:ev.name||snap.name,location:shortLoc(ev.location)||snap.location,source:ev.source||snap.source,main,support,cardTba,posterURL:html?metaImage(html,ev.source):null,live:true};
 }catch(_){return null;}
}

async function loadData(){
 const path=cacheFile(`combat-hub-live-${KEY}.json`),cached=readJSON(path),now=Date.now();
 const ttl=(cached?.data?.cardTba?2:6)*3600000;
 if(cached&&now-cached.savedAt<ttl)return cached.data;
 const live=await discoverLive();
 if(live){writeJSON(path,{savedAt:now,data:live});return live;}
 if(cached?.data)return {...cached.data,stale:true};
 return {...SNAPSHOT[KEY],fallback:true};
}

const KNOWN_UFC={NURMAGOMEDOV:'https://www.ufc.com/athlete/umar-nurmagomedov',SONG:'https://www.ufc.com/athlete/yadong-song'};
const KNOWN_RIZIN={'ラジャブアリ・シェイドゥラエフ':'https://jp.rizinff.com/_tags/%E3%83%A9%E3%82%B8%E3%83%A3%E3%83%96%E3%82%A2%E3%83%AA%E3%83%BB%E3%82%B7%E3%82%A7%E3%82%A4%E3%83%89%E3%82%A5%E3%83%A9%E3%82%A8%E3%83%95','AJ・マッキー':'https://jp.rizinff.com/_tags/AJ%E3%83%BB%E3%83%9E%E3%83%83%E3%82%AD%E3%83%BC'};
async function profileImage(url,name,kind){if(!url)return{name,image:null};let imgURL=null,jp=name;try{const h=await reqText(url,8);imgURL=kind==='rizin'?rizinImg(h,url,name):metaImage(h,url);if(kind==='ufc'){try{const j=await reqText(url.replace('https://www.ufc.com/','https://jp.ufc.com/'),8);const m=j.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);if(m)jp=stripHTML(m[1])||jp;}catch(_){}}}catch(_){}return{name:jp,image:await cachedImage(imgURL,kind)};}
function rizinImg(html,url,name){for(const tag of html.match(/<img\b[^>]*>/gi)||[]){const alt=stripHTML(attr(tag,'alt')||'');if(alt&&(alt.includes(name)||name.includes(alt))){const src=attr(tag,'data-src')||attr(tag,'data-original')||attr(tag,'src');if(src)return absoluteURL(src,url);}}return metaImage(html,url);}
async function athleteLinks(html,base,re){const out=[];for(const m of html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)){const href=(m[1].match(/href=["']([^"']+)["']/i)||[])[1];const label=cleanName(m[2]);if(!href||!label)continue;const u=absoluteURL(href,base);if(re.test(u)&&!out.some(x=>x.url===u))out.push({url:u,label});}return out;}
async function heroContext(D){
 if(KEY==='ufc'){
  let html='';try{html=await reqText(D.source,8);}catch(_){}
  const ath=await athleteLinks(html,D.source,/\/athlete\//i);
  const aURL=ath.find(x=>norm(x.label).includes(norm(D.main.a)))?.url||KNOWN_UFC[norm(D.main.a)]||KNOWN_UFC[D.main.a];
  const bURL=ath.find(x=>norm(x.label).includes(norm(D.main.b)))?.url||KNOWN_UFC[norm(D.main.b)]||KNOWN_UFC[D.main.b];
  return{a:await profileImage(aURL,D.main.a,'ufc'),b:await profileImage(bURL,D.main.b,'ufc'),poster:null};
 }
 if(KEY==='rizin'){
  let html='';try{html=await reqText(D.source,8);}catch(_){}
  const ath=await athleteLinks(html,D.source,/\/_tags\//i);
  const aURL=ath.find(x=>x.label.includes(D.main.a))?.url||KNOWN_RIZIN[D.main.a];
  const bURL=ath.find(x=>x.label.includes(D.main.b))?.url||KNOWN_RIZIN[D.main.b];
  return{a:await profileImage(aURL,D.main.a,'rizin'),b:await profileImage(bURL,D.main.b,'rizin'),poster:null};
 }
 let poster=null;try{poster=await cachedImage(D.posterURL||metaImage(await reqText(D.source,8),D.source),`${KEY}-event`);}catch(_){}
 return{a:{name:D.main.a,image:null},b:{name:D.main.b,image:null},poster};
}

function imageRect(image,x,width,side){if(!image?.size)return new Rect(x,0,width,338);const iw=image.size.width,ih=image.size.height,scale=Math.max(width/iw,338/ih),dw=iw*scale,dh=ih*scale,bias=side==='left'?.03:.97;return new Rect(x+(width-dw)*bias,(338-dh)/2-32,dw,dh);}
function heroBg(a,b){const c=new DrawContext();c.size=new Size(720,338);c.opaque=true;c.respectScreenScale=false;c.setFillColor(new Color('#040506'));c.fillRect(new Rect(0,0,720,338));if(a)c.drawImageInRect(a,imageRect(a,-5,360,'left'));if(b)c.drawImageInRect(b,imageRect(b,365,360,'right'));c.setFillColor(new Color('#000000',V.heroShade));c.fillRect(new Rect(0,0,720,338));c.setFillColor(new Color('#000000',V.headerShade));c.fillRect(new Rect(0,0,720,108));c.setFillColor(new Color('#000000',V.mainShade));c.fillRect(new Rect(0,105,720,120));c.setFillColor(new Color('#000000',V.footShade));c.fillRect(new Rect(0,224,720,114));c.setFillColor(new Color(S.accent,V.veil));c.fillRect(new Rect(350,0,20,338));return c.getImage();}
function posterBg(image){const c=new DrawContext();c.size=new Size(720,338);c.opaque=true;c.respectScreenScale=false;c.setFillColor(new Color('#050609'));c.fillRect(new Rect(0,0,720,338));if(image?.size){const iw=image.size.width,ih=image.size.height,scale=Math.max(720/iw,338/ih),dw=iw*scale,dh=ih*scale;c.drawImageInRect(image,new Rect((720-dw)/2,(338-dh)/2,dw,dh));}c.setFillColor(new Color('#000000',V.posterShade));c.fillRect(new Rect(0,0,720,338));c.setFillColor(new Color('#000000',V.headerShade));c.fillRect(new Rect(0,0,720,108));c.setFillColor(new Color('#000000',V.mainShade));c.fillRect(new Rect(0,105,720,120));c.setFillColor(new Color('#000000',V.footShade));c.fillRect(new Rect(0,224,720,114));c.setFillColor(new Color(S.accent,V.veil));c.fillRect(new Rect(0,0,720,338));return c.getImage();}
function gradient(){const g=new LinearGradient();g.startPoint=new Point(0,0);g.endPoint=new Point(1,1);g.colors=[new Color('#050609'),new Color(S.accent,.14)];g.locations=[0,1];return g;}
function dateOnly(d){const f=new DateFormatter();f.locale='ja_JP';f.timeZone='Asia/Tokyo';f.dateFormat='M/d (E)';return f.string(new Date(d));}
function dateText(D){if(D.timeTba)return`${D.displayDate||dateOnly(D.startAt)} ・ 時刻未定`;const f=new DateFormatter();f.locale='ja_JP';f.timeZone='Asia/Tokyo';f.dateFormat="M/d (E) HH:mm 'JST'";return f.string(new Date(D.startAt));}
function countdown(D){if(D.timeTba)return'時刻未定';const q=new Date(D.startAt)-Date.now();if(q<=0)return'開催中';const m=Math.floor(q/60000),days=Math.floor(m/1440),h=Math.floor((m%1440)/60),mm=m%60;if(days>0)return`${days}日 ${h}時間`;if(h>0)return`${h}時間 ${mm}分`;return`${mm}分`;}
function division(s){const v=String(s||'');if(/FEATHER|フェザー/i.test(v))return/タイトル|TITLE/i.test(v)?'フェザー級タイトル戦':'フェザー級';if(/BANTAM|バンタム/i.test(v))return/スーパー|SUPER/i.test(v)?'スーパー・バンタム級':'バンタム級';if(/STRAW|ストロー/i.test(v))return'ストロー級';if(/WELTER|ウェルター/i.test(v))return'ウェルター級';if(/LIGHT|ライト/i.test(v))return'ライト級';return v.length>25?v.slice(0,24)+'…':v;}
function supportRow(w,row){const s=w.addStack();s.centerAlignContent();const l=s.addStack();l.size=new Size(65,0);tx(l,row.label,7.1,new Color(S.accent),'bold');s.addSpacer(4);const a=s.addStack();a.size=new Size(116,0);tx(a,row.a,9.0,new Color(C.text),'semibold');s.addSpacer(4);tx(s,'VS',7.1,new Color(S.accent),'bold');s.addSpacer(4);const b=s.addStack();b.size=new Size(116,0);const bt=tx(b,row.b,9.0,new Color(C.text),'semibold');bt.rightAlignText();}

const D=await loadData(),ctx=await heroContext(D),w=new ListWidget();w.setPadding(10,14,8,14);
if(ctx.poster)w.backgroundImage=posterBg(ctx.poster);else if(ctx.a.image||ctx.b.image)w.backgroundImage=heroBg(ctx.a.image,ctx.b.image);else w.backgroundGradient=gradient();
const h=w.addStack();h.centerAlignContent();const hl=h.addStack();hl.layoutVertically();tx(hl,S.label,20,new Color(C.text),'black');hl.addSpacer(2);const meta=hl.addStack();tx(meta,dateText(D),8.1,new Color(C.sub),'semibold');meta.addSpacer(5);tx(meta,'·',7,new Color(C.muted));meta.addSpacer(5);tx(meta,shortLoc(D.location),8.1,new Color(C.sub),'semibold');h.addSpacer();const hr=h.addStack();hr.layoutVertically();const lab=hr.addStack();lab.addSpacer();tx(lab,D.timeTba?'開催':'開催まで',6.2,new Color(C.muted),'bold');hr.addSpacer(1);const cd=hr.addStack();cd.addSpacer();tx(cd,countdown(D),12.8,new Color(C.text),'black');

if(D.cardTba){
 w.addSpacer(19);const center=w.addStack();center.layoutVertically();const title=tx(center,'対戦カード発表待ち',14.0,new Color(C.text),'black');title.centerAlignText();center.addSpacer(5);const sub=tx(center,D.name||D.main.context,8.1,new Color(S.accent),'semibold');sub.centerAlignText();w.addSpacer(10);divider(w);w.addSpacer(7);const foot=w.addStack();foot.addSpacer();tx(foot,'公式更新を自動反映',6.8,new Color(C.muted),'semibold');foot.addSpacer();
}else{
 w.addSpacer(V.gap);const main=w.addStack();main.centerAlignContent();const aBox=main.addStack();aBox.layoutVertically();aBox.size=new Size(136,0);tx(aBox,ctx.a.name,V.mainSize,new Color(C.text),'black',2);main.addSpacer();const vsBox=main.addStack();vsBox.size=new Size(34,0);vsBox.centerAlignContent();const v=tx(vsBox,'VS',13.5,new Color(S.accent),'black');v.centerAlignText();main.addSpacer();const bBox=main.addStack();bBox.layoutVertically();bBox.size=new Size(136,0);const bn=tx(bBox,ctx.b.name,V.mainSize,new Color(C.text),'black',2);bn.rightAlignText();w.addSpacer(3);const dv=tx(w,division(D.main.context),V.division,new Color('#BBC2CB'),'semibold');dv.centerAlignText();w.addSpacer(5);divider(w);w.addSpacer(KEY==='boxing'?6:4);
 if(D.support?.length){D.support.slice(0,2).forEach((r,i)=>{supportRow(w,r);if(i<Math.min(2,D.support.length)-1)w.addSpacer(4);});}else{const empty=w.addStack();empty.addSpacer();tx(empty,KEY==='boxing'?'UNDERCARD 発表待ち':'追加カード発表待ち',6.8,new Color(C.muted),'semibold');empty.addSpacer();}
}
w.url=D.source||S.listing;w.refreshAfterDate=new Date(Date.now()+30*60*1000);
if(config.runsInWidget)Script.setWidget(w);else await w.presentMedium();
Script.complete();
})();

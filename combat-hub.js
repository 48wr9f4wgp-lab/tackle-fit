// COMBAT HUB — GitHub Standalone / Personal
// Scriptable 1本で UFC / RIZIN / ONE / BOXING / K-1 を表示
// Home Screen Widget Parameter: UFC / RIZIN / ONE / BOXING / K1
// v6.2.0-github — no Vercel dependency

(async () => {
const VERSION = '6.2.0-github';
const MODE_MAP = {UFC:'ufc',RIZIN:'rizin',ONE:'one',BOXING:'boxing',K1:'k1'};
const LABELS = ['UFC','RIZIN','ONE','BOXING','K-1'];
const PARAMS = ['UFC','RIZIN','ONE','BOXING','K1'];
const norm = v => String(v || '').trim().toUpperCase().replace(/[\s_-]+/g,'');

let MODE = norm(args.widgetParameter);
if (!MODE_MAP[MODE] && !config.runsInWidget) {
  const a = new Alert();
  a.title = 'COMBAT HUB';
  a.message = 'プレビューする団体';
  LABELS.forEach(x => a.addAction(x));
  a.addCancelAction('キャンセル');
  const i = await a.presentSheet();
  if (i < 0) { Script.complete(); return; }
  MODE = PARAMS[i];
}
if (!MODE_MAP[MODE]) MODE = 'UFC';
const KEY = MODE_MAP[MODE];

const SERIES = {
  ufc:{label:'UFC',accent:'#F23B35',url:'https://www.ufc.com/events'},
  rizin:{label:'RIZIN',accent:'#5CE68A',url:'https://jp.rizinff.com/'},
  one:{label:'ONE',accent:'#F4D54A',url:'https://www.onefc.com/jp/events/'},
  boxing:{label:'BOXING',accent:'#4BA3FF',url:'https://www.ringmagazine.com/events'},
  k1:{label:'K-1',accent:'#FF8C3A',url:'https://www.k-1.co.jp/k-1wgp/schedule'}
};
const S = SERIES[KEY];
const C = {text:'#F7F8FA',sub:'#CDD2D9',muted:'#8B929D'};

const SNAPSHOT = {
  ufc:{
    startAt:'2026-08-29T10:00:00.000Z',location:'上海',
    main:{a:'NURMAGOMEDOV',b:'SONG',context:'BANTAMWEIGHT'},
    support:[
      {label:'CO-MAIN',a:'ヤン・シャオナン',b:'デニージ・ゴミス'},
      {label:'FEATURED',a:'アオリ・チロン',b:'朝倉 海'}
    ],
    source:'https://www.ufc.com/event/ufc-fight-night-august-29-2026'
  },
  rizin:{
    startAt:'2026-09-10T16:00:00+09:00',location:'大阪',
    main:{a:'ラジャブアリ・シェイドゥラエフ',b:'AJ・マッキー',context:'RIZIN × PFL FEATHERWEIGHT TITLE'},
    support:[
      {label:'CO-MAIN',a:'朝倉未来',b:'青木真也'},
      {label:'FEATURED',a:'ホベルト・サトシ・ソウザ',b:'野村駿太'}
    ],
    source:'https://jp.rizinff.com/_ct/17853585'
  },
  one:{
    startAt:'2026-08-28T20:30:00+09:00',location:'バンコク',
    main:null,support:[],
    source:'https://www.onefc.com/jp/events/one-friday-fights-168/'
  },
  boxing:{
    startAt:'2026-09-12T12:00:00-07:00',location:'Las Vegas',timeTba:true,
    main:{a:'RYAN GARCIA',b:'CONOR BENN',context:'WBC WELTERWEIGHT WORLD TITLE'},
    support:[],
    source:'https://www.ringmagazine.com/events'
  },
  k1:{
    startAt:'2026-09-12T12:00:00+09:00',location:'東京',
    main:{a:'AKIHIRO KANEKO',b:'RIAMU',context:'SUPER BANTAMWEIGHT TITLE'},
    support:[
      {label:'TITLE FIGHT',a:'朝久泰央',b:'アラッサン・カマラ'},
      {label:'TITLE FIGHT',a:'里見柚己',b:'永澤サムエル聖光'}
    ],
    source:'https://www.k-1.co.jp/k-1wgp/schedule'
  }
};
const D = SNAPSHOT[KEY];

const fm = FileManager.local();
const DOC = fm.documentsDirectory();

function fnt(z,w='regular'){
  if(w==='black' && Font.blackSystemFont) return Font.blackSystemFont(z);
  if(w==='bold') return Font.boldSystemFont(z);
  if(w==='semibold') return Font.semiboldSystemFont(z);
  return Font.systemFont(z);
}
function tx(st,s,z,c,w='regular',n=1){
  const t=st.addText(String(s??'')); t.font=fnt(z,w); t.textColor=c; t.lineLimit=n; t.minimumScaleFactor=.43; return t;
}
function divider(st){const d=st.addStack();d.size=new Size(0,1);d.backgroundColor=new Color('#FFFFFF',.07);}
function stripHTML(s){return String(s||'').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,' ').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/&nbsp;/gi,' ').replace(/&amp;/gi,'&').replace(/&quot;/gi,'"').replace(/&#39;/gi,"'").replace(/\s+/g,' ').trim();}
function safeKey(s){let h=2166136261;for(const ch of String(s||'')){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return(h>>>0).toString(16)}
function absoluteURL(url,base){if(!url)return null;if(/^https?:\/\//i.test(url))return url;if(url.startsWith('//'))return'https:'+url;const m=String(base||'').match(/^(https?:\/\/[^/]+)/i);return(m?m[1]:'')+(url.startsWith('/')?url:'/'+url)}
async function reqText(url,timeout=9){const r=new Request(url);r.timeoutInterval=timeout;r.headers={'User-Agent':'Mozilla/5.0'};return await r.loadString()}
function metaImage(html,base){const tags=html.match(/<meta\b[^>]*>/gi)||[];for(const tag of tags){if(!/property=["']og:image["']/i.test(tag)&&!/name=["']twitter:image["']/i.test(tag))continue;const m=tag.match(/content=["']([^"']+)["']/i);if(m)return absoluteURL(m[1].replace(/&amp;/g,'&'),base)}return null}
function attr(tag,name){const m=tag.match(new RegExp(`${name}=["']([^"']+)["']`,'i'));return m?m[1].replace(/&amp;/g,'&'):null}
function anchors(html,base){const out=[];const re=/<a\b([^>]*)>([\s\S]*?)<\/a>/gi;let m;while((m=re.exec(html))){const href=(m[1].match(/href=["']([^"']+)["']/i)||[])[1];if(href)out.push({href:absoluteURL(href.replace(/&amp;/g,'&'),base),label:stripHTML(m[2])})}return out}
async function cachedImage(url,ns='auto'){
  if(!url)return null;
  const hash=safeKey(url);
  const path=fm.joinPath(DOC,`combat-${ns}-${hash}.jpg`);
  const legacy=fm.joinPath(DOC,`combat_${ns}_${hash}.jpg`);
  for(const p of [path,legacy]){if(fm.fileExists(p)){try{return fm.readImage(p)}catch(_){}}}
  try{const r=new Request(url);r.timeoutInterval=10;r.headers={'User-Agent':'Mozilla/5.0'};const img=await r.loadImage();fm.writeImage(path,img);return img}catch(_){return null}
}
function profileImage(html,url,name){
  for(const tag of html.match(/<img\b[^>]*>/gi)||[]){
    const alt=stripHTML(attr(tag,'alt')||'');
    if(alt&&(alt.includes(name)||name.includes(alt))){
      const src=attr(tag,'data-src')||attr(tag,'data-original')||attr(tag,'src');
      if(src)return absoluteURL(src,url);
    }
  }
  return metaImage(html,url);
}

const UFC_PROFILES = {
  NURMAGOMEDOV:'https://www.ufc.com/athlete/umar-nurmagomedov',
  SONG:'https://www.ufc.com/athlete/yadong-song'
};
async function ufcProfile(name){
  const url=UFC_PROFILES[String(name).toUpperCase()];
  if(!url)return{name,image:null};
  let jp=name,imgURL=null;
  try{const h=await reqText(url);imgURL=metaImage(h,url)}catch(_){}
  try{const h=await reqText(url.replace('https://www.ufc.com/','https://jp.ufc.com/'));const m=h.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);if(m)jp=stripHTML(m[1])||jp}catch(_){}
  return{name:jp,image:await cachedImage(imgURL,'ufc')};
}

async function rizinProfile(name){
  const direct=`https://jp.rizinff.com/_tags/${encodeURIComponent(name)}`;
  try{
    const h=await reqText(direct),iu=profileImage(h,direct,name);
    const image=await cachedImage(iu,'rizin');
    if(image)return{name,image};
  }catch(_){}
  try{
    const card=await reqText(D.source),ls=anchors(card,D.source);
    const link=ls.find(x=>x.label.trim()===name&&/\/_tags\//.test(x.href))||ls.find(x=>x.label.includes(name)&&/\/_tags\//.test(x.href));
    if(link){const h=await reqText(link.href),iu=profileImage(h,link.href,name);return{name,image:await cachedImage(iu,'rizin')}}
  }catch(_){}
  return{name,image:null};
}

const ONE_WITHDRAWN = ['Phetjeeja','ペッジージャ','Antonia Prifti','アントニア'];
function fightPair(s){
  const c=stripHTML(s).replace(/\s+/g,' ').trim();
  if(c.length<5||c.length>110)return null;
  const m=c.match(/^(.{2,48}?)\s+(?:vs\.?|VS)\s+(.{2,48})$/i);
  if(!m)return null;
  const a=m[1].trim(),b=m[2].trim();
  if(!a||!b)return null;
  if(ONE_WITHDRAWN.some(x=>a.includes(x)||b.includes(x)))return null;
  return{a,b};
}
function onePairs(html){
  const out=[],seen=new Set();
  const chunks=html.split(/<\/(?:h1|h2|h3|h4|p|li|div|article|section)>/i);
  for(const ch of chunks){
    if(!/\bvs\.?\b/i.test(stripHTML(ch)))continue;
    let p=fightPair(ch);
    if(!p){
      const c=stripHTML(ch);
      const m=c.match(/(.{2,48}?)\s+(?:vs\.?|VS)\s+(.{2,48})/i);
      if(m)p=fightPair(`${m[1]} vs ${m[2]}`);
    }
    if(!p)continue;
    const k=`${p.a}|${p.b}`;
    if(!seen.has(k)){seen.add(k);out.push(p)}
  }
  return out;
}
async function oneProfileFromPage(name,eventHtml){
  const ls=anchors(eventHtml,D.source);
  const link=ls.find(x=>/\/athletes\//.test(x.href)&&(x.label.trim()===name||x.label.includes(name)||name.includes(x.label)));
  if(!link)return{name,image:null};
  try{const h=await reqText(link.href),iu=profileImage(h,link.href,name);return{name,image:await cachedImage(iu,'one')}}catch(_){return{name,image:null}}
}
async function oneContext(){
  try{
    const html=await reqText(D.source);
    const pairs=onePairs(html);
    if(!pairs.length)return{pending:true,main:null,support:[],a:{name:'',image:null},b:{name:'',image:null},url:D.source};
    const main={a:pairs[0].a,b:pairs[0].b,context:'ONE公式カード'};
    const support=pairs.slice(1,3).map((p,i)=>({label:i===0?'CO-MAIN':'FEATURED',a:p.a,b:p.b}));
    return{
      pending:false,main,support,
      a:await oneProfileFromPage(main.a,html),
      b:await oneProfileFromPage(main.b,html),
      url:D.source
    };
  }catch(_){
    return{pending:true,main:null,support:[],a:{name:'',image:null},b:{name:'',image:null},url:D.source};
  }
}

async function heroContext(){
  if(KEY==='ufc')return{pending:false,main:D.main,support:D.support,a:await ufcProfile(D.main.a),b:await ufcProfile(D.main.b),url:D.source};
  if(KEY==='rizin')return{pending:false,main:D.main,support:D.support,a:await rizinProfile(D.main.a),b:await rizinProfile(D.main.b),url:D.source};
  if(KEY==='one')return await oneContext();
  return{pending:false,main:D.main,support:D.support,a:{name:D.main.a,image:null},b:{name:D.main.b,image:null},url:D.source};
}

function imageRect(image,x,width,side){
  if(!image?.size)return new Rect(x,0,width,338);
  const iw=image.size.width,ih=image.size.height,scale=Math.max(width/iw,338/ih),dw=iw*scale,dh=ih*scale,bias=side==='left'?.03:.97;
  return new Rect(x+(width-dw)*bias,(338-dh)/2-34,dw,dh);
}
function bg(a,b){
  const c=new DrawContext();c.size=new Size(720,338);c.opaque=true;c.respectScreenScale=false;
  c.setFillColor(new Color('#040506'));c.fillRect(new Rect(0,0,720,338));
  if(a)c.drawImageInRect(a,imageRect(a,-5,360,'left'));
  if(b)c.drawImageInRect(b,imageRect(b,365,360,'right'));
  const shade=KEY==='rizin'?.82:KEY==='one'?.78:.73;
  c.setFillColor(new Color('#000000',shade));c.fillRect(new Rect(0,0,720,338));
  c.setFillColor(new Color('#000000',.17));c.fillRect(new Rect(0,155,720,183));
  c.setFillColor(new Color('#000000',.15));c.fillRect(new Rect(0,220,720,118));
  c.setFillColor(new Color(S.accent,.022));c.fillRect(new Rect(352,0,16,338));
  return c.getImage();
}
function gradient(){const g=new LinearGradient();g.startPoint=new Point(0,0);g.endPoint=new Point(1,1);g.colors=[new Color('#050609'),new Color(S.accent,.14)];g.locations=[0,1];return g}
function dateText(d){if(D.timeTba)return'9/12 ・ 時刻未定';const x=new Date(d),f=new DateFormatter();f.locale='ja_JP';f.timeZone='Asia/Tokyo';f.dateFormat="M/d (E) HH:mm 'JST'";return f.string(x)}
function countdown(d){if(D.timeTba)return'時刻未定';const q=new Date(d)-Date.now();if(q<=0)return'開催中';const m=Math.floor(q/60000),days=Math.floor(m/1440),h=Math.floor((m%1440)/60),mm=m%60;if(days>0)return`${days}日 ${h}時間`;if(h>0)return`${h}時間 ${mm}分`;return`${mm}分`}
function division(s){const v=String(s||'');if(/FEATHER/i.test(v))return/TITLE/i.test(v)?'フェザー級タイトル戦':'フェザー級';if(/BANTAM/i.test(v))return'バンタム級';if(/STRAW/i.test(v))return'ストロー級';if(/WELTER/i.test(v))return'ウェルター級';if(/SUPER BANTAM/i.test(v))return'スーパー・バンタム級';if(/LIGHT/i.test(v))return'ライト級';return v.length>22?v.slice(0,21)+'…':v}
function supportRow(w,row){const s=w.addStack();s.centerAlignContent();const l=s.addStack();l.size=new Size(64,0);tx(l,row.label,7.4,new Color(S.accent),'bold');s.addSpacer(4);const a=s.addStack();a.size=new Size(116,0);tx(a,row.a,9.3,new Color(C.text),'semibold');s.addSpacer(4);tx(s,'VS',7.4,new Color(S.accent),'bold');s.addSpacer(4);const b=s.addStack();b.size=new Size(116,0);const bt=tx(b,row.b,9.3,new Color(C.text),'semibold');bt.rightAlignText()}

const ctx=await heroContext();
const w=new ListWidget();w.setPadding(10,14,8,14);
if(ctx.a.image||ctx.b.image)w.backgroundImage=bg(ctx.a.image,ctx.b.image);else w.backgroundGradient=gradient();

const h=w.addStack();h.centerAlignContent();
const hl=h.addStack();hl.layoutVertically();tx(hl,S.label,20,new Color(C.text),'black');hl.addSpacer(2);
const meta=hl.addStack();tx(meta,dateText(D.startAt),8.1,new Color(C.sub),'semibold');meta.addSpacer(5);tx(meta,'·',7,new Color(C.muted));meta.addSpacer(5);tx(meta,D.location,8.1,new Color(C.sub),'semibold');
h.addSpacer();
const hr=h.addStack();hr.layoutVertically();const lab=hr.addStack();lab.addSpacer();tx(lab,'開催まで',6.3,new Color(C.muted),'bold');hr.addSpacer(1);const cd=hr.addStack();cd.addSpacer();tx(cd,countdown(D.startAt),12.8,new Color(C.text),'black');

if(ctx.pending){
  w.addSpacer(26);
  const p=w.addStack();p.addSpacer();tx(p,'対戦カード更新待ち',13.4,new Color(C.text),'black');p.addSpacer();
  w.addSpacer(4);
  const s=w.addStack();s.addSpacer();tx(s,'ONE公式発表を確認中',7.2,new Color(C.muted),'semibold');s.addSpacer();
  w.addSpacer(20);
}else{
  w.addSpacer(18);
  const main=w.addStack();main.centerAlignContent();
  const aBox=main.addStack();aBox.layoutVertically();aBox.size=new Size(136,0);tx(aBox,ctx.a.name||ctx.main.a,11.7,new Color(C.text),'black',2);
  main.addSpacer();
  const vsBox=main.addStack();vsBox.size=new Size(34,0);vsBox.centerAlignContent();const v=tx(vsBox,'VS',13.5,new Color(S.accent),'black');v.centerAlignText();
  main.addSpacer();
  const bBox=main.addStack();bBox.layoutVertically();bBox.size=new Size(136,0);const bn=tx(bBox,ctx.b.name||ctx.main.b,11.7,new Color(C.text),'black',2);bn.rightAlignText();
  w.addSpacer(3);const dv=tx(w,division(ctx.main.context),7.3,new Color('#BBC2CB'),'semibold');dv.centerAlignText();w.addSpacer(5);divider(w);w.addSpacer(4);

  const rows=(ctx.support||[]).slice(0,2);
  if(rows.length){rows.forEach((r,i)=>{supportRow(w,r);if(i<rows.length-1)w.addSpacer(4)})}
  else{const empty=w.addStack();empty.addSpacer();tx(empty,'追加カードは公式更新待ち',7,new Color(C.muted),'semibold');empty.addSpacer()}
}

w.url=ctx.url||D.source||S.url;
w.refreshAfterDate=new Date(Date.now()+30*60*1000);
if(config.runsInWidget)Script.setWidget(w);else await w.presentMedium();
Script.complete();
})();

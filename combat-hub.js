// COMBAT HUB — GitHub Standalone / Personal
// Scriptable 1本で UFC / RIZIN / ONE / BOXING / K-1 を表示
// Home Screen Widget Parameter: UFC / RIZIN / ONE / BOXING / K1
// v6.7.0-github — K-1 background visibility fix / no Vercel dependency

(async()=>{
const VERSION='6.7.0-github';
const MODE_MAP={UFC:'ufc',RIZIN:'rizin',ONE:'one',BOXING:'boxing',K1:'k1'};
const LABELS=['UFC','RIZIN','ONE','BOXING','K-1'];
const PARAMS=['UFC','RIZIN','ONE','BOXING','K1'];
const norm=v=>String(v||'').trim().toUpperCase().replace(/[\s_-]+/g,'');
let MODE=norm(args.widgetParameter);
if(!MODE_MAP[MODE]&&!config.runsInWidget){const a=new Alert();a.title='COMBAT HUB';a.message='プレビューする団体';LABELS.forEach(x=>a.addAction(x));a.addCancelAction('キャンセル');const i=await a.presentSheet();if(i<0){Script.complete();return;}MODE=PARAMS[i];}
if(!MODE_MAP[MODE])MODE='UFC';
const KEY=MODE_MAP[MODE];

const SERIES={
 ufc:{label:'UFC',accent:'#F23B35',url:'https://www.ufc.com/events'},
 rizin:{label:'RIZIN',accent:'#5CE68A',url:'https://jp.rizinff.com/'},
 one:{label:'ONE',accent:'#F4D54A',url:'https://www.onefc.com/jp/events/'},
 boxing:{label:'BOXING',accent:'#4BA3FF',url:'https://www.ringmagazine.com/events'},
 k1:{label:'K-1',accent:'#FF8C3A',url:'https://www.k-1.co.jp/schedule'}
};
const S=SERIES[KEY];
const C={text:'#F7F8FA',sub:'#CDD2D9',muted:'#8B929D'};

const VISUAL={
 ufc:{posterShade:.76,heroShade:.73,topShade:.03,bottomShade:.16,accentVeil:.018,heroGap:18,mainSize:11.7,divisionSize:7.3},
 rizin:{posterShade:.80,heroShade:.78,topShade:.04,bottomShade:.18,accentVeil:.018,heroGap:18,mainSize:11.6,divisionSize:7.2},
 one:{posterShade:.72,heroShade:.76,topShade:.04,bottomShade:.18,accentVeil:.030,heroGap:20,mainSize:11.7,divisionSize:7.3},
 boxing:{posterShade:.81,heroShade:.76,topShade:.08,bottomShade:.22,accentVeil:.022,heroGap:18,mainSize:11.9,divisionSize:7.2},
 k1:{posterShade:.70,heroShade:.78,topShade:.05,bottomShade:.18,accentVeil:.025,heroGap:17,mainSize:12.2,divisionSize:7.4}
};
const V=VISUAL[KEY];

const SNAPSHOT={
 ufc:{startAt:'2026-08-29T10:00:00.000Z',location:'上海',main:{a:'NURMAGOMEDOV',b:'SONG',context:'BANTAMWEIGHT'},support:[{label:'CO-MAIN',a:'ヤン・シャオナン',b:'デニージ・ゴミス'},{label:'FEATURED',a:'アオリ・チロン',b:'朝倉 海'}],source:'https://www.ufc.com/event/ufc-fight-night-august-29-2026'},
 rizin:{startAt:'2026-09-10T16:00:00+09:00',location:'大阪',main:{a:'ラジャブアリ・シェイドゥラエフ',b:'AJ・マッキー',context:'RIZIN × PFL FEATHERWEIGHT TITLE'},support:[{label:'CO-MAIN',a:'朝倉未来',b:'青木真也'},{label:'FEATURED',a:'ホベルト・サトシ・ソウザ',b:'野村駿太'}],source:'https://jp.rizinff.com/_tags/%E8%B6%85RIZIN5'},
 one:{startAt:'2026-08-28T20:30:00+09:00',location:'バンコク',cardTba:true,main:{a:'対戦カード',b:'発表待ち',context:'ONE Friday Fights 168'},support:[],source:'https://www.onefc.com/jp/events/one-friday-fights-168/'},
 boxing:{startAt:'2026-09-12T12:00:00-07:00',displayDate:'9/12 (土)',location:'ラスベガス',timeTba:true,main:{a:'ライアン・ガルシア',b:'コナー・ベン',context:'WBC ウェルター級タイトル戦'},support:[],source:'https://www.ringmagazine.com/news/ryan-garcia-vs-conor-benn-set-for-sept-12-in-las-vegas-2lAAiNVusWH1ZYNPUFQdQo'},
 k1:{startAt:'2026-09-12T12:00:00+09:00',location:'東京・代々木第二',main:{a:'金子晃大',b:'璃明武',context:'スーパー・バンタム級タイトル戦'},support:[{label:'TITLE FIGHT',a:'朝久泰央',b:'アラッサン・カマラ'},{label:'TITLE FIGHT',a:'里見柚己',b:'永澤サムエル聖光'}],source:'https://www.k-1.co.jp/schedule/16669'}
};
const D=SNAPSHOT[KEY];

const fm=FileManager.local(),DOC=fm.documentsDirectory();
function fnt(z,w='regular'){if(w==='black'&&Font.blackSystemFont)return Font.blackSystemFont(z);if(w==='bold')return Font.boldSystemFont(z);if(w==='semibold')return Font.semiboldSystemFont(z);return Font.systemFont(z);}
function tx(st,s,z,c,w='regular',n=1){const t=st.addText(String(s??''));t.font=fnt(z,w);t.textColor=c;t.lineLimit=n;t.minimumScaleFactor=.43;return t;}
function divider(st){const d=st.addStack();d.size=new Size(0,1);d.backgroundColor=new Color('#FFFFFF',.075);}
function stripHTML(s){return String(s||'').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,' ').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/&nbsp;/gi,' ').replace(/&amp;/gi,'&').replace(/&quot;/gi,'"').replace(/&#39;/gi,"'").replace(/\s+/g,' ').trim();}
function safeKey(s){let h=2166136261;for(const ch of String(s||'')){h^=ch.charCodeAt(0);h=Math.imul(h,16777619);}return(h>>>0).toString(16);}
function absoluteURL(url,base){if(!url)return null;if(/^https?:\/\//i.test(url))return url;if(url.startsWith('//'))return'https:'+url;const m=String(base||'').match(/^(https?:\/\/[^/]+)/i);return(m?m[1]:'')+(url.startsWith('/')?url:'/'+url);}
async function reqText(url,timeout=9){const r=new Request(url);r.timeoutInterval=timeout;r.headers={'User-Agent':'Mozilla/5.0','Cache-Control':'no-cache'};return await r.loadString();}
function metaImage(html,base){const tags=html.match(/<meta\b[^>]*>/gi)||[];for(const tag of tags){if(!/property=["']og:image["']/i.test(tag)&&!/name=["']twitter:image["']/i.test(tag))continue;const m=tag.match(/content=["']([^"']+)["']/i);if(m)return absoluteURL(m[1].replace(/&amp;/g,'&'),base);}return null;}
function attr(tag,name){const m=tag.match(new RegExp(`${name}=["']([^"']+)["']`,'i'));return m?m[1].replace(/&amp;/g,'&'):null;}
async function cachedImage(url,ns='auto'){if(!url)return null;const path=fm.joinPath(DOC,`combat-${ns}-${safeKey(url)}.jpg`);if(fm.fileExists(path)){try{return fm.readImage(path);}catch(_){}}try{const r=new Request(url);r.timeoutInterval=10;r.headers={'User-Agent':'Mozilla/5.0'};const img=await r.loadImage();fm.writeImage(path,img);return img;}catch(_){return null;}}

const UFC_PROFILES={NURMAGOMEDOV:'https://www.ufc.com/athlete/umar-nurmagomedov',SONG:'https://www.ufc.com/athlete/yadong-song'};
async function ufcProfile(name){const url=UFC_PROFILES[String(name).toUpperCase()];if(!url)return{name,image:null};let jp=name,imgURL=null;try{const h=await reqText(url);imgURL=metaImage(h,url);}catch(_){}try{const h=await reqText(url.replace('https://www.ufc.com/','https://jp.ufc.com/'));const m=h.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);if(m)jp=stripHTML(m[1])||jp;}catch(_){}return{name:jp,image:await cachedImage(imgURL,'ufc')};}

const RIZIN_PROFILES={'ラジャブアリ・シェイドゥラエフ':'https://jp.rizinff.com/_tags/%E3%83%A9%E3%82%B8%E3%83%A3%E3%83%96%E3%82%A2%E3%83%AA%E3%83%BB%E3%82%B7%E3%82%A7%E3%82%A4%E3%83%89%E3%82%A5%E3%83%A9%E3%82%A8%E3%83%95','AJ・マッキー':'https://jp.rizinff.com/_tags/AJ%E3%83%BB%E3%83%9E%E3%83%83%E3%82%AD%E3%83%BC'};
function rizinImg(html,url,name){for(const tag of html.match(/<img\b[^>]*>/gi)||[]){const alt=stripHTML(attr(tag,'alt')||'');if(alt&&(alt.includes(name)||name.includes(alt))){const src=attr(tag,'data-src')||attr(tag,'data-original')||attr(tag,'src');if(src)return absoluteURL(src,url);}}return metaImage(html,url);}
async function rizinProfile(name){const url=RIZIN_PROFILES[name];if(!url)return{name,image:null};let imgURL=null;try{const h=await reqText(url);imgURL=rizinImg(h,url,name);}catch(_){}return{name,image:await cachedImage(imgURL,'rizin')};}

async function posterFrom(url,ns){try{const h=await reqText(url);return await cachedImage(metaImage(h,url),ns);}catch(_){return null;}}
async function heroContext(){
 if(KEY==='ufc')return{a:await ufcProfile(D.main.a),b:await ufcProfile(D.main.b),poster:null};
 if(KEY==='rizin')return{a:await rizinProfile(D.main.a),b:await rizinProfile(D.main.b),poster:null};
 if(KEY==='one')return{a:{name:D.main.a,image:null},b:{name:D.main.b,image:null},poster:await posterFrom(D.source,'one-event')};
 if(KEY==='boxing')return{a:{name:D.main.a,image:null},b:{name:D.main.b,image:null},poster:await posterFrom(D.source,'boxing-event')};
 if(KEY==='k1')return{a:{name:D.main.a,image:null},b:{name:D.main.b,image:null},poster:await posterFrom(D.source,'k1-event')};
 return{a:{name:D.main.a,image:null},b:{name:D.main.b,image:null},poster:null};
}

function imageRect(image,x,width,side){if(!image?.size)return new Rect(x,0,width,338);const iw=image.size.width,ih=image.size.height,scale=Math.max(width/iw,338/ih),dw=iw*scale,dh=ih*scale,bias=side==='left'?.03:.97;return new Rect(x+(width-dw)*bias,(338-dh)/2-34,dw,dh);}
function bg(a,b){const c=new DrawContext();c.size=new Size(720,338);c.opaque=true;c.respectScreenScale=false;c.setFillColor(new Color('#040506'));c.fillRect(new Rect(0,0,720,338));if(a)c.drawImageInRect(a,imageRect(a,-5,360,'left'));if(b)c.drawImageInRect(b,imageRect(b,365,360,'right'));c.setFillColor(new Color('#000000',V.heroShade));c.fillRect(new Rect(0,0,720,338));c.setFillColor(new Color('#000000',V.bottomShade));c.fillRect(new Rect(0,148,720,190));c.setFillColor(new Color(S.accent,V.accentVeil));c.fillRect(new Rect(352,0,16,338));return c.getImage();}
function posterBg(image){const c=new DrawContext();c.size=new Size(720,338);c.opaque=true;c.respectScreenScale=false;c.setFillColor(new Color('#050609'));c.fillRect(new Rect(0,0,720,338));if(image?.size){const iw=image.size.width,ih=image.size.height,scale=Math.max(720/iw,338/ih),dw=iw*scale,dh=ih*scale;c.drawImageInRect(image,new Rect((720-dw)/2,(338-dh)/2,dw,dh));}c.setFillColor(new Color('#000000',V.posterShade));c.fillRect(new Rect(0,0,720,338));c.setFillColor(new Color('#000000',V.topShade));c.fillRect(new Rect(0,0,720,118));c.setFillColor(new Color('#000000',V.bottomShade));c.fillRect(new Rect(0,150,720,188));if(KEY==='k1'){c.setFillColor(new Color(S.accent,.035));c.fillRect(new Rect(330,0,60,338));}c.setFillColor(new Color(S.accent,V.accentVeil));c.fillRect(new Rect(0,0,720,338));return c.getImage();}
function gradient(){const g=new LinearGradient();g.startPoint=new Point(0,0);g.endPoint=new Point(1,1);g.colors=[new Color('#050609'),new Color(S.accent,.14)];g.locations=[0,1];return g;}
function dateOnly(d){const f=new DateFormatter();f.locale='ja_JP';f.timeZone='Asia/Tokyo';f.dateFormat='M/d (E)';return f.string(new Date(d));}
function dateText(d){if(D.timeTba)return`${D.displayDate||dateOnly(d)} ・ 時刻未定`;const f=new DateFormatter();f.locale='ja_JP';f.timeZone='Asia/Tokyo';f.dateFormat="M/d (E) HH:mm 'JST'";return f.string(new Date(d));}
function countdown(d){if(D.timeTba)return'時刻未定';const q=new Date(d)-Date.now();if(q<=0)return'開催中';const m=Math.floor(q/60000),days=Math.floor(m/1440),h=Math.floor((m%1440)/60),mm=m%60;if(days>0)return`${days}日 ${h}時間`;if(h>0)return`${h}時間 ${mm}分`;return`${mm}分`;}
function division(s){const v=String(s||'');if(/FEATHER/i.test(v))return/TITLE/i.test(v)?'フェザー級タイトル戦':'フェザー級';if(/BANTAM/i.test(v))return'バンタム級';if(/STRAW/i.test(v))return'ストロー級';if(/WELTER/i.test(v))return'ウェルター級';if(/SUPER BANTAM/i.test(v))return'スーパー・バンタム級';if(/LIGHT/i.test(v))return'ライト級';return v.length>24?v.slice(0,23)+'…':v;}
function supportRow(w,row){const s=w.addStack();s.centerAlignContent();const l=s.addStack();l.size=new Size(64,0);tx(l,row.label,7.2,new Color(S.accent),'bold');s.addSpacer(4);const a=s.addStack();a.size=new Size(116,0);tx(a,row.a,9.1,new Color(C.text),'semibold');s.addSpacer(4);tx(s,'VS',7.2,new Color(S.accent),'bold');s.addSpacer(4);const b=s.addStack();b.size=new Size(116,0);const bt=tx(b,row.b,9.1,new Color(C.text),'semibold');bt.rightAlignText();}

const ctx=await heroContext();
const w=new ListWidget();w.setPadding(10,14,8,14);
if(ctx.poster)w.backgroundImage=posterBg(ctx.poster);else if(ctx.a.image||ctx.b.image)w.backgroundImage=bg(ctx.a.image,ctx.b.image);else w.backgroundGradient=gradient();

const h=w.addStack();h.centerAlignContent();const hl=h.addStack();hl.layoutVertically();tx(hl,S.label,20,new Color(C.text),'black');hl.addSpacer(2);const meta=hl.addStack();tx(meta,dateText(D.startAt),8.1,new Color(C.sub),'semibold');meta.addSpacer(5);tx(meta,'·',7,new Color(C.muted));meta.addSpacer(5);tx(meta,D.location,8.1,new Color(C.sub),'semibold');h.addSpacer();const hr=h.addStack();hr.layoutVertically();const lab=hr.addStack();lab.addSpacer();tx(lab,D.timeTba?'開催':'開催まで',6.3,new Color(C.muted),'bold');hr.addSpacer(1);const cd=hr.addStack();cd.addSpacer();tx(cd,countdown(D.startAt),12.8,new Color(C.text),'black');

if(KEY==='one'&&D.cardTba){
 w.addSpacer(20);const center=w.addStack();center.layoutVertically();const title=tx(center,'対戦カード発表待ち',13.5,new Color(C.text),'black');title.centerAlignText();center.addSpacer(4);const sub=tx(center,'ONE Friday Fights 168',8,new Color('#D8C86A'),'semibold');sub.centerAlignText();w.addSpacer(10);divider(w);w.addSpacer(6);const foot=w.addStack();foot.addSpacer();tx(foot,'公式更新を自動反映',7,new Color(C.muted),'semibold');foot.addSpacer();
}else{
 w.addSpacer(V.heroGap);const main=w.addStack();main.centerAlignContent();const aBox=main.addStack();aBox.layoutVertically();aBox.size=new Size(136,0);tx(aBox,ctx.a.name,V.mainSize,new Color(C.text),'black',2);main.addSpacer();const vsBox=main.addStack();vsBox.size=new Size(34,0);vsBox.centerAlignContent();const v=tx(vsBox,'VS',13.5,new Color(S.accent),'black');v.centerAlignText();main.addSpacer();const bBox=main.addStack();bBox.layoutVertically();bBox.size=new Size(136,0);const bn=tx(bBox,ctx.b.name,V.mainSize,new Color(C.text),'black',2);bn.rightAlignText();w.addSpacer(3);const dv=tx(w,division(D.main.context),V.divisionSize,new Color('#BBC2CB'),'semibold');dv.centerAlignText();w.addSpacer(5);divider(w);w.addSpacer(4);
 if(D.support.length){D.support.slice(0,2).forEach((r,i)=>{supportRow(w,r);if(i<Math.min(2,D.support.length)-1)w.addSpacer(4);});}else{const empty=w.addStack();empty.addSpacer();tx(empty,KEY==='boxing'?'UNDERCARD 発表待ち':'追加カードは次回更新',7,new Color(C.muted),'semibold');empty.addSpacer();}
}

w.url=D.source||S.url;w.refreshAfterDate=new Date(Date.now()+30*60*1000);
if(config.runsInWidget)Script.setWidget(w);else await w.presentMedium();
Script.complete();
})();

/* Avatar humain : rendu à partir du sprite PNG original, avec recoloration par masque et calques SVG indépendants. */
const $=s=>document.querySelector(s);
const HN={style0:'Coupe d’origine',style1:'Longues ondulations',style2:'Lisse',style3:'Carré ondulé',style4:'Couettes longues',style5:'Double chignon',style6:'Boucles volumineuses',style7:'Tresses',style8:'Queue bouclée',hijab:'Hijab'};
const HAIR_FILES={style0:'style-0.png',style1:'style-1.png',style2:'style-2.png',style3:'style-3.png',style4:'style-4.png',style5:'style-5.png',style6:'style-6.png',style7:'style-7.png',style8:'style-8.png',hijab:'hijab.png'};
const OUTFIT_FILES={tee:'tee.png',sweater:'sweater.png',hoodie:'hoodie.png',dress:'dress.png',overalls:'overalls.png'};
const ON={tee:'T-shirt',sweater:'Pull cosy',hoodie:'Sweat',dress:'Robe',overalls:'Salopette'};
const PAN={none:'Aucun',bow:'Nœud',cowboy:'Chapeau cowboy',flower:'Fleur',crown:'Couronne',cap:'Casquette',beret:'Béret',bonnet:'Bonnet',glasses:'Lunettes',scarf:'Écharpe',halo:'Aur éole',wings:'Petites ailes'};
const AN={none:'Aucun',bow:'Nœud',flower:'Fleur',headband:'Serre-tête',beret:'Béret',cap:'Casquette',necklace:'Collier',earrings:'Boucles d’oreilles',backpack:'Sac à dos',crown:'Couronne',glasses:'Lunettes',sunglasses:'Lunettes soleil',hairclip:'Barrette',scarf:'Écharpe'};
const HAIR_COLORS=['#291a2b','#493027','#79513a','#b87943','#e5b45b','#f2d7a0','#d85b3d','#d77aa8','#9b78d0','#536fae','#c9d0d8','#f5eee5'];
const SKIN_COLORS=['#ffe9d8','#f8d0b0','#efb58e','#d9956b','#bd7954','#965b3f','#70432f','#42291f'];
const OUTFIT_COLORS=['#fff0df','#ff78b8','#94a6ee','#4a3bea','#8fe3c0','#ffe6fb','#f4b183','#e8c85a','#536b52','#7c4f45','#343b55','#f4f0df'];
const ACCENT_COLORS=['#ff4fa8','#ffd84a','#8fe3c0','#ffe6fb','#4a3bea'];
const PETACC_COLORS=['#ff4fb8','#ffd84a','#8fe3c0','#ffe6fb','#4a3bea','#a0c8ff','#7a4a2a'];
const PN={ophanim:'Ophanim',bunny:'Lemon',cat:'Fibonacci',turtle:'Leto',yarn:'Lovelace',octo:'Chopard',narwhal:'Socrate',snail:'Platon',frog:'Artemis',sheep:'Diana',button:'Avicenne',llama:'Firnas',starfish:'Hypatie',giraffe:'Tesla',dalmatian:'Newton',koala:'Galilée',crab:'Curie',kiwi:'Kiwi'};
const DEFAULT_COMPANION_NAMES={...PN};
let S={name:'Moi',bio:'',skin:0,hair:1,outfit:5,accent:0,hs:'sprite',os:'sweater',shoes:'sneakers',layers:[],accs:[],petAcc:'none',petAccent:0,pal:'bunny',cn:'Lemon',cNames:{...DEFAULT_COMPANION_NAMES},mode:'sleep',tab:'me',spriteHue:0};
// Nouvelle clé de sauvegarde : les anciens accessoires dessinés ne peuvent plus contaminer ce profil refondu.
let savedProfile={};try{savedProfile=JSON.parse(localStorage.getItem('wipProfileStudioV2')||'{}');Object.assign(S,savedProfile)}catch(e){savedProfile={}}
if(!['none','sneakers','boots','mary-janes'].includes(S.shoes))S.shoes='sneakers';
S.layers=Array.isArray(S.layers)?S.layers.filter(v=>['cardigan','jacket','apron','cape','scarf'].includes(v)):[];S.accs=Array.isArray(S.accs)?S.accs.filter(v=>['bow','flower','headband','beret','cap','necklace','earrings','backpack','crown','glasses','sunglasses','hairclip','scarf'].includes(v)):[];if(Array.isArray(savedProfile.accs)&&savedProfile.accs.includes('hijab'))S.hs='hijab';S.cNames={...DEFAULT_COMPANION_NAMES,...(S.cNames||{})};
const clamp=(v,n)=>Number.isInteger(Number(v))&&Number(v)>=0&&Number(v)<n?Number(v):0;
S.skin=clamp(S.skin,SKIN_COLORS.length);S.hair=clamp(S.hair,HAIR_COLORS.length);S.outfit=clamp(S.outfit,OUTFIT_COLORS.length);S.accent=clamp(S.accent,ACCENT_COLORS.length);S.petAccent=clamp(S.petAccent,7);
if(!HN[S.hs])S.hs='style0';if(!ON[S.os])S.os='sweater';if(!PN[S.pal])S.pal='bunny';if(!['sleep','knit','done'].includes(S.mode))S.mode='sleep';if(!['me','pal'].includes(S.tab))S.tab='me';
const colorize=(img)=>{
  const c=document.createElement('canvas');c.width=img.naturalWidth||288;c.height=img.naturalHeight||512;
  const x=c.getContext('2d',{willReadFrequently:true});x.drawImage(img,0,0,c.width,c.height);
  const im=x.getImageData(0,0,c.width,c.height),d=im.data;
  const skin=hexRgb(SKIN_COLORS[S.skin]),hair=hexRgb(HAIR_COLORS[S.hair]);
  const mix=(i,target,lum)=>{const f=Math.max(.48,Math.min(1.32,lum/165));d[i]=Math.min(255,target[0]*f);d[i+1]=Math.min(255,target[1]*f);d[i+2]=Math.min(255,target[2]*f)};
  for(let y=0;y<c.height;y++)for(let xx=0;xx<c.width;xx++){
    const i=(y*c.width+xx)*4;if(d[i+3]<24)continue;
    const r=d[i],g=d[i+1],b=d[i+2],lum=.299*r+.587*g+.114*b,nx=xx/c.width,ny=y/c.height;
    const teeSleeve=S.os==='tee'&&r>g*1.10&&b>g*.90&&r>110&&ny>.48&&ny<.61&&((xx<96)||(xx>192));
    const faceKeep=(((xx-144)/68)**2+((y-150)/78)**2)<=1;
    const hairRegion=(ny<.23||((nx<.42||nx>.58)&&ny<.80));
    const brown=(lum<158&&r<190&&g<155&&b<180&&r>g*.92);
    const hairZone=hairRegion&&brown&&!faceKeep; 
    const peach=r>g*1.08&&g>b*1.04&&lum>145;
    const face=(ny>.20&&ny<.43&&nx>.32&&nx<.68);
    const arms=(ny>.48&&ny<.68&&((nx>.28&&nx<.43)||(nx>.57&&nx<.72)));
    if(hairZone){if(S.hs==='style0')mix(i,hair,lum);else d[i+3]=0}
    else if(teeSleeve)mix(i,skin,lum);
    else if(peach&&(face||arms))mix(i,skin,lum);
  }
  x.putImageData(im,0,0);return c
};
function hexRgb(h){return [parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)]}
function tintLayer(img,color){
  const c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;const x=c.getContext('2d',{willReadFrequently:true});x.drawImage(img,0,0);
  const im=x.getImageData(0,0,c.width,c.height),d=im.data,t=hexRgb(color);
  for(let i=0;i<d.length;i+=4){if(d[i+3]<10)continue;const lum=(.299*d[i]+.587*d[i+1]+.114*d[i+2])/255;const f=.48+lum*.68;d[i]=Math.min(255,t[0]*f);d[i+1]=Math.min(255,t[1]*f);d[i+2]=Math.min(255,t[2]*f)}x.putImageData(im,0,0);return c
}
function addRasterLayer(wrap,path,color){const img=new Image();img.onload=()=>{const node=document.createElement('img');node.className='human-raster-layer '+(path.includes('/accessories/')?'accessory-raster-layer':path.includes('hair/')?'hair-raster-layer':'clothing-raster-layer');node.alt='';node.src=color?tintLayer(img,color).toDataURL():path;wrap.append(node)};img.src=path}
function humanSpriteNode(){
  const wrap=document.createElement('div');wrap.className='hero-composite';const img=new Image();img.className='hero-source';img.src='wip-sprites/human/avatar-base.png';img.alt='Mon personnage';
  img.onload=()=>{
    const c=colorize(img);c.className='hero-sprite';c.setAttribute('role','img');c.setAttribute('aria-label','Mon personnage personnalisable');wrap.replaceChildren(c);
    const root='wip-sprites/human/layers/';
    // The selected outfit is a real, full-canvas transparent PNG layer, not an icon or SVG shape.
    const top=new Image();top.onload=()=>{const layer=tintLayer(top,OUTFIT_COLORS[S.outfit]);const node=document.createElement('img');node.className='human-raster-layer';node.alt='';node.src=layer.toDataURL();wrap.append(node)};top.src=root+'outfits/'+(S.os==='tee'||S.os==='dress'?'tee.png':S.os==='hoodie'?'hoodie.png':S.os==='overalls'?'overalls.png':'sweater.png');
    const pants=new Image();pants.onload=()=>{const layer=tintLayer(pants,'#8496d5');const node=document.createElement('img');node.className='human-raster-layer';node.alt='';node.src=layer.toDataURL();wrap.append(node)};pants.src=root+'outfits/bottoms.png';
    if(S.os==='tee')addRasterLayer(wrap,root+'outfits/tee-details.png');
    if(S.os==='sweater')addRasterLayer(wrap,root+'outfits/sweater-details.png');
    if(S.os==='dress'){addRasterLayer(wrap,root+'outfits/dress-skirt.png')}
    if(S.os==='overalls')addRasterLayer(wrap,root+'outfits/overalls-bib.png');
    if(S.os==='hoodie')addRasterLayer(wrap,root+'outfits/hoodie-details.png');
    // Additional clothing pieces can be stacked independently.
    S.layers.forEach(v=>{const file=({cardigan:'cardigan',jacket:'jacket',apron:'apron',cape:'cape',scarf:'scarf'})[v];if(file)addRasterLayer(wrap,root+'outfits/'+file+'.png',ACCENT_COLORS[S.accent])});
    // Footwear is a genuine pixel-art PNG, positioned over the avatar's feet.
    if(S.shoes&&S.shoes!=='none'){const shoe=new Image();shoe.onload=()=>{const node=document.createElement('img');node.className='shoe-raster-layer';node.alt='';node.src=shoe.src;wrap.append(node)};shoe.src=root+'shoes/'+S.shoes+'.png'}
    // Hair assets are transparent PNGs aligned to the avatar canvas.
    if(S.hs!=='style0'){const hair=new Image();hair.onload=()=>{const layer=tintLayer(hair,HAIR_COLORS[S.hair]);const node=document.createElement('img');node.className='human-raster-layer hair-raster-layer';node.alt='';node.src=layer.toDataURL();wrap.append(node)};hair.src=root+'hair/'+(HAIR_FILES[S.hs]||HAIR_FILES.style1)}
    // Multi-select accessories are individual transparent pixel-art PNG layers.
    const accessoryMap={bow:'bow',flower:'flower',headband:'headband',beret:'beret',cap:'cap',necklace:'necklace',earrings:'earrings',backpack:'backpack',crown:'crown',glasses:'glasses',sunglasses:'sunglasses',hairclip:'hairclip',scarf:'scarf'};
    S.accs.forEach(v=>{const file=accessoryMap[v];if(file)addRasterLayer(wrap,root+'accessories/'+file+'.png',ACCENT_COLORS[S.accent])});
  };wrap.append(img);return wrap
}

/* Compagnons illustrés : sprites PNG dessinés individuellement.
   Chaque compagnon possède quatre poses : idle, happy, sleep et action. La grenouille a été redessinée avec une petite bouche souriante fermée, plus douce et discrète. */
const PET_SPRITES={"bunny-idle":"wip-sprites/bunny-idle.png","bunny-happy":"wip-sprites/bunny-happy.png","bunny-sleep":"wip-sprites/bunny-sleep.png","bunny-action":"wip-sprites/bunny-action.png","cat-idle":"wip-sprites/cat-idle.png","cat-happy":"wip-sprites/cat-happy.png","cat-sleep":"wip-sprites/cat-sleep.png","cat-action":"wip-sprites/cat-action.png","turtle-idle":"wip-sprites/turtle-idle.png","turtle-happy":"wip-sprites/turtle-happy.png","turtle-sleep":"wip-sprites/turtle-sleep.png","turtle-action":"wip-sprites/turtle-action.png","yarn-idle":"wip-sprites/yarn-idle.png","yarn-happy":"wip-sprites/yarn-happy.png","yarn-sleep":"wip-sprites/yarn-sleep.png","yarn-action":"wip-sprites/yarn-action.png","octo-idle":"wip-sprites/octo-idle.png","octo-happy":"wip-sprites/octo-happy.png","octo-sleep":"wip-sprites/octo-sleep.png","octo-action":"wip-sprites/octo-action.png","narwhal-idle":"wip-sprites/narwhal-idle.png","narwhal-happy":"wip-sprites/narwhal-happy.png","narwhal-sleep":"wip-sprites/narwhal-sleep.png","narwhal-action":"wip-sprites/narwhal-action.png","snail-idle":"wip-sprites/snail-idle.png","snail-happy":"wip-sprites/snail-happy.png","snail-sleep":"wip-sprites/snail-sleep.png","snail-action":"wip-sprites/snail-action.png","frog-idle":"wip-sprites/frog-idle.png","frog-happy":"wip-sprites/frog-happy.png","frog-sleep":"wip-sprites/frog-sleep.png","frog-action":"wip-sprites/frog-action.png","sheep-idle":"wip-sprites/sheep-idle.png","sheep-happy":"wip-sprites/sheep-happy.png","sheep-sleep":"wip-sprites/sheep-sleep.png","sheep-action":"wip-sprites/sheep-action.png","button-idle":"wip-sprites/button-idle.png","button-happy":"wip-sprites/button-happy.png","button-sleep":"wip-sprites/button-sleep.png","button-action":"wip-sprites/button-action.png","llama-idle":"wip-sprites/llama-idle.png","llama-happy":"wip-sprites/llama-happy.png","llama-sleep":"wip-sprites/llama-sleep.png","llama-action":"wip-sprites/llama-action.png","starfish-idle":"wip-sprites/starfish-idle.png","starfish-happy":"wip-sprites/starfish-happy.png","starfish-sleep":"wip-sprites/starfish-sleep.png","starfish-action":"wip-sprites/starfish-action.png","giraffe-idle":"wip-sprites/giraffe-idle.png","giraffe-happy":"wip-sprites/giraffe-happy.png","giraffe-sleep":"wip-sprites/giraffe-sleep.png","giraffe-action":"wip-sprites/giraffe-action.png","dalmatian-idle":"wip-sprites/dalmatian-idle.png","dalmatian-happy":"wip-sprites/dalmatian-happy.png","dalmatian-sleep":"wip-sprites/dalmatian-sleep.png","dalmatian-action":"wip-sprites/dalmatian-action.png","koala-idle":"wip-sprites/koala-idle.png","koala-happy":"wip-sprites/koala-happy.png","koala-sleep":"wip-sprites/koala-sleep.png","koala-action":"wip-sprites/koala-action.png","kiwi-idle":"wip-sprites/kiwi-idle.png","kiwi-happy":"wip-sprites/kiwi-happy.png","kiwi-sleep":"wip-sprites/kiwi-sleep.png","kiwi-action":"wip-sprites/kiwi-action.png","crab-idle":"wip-sprites/crab-idle.png","crab-happy":"wip-sprites/crab-happy.png","crab-sleep":"wip-sprites/crab-sleep.png","crab-action":"wip-sprites/crab-action.png"};
const petImage=(kind,pose='idle',className='pet-sprite')=>{
  const img=document.createElement('img');
  img.className=className;
  img.src=kind==='ophanim'?`wip-sprites/ophanim-${pose}.png`:PET_SPRITES[`${kind}-${pose}`]||PET_SPRITES[`${kind}-idle`]||'';
  img.alt=PN[kind]||'Compagnon';
  img.width=192; img.height=192;
  img.draggable=false;
  img.onerror=()=>{img.alt='Sprite indisponible : '+(PN[kind]||kind);};
  return img;
};
const humanPose=()=>S.mode==='sleep'?'sleep':S.mode==='knit'?'action':'happy';
const humanSprite=()=>humanSpriteNode();
const petPose=()=>S.mode==='sleep'?'sleep':S.mode==='knit'?'happy':'action';
const t0=Date.now();
const clock=()=>{const s=Math.floor((Date.now()-t0)/1000);return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')};
const bubble=()=>S.mode==='knit'?'♪ '+clock():S.mode==='done'?'★ fini !':'zzz…';
const PET_SIZE={ophanim:190,giraffe:212,llama:211,sheep:211,bunny:191,cat:195,turtle:205,koala:193,dalmatian:193,narwhal:202,octo:199,snail:184,frog:193,starfish:184,button:173,yarn:132,crab:164,kiwi:104};
function petWithAccessory(kind,pose,cls){const wrap=document.createElement('div');wrap.className='pet-wrap '+cls+(['ophanim','kiwi'].includes(kind)?' '+kind+'-float':'');wrap.style.setProperty('--pet-size',(PET_SIZE[kind]||156)+'px');wrap.append(petImage(kind,pose,'pet-main'));if(kind==='yarn')wrap.classList.add('yarn-companion');const deco=document.createElement('span');deco.className='pet-deco '+(S.petAcc||'none');deco.textContent=({none:'',bow:'🎀',cowboy:'🤠',flower:'🌼',crown:'👑',cap:'🧢',beret:'🎨',bonnet:'🧶',glasses:'👓',scarf:'🧣',halo:'😇',wings:'🪽'})[S.petAcc]||'';deco.style.filter='hue-rotate('+(S.petAccent*55)+'deg)';wrap.append(deco);return wrap;}
function scene(){document.documentElement.style.setProperty('--sprite-hue',(S.spriteHue||0)+'deg');const sc=$('#scene');sc.innerHTML='<div class="rug"></div>';
const a=document.createElement('div');a.className='who '+({sleep:'slow',knit:'fast',done:'hop'})[S.mode];const stage=document.createElement('div');stage.className='hero-stage';stage.append(humanSprite());a.append(stage);const n=document.createElement('div');n.className='nm';n.textContent=S.name||'Moi';a.append(n);
const b=document.createElement('div');b.className='who '+({sleep:'slow',knit:'fast',done:'hop'})[S.mode];b.innerHTML='<div class="bub" id="bub"></div>';b.append(petWithAccessory(S.pal,petPose(),'pet-stage'));const m=document.createElement('div');m.className='nm';m.textContent=S.cn||'Compagnon';b.append(m);
sc.append(a,b);$('#bub').textContent=bubble()}
function set(k,v){S[k]=v;if(k==='pal'){S.cn=S.cNames[v]||DEFAULT_COMPANION_NAMES[v];}render()}
function swatches(id,colors,key){const box=$('#'+id);if(!box)return;box.innerHTML='';colors.forEach((c,i)=>{const b=document.createElement('button');b.type='button';b.className='sw';b.style.background=c;b.dataset.choice=key;b.dataset.value=i;b.setAttribute('aria-label','Couleur '+(i+1));b.setAttribute('aria-pressed',String(Number(S[key])===i));b.onclick=()=>{S[key]=i;render()};box.append(b)})}
const CHOICE_ART={};
const ACCESSORY_FILES={bow:'bow',flower:'flower',headband:'headband',beret:'beret',cap:'cap',necklace:'necklace',earrings:'earrings',backpack:'backpack',crown:'crown',glasses:'glasses',sunglasses:'sunglasses',hairclip:'hairclip',scarf:'scarf'};
const LAYER_FILES={cardigan:'cardigan',jacket:'jacket',apron:'apron',cape:'cape',scarf:'scarf'};
const SHOE_FILES={none:null,sneakers:'sneakers',boots:'boots','mary-janes':'mary-janes'};
const SHOE_NAMES={none:'Aucune',sneakers:'Baskets',boots:'Bottines','mary-janes':'Mocassins'};
function buildChoiceList(id,items,key){const box=$('#'+id);if(!box)return;box.innerHTML='';Object.entries(items).forEach(([value,label])=>{const b=document.createElement('button');b.type='button';b.className='choice';b.dataset.choice=key;b.dataset.value=value;const art=document.createElement('span');art.className='choice-art';let src='';if(key==='hs')src='wip-sprites/human/layers/hair/'+(HAIR_FILES[value]||HAIR_FILES.style0);else if(key==='os')src='wip-sprites/human/layers/outfits/thumbs/'+value+'.png';else if(key==='accs'&&ACCESSORY_FILES[value])src='wip-sprites/human/layers/accessories/thumbs/'+ACCESSORY_FILES[value]+'.png';else if(key==='layers'&&LAYER_FILES[value])src='wip-sprites/human/layers/outfits/thumbs/'+LAYER_FILES[value]+'.png';else if(key==='shoes'&&SHOE_FILES[value])src='wip-sprites/human/layers/shoes/thumbs/'+SHOE_FILES[value]+'.png';if(src){const image=document.createElement('img');image.src=src;image.alt='';image.loading='lazy';art.append(image)}else art.textContent=value==='none'?'×':'♡';const caption=document.createElement('span');caption.className='choice-label';caption.textContent=label;b.append(art,caption);b.onclick=()=>{if(key==='accs'||key==='layers'){if(value==='none')S[key]=[];else S[key]=S[key].includes(value)?S[key].filter(x=>x!==value):[...S[key],value]}else{S[key]=value;if(key==='hs')S.accs=S.accs.filter(x=>x!=='hijab')}render()};box.append(b)})}
buildChoiceList('shoe-choices',SHOE_NAMES,'shoes');buildChoiceList('hair-choices',HN,'hs');buildChoiceList('clothing-layer-choices',{cardigan:'Gilet',jacket:'Veste',apron:'Tablier',cape:'Cape',scarf:'Écharpe'},'layers');swatches('skin-choices',SKIN_COLORS,'skin');swatches('hair-color-choices',HAIR_COLORS,'hair');buildChoiceList('outfit-choices',ON,'os');swatches('outfit-color-choices',OUTFIT_COLORS,'outfit');buildChoiceList('accessory-choices',AN,'accs');swatches('accessory-color-choices',ACCENT_COLORS,'accent');
function stp(id,k,names){const box=$('#p-'+id),keys=Object.keys(names);box.innerHTML='<button class="btn" aria-label="Précédent">◀</button><span></span><button class="btn" aria-label="Suivant">▶</button>';
const go=d=>set(k,keys[(keys.indexOf(S[k])+d+keys.length)%keys.length]);box.children[0].onclick=()=>go(-1);box.children[2].onclick=()=>go(1)}
stp('petacc','petAcc',PAN);swatches('s-petaccent',PETACC_COLORS,'petAccent');
Object.keys(PN).forEach(k=>{const b=document.createElement('button');b.className='btn';b.dataset.pal=k;b.append(petImage(k,'idle','pet-thumb'));b.append(PN[k]);b.onclick=()=>set('pal',k);$('#pals').append(b)});
document.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>set('mode',b.dataset.m));
document.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>set('tab',b.dataset.t));
$('#sprite-hue').value=S.spriteHue||0;$('#hue-value').textContent=(S.spriteHue||0)+'°';
$('#sprite-hue').oninput=e=>{S.spriteHue=Number(e.target.value);$('#hue-value').textContent=S.spriteHue+'°';document.documentElement.style.setProperty('--sprite-hue',S.spriteHue+'deg');try{localStorage.setItem('wipProfileStudioV2',JSON.stringify(S))}catch(err){}};
$('#nm').oninput=e=>{S.name=e.target.value;render(1)};$('#bio').oninput=e=>{S.bio=e.target.value;render(1)};$('#cn').oninput=e=>{S.cn=e.target.value;S.cNames[S.pal]=S.cn;render(1)};
function render(typing){scene();
document.querySelectorAll('[data-k][data-v]').forEach(b=>b.setAttribute('aria-pressed',String(S[b.dataset.k]==b.dataset.v)));
document.querySelectorAll('[data-m]').forEach(b=>b.setAttribute('aria-pressed',String(S.mode===b.dataset.m)));
document.querySelectorAll('[data-t]').forEach(b=>b.setAttribute('aria-selected',String(S.tab===b.dataset.t)));
document.querySelectorAll('[data-pal]').forEach(b=>b.setAttribute('aria-pressed',String(S.pal===b.dataset.pal)));
document.querySelectorAll('[data-choice]').forEach(b=>{const k=b.dataset.choice,v=b.dataset.value;const selected=(k==='accs'||k==='layers')?S[k].includes(v):String(S[k])===String(v);b.setAttribute('aria-pressed',String(selected))});
$('#p-petacc span').textContent=PAN[S.petAcc]||'Aucun';
$('#me').hidden=S.tab!=='me';$('#pal').hidden=S.tab!=='pal';
document.querySelectorAll('[data-editor-panel]').forEach(p=>p.hidden=false);
S.cn=S.cNames[S.pal]||DEFAULT_COMPANION_NAMES[S.pal];if(!typing){$('#nm').value=S.name;$('#bio').value=S.bio;$('#cn').value=S.cn}
$('#out').value=JSON.stringify(S);
try{localStorage.setItem('wipProfileStudioV2',JSON.stringify(S))}catch(e){}}
setInterval(()=>{if(S.mode==='knit'&&$('#bub'))$('#bub').textContent=bubble()},1000);
try{render()}catch(error){console.error('WIP Island : erreur au démarrage',error);const sceneEl=$('#scene');if(sceneEl){sceneEl.innerHTML='';const msg=document.createElement('p');msg.className='startup-error';msg.textContent='Oups ! WIP Island n’a pas réussi à charger. Recharge la page ou vérifie les fichiers.';sceneEl.append(msg)}}

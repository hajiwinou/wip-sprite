
/* Avatar humain : rendu à partir du sprite PNG original, avec recoloration par masque et calques SVG indépendants. */
const $=s=>document.querySelector(s);
const HN={sprite:'Coupe d’origine',fringe:'Frange',curtain:'Frange rideau',bun:'Chignon',twin:'Couettes',afro:'Volume afro',braids:'Tresses',ponytail:'Queue haute'};
const ON={tee:'T-shirt',sweater:'Pull cosy',hoodie:'Sweat',dress:'Robe',overalls:'Salopette'};
const PAN={none:'Aucun',bow:'Nœud',cowboy:'Chapeau cowboy',flower:'Fleur',crown:'Couronne',cap:'Casquette',beret:'Béret',bonnet:'Bonnet',glasses:'Lunettes',scarf:'Écharpe',halo:'Aur éole',wings:'Petites ailes'};
const AN={none:'Aucun',bow:'Nœud',flower:'Fleur',headband:'Serre-tête',beret:'Béret',cap:'Casquette',necklace:'Collier',earrings:'Boucles d’oreilles',backpack:'Sac à dos',crown:'Couronne',glasses:'Lunettes',sunglasses:'Lunettes soleil',hairclip:'Barrette',scarf:'Écharpe',hijab:'Hijab'};
const HAIR_COLORS=['#291a2b','#493027','#79513a','#b87943','#e5b45b','#f2d7a0','#d85b3d','#d77aa8','#9b78d0','#536fae','#c9d0d8','#f5eee5'];
const SKIN_COLORS=['#ffe9d8','#f8d0b0','#efb58e','#d9956b','#bd7954','#965b3f','#70432f','#42291f'];
const OUTFIT_COLORS=['#fff0df','#ff78b8','#94a6ee','#4a3bea','#8fe3c0','#ffe6fb','#f4b183','#e8c85a','#536b52','#7c4f45','#343b55','#f4f0df'];
const ACCENT_COLORS=['#ff4fa8','#ffd84a','#8fe3c0','#ffe6fb','#4a3bea'];
const PETACC_COLORS=['#ff4fb8','#ffd84a','#8fe3c0','#ffe6fb','#4a3bea','#a0c8ff','#7a4a2a'];
const PN={ophanim:'Ophanim',bunny:'Lemon',cat:'Fibonacci',turtle:'Leto',yarn:'Lovelace',octo:'Chopard',narwhal:'Socrate',snail:'Platon',frog:'Artemis',sheep:'Diana',button:'Avicenne',llama:'Firnas',starfish:'Hypatie',giraffe:'Tesla',dalmatian:'Newton',koala:'Galilée',crab:'Curie',kiwi:'Kiwi'};
const DEFAULT_COMPANION_NAMES={...PN};
let S={name:'Moi',bio:'',skin:0,hair:1,outfit:5,accent:0,hs:'sprite',os:'sweater',layers:[],accs:[],petAcc:'none',petAccent:0,pal:'bunny',cn:'Lemon',cNames:{...DEFAULT_COMPANION_NAMES},mode:'sleep',tab:'me',spriteHue:0};
// Nouvelle clé de sauvegarde : les anciens accessoires dessinés ne peuvent plus contaminer ce profil refondu.
try{Object.assign(S,JSON.parse(localStorage.getItem('wipProfileLayersV1')||'{}'))}catch(e){}
S.layers=Array.isArray(S.layers)?S.layers:[];S.accs=Array.isArray(S.accs)?S.accs:[];S.cNames={...DEFAULT_COMPANION_NAMES,...(S.cNames||{})};
const clamp=(v,n)=>Number.isInteger(Number(v))&&Number(v)>=0&&Number(v)<n?Number(v):0;
S.skin=clamp(S.skin,SKIN_COLORS.length);S.hair=clamp(S.hair,HAIR_COLORS.length);S.outfit=clamp(S.outfit,OUTFIT_COLORS.length);S.accent=clamp(S.accent,ACCENT_COLORS.length);S.petAccent=clamp(S.petAccent,7);
if(!HN[S.hs])S.hs='sprite';if(!ON[S.os])S.os='sweater';if(!PN[S.pal])S.pal='bunny';if(!['sleep','knit','done'].includes(S.mode))S.mode='sleep';if(!['me','pal'].includes(S.tab))S.tab='me';
const colorize=(img)=>{
  const c=document.createElement('canvas');
  c.width=img.naturalWidth||192;c.height=img.naturalHeight||206;
  const x=c.getContext('2d',{willReadFrequently:true});
  x.drawImage(img,0,0,c.width,c.height);
  const im=x.getImageData(0,0,c.width,c.height),d=im.data;
  const skin=hexRgb(SKIN_COLORS[S.skin]),hair=hexRgb(HAIR_COLORS[S.hair]),cloth=hexRgb(OUTFIT_COLORS[S.outfit]);
  const mix=(i,target,lum)=>{const f=Math.max(.48,Math.min(1.32,lum/165));d[i]=Math.min(255,target[0]*f);d[i+1]=Math.min(255,target[1]*f);d[i+2]=Math.min(255,target[2]*f)};
  for(let y=0;y<c.height;y++)for(let xx=0;xx<c.width;xx++){
    const i=(y*c.width+xx)*4;if(d[i+3]<24)continue;
    const r=d[i],g=d[i+1],b=d[i+2],lum=.299*r+.587*g+.114*b;
    const nx=xx/c.width,ny=y/c.height;
    const brown=r>g*1.16&&g>b*1.06&&r<155&&g<125&&lum<125;
    const hairZone=brown&&ny<.72&&(ny<.34||nx<.34||nx>.66);
    const peach=r>g*1.08&&g>b*1.04&&lum>145;
    const face=(ny>.20&&ny<.43&&nx>.32&&nx<.68);
    const arms=(ny>.48&&ny<.68&&((nx>.28&&nx<.43)||(nx>.57&&nx<.72)));
    const skinZone=peach&&(face||arms);
    const pink=r>g*1.08&&b>g*.82&&r>130&&ny>.40&&ny<.68&&nx>.28&&nx<.73;
    const blue=b>r*1.03&&b>g*.96&&ny>.56&&ny<.94&&nx>.28&&nx<.73;
    if(hairZone){if(S.hs==='sprite'&&!S.accs.includes('hijab'))mix(i,hair,lum);else d[i+3]=0}
    else if(skinZone)mix(i,skin,lum);
    else if(pink||blue)mix(i,cloth,lum);
  }
  x.putImageData(im,0,0);return c
};
function hexRgb(h){return [parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)]}
function humanLayerSvg(){const hair=HAIR_COLORS[S.hair],accent=ACCENT_COLORS[S.accent];let a='';
const hairBase=`M96 18 C62 15 31 40 28 79 L22 126 Q28 154 56 160 L61 121 L50 96 Q48 72 68 58 Q96 40 124 58 Q144 72 142 96 L131 121 L136 160 Q164 153 170 126 L164 79 Q160 42 130 24 Z M64 94 Q60 58 96 54 Q132 58 128 94 L124 119 Q96 133 68 119 Z`;
if(S.hs!=='sprite'&&!S.accs.includes('hijab')){a+=`<path d="${hairBase}" fill="${hair}" fill-rule="evenodd" stroke="#21152b" stroke-width="4" stroke-linejoin="miter"/>`;
if(S.hs==='fringe')a+=`<path d="M57 65 L67 45 L84 43 L93 72 L102 44 L121 47 L137 67 L122 64 L111 78 L99 64 L87 79 L74 65 Z" fill="${hair}" stroke="#21152b" stroke-width="3"/>`;
if(S.hs==='curtain')a+=`<path d="M57 65 L67 45 L88 42 L95 77 L83 69 L74 81 Z M105 42 L125 46 L137 66 L119 81 L109 69 Z" fill="${hair}" stroke="#21152b" stroke-width="3"/>`;
if(S.hs==='bun')a+=`<circle cx="96" cy="20" r="18" fill="${hair}" stroke="#21152b" stroke-width="4"/>`;
if(S.hs==='twin')a+=`<circle cx="38" cy="43" r="16" fill="${hair}" stroke="#21152b" stroke-width="4"/><circle cx="154" cy="43" r="16" fill="${hair}" stroke="#21152b" stroke-width="4"/>`;
if(S.hs==='afro')a+=`<g fill="${hair}" stroke="#21152b" stroke-width="4"><circle cx="42" cy="58" r="18"/><circle cx="57" cy="34" r="18"/><circle cx="80" cy="23" r="18"/><circle cx="106" cy="22" r="18"/><circle cx="132" cy="34" r="18"/><circle cx="151" cy="58" r="18"/></g>`;
if(S.hs==='braids')a+=`<g fill="${hair}" stroke="#21152b" stroke-width="3"><path d="M43 83 L32 96 L42 108 L31 120 L42 132 L32 144 L45 154 L57 141 L48 129 L59 117 L49 104 L59 92 Z M149 83 L160 96 L150 108 L161 120 L150 132 L160 144 L147 154 L135 141 L144 129 L133 117 L143 104 L133 92 Z"/></g>`;
if(S.hs==='ponytail')a+=`<path d="M139 45 Q169 45 174 75 L170 116 L155 137 L146 117 L159 79 L137 66 Z" fill="${hair}" stroke="#21152b" stroke-width="4"/>`;
}
if(S.os==='tee')a+=`<path d="M68 130 L82 126 L96 137 L110 126 L124 130 L130 174 L62 174 Z" fill="${OUTFIT_COLORS[S.outfit]}" stroke="#21152b" stroke-width="4"/>`;
if(S.os==='hoodie')a+=`<path d="M68 130 L82 126 L96 137 L110 126 L124 130 L132 176 L60 176 Z M78 126 Q96 108 114 126 L108 143 L84 143 Z" fill="${OUTFIT_COLORS[S.outfit]}" stroke="#21152b" stroke-width="4"/>`;
if(S.os==='dress')a+=`<path d="M70 129 L122 129 L139 177 L53 177 Z" fill="${OUTFIT_COLORS[S.outfit]}" stroke="#21152b" stroke-width="4"/>`;
if(S.os==='overalls')a+=`<path d="M72 131 L120 131 L126 177 L66 177 Z M76 124 L83 124 L88 145 L80 145 Z M109 124 L116 124 L112 145 L104 145 Z" fill="${OUTFIT_COLORS[S.outfit]}" stroke="#21152b" stroke-width="3"/>`;
if(S.layers.includes('cardigan'))a+=`<path d="M62 132 L80 127 L82 176 L61 176 Z M112 127 L131 132 L132 176 L111 176 Z" fill="${OUTFIT_COLORS[S.outfit]}" stroke="#21152b" stroke-width="3"/>`;
if(S.layers.includes('jacket'))a+=`<path d="M60 130 L78 126 L83 177 L59 177 Z M114 126 L133 130 L135 177 L111 177 Z" fill="${OUTFIT_COLORS[S.outfit]}" stroke="#21152b" stroke-width="3"/>`;
if(S.layers.includes('apron'))a+=`<path d="M77 137 L115 137 L122 178 L70 178 Z" fill="#fff0df" stroke="#21152b" stroke-width="3"/>`;
if(S.layers.includes('cape'))a+=`<path d="M63 121 L78 129 L69 184 L46 177 Z M129 121 L114 129 L123 184 L146 177 Z" fill="${OUTFIT_COLORS[S.outfit]}" stroke="#21152b" stroke-width="3"/>`;
if(S.layers.includes('scarf')||S.accs.includes('scarf'))a+=`<path d="M73 120 L119 120 L116 133 L76 133 Z M109 129 L122 129 L129 158 L116 158 Z" fill="${accent}" stroke="#21152b" stroke-width="3"/>`;
if(S.accs.includes('hijab'))a+=`<path fill-rule="evenodd" d="M40 98 Q30 49 63 31 Q96 7 129 31 Q163 49 152 98 L144 135 L132 158 L60 158 L48 135 Z M58 91 Q58 49 96 45 Q134 49 134 91 L130 116 L62 116 Z" fill="${accent}" stroke="#21152b" stroke-width="4"/>`;
if(S.accs.includes('bow'))a+=`<path d="M49 47 L69 39 L65 58 Z M73 39 L91 47 L76 58 Z" fill="${accent}" stroke="#21152b" stroke-width="3"/>`;
if(S.accs.includes('flower'))a+=`<g fill="${accent}" stroke="#21152b" stroke-width="2"><circle cx="50" cy="52" r="7"/><circle cx="62" cy="52" r="7"/><circle cx="56" cy="44" r="7"/><circle cx="56" cy="60" r="7"/><circle cx="56" cy="52" r="4" fill="#ffd84a"/></g>`;
if(S.accs.includes('backpack'))a+=`<path d="M55 137 Q42 133 40 150 L42 174 L62 174 L63 145 Z" fill="${accent}" stroke="#21152b" stroke-width="3"/>`;
if(S.accs.includes('beret'))a+=`<path d="M48 48 Q57 19 99 20 Q136 20 145 48 L137 58 L55 58 Z" fill="${accent}" stroke="#21152b" stroke-width="4"/>`;
if(S.accs.includes('cap'))a+=`<path d="M53 47 Q61 24 96 23 Q130 24 139 47 L139 56 L53 56 Z M98 50 L154 57 L151 64 L103 60 Z" fill="${accent}" stroke="#21152b" stroke-width="4"/>`;
if(S.accs.includes('glasses'))a+=`<g fill="none" stroke="#21152b" stroke-width="4"><rect x="61" y="76" width="25" height="18" rx="5"/><rect x="106" y="76" width="25" height="18" rx="5"/><path d="M86 83 L106 83"/></g>`;
if(S.accs.includes('sunglasses'))a+=`<g fill="${accent}" fill-opacity=".82" stroke="#21152b" stroke-width="4"><rect x="61" y="76" width="25" height="18" rx="5"/><rect x="106" y="76" width="25" height="18" rx="5"/><path d="M86 83 L106 83" fill="none"/></g>`;
if(S.accs.includes('crown'))a+=`<path d="M61 40 L68 19 L85 34 L96 12 L108 34 L125 19 L132 42 Z" fill="${accent}" stroke="#21152b" stroke-width="4"/>`;
if(S.accs.includes('headband'))a+=`<path d="M48 57 Q96 19 144 57" fill="none" stroke="${accent}" stroke-width="8"/>`;
if(S.accs.includes('necklace'))a+=`<path d="M78 130 Q96 151 114 130" fill="none" stroke="${accent}" stroke-width="4"/><circle cx="96" cy="145" r="5" fill="${accent}" stroke="#21152b" stroke-width="2"/>`;
if(S.accs.includes('earrings'))a+=`<g fill="${accent}" stroke="#21152b" stroke-width="2"><circle cx="49" cy="105" r="5"/><circle cx="143" cy="105" r="5"/></g>`;
if(S.accs.includes('hairclip'))a+=`<rect x="48" y="67" width="18" height="5" fill="${accent}" stroke="#21152b" stroke-width="2"/>`;
return `<svg viewBox="0 0 192 342" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">${a}</svg>`}
function humanSpriteNode(){const wrap=document.createElement('div');wrap.className='hero-composite';const img=new Image();img.className='hero-source';img.src='wip-sprites/human/avatar-base.png';img.alt='Mon personnage';img.onload=()=>{const c=colorize(img);c.className='hero-sprite';c.setAttribute('role','img');c.setAttribute('aria-label','Mon personnage personnalisable');wrap.insertBefore(c,wrap.firstChild);img.remove()};wrap.append(img);const overlay=document.createElement('div');overlay.className='human-overlay';overlay.innerHTML=humanLayerSvg();wrap.append(overlay);return wrap}

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
const PET_SIZE={ophanim:190,giraffe:212,llama:211,sheep:211,bunny:191,cat:195,turtle:205,koala:193,dalmatian:193,narwhal:202,octo:199,snail:184,frog:193,starfish:184,button:173,yarn:184,crab:164,kiwi:170};
function petWithAccessory(kind,pose,cls){const wrap=document.createElement('div');wrap.className='pet-wrap '+cls+(['ophanim','kiwi'].includes(kind)?' '+kind+'-float':'');wrap.style.setProperty('--pet-size',(PET_SIZE[kind]||156)+'px');wrap.append(petImage(kind,pose,'pet-main'));if(kind==='yarn'){wrap.classList.add('yarn-companion');const face=document.createElement('span');face.className='yarn-face';face.setAttribute('aria-label','Visage mignon de Lovelace');face.innerHTML='<i></i><i></i><b></b>';wrap.append(face)}const deco=document.createElement('span');deco.className='pet-deco '+(S.petAcc||'none');deco.textContent=({none:'',bow:'🎀',cowboy:'🤠',flower:'🌼',crown:'👑',cap:'🧢',beret:'🎨',bonnet:'🧶',glasses:'👓',scarf:'🧣',halo:'😇',wings:'🪽'})[S.petAcc]||'';deco.style.filter='hue-rotate('+(S.petAccent*55)+'deg)';wrap.append(deco);return wrap;}
function scene(){document.documentElement.style.setProperty('--sprite-hue',(S.spriteHue||0)+'deg');const sc=$('#scene');sc.innerHTML='<div class="rug"></div>';
const a=document.createElement('div');a.className='who '+({sleep:'slow',knit:'fast',done:'hop'})[S.mode];const stage=document.createElement('div');stage.className='hero-stage';stage.append(humanSprite());a.append(stage);const n=document.createElement('div');n.className='nm';n.textContent=S.name||'Moi';a.append(n);
const b=document.createElement('div');b.className='who '+({sleep:'slow',knit:'fast',done:'hop'})[S.mode];b.innerHTML='<div class="bub" id="bub"></div>';b.append(petWithAccessory(S.pal,petPose(),'pet-stage'));const m=document.createElement('div');m.className='nm';m.textContent=S.cn||'Compagnon';b.append(m);
sc.append(a,b);$('#bub').textContent=bubble()}
function set(k,v){S[k]=v;if(k==='pal'){S.cn=S.cNames[v]||DEFAULT_COMPANION_NAMES[v];}render()}
function swatches(id,colors,key){const box=$('#'+id);if(!box)return;box.innerHTML='';colors.forEach((c,i)=>{const b=document.createElement('button');b.type='button';b.className='sw';b.style.background=c;b.dataset.choice=key;b.dataset.value=i;b.setAttribute('aria-label','Couleur '+(i+1));b.setAttribute('aria-pressed',String(Number(S[key])===i));b.onclick=()=>{S[key]=i;render()};box.append(b)})}
function buildChoiceList(id,items,key){const box=$('#'+id);if(!box)return;box.innerHTML='';Object.entries(items).forEach(([value,label])=>{const b=document.createElement('button');b.type='button';b.className='choice';b.textContent=label;b.dataset.choice=key;b.dataset.value=value;b.onclick=()=>{if(key==='accs'||key==='layers'){S[key]=S[key].includes(value)?S[key].filter(x=>x!==value):[...S[key],value]}else S[key]=value;render()};box.append(b)})}
buildChoiceList('hair-choices',HN,'hs');buildChoiceList('clothing-layer-choices',{cardigan:'Gilet',jacket:'Veste',apron:'Tablier',cape:'Cape',scarf:'Écharpe'},'layers');swatches('skin-choices',SKIN_COLORS,'skin');swatches('hair-color-choices',HAIR_COLORS,'hair');buildChoiceList('outfit-choices',ON,'os');swatches('outfit-color-choices',OUTFIT_COLORS,'outfit');buildChoiceList('accessory-choices',AN,'accs');swatches('accessory-color-choices',ACCENT_COLORS,'accent');
function stp(id,k,names){const box=$('#p-'+id),keys=Object.keys(names);box.innerHTML='<button class="btn" aria-label="Précédent">◀</button><span></span><button class="btn" aria-label="Suivant">▶</button>';
const go=d=>set(k,keys[(keys.indexOf(S[k])+d+keys.length)%keys.length]);box.children[0].onclick=()=>go(-1);box.children[2].onclick=()=>go(1)}
stp('petacc','petAcc',PAN);swatches('s-petaccent',PETACC_COLORS,'petAccent');
Object.keys(PN).forEach(k=>{const b=document.createElement('button');b.className='btn';b.dataset.pal=k;b.append(petImage(k,'idle','pet-thumb'));b.append(PN[k]);b.onclick=()=>set('pal',k);$('#pals').append(b)});
document.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>set('mode',b.dataset.m));
document.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>set('tab',b.dataset.t));
$('#sprite-hue').value=S.spriteHue||0;$('#hue-value').textContent=(S.spriteHue||0)+'°';
$('#sprite-hue').oninput=e=>{S.spriteHue=Number(e.target.value);$('#hue-value').textContent=S.spriteHue+'°';document.documentElement.style.setProperty('--sprite-hue',S.spriteHue+'deg');try{localStorage.setItem('wipProfileLayersV1',JSON.stringify(S))}catch(err){}};
$('#nm').oninput=e=>{S.name=e.target.value;render(1)};$('#bio').oninput=e=>{S.bio=e.target.value;render(1)};$('#cn').oninput=e=>{S.cn=e.target.value;S.cNames[S.pal]=S.cn;render(1)};
function render(typing){scene();
document.querySelectorAll('[data-k][data-v]').forEach(b=>b.setAttribute('aria-pressed',String(S[b.dataset.k]==b.dataset.v)));
document.querySelectorAll('[data-m]').forEach(b=>b.setAttribute('aria-pressed',String(S.mode===b.dataset.m)));
document.querySelectorAll('[data-t]').forEach(b=>b.setAttribute('aria-selected',String(S.tab===b.dataset.t)));
document.querySelectorAll('[data-pal]').forEach(b=>b.setAttribute('aria-pressed',String(S.pal===b.dataset.pal)));
document.querySelectorAll('[data-choice]').forEach(b=>{const k=b.dataset.choice,v=b.dataset.value;const selected=(k==='accs'||k==='layers')?S[k].includes(v):String(S[k])===String(v);b.setAttribute('aria-pressed',String(selected))});
$('#p-petacc span').textContent=PAN[S.petAcc]||'Aucun';
$('#me').hidden=S.tab!=='me';$('#pal').hidden=S.tab!=='pal';
S.cn=S.cNames[S.pal]||DEFAULT_COMPANION_NAMES[S.pal];if(!typing){$('#nm').value=S.name;$('#bio').value=S.bio;$('#cn').value=S.cn}
$('#out').value=JSON.stringify(S);
try{localStorage.setItem('wipProfileLayersV1',JSON.stringify(S))}catch(e){}}
setInterval(()=>{if(S.mode==='knit'&&$('#bub'))$('#bub').textContent=bubble()},1000);
try{render()}catch(error){console.error('WIP Island : erreur au démarrage',error);const sceneEl=$('#scene');if(sceneEl){sceneEl.innerHTML='';const msg=document.createElement('p');msg.className='startup-error';msg.textContent='Oups ! WIP Island n’a pas réussi à charger. Recharge la page ou vérifie les fichiers.';sceneEl.append(msg)}}

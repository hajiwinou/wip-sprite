
/* Sprites 22x24, style « Choose ur pal » : contour marine automatique, couleurs plates, yeux fermés, joues roses.
   Chaque ligne décrit la moitié gauche (x 0 à 10), le miroir est ajouté tout seul.
   Lettres : s peau, h cheveux, o haut, a accessoire, b corps du compagnon, p rose, k encre, w blanc, d chaussures. Majuscule = même couleur, plus foncée. */
const W=48,H=48;
const P={skin:['#ffe9d8','#f8d0b0','#efb58e','#d9956b','#bd7954','#965b3f','#70432f','#42291f'],hair:['#21152b','#493027','#79513a','#b87943','#e5b45b','#f2d7a0','#d85b3d','#d77aa8','#9b78d0','#536fae','#c9d0d8','#f5eee5'],outfit:['#94a6ee','#ff4fa8','#4a3bea','#a0c8ff','#8fe3c0','#ffe6fb','#f4b183','#e8c85a','#536b52','#7c4f45','#343b55','#f4f0df'],accent:['#ff4fa8','#ffd84a','#8fe3c0','#ffe6fb','#4a3bea'],petaccent:['#ff4fb8','#ffd84a','#8fe3c0','#ffe6fb','#4a3bea','#a0c8ff','#7a4a2a']};
const blank=()=>Array.from({length:H},()=>Array(W).fill('.'));
const paint=(g,rows,m=1)=>{for(const y in rows)[...rows[y]].forEach((c,x)=>{if(c!=='.'){g[y][x]=c;if(m)g[y][W-1-x]=c}})};
const ell=(g,cx,cy,rx,ry,f)=>{for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(((x-cx)/rx)**2+((y-cy)/ry)**2<=1)g[y][x]=f(x,y)};
const rect=(g,x,y,w,h,c)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)g[j][i]=c};
const R=(o,a,b,s)=>{for(let y=a;y<=b;y++)o[y]=s;return o};
const sh=h=>'#'+[1,3,5].map(i=>Math.round(parseInt(h.substr(i,2),16)*.8).toString(16).padStart(2,'0')).join('');
const cols=m=>{const o={p:'#ff8ec7',k:'#1d1470',w:'#fff',d:'#4a3bea'};for(const k in m){o[k]=m[k];o[k.toUpperCase()]=sh(m[k])}return o};

/* Personnage */
const BASE=R({5:"......sssss",6:"....sssssss",13:"....sssssss",14:"......ooooo",15:"..ssooooooo",16:"....ooooooo",17:"....ooooooo",18:"....OOOOOOO",19:"....sss",20:"...dddd"},7,12,"...ssssssss");
const FACE={9:"......kk",10:"....pp",11:"..........k"};
const HA={4:"......hhhhh",5:"....hhhhhhh",6:"...hhhhhhhh",7:"...hhh.hhhh",8:"...h",9:"...h",10:"...h"};
const HAIR={A:HA,B:{...HA,1:"....hhh",2:"...hhhhh",3:"...hhhhh"},C:R({...HA},11,14,"...hh")};
const ACC={none:{},bonnet:{0:"..........w",1:"........www",2:"......aaaaa",3:"....aaaaaaa",4:"...aaaaaaaa",5:"...AAAAAAAA",6:"...AAAAAAAA"},
echarpe:R({14:"....aaaaaaa",15:"....AAAAAAA"},16,18,"........aa"),
lunettes:{8:".....aaaa",9:".....a..aaa",10:".....aaaa"}};
function hero(){
 const g=blank();
 // Petit personnage chibi aux proportions et au langage visuel des compagnons.
 // Tête ronde, oreilles douces, grands yeux brillants, joues et sourire.
 ell(g,24,35,10,8,()=> 'o');
 if(S.os==='dress'){ell(g,24,35,12,9,()=> 'o');rect(g,14,31,20,4,'O')}
 else if(S.os==='overalls'){rect(g,17,27,4,13,'a');rect(g,27,27,4,13,'a');rect(g,17,31,14,7,'o');rect(g,18,27,3,2,'A');rect(g,27,27,3,2,'A')}
 else if(S.os==='hoodie'){ell(g,24,28,11,5,()=> 'O');rect(g,21,27,6,6,'a');rect(g,21,32,6,2,'A')}
 else if(S.os==='cardigan'){rect(g,15,28,4,13,'O');rect(g,29,28,4,13,'O');rect(g,22,29,4,1,'a');rect(g,22,34,4,1,'a')}
 else if(S.os==='blouse'){rect(g,17,28,14,4,'O');rect(g,21,28,6,5,'a')}
 else if(S.os==='vest'){rect(g,19,28,10,9,'O');rect(g,22,28,4,8,'o')}
 else if(S.os==='coat'){rect(g,14,28,5,13,'O');rect(g,29,28,5,13,'O');rect(g,21,29,6,2,'a');rect(g,23,34,2,2,'A')}
 else {rect(g,17,28,14,4,'O')}
 // Couches de vêtements cumulables : elles restent visibles sur la tenue de base.
 if(S.layers.includes('cardigan')){rect(g,14,28,5,13,'A');rect(g,29,28,5,13,'A');rect(g,21,29,6,1,'a');rect(g,21,34,6,1,'a')}
 if(S.layers.includes('jacket')){rect(g,13,28,6,13,'A');rect(g,29,28,6,13,'A');rect(g,13,28,22,2,'A')}
 if(S.layers.includes('vest')){rect(g,18,28,12,10,'A');rect(g,22,28,4,8,'o')}
 if(S.layers.includes('apron')){rect(g,18,29,12,10,'w');rect(g,17,28,14,2,'a')}
 if(S.layers.includes('cape')){rect(g,12,26,5,15,'A');rect(g,31,26,5,15,'A')}
 if(S.layers.includes('scarf')){rect(g,14,26,20,3,'a');rect(g,29,28,4,9,'A')}
 rect(g,19,40,5,5,'s');rect(g,25,40,5,5,'s');ell(g,20,45,5,2,()=> 'd');ell(g,29,45,5,2,()=> 'd');
 rect(g,21,24,6,6,'s');ell(g,24,17,15,15,()=> 's');ell(g,9,18,3,4,()=> 's');ell(g,39,18,3,4,()=> 's');ell(g,13,35,3,4,()=> 's');ell(g,35,35,3,4,()=> 's');
 if(S.hs==='V'){
   ell(g,24,15,17,17,()=> 'a');rect(g,8,16,7,18,'a');rect(g,33,16,7,18,'a');ell(g,24,5,14,7,()=> 'a');rect(g,12,9,24,4,'A');rect(g,14,31,6,5,'A');rect(g,28,31,6,5,'A');
 } else {
   ell(g,24,7,15,9,()=> 'h');rect(g,10,9,5,10,'h');rect(g,33,9,5,10,'h');
   const long=['long','verylong','wavy','curly','braids','frenchbraid','twin','space','ponytail','lowpony','afro','halfup'];
   if(long.includes(S.hs)){rect(g,9,13,5,20,'h');rect(g,34,13,5,20,'h')}
   if(S.hs==='verylong'){rect(g,8,27,6,12,'H');rect(g,34,27,6,12,'H')}
   if(['wavy','curly'].includes(S.hs))for(let y=17;y<35;y+=5){ell(g,11,y,3,3,()=> 'h');ell(g,37,y,3,3,()=> 'h')}
   if(['braids','frenchbraid'].includes(S.hs))for(let y=17;y<39;y+=4){ell(g,10,y,3,3,()=>y%8?'h':'H');ell(g,38,y,3,3,()=>y%8?'h':'H')}
   if(['twin','space'].includes(S.hs)){ell(g,10,5,6,6,()=> 'h');ell(g,38,5,6,6,()=> 'h');if(S.hs==='space'){ell(g,10,1,4,4,()=> 'H');ell(g,38,1,4,4,()=> 'H')}}
   if(['ponytail','lowpony'].includes(S.hs)){ell(g,40,15,5,7,()=> 'h');rect(g,37,11,4,6,'H');if(S.hs==='lowpony')ell(g,40,25,4,8,()=> 'h')}
   if(S.hs==='afro')for(const [x,y] of [[12,8],[17,3],[24,1],[31,3],[36,8],[10,14],[38,14]])ell(g,x,y,5,5,()=> 'h');
   if(S.hs==='curly')for(const [x,y] of [[13,5],[20,2],[28,2],[35,5]])ell(g,x,y,4,4,()=> 'H');
   if(S.hs==='bob'){rect(g,10,18,5,9,'h');rect(g,33,18,5,9,'h')}
   if(S.hs==='hime'){rect(g,9,14,6,19,'h');rect(g,33,14,6,19,'h');rect(g,15,9,18,3,'h')}
   if(['bun','messybun'].includes(S.hs)){ell(g,24,1,7,6,()=> 'h');if(S.hs==='messybun'){ell(g,16,3,4,4,()=> 'H');ell(g,32,3,4,4,()=> 'H')}}
   if(['fringe','curtain','straight'].includes(S.hs)){rect(g,14,10,7,4,'h');rect(g,24,10,10,4,'h');if(S.hs==='curtain'){rect(g,19,10,3,7,'H');rect(g,24,10,3,7,'H')}}
   if(S.hs==='halfup'){ell(g,24,3,7,5,()=> 'H');rect(g,20,7,8,4,'H')}
 }
 // Le hijab est une couche indépendante : il recouvre les cheveux sans changer la peau ni les vêtements.
 if(S.accs.includes('hijab')){ell(g,24,8,16,10,()=> 'a');rect(g,8,15,7,19,'a');rect(g,33,15,7,19,'a');ell(g,24,32,13,6,()=> 'a');rect(g,13,11,22,3,'A');}
 // Yeux ronds et reflets, joues roses, petite bouche souriante.
 ell(g,18,19,2,3,()=> 'k');ell(g,30,19,2,3,()=> 'k');rect(g,18,18,1,1,'w');rect(g,30,18,1,1,'w');ell(g,14,24,3,2,()=> 'p');ell(g,34,24,3,2,()=> 'p');rect(g,23,25,2,1,'k');g[26][22]='k';g[26][25]='k';
 if(S.os==='sweater'){rect(g,20,30,8,2,'A');rect(g,21,35,6,1,'A')}
 if(S.os==='dress')rect(g,16,35,16,2,'A');
 if(S.accs.includes('bonnet')){ell(g,24,5,15,6,()=> 'a');rect(g,11,8,26,3,'a');ell(g,24,0,3,3,()=> 'A')}
 if(S.accs.includes('beret')){ell(g,23,3,14,5,()=> 'a');rect(g,12,6,24,2,'A')}
 if(S.accs.includes('cap')){rect(g,11,4,25,6,'a');rect(g,27,9,13,2,'A')}
 if(S.accs.includes('headband'))rect(g,10,10,28,3,'a');
 if(S.accs.includes('bow')){ell(g,10,8,5,4,()=> 'a');ell(g,17,8,5,4,()=> 'a');ell(g,14,8,2,2,()=> 'A')}
 if(S.accs.includes('flower')){ell(g,11,9,3,3,()=> 'a');ell(g,11,5,2,2,()=> 'A');ell(g,7,9,2,2,()=> 'A');ell(g,15,9,2,2,()=> 'A')}
 if(S.accs.includes('echarpe')){rect(g,14,28,20,4,'a');rect(g,29,31,4,8,'A')}
 if(['lunettes','sunglasses'].some(k=>S.accs.includes(k))){rect(g,13,18,9,5,'a');rect(g,26,18,9,5,'a');rect(g,22,19,4,2,'A');if(S.accs.includes('sunglasses')){rect(g,14,19,7,3,'A');rect(g,27,19,7,3,'A')}}
 if(S.accs.includes('necklace')){rect(g,18,29,12,2,'a');ell(g,24,33,2,2,()=> 'A')}
 if(S.accs.includes('earrings')){ell(g,9,21,2,3,()=> 'a');ell(g,39,21,2,3,()=> 'a')}
 if(S.accs.includes('backpack')){rect(g,8,30,5,12,'a');rect(g,8,30,5,2,'A')}
 if(S.accs.includes('crown')){rect(g,14,3,20,3,'a');rect(g,14,0,3,4,'A');rect(g,22,0,4,4,'A');rect(g,31,0,3,4,'A')}
 if(S.accs.includes('cowboy')){ell(g,24,5,12,4,()=> 'a');rect(g,7,8,34,3,'a');rect(g,20,1,8,5,'A')}
 if(S.accs.includes('hairclip')){rect(g,10,12,7,2,'a');rect(g,12,10,3,6,'A')}
 if(S.accs.includes('mask')){rect(g,15,23,18,5,'a');rect(g,17,24,3,1,'A')}
 if(S.accs.includes('bowtie')){ell(g,18,31,4,3,()=> 'a');ell(g,30,31,4,3,()=> 'a');rect(g,23,29,3,4,'A')}
 return g;
 }

 const HN={pixie:'Pixie',short:'Coupe courte',bob:'Carré',long:'Longs',verylong:'Très longs',wavy:'Ondulés',curly:'Bouclés',afro:'Afro',braids:'Tresses',frenchbraid:'Tresse couronne',twin:'Couettes',space:'Space buns',ponytail:'Queue haute',lowpony:'Queue basse',halfup:'Demi-attachés',bun:'Chignon',messybun:'Chignon flou',fringe:'Frange droite',curtain:'Frange rideau',hime:'Hime cut',straight:'Lisses',V:'Hijab'};
const ON={tee:'T-shirt',sweater:'Pull cosy',hoodie:'Sweat à capuche',dress:'Robe',overalls:'Salopette',cardigan:'Gilet',blouse:'Blouse',vest:'Débardeur',coat:'Manteau'};
const PAN={none:'Aucun',bow:'Nœud',cowboy:'Chapeau cowboy',flower:'Couronne de fleurs',crown:'Couronne',cap:'Casquette',beret:'Béret',bonnet:'Bonnet',glasses:'Lunettes',scarf:'Écharpe',halo:'Aur éole',wings:'Petites ailes'};
const AN={none:'Aucun',bonnet:'Bonnet',echarpe:'Écharpe',lunettes:'Lunettes',bow:'Nœud',flower:'Fleur',headband:'Serre-tête',beret:'Béret',cap:'Casquette',necklace:'Collier',earrings:'Boucles d’oreilles',backpack:'Sac à dos',crown:'Couronne',cowboy:'Chapeau cowboy',hairclip:'Barrette',mask:'Masque',sunglasses:'Lunettes soleil',bowtie:'Nœud papillon',hijab:'Hijab'};

// Les noms doivent être déclarés avant l'initialisation du profil sauvegardé.
const PN={ophanim:'Ophanim',bunny:'Lemon',cat:'Fibonacci',turtle:'Leto',yarn:'Lovelace',octo:'Chopard',narwhal:'Socrate',snail:'Platon',frog:'Artemis',sheep:'Diana',button:'Avicenne',llama:'Firnas',starfish:'Hypatie',giraffe:'Tesla',dalmatian:'Newton',koala:'Galilée',crab:'Curie'};
const DEFAULT_COMPANION_NAMES={...PN};
let S={spriteHue:0,name:'Maille',bio:'',skin:0,hs:'B',hair:0,os:'sweater',outfit:0,acc:'bonnet',accs:['bonnet'],accent:0,petAcc:'bow',petAccent:0,pal:'bunny',cn:'Lemon',cNames:{...DEFAULT_COMPANION_NAMES},mode:'sleep',tab:'me'};
try{Object.assign(S,JSON.parse(localStorage.getItem('wipProfile')||'{}'))}catch(e){}
delete S.cbody; delete S.cacc; S.accs=Array.isArray(S.accs)?S.accs:(S.acc?[S.acc]:['bonnet']); S.layers=Array.isArray(S.layers)?S.layers:[]; if(!S.petAcc)S.petAcc='bow'; if(S.petAccent===undefined)S.petAccent=0; S.cNames={...DEFAULT_COMPANION_NAMES,...(S.cNames||{})}; if(S.cn && S.cn!=='Pompon' && !S.cNames[S.pal])S.cNames[S.pal]=S.cn; S.cn=S.cNames[S.pal]||DEFAULT_COMPANION_NAMES[S.pal];
 const oldHair={A:'pixie',B:'bun',C:'verylong',D:'bob',E:'twin',F:'ponytail',G:'lowpony',H:'wavy',I:'curly',J:'braids',K:'curtain',L:'short',M:'halfup',N:'afro',O:'bob',Q:'space',R:'braids',T:'fringe',U:'hime'}; if(oldHair[S.hs])S.hs=oldHair[S.hs]; if(!HN[S.hs])S.hs='bob';
if(!Object.prototype.hasOwnProperty.call({ophanim:1,bunny:1,cat:1,turtle:1,yarn:1,octo:1,narwhal:1,snail:1,frog:1,sheep:1,button:1,llama:1,starfish:1,giraffe:1,dalmatian:1,koala:1,crab:1},S.pal)) S.pal='bunny';
// Normalise les anciennes sauvegardes pour éviter qu'une valeur périmée bloque le rendu.
const clampIndex=(v,max,fallback=0)=>Number.isInteger(Number(v))&&Number(v)>=0&&Number(v)<max?Number(v):fallback;
S.skin=clampIndex(S.skin,P.skin.length);S.hair=clampIndex(S.hair,P.hair.length);S.outfit=clampIndex(S.outfit,P.outfit.length);S.accent=clampIndex(S.accent,P.accent.length);S.petAccent=clampIndex(S.petAccent,P.petaccent.length);
if(!['tee','sweater','hoodie','dress','overalls','cardigan','blouse','vest','coat'].includes(S.os))S.os='sweater';
if(!['pixie','short','bob','long','verylong','wavy','curly','afro','braids','frenchbraid','twin','space','ponytail','lowpony','halfup','bun','messybun','fringe','curtain','hime','straight','V'].includes(S.hs))S.hs='bob';
if(!['sleep','knit','done'].includes(S.mode))S.mode='sleep';
if(!['me','pal'].includes(S.tab))S.tab='me';
S.spriteHue=Number.isFinite(Number(S.spriteHue))?Math.max(0,Math.min(360,Number(S.spriteHue))):0;
const $=s=>document.querySelector(s);
function draw(g,col,px){const c=document.createElement('canvas');c.width=W+2;c.height=H+2;const x=c.getContext('2d');const f=(i,j)=>g[i]&&g[i][j]&&g[i][j]!=='.';
for(let i=-1;i<=H;i++)for(let j=-1;j<=W;j++){if(f(i,j)){x.fillStyle=col[g[i][j]]||'#000';x.fillRect(j+1,i+1,1,1)}else if(f(i-1,j)||f(i+1,j)||f(i,j-1)||f(i,j+1)){x.fillStyle='#1d1470';x.fillRect(j+1,i+1,1,1)}}
c.style.cssText='width:'+(W+2)*px+'px;height:'+(H+2)*px+'px;image-rendering:pixelated';return c}
const heroC=px=>{const c=draw(hero(),cols({s:P.skin[S.skin],h:P.hair[S.hair],o:P.outfit[S.outfit],a:P.accent[S.accent],d:'#1d1470'}),px);c.className='hero-sprite';c.setAttribute('role','img');c.setAttribute('aria-label','Avatar humain personnalisable');return c};

/* Compagnons illustrés : sprites PNG dessinés individuellement.
   Chaque compagnon possède quatre poses : idle, happy, sleep et action. La grenouille a été redessinée avec une petite bouche souriante fermée, plus douce et discrète. */
const PET_SPRITES={"bunny-idle":"wip-sprites/bunny-idle.png","bunny-happy":"wip-sprites/bunny-happy.png","bunny-sleep":"wip-sprites/bunny-sleep.png","bunny-action":"wip-sprites/bunny-action.png","cat-idle":"wip-sprites/cat-idle.png","cat-happy":"wip-sprites/cat-happy.png","cat-sleep":"wip-sprites/cat-sleep.png","cat-action":"wip-sprites/cat-action.png","turtle-idle":"wip-sprites/turtle-idle.png","turtle-happy":"wip-sprites/turtle-happy.png","turtle-sleep":"wip-sprites/turtle-sleep.png","turtle-action":"wip-sprites/turtle-action.png","yarn-idle":"wip-sprites/yarn-idle.png","yarn-happy":"wip-sprites/yarn-happy.png","yarn-sleep":"wip-sprites/yarn-sleep.png","yarn-action":"wip-sprites/yarn-action.png","octo-idle":"wip-sprites/octo-idle.png","octo-happy":"wip-sprites/octo-happy.png","octo-sleep":"wip-sprites/octo-sleep.png","octo-action":"wip-sprites/octo-action.png","narwhal-idle":"wip-sprites/narwhal-idle.png","narwhal-happy":"wip-sprites/narwhal-happy.png","narwhal-sleep":"wip-sprites/narwhal-sleep.png","narwhal-action":"wip-sprites/narwhal-action.png","snail-idle":"wip-sprites/snail-idle.png","snail-happy":"wip-sprites/snail-happy.png","snail-sleep":"wip-sprites/snail-sleep.png","snail-action":"wip-sprites/snail-action.png","frog-idle":"wip-sprites/frog-idle.png","frog-happy":"wip-sprites/frog-happy.png","frog-sleep":"wip-sprites/frog-sleep.png","frog-action":"wip-sprites/frog-action.png","sheep-idle":"wip-sprites/sheep-idle.png","sheep-happy":"wip-sprites/sheep-happy.png","sheep-sleep":"wip-sprites/sheep-sleep.png","sheep-action":"wip-sprites/sheep-action.png","button-idle":"wip-sprites/button-idle.png","button-happy":"wip-sprites/button-happy.png","button-sleep":"wip-sprites/button-sleep.png","button-action":"wip-sprites/button-action.png","llama-idle":"wip-sprites/llama-idle.png","llama-happy":"wip-sprites/llama-happy.png","llama-sleep":"wip-sprites/llama-sleep.png","llama-action":"wip-sprites/llama-action.png","starfish-idle":"wip-sprites/starfish-idle.png","starfish-happy":"wip-sprites/starfish-happy.png","starfish-sleep":"wip-sprites/starfish-sleep.png","starfish-action":"wip-sprites/starfish-action.png","giraffe-idle":"wip-sprites/giraffe-idle.png","giraffe-happy":"wip-sprites/giraffe-happy.png","giraffe-sleep":"wip-sprites/giraffe-sleep.png","giraffe-action":"wip-sprites/giraffe-action.png","dalmatian-idle":"wip-sprites/dalmatian-idle.png","dalmatian-happy":"wip-sprites/dalmatian-happy.png","dalmatian-sleep":"wip-sprites/dalmatian-sleep.png","dalmatian-action":"wip-sprites/dalmatian-action.png","koala-idle":"wip-sprites/koala-idle.png","koala-happy":"wip-sprites/koala-happy.png","koala-sleep":"wip-sprites/koala-sleep.png","koala-action":"wip-sprites/koala-action.png","crab-idle":"wip-sprites/crab-idle.png","crab-happy":"wip-sprites/crab-happy.png","crab-sleep":"wip-sprites/crab-sleep.png","crab-action":"wip-sprites/crab-action.png"};
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
const humanSprite=()=>heroC(5);
const petPose=()=>S.mode==='sleep'?'sleep':S.mode==='knit'?'happy':'action';
const t0=Date.now();
const clock=()=>{const s=Math.floor((Date.now()-t0)/1000);return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')};
const bubble=()=>S.mode==='knit'?'♪ '+clock():S.mode==='done'?'★ fini !':'zzz…';
const PET_SIZE={ophanim:190,giraffe:212,llama:211,sheep:211,bunny:191,cat:195,turtle:205,koala:193,dalmatian:193,narwhal:202,octo:199,snail:184,frog:193,starfish:184,button:173,yarn:184,crab:164};
function petWithAccessory(kind,pose,cls){const wrap=document.createElement('div');wrap.className='pet-wrap '+cls;wrap.style.setProperty('--pet-size',(PET_SIZE[kind]||156)+'px');wrap.append(petImage(kind,pose,'pet-main'));const deco=document.createElement('span');deco.className='pet-deco '+(S.petAcc||'none');deco.textContent=({none:'',bow:'🎀',cowboy:'🤠',flower:'🌼',crown:'👑',cap:'🧢',beret:'🎨',bonnet:'🧶',glasses:'👓',scarf:'🧣',halo:'😇',wings:'🪽'})[S.petAcc]||'';deco.style.filter='hue-rotate('+(S.petAccent*55)+'deg)';wrap.append(deco);return wrap;}
function scene(){document.documentElement.style.setProperty('--sprite-hue',(S.spriteHue||0)+'deg');const sc=$('#scene');sc.innerHTML='<div class="rug"></div>';
const a=document.createElement('div');a.className='who '+({sleep:'slow',knit:'fast',done:'hop'})[S.mode];const stage=document.createElement('div');stage.className='hero-stage';stage.append(humanSprite());a.append(stage);const n=document.createElement('div');n.className='nm';n.textContent=S.name||'Moi';a.append(n);
const b=document.createElement('div');b.className='who '+({sleep:'slow',knit:'fast',done:'hop'})[S.mode];b.innerHTML='<div class="bub" id="bub"></div>';b.append(petWithAccessory(S.pal,petPose(),'pet-stage'));const m=document.createElement('div');m.className='nm';m.textContent=S.cn||'Compagnon';b.append(m);
sc.append(a,b);$('#bub').textContent=bubble()}
function set(k,v){S[k]=v;if(k==='pal'){S.cn=S.cNames[v]||DEFAULT_COMPANION_NAMES[v];}render()}
function sws(id,paletteKey,stateKey){const box=$('#s-'+id);if(!box)return;box.innerHTML='';P[paletteKey].forEach((c,i)=>{const b=document.createElement('button');b.type='button';b.className='sw';b.style.background=c;b.dataset.choice=stateKey;b.dataset.value=i;b.setAttribute('aria-label','Couleur '+(i+1));b.setAttribute('aria-pressed',String(Number(S[stateKey])===i));b.onclick=()=>{S[stateKey]=i;render()};box.append(b)})}
function buildChoiceList(id,items,key){const box=$('#'+id);box.innerHTML='';Object.entries(items).forEach(([value,label])=>{const b=document.createElement('button');b.type='button';b.className='choice';b.textContent=label;b.dataset.choice=key;b.dataset.value=value;b.onclick=()=>{if(key==='accs'||key==='layers'){S[key]=S[key].includes(value)?S[key].filter(x=>x!==value):[...S[key],value];}else S[key]=value;render()};box.append(b)})}
function buildSwatches(id,key){const box=$('#'+id);box.innerHTML='';P[key].forEach((color,i)=>{const b=document.createElement('button');b.type='button';b.className='sw';b.style.background=color;b.dataset.choice=key;b.dataset.value=i;b.setAttribute('aria-label','Couleur '+(i+1));b.onclick=()=>{S[key]=i;render()};box.append(b)})}
const hairChoices={pixie:'Pixie',short:'Courts',bob:'Carré',long:'Longs',verylong:'Très longs',wavy:'Ondulés',curly:'Bouclés',afro:'Afro',braids:'Tresses',frenchbraid:'Tresse couronne',twin:'Couettes',space:'Space buns',ponytail:'Queue haute',lowpony:'Queue basse',halfup:'Demi-attachés',bun:'Chignon',messybun:'Chignon flou',fringe:'Frange droite',curtain:'Frange rideau',hime:'Hime cut',straight:'Lisses'};
buildChoiceList('hair-choices',hairChoices,'hs');buildChoiceList('clothing-layer-choices',{cardigan:'Gilet',jacket:'Veste',vest:'Débardeur',apron:'Tablier',cape:'Cape',scarf:'Écharpe'},'layers');buildSwatches('skin-choices','skin');buildSwatches('hair-color-choices','hair');buildChoiceList('outfit-choices',ON,'os');buildSwatches('outfit-color-choices','outfit');buildChoiceList('accessory-choices',AN,'accs');buildSwatches('accessory-color-choices','accent');
function stp(id,k,names){const box=$('#p-'+id),keys=Object.keys(names);box.innerHTML='<button class="btn" aria-label="Précédent">◀</button><span></span><button class="btn" aria-label="Suivant">▶</button>';
const go=d=>set(k,keys[(keys.indexOf(S[k])+d+keys.length)%keys.length]);box.children[0].onclick=()=>go(-1);box.children[2].onclick=()=>go(1)}
stp('petacc','petAcc',PAN);sws('petaccent','petaccent','petAccent');
Object.keys(PN).forEach(k=>{const b=document.createElement('button');b.className='btn';b.dataset.pal=k;b.append(petImage(k,'idle','pet-thumb'));b.append(PN[k]);b.onclick=()=>set('pal',k);$('#pals').append(b)});
document.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>set('mode',b.dataset.m));
document.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>set('tab',b.dataset.t));
$('#sprite-hue').value=S.spriteHue||0;$('#hue-value').textContent=(S.spriteHue||0)+'°';
$('#sprite-hue').oninput=e=>{S.spriteHue=Number(e.target.value);$('#hue-value').textContent=S.spriteHue+'°';document.documentElement.style.setProperty('--sprite-hue',S.spriteHue+'deg');try{localStorage.setItem('wipProfile',JSON.stringify(S))}catch(err){}};
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
try{localStorage.setItem('wipProfile',JSON.stringify(S))}catch(e){}}
setInterval(()=>{if(S.mode==='knit'&&$('#bub'))$('#bub').textContent=bubble()},1000);
try{render()}catch(error){console.error('WIP Island : erreur au démarrage',error);const sceneEl=$('#scene');if(sceneEl){sceneEl.innerHTML='';const msg=document.createElement('p');msg.className='startup-error';msg.textContent='Oups ! WIP Island n’a pas réussi à charger. Recharge la page ou vérifie les fichiers.';sceneEl.append(msg)}}

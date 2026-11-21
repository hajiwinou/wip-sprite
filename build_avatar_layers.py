from PIL import Image, ImageDraw
import numpy as np, os
ROOT='/mnt/data/wipfix/wip-sprites/human/layers'
os.makedirs(ROOT+'/outfits',exist_ok=True);os.makedirs(ROOT+'/accessories',exist_ok=True)
base=Image.open('/mnt/data/wipfix/wip-sprites/human/avatar-base.png').convert('RGBA')
a=np.array(base);r,g,b,al=[a[:,:,i] for i in range(4)]; yy,xx=np.indices(r.shape)
# Original sweater pixels: warm pink range within torso/sleeve vertical band.
hue_mask=(r>g*1.10)&(b>g*.90)&(r>110)&(yy>=155)&(yy<=305)&(xx>=20)&(xx<=265)&(al>0)
# Filter out cheek/skin and face by restricting lower half of upper torso.
top_mask=hue_mask & ~((yy<185)&(xx>80)&(xx<210))
# Jeans pixels: blue/cyan range below waist.
pants_mask=(b>r*1.10)&(b>g*.90)&(r<190)&(yy>=280)&(yy<=465)&(xx>=65)&(xx<=230)&(al>0)
# refine masks using connected components, keep central garment and sleeves connected
from scipy import ndimage
for name,mask in [('top',top_mask),('pants',pants_mask)]:
 lab,n=ndimage.label(mask); sizes=np.bincount(lab.ravel()); keep=np.argsort(sizes[1:])[-3:]+1 if n else []
 m=np.isin(lab,keep); print(name, int(m.sum()), (np.where(m)[1].min(),np.where(m)[0].min(),np.where(m)[1].max(),np.where(m)[0].max()))
 if name=='top': top_mask=m
 else: pants_mask=m
# derive luminance shading from source pixels, use palette chosen by JS later through CSS canvas tinting.
# Store neutral greyscale alpha layers; preserve original source highlights/outline via luminance.
def save_mask(mask,path):
 out=np.zeros((512,288,4),dtype=np.uint8)
 lum=(.299*r+.587*g+.114*b).astype(np.uint8)
 # retain linework and folds as varying alpha/gray intensity; opaque garment pixels
 out[:,:,0]=lum;out[:,:,1]=lum;out[:,:,2]=lum;out[:,:,3]=(mask*255).astype(np.uint8)
 Image.fromarray(out,'RGBA').save(path)
tee_mask=top_mask & ~(((xx<96)|(xx>192)) & (yy>248))
save_mask(tee_mask,ROOT+'/outfits/tee.png')
for k in ['sweater','hoodie','overalls']:
 save_mask(top_mask,ROOT+f'/outfits/{k}.png')
save_mask(pants_mask,ROOT+'/outfits/bottoms.png')
# Additional silhouette overlays, pixelated with 2px steps, same 288x512 canvas.
def blank(): return Image.new('RGBA',(288,512),(0,0,0,0))
# Dress skirt: start at waist, flare over trousers to ankle; overlay mask in dress color.
im=blank();d=ImageDraw.Draw(im)
ink='#302044'; fabric='#d98fca'; light='#f4c6e8'
# pixelated skirt silhouette with outlined hem
poly=[(91,270),(197,270),(204,300),(218,365),(229,450),(214,462),(74,462),(59,450),(70,365),(84,300)]
d.polygon(poly,fill=fabric,outline=ink,width=5)
d.line([(91,281),(197,281)],fill=light,width=5)
d.line([(78,456),(210,456)],fill=ink,width=5)
d.line([(104,310),(92,435)],fill='#f6c6e8',width=5);d.line([(132,304),(126,445)],fill='#b979bd',width=4);d.line([(171,304),(184,435)],fill='#f6c6e8',width=5)
d.rectangle((138,300,145,428),fill='#b979bd')
d.ellipse((134,282,150,298),fill='#ffd86a',outline=ink,width=3)
# waist bow
d.polygon([(130,286),(142,278),(142,296)],fill='#ff8fca',outline=ink);d.polygon([(146,278),(158,286),(146,296)],fill='#ff8fca',outline=ink)
im.save(ROOT+'/outfits/dress-skirt.png')
# bib for overalls
im=blank();d=ImageDraw.Draw(im);d.rounded_rectangle((103,205,185,298),radius=8,fill='#7892db',outline=ink,width=5);d.rectangle((110,190,120,222),fill='#7892db',outline=ink,width=3);d.rectangle((168,190,178,222),fill='#7892db',outline=ink,width=3);d.rectangle((137,238,151,249),fill='#f7d58a',outline=ink,width=2);im.save(ROOT+'/outfits/overalls-bib.png')
# Hoodie pocket/hood accents
im=blank();d=ImageDraw.Draw(im);d.arc((103,155,185,236),180,360,fill=ink,width=5);d.line([(106,266),(182,266),(177,286),(111,286),(106,266)],fill='#f4c6e8',width=4);im.save(ROOT+'/outfits/hoodie-details.png')
# Accessories, raster pixel-art sprites at original avatar coordinates.
def outlined_poly(draw, pts, fill, width=4): draw.polygon(pts,fill=fill,outline=ink); 
# Pixel flower
im=blank();d=ImageDraw.Draw(im)
for box in [(214,55,236,77),(230,70,252,92),(214,86,236,108),(198,70,220,92),(214,70,236,92)]:d.ellipse(box,fill='#ff9dce',outline=ink,width=3)
d.ellipse((215,72,234,91),fill='#ffd86a',outline=ink,width=2);im.save(ROOT+'/accessories/flower.png')
# Bow
im=blank();d=ImageDraw.Draw(im);outlined_poly(d,[(205,63),(229,53),(226,83)],'#ff79bd');outlined_poly(d,[(231,53),(255,63),(235,83)],'#ff9dce');d.ellipse((223,63,236,76),fill='#ffd86a',outline=ink,width=3);im.save(ROOT+'/accessories/bow.png')
# Hijab wraps head and neck, keeping central face window clear.
im=blank();d=ImageDraw.Draw(im)
# outer scarf silhouette around hairline/head
outlined_poly(d,[(48,112),(42,76),(54,36),(86,7),(143,0),(202,9),(235,39),(247,78),(240,124),(224,180),(204,238),(175,258),(111,258),(82,238),(62,181)],'#9aa8ee',5)
# Ouverture du visage : descendue sous la frange pour ne pas laisser les cheveux dépasser.
face=[(84,128),(91,116),(111,105),(144,102),(177,110),(197,124),(203,145),(194,178),(176,204),(105,204),(88,180),(80,150)]
d.polygon(face,fill=(0,0,0,0))
d.line(face+[face[0]],fill=ink,width=4)
# plis doux du tissu et retombée sur les épaules
d.line([(61,126),(75,183),(104,229)],fill='#d7dafa',width=5);d.line([(228,126),(210,184),(180,230)],fill='#d7dafa',width=5)
d.line([(76,218),(106,247),(178,247),(207,218)],fill='#d7dafa',width=4)
im.save(ROOT+'/accessories/hijab.png')
# Headband
im=blank();d=ImageDraw.Draw(im);d.arc((48,18,238,137),190,350,fill='#ff80c4',width=10);d.arc((48,18,238,137),190,350,fill=ink,width=3);im.save(ROOT+'/accessories/headband.png')
# Beret
im=blank();d=ImageDraw.Draw(im);d.ellipse((77,6,207,72),fill='#a58bdb',outline=ink,width=5);d.line([(84,64),(202,64)],fill=ink,width=5);d.ellipse((137,3,150,16),fill='#ffcae5',outline=ink,width=2);im.save(ROOT+'/accessories/beret.png')
# Cap
im=blank();d=ImageDraw.Draw(im);d.pieslice((78,8,207,112),180,360,fill='#88a0ec',outline=ink,width=5);d.polygon([(139,68),(239,73),(229,89),(143,84)],fill='#88a0ec',outline=ink);im.save(ROOT+'/accessories/cap.png')
# Glasses
im=blank();d=ImageDraw.Draw(im);d.rounded_rectangle((75,100,125,135),radius=8,outline=ink,width=5);d.rounded_rectangle((161,100,211,135),radius=8,outline=ink,width=5);d.line([(125,115),(161,115)],fill=ink,width=5);d.line([(75,108),(60,101)],fill=ink,width=4);d.line([(211,108),(226,101)],fill=ink,width=4);im.save(ROOT+'/accessories/glasses.png')
# Necklace
im=blank();d=ImageDraw.Draw(im);d.arc((104,185,184,258),0,180,fill=ink,width=5);d.arc((108,188,180,254),0,180,fill='#ff8bc8',width=5);d.polygon([(143,245),(151,254),(143,264),(135,254)],fill='#ffd86a',outline=ink);im.save(ROOT+'/accessories/necklace.png')
# Backpack
im=blank();d=ImageDraw.Draw(im);d.rounded_rectangle((39,255,82,345),radius=12,fill='#9aa8ee',outline=ink,width=5);d.line([(77,255),(94,277),(89,329)],fill=ink,width=5);d.rectangle((49,289,73,317),fill='#f5c8e7',outline=ink,width=3);im.save(ROOT+'/accessories/backpack.png')
# Scarf
im=blank();d=ImageDraw.Draw(im);d.polygon([(98,188),(188,188),(181,220),(105,220)],fill='#ff8bc8',outline=ink);d.polygon([(165,210),(188,210),(196,290),(177,290)],fill='#ff8bc8',outline=ink);d.line([(105,211),(180,211)],fill='#ffd5eb',width=4);im.save(ROOT+'/accessories/scarf.png')
# Small hair clip
im=blank();d=ImageDraw.Draw(im);d.rounded_rectangle((201,94,240,106),radius=4,fill='#ff8bc8',outline=ink,width=3);d.ellipse((214,88,228,112),fill='#ffd86a',outline=ink,width=2);im.save(ROOT+'/accessories/hairclip.png')
# Crown
im=blank();d=ImageDraw.Draw(im);outlined_poly(d,[(92,49),(107,12),(135,40),(151,5),(175,40),(204,12),(216,50)],'#ffd86a',5);d.rectangle((99,48,210,65),fill='#ff91c9',outline=ink,width=4);im.save(ROOT+'/accessories/crown.png')
# Earrings
im=blank();d=ImageDraw.Draw(im);d.ellipse((56,151,70,165),fill='#ffd86a',outline=ink,width=3);d.ellipse((218,151,232,165),fill='#ffd86a',outline=ink,width=3);im.save(ROOT+'/accessories/earrings.png')
# Sunglasses
im=Image.open(ROOT+'/accessories/glasses.png');d=ImageDraw.Draw(im);d.rounded_rectangle((78,103,122,132),radius=6,fill='#554a78',outline=ink,width=3);d.rounded_rectangle((164,103,208,132),radius=6,fill='#554a78',outline=ink,width=3);im.save(ROOT+'/accessories/sunglasses.png')
print('created assets',len(os.listdir(ROOT+'/outfits')),len(os.listdir(ROOT+'/accessories')))
# Extra wearable layers: raster PNGs aligned to the 288x512 character canvas.
# Cardigan side panels and sleeves sit over the existing top.
im=blank();d=ImageDraw.Draw(im)
d.polygon([(73,198),(101,205),(105,305),(78,299)],fill='#9aa8ee',outline=ink);d.polygon([(183,205),(211,198),(210,299),(183,305)],fill='#9aa8ee',outline=ink);d.line([(96,210),(105,296)],fill='#d9e0ff',width=4);d.line([(192,210),(183,296)],fill='#d9e0ff',width=4);d.line([(109,218),(179,218)],fill=ink,width=3)
im.save(ROOT+'/outfits/cardigan.png')
# Jacket panels with collar
im=blank();d=ImageDraw.Draw(im);d.polygon([(74,197),(104,202),(111,300),(78,296)],fill='#7e8fc9',outline=ink);d.polygon([(180,202),(211,197),(210,296),(177,300)],fill='#7e8fc9',outline=ink);d.polygon([(104,199),(132,220),(143,207),(155,220),(183,199),(175,290),(113,290)],fill='#aab8ef',outline=ink);d.line([(144,210),(144,292)],fill=ink,width=3);im.save(ROOT+'/outfits/jacket.png')
# Apron
im=blank();d=ImageDraw.Draw(im);d.polygon([(111,218),(177,218),(191,320),(97,320)],fill='#f3b5d9',outline=ink);d.line([(112,218),(102,194),(185,194),(177,218)],fill='#f3b5d9',width=5);d.rectangle((126,263,164,289),fill='#ffe0ef',outline=ink,width=3);d.line([(108,228),(180,228)],fill='#fff0f7',width=3);im.save(ROOT+'/outfits/apron.png')
# Cape behind shoulders
im=blank();d=ImageDraw.Draw(im);d.polygon([(83,188),(112,200),(144,206),(176,200),(205,188),(220,350),(190,380),(96,380),(68,350)],fill='#9b83d6',outline=ink);d.line([(91,198),(112,320)],fill='#d8c9ff',width=4);d.line([(197,198),(176,320)],fill='#d8c9ff',width=4);im.save(ROOT+'/outfits/cape.png')
# Compact PNG thumbnails for the selection grid, cropped from the same real wearable layers.
for group in ['accessories','outfits']:
 srcdir=ROOT+'/'+group; thumbdir=srcdir+'/thumbs';os.makedirs(thumbdir,exist_ok=True)
 for fn in os.listdir(srcdir):
  if not fn.endswith('.png') or fn in ['bottoms.png','dress-skirt.png','overalls-bib.png','hoodie-details.png']: continue
  im=Image.open(srcdir+'/'+fn).convert('RGBA'); bbox=im.getbbox()
  if not bbox: continue
  crop=im.crop(bbox); crop.thumbnail((92,92),Image.Resampling.NEAREST)
  canvas=Image.new('RGBA',(100,100),(0,0,0,0));canvas.alpha_composite(crop,((100-crop.width)//2,(100-crop.height)//2));canvas.save(thumbdir+'/'+fn)
# Style-specific pixel details, layered over the shared garment silhouette.
im=blank();d=ImageDraw.Draw(im);d.line([(112,209),(143,226),(176,209)],fill=ink,width=4);d.line([(119,214),(143,232),(169,214)],fill='#fff0f7',width=3);d.ellipse((136,250,151,265),fill='#ff8bc8',outline=ink,width=2);im.save(ROOT+'/outfits/tee-details.png')
im=blank();d=ImageDraw.Draw(im);d.arc((110,198,178,244),0,180,fill=ink,width=4);d.arc((114,202,174,240),0,180,fill='#fff0f7',width=3);d.line([(75,290),(94,296)],fill='#fff0f7',width=3);d.line([(194,296),(213,290)],fill='#fff0f7',width=3);im.save(ROOT+'/outfits/sweater-details.png')

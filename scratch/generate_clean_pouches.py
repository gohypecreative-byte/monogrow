import os
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

base = Image.open('public/assets/monagrow-mix-dryfruits-packaging.png').convert('RGBA')
w, h = base.size

top_col = np.array([245, 230, 210, 255], dtype=np.float32)
bot_col = np.array([242, 226, 205, 255], dtype=np.float32)
th = 680 - 475
tw = 884 - 200
grad = np.zeros((th, tw, 4), dtype=np.uint8)
for y in range(th):
    t = y / float(th)
    col = (1 - t) * top_col + t * bot_col
    grad[y, :] = col.astype(np.uint8)
grad_img = Image.fromarray(grad, mode='RGBA')

f_arr = np.ones((th, tw), dtype=np.float32) * 255.0
f_size = 14
for i in range(f_size):
    factor = (i + 1) / float(f_size)
    f_arr[i, :] = np.minimum(f_arr[i, :], factor * 255.0)
    f_arr[th - 1 - i, :] = np.minimum(f_arr[th - 1 - i, :], factor * 255.0)
    f_arr[:, i] = np.minimum(f_arr[:, i], factor * 255.0)
    f_arr[:, tw - 1 - i] = np.minimum(f_arr[:, tw - 1 - i], factor * 255.0)
feather = Image.fromarray(f_arr.astype(np.uint8), mode='L').filter(ImageFilter.GaussianBlur(3))

win_mask = Image.open('scratch/window_mask_clean.png').convert('L')
win_mask_feather = win_mask.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(2))

font_prem = ImageFont.truetype('C:/Windows/Fonts/georgia.ttf', 19)
font_top = ImageFont.truetype('C:/Windows/Fonts/georgiab.ttf', 26)
font_main = ImageFont.truetype('C:/Windows/Fonts/georgiab.ttf', 44)
font_sub = ImageFont.truetype('C:/Windows/Fonts/georgia.ttf', 17)

maroon = (116, 7, 7, 255)
sub_col = (75, 50, 40, 230)

# Textures
walnut_src = Image.open('C:/Users/suris/.gemini/antigravity/brain/41af2181-0931-4c98-b994-adebc7d96505/scratch/test_walnut.jpg').convert('RGBA')
crop_walnut = walnut_src.crop((150, 250, 1150, 1350)).resize((564, 520), Image.Resampling.LANCZOS)

raisin_src = Image.open('C:/Users/suris/.gemini/antigravity/brain/41af2181-0931-4c98-b994-adebc7d96505/scratch/golden_raisins.jpg').convert('RGBA')
crop_raisin = raisin_src.crop((100, 80, 1180, 880)).resize((564, 520), Image.Resampling.LANCZOS)

cashew_src = Image.open('public/assets/cashew-kernels.jpg').convert('RGBA')
crop_cashew = cashew_src.crop((100, 100, 924, 924)).resize((564, 520), Image.Resampling.LANCZOS)

crop_almond = Image.open('scratch/cur_win_almonds.png').convert('RGBA')
crop_pistachio = Image.open('scratch/cur_win_pistachios.png').convert('RGBA')

items = [
    {
        'key': 'walnuts',
        'line1': 'KASHMIRI SNOW WHITE',
        'line2': 'WALNUTS',
        'sub1': 'Extra Light Halves • Snow Sweet & Naturally Crunchy',
        'sub2': 'Rich in Plant-Based Omega-3 & Antioxidants',
        'tex': crop_walnut,
    },
    {
        'key': 'raisins',
        'line1': 'GOLDEN LONG SEEDLESS',
        'line2': 'RAISINS',
        'sub1': 'Sun-Dried Golden Long Raisins • Naturally Sweet',
        'sub2': 'Source of Natural Energy & Essential Iron',
        'tex': crop_raisin,
    },
    {
        'key': 'cashews',
        'line1': 'ROYAL KING',
        'line2': 'CASHEWS W240',
        'sub1': 'Jumbo Whole White Cashews • Sweet Buttery Crunch',
        'sub2': '100% Unblemished Grade • Vacuum Nitrogen Packed',
        'tex': crop_cashew,
    },
    {
        'key': 'almonds',
        'line1': 'CALIFORNIA SELECT',
        'line2': 'ROYAL ALMONDS',
        'sub1': 'Plump Golden Whole Kernels • High Vitamin E & Protein',
        'sub2': 'Supreme Nonpareil Grade • Naturally Crunchy Snap',
        'tex': crop_almond,
    },
    {
        'key': 'pistachios',
        'line1': 'ROASTED & SALTED',
        'line2': 'JUMBO PISTACHIOS',
        'sub1': 'Naturally Tree-Opened • Light Himalayan Pink Salt',
        'sub2': 'Jumbo 18/20 Grade • Oven Roasted Without Oil',
        'tex': crop_pistachio,
    },
]

for it in items:
    pouch = base.copy()
    # 1. Clear title area completely
    pouch.paste(grad_img, (200, 475), feather)
    
    # 2. Draw clean branding & title
    draw = ImageDraw.Draw(pouch)
    bp = font_prem.getbbox('— PREMIUM —')
    draw.text(((w - (bp[2] - bp[0])) // 2, 482), '— PREMIUM —', fill=maroon, font=font_prem)
    
    b1 = font_top.getbbox(it['line1'])
    draw.text(((w - (b1[2] - b1[0])) // 2, 514), it['line1'], fill=maroon, font=font_top)
    
    b2 = font_main.getbbox(it['line2'])
    draw.text(((w - (b2[2] - b2[0])) // 2, 548), it['line2'], fill=maroon, font=font_main)
    
    bs1 = font_sub.getbbox(it['sub1'])
    draw.text(((w - (bs1[2] - bs1[0])) // 2, 608), it['sub1'], fill=sub_col, font=font_sub)
    
    bs2 = font_sub.getbbox(it['sub2'])
    draw.text(((w - (bs2[2] - bs2[0])) // 2, 632), it['sub2'], fill=sub_col, font=font_sub)
    
    # 3. Composite commodity texture into leaf window
    win_reg = pouch.crop((260, 685, 824, 1205))
    win_reg.paste(it['tex'], (0, 0), win_mask_feather)
    pouch.paste(win_reg, (260, 685))
    
    # 4. Save to public assets
    p1 = f"public/assets/monagrow-{it['key']}-pouch-new.png"
    p2 = f"public/assets/monagrow-{it['key']}-bag-cutout.png"
    pouch.save(p1, format='PNG', optimize=True)
    pouch.save(p2, format='PNG', optimize=True)
    print(f"Successfully built and saved {p1} & {p2}")

print("ALL 5 POUCHES BUILT PERFECTLY!")

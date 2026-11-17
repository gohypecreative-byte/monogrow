import numpy as np
from PIL import Image

def hex_to_rgb(hex_str):
    hex_str = hex_str.lstrip('#')
    return [int(hex_str[i:i+2], 16) for i in (0, 2, 4)]

panels = [
    ('Basmati Rice (Original Wood)', 'public/assets/hero-center-rice.png', '#142e61'),
    ('Estate Coffee (Original Wood)', 'public/assets/hero-center-coffee.png', '#754832'),
    ('Royal Dry Fruits (Original Wood)', 'public/assets/hero-center-dryfruit.png', '#3e164f'),
    ('Refined Sugar (Original Wood)', 'public/assets/hero-center-sugar.png', '#516b3b'),
]

canvas = Image.new('RGB', (1200, 1200), (20, 20, 20))

for idx, (title, img_path, bg_hex) in enumerate(panels):
    r, c = idx // 2, idx % 2
    x_off = c * 600
    y_off = r * 600
    
    bg_color = tuple(hex_to_rgb(bg_hex))
    panel_bg = Image.new('RGBA', (600, 600), bg_color + (255,))
    
    prod_img = Image.open(img_path).resize((540, 540), Image.Resampling.LANCZOS)
    panel_bg.paste(prod_img, (30, 30), prod_img)
    
    canvas.paste(panel_bg.convert('RGB'), (x_off, y_off))

canvas.save('scratch/bowls_preview_original.png')
print("Saved scratch/bowls_preview_original.png")

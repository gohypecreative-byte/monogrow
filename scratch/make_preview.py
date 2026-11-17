import numpy as np
from PIL import Image

def hex_to_rgb(hex_str):
    hex_str = hex_str.lstrip('#')
    return [int(hex_str[i:i+2], 16) for i in (0, 2, 4)]

panels = [
    ('Basmati Rice (Crystal Glass Bowl)', 'scratch/rice_glass.png', '#142e61'),
    ('Estate Coffee (Glazed Porcelain Bowl)', 'scratch/coffee_porcelain.png', '#754832'),
    ('Royal Dry Fruits (Burnished Copper Bowl)', 'scratch/dryfruit_copper.png', '#3e164f'),
    ('Refined Sugar (Crystal Glass Bowl)', 'scratch/sugar_glass.png', '#516b3b'),
]

# Create a 2x2 grid, each panel 600x600
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

canvas.save('scratch/bowls_preview_option1.png')
print("Saved scratch/bowls_preview_option1.png")

# Now let's also do Option 2 where Sugar is Obsidian Slate Ceramic:
panels[3] = ('Refined Sugar (Obsidian Slate Bowl)', 'scratch/sugar_obsidian.png', '#516b3b')
canvas2 = Image.new('RGB', (1200, 1200), (20, 20, 20))
for idx, (title, img_path, bg_hex) in enumerate(panels):
    r, c = idx // 2, idx % 2
    x_off = c * 600
    y_off = r * 600
    
    bg_color = tuple(hex_to_rgb(bg_hex))
    panel_bg = Image.new('RGBA', (600, 600), bg_color + (255,))
    
    prod_img = Image.open(img_path).resize((540, 540), Image.Resampling.LANCZOS)
    panel_bg.paste(prod_img, (30, 30), prod_img)
    
    canvas2.paste(panel_bg.convert('RGB'), (x_off, y_off))

canvas2.save('scratch/bowls_preview_option2.png')
print("Saved scratch/bowls_preview_option2.png")

import numpy as np
from PIL import Image

bg_color = (81, 107, 59) # #516b3b

options = [
    ('Crystal Glass', 'scratch/sugar_glass.png'),
    ('Obsidian Slate', 'scratch/sugar_obsidian.png'),
    ('Emerald Glazed', 'scratch/sugar_emerald.png'),
]

canvas = Image.new('RGB', (1800, 600), (20, 20, 20))

for idx, (title, img_path) in enumerate(options):
    panel = Image.new('RGBA', (600, 600), bg_color + (255,))
    img = Image.open(img_path).resize((540, 540), Image.Resampling.LANCZOS)
    panel.paste(img, (30, 30), img)
    canvas.paste(panel.convert('RGB'), (idx * 600, 0))

canvas.save('scratch/sugar_comparison.png')
print("Saved scratch/sugar_comparison.png")

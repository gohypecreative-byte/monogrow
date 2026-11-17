import numpy as np
from PIL import Image

for bg_name, filename in [('Hero Navy', 'scratch/rice_on_hero_bg.png'), ('Card Maroon', 'scratch/rice_on_card_bg.png')]:
    arr = np.array(Image.open(filename))
    h, w = arr.shape[:2]
    cx, cy = w / 2, h / 2
    y, x = np.indices((h, w))
    r = np.sqrt((x - cx)**2 + (y - cy)**2)
    
    # Outer glass rim: r between 230 and 260
    rim = arr[(r >= 230) & (r <= 260)]
    print(f"{bg_name} rim: mean RGB={rim.mean(axis=0).astype(int)}")

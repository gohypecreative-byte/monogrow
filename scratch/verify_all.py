import numpy as np
from PIL import Image

files = [
    ('Rice (Glass)', 'scratch/rice_glass.png'),
    ('Coffee (Porcelain)', 'scratch/coffee_porcelain.png'),
    ('Dry Fruits (Copper)', 'scratch/dryfruit_copper.png'),
    ('Sugar (Obsidian)', 'scratch/sugar_obsidian.png'),
    ('Sugar (Glass)', 'scratch/sugar_glass.png'),
]

for title, path in files:
    img = Image.open(path)
    arr = np.array(img)
    alpha = arr[:, :, 3]
    rgb = arr[:, :, :3]
    ys, xs = np.where(alpha > 30)
    cx = (xs.min() + xs.max()) / 2.0
    cy = (ys.min() + ys.max()) / 2.0
    
    # Outer rim color: r between 480 and 520
    y_grid, x_grid = np.indices(alpha.shape)
    r = np.sqrt((x_grid - cx)**2 + (y_grid - cy)**2)
    rim_pixels = rgb[(r >= 480) & (r <= 520) & (alpha > 100)]
    mean_rim = rim_pixels.mean(axis=0).astype(int)
    
    print(f"{title}: size={img.size}, mode={img.mode}, center=({cx:.1f}, {cy:.1f}), rim mean RGB={mean_rim}")

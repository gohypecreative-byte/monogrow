import numpy as np
from PIL import Image

for name in ['rice', 'coffee', 'dryfruit', 'sugar']:
    img = Image.open(f'public/assets/hero-center-{name}.png')
    arr = np.array(img)
    alpha = arr[:, :, 3]
    rgb = arr[:, :, :3]
    h, w = alpha.shape
    
    # Let's find the bounding box of non-transparent pixels
    ys, xs = np.where(alpha > 30)
    print(f"\n=== {name} ===")
    print(f"BBox: X [{xs.min()}, {xs.max()}], Y [{ys.min()}, {ys.max()}]")
    cx = (xs.min() + xs.max()) / 2.0
    cy = (ys.min() + ys.max()) / 2.0
    rx = (xs.max() - xs.min()) / 2.0
    ry = (ys.max() - ys.min()) / 2.0
    print(f"Center: ({cx:.1f}, {cy:.1f}), Radii: rx={rx:.1f}, ry={ry:.1f}, aspect={ry/rx:.3f}")

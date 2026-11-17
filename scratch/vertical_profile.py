import numpy as np
from PIL import Image

for name in ['rice', 'coffee', 'dryfruit', 'sugar']:
    img = Image.open(f'public/assets/hero-center-{name}.png')
    arr = np.array(img)
    alpha = arr[:, :, 3]
    rgb = arr[:, :, :3]
    
    ys, xs = np.where(alpha > 30)
    cx = int(round((xs.min() + xs.max()) / 2.0))
    cy = int(round((ys.min() + ys.max()) / 2.0))
    
    print(f"\n=================== {name} (Vertical profile at x={cx}) ===================")
    for y in range(ys.min(), ys.max() + 1, 30):
        a = alpha[y, cx]
        c = rgb[y, cx]
        print(f"  y={y:4d} (dy={y-cy:+4d}): alpha={a:3d}, RGB=[{c[0]:3d}, {c[1]:3d}, {c[2]:3d}]")

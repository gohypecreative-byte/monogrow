import numpy as np
from PIL import Image

for name in ['rice', 'coffee', 'dryfruit', 'sugar']:
    img = Image.open(f'public/assets/hero-center-{name}.png')
    arr = np.array(img)
    alpha = arr[:, :, 3]
    rgb = arr[:, :, :3]
    h, w = alpha.shape
    
    ys, xs = np.where(alpha > 30)
    cx = (xs.min() + xs.max()) / 2.0
    cy = (ys.min() + ys.max()) / 2.0
    
    print(f"\n=================== {name} ===================")
    # Check at 4 cardinal directions: East (angle 0), South (angle 90), West (angle 180), North (angle 270)
    for angle_deg in [0, 45, 90, 135, 180, 225, 270, 315]:
        rad = np.deg2rad(angle_deg)
        print(f"--- Angle {angle_deg}° ---")
        for dist in range(350, 580, 25):
            px = int(cx + dist * np.cos(rad))
            py = int(cy + dist * np.sin(rad))
            if 0 <= px < w and 0 <= py < h:
                a = alpha[py, px]
                c = rgb[py, px]
                print(f"  dist={dist}: alpha={a}, RGB=[{c[0]:3d}, {c[1]:3d}, {c[2]:3d}]")

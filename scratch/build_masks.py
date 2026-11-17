import numpy as np
from PIL import Image

def get_bowl_mask(name):
    img = Image.open(f'public/assets/hero-center-{name}.png')
    arr = np.array(img)
    alpha = arr[:, :, 3]
    rgb = arr[:, :, :3]
    h, w = alpha.shape
    
    # 1. Non-transparent bbox and center
    ys, xs = np.where(alpha > 30)
    cx = (xs.min() + xs.max()) / 2.0
    cy = (ys.min() + ys.max()) / 2.0
    
    y_grid, x_grid = np.indices((h, w))
    dx = x_grid - cx
    dy = y_grid - cy
    
    # Elliptical radius from center
    # Top opening has aspect ratio ~ 0.90 to 0.95
    # The bowl rim is generally at r > 440
    # In the bottom (dy > 300), the bowl wall extends further down
    
    # Let's inspect each product's specific characteristics
    return img, arr, alpha, rgb, cx, cy, dx, dy

print("get_bowl_mask defined")

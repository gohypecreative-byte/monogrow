import numpy as np
from PIL import Image

for name in ['rice', 'coffee', 'dryfruit', 'sugar']:
    img = Image.open(f'public/assets/hero-center-{name}.png')
    arr = np.array(img)
    alpha = arr[:, :, 3]
    rgb = arr[:, :, :3]
    h, w = alpha.shape
    
    # Grid coordinates
    y_grid, x_grid = np.indices((h, w))
    
    # Calculate center of non-transparent mass
    mask_solid = alpha > 100
    cy = np.mean(y_grid[mask_solid])
    cx = np.mean(x_grid[mask_solid])
    
    # Radial distance from center (scaled by slight vertical tilt)
    dy = y_grid - cy
    dx = x_grid - cx
    
    # Find outer boundary of alpha > 20 along vertical and horizontal axes
    print(f"\n--- {name} (center: x={cx:.1f}, y={cy:.1f}) ---")
    
    # Sample slices:
    # Let's inspect where the wood rim begins and ends
    # For instance, along radius:
    r = np.sqrt(dx**2 + (dy * 1.15)**2)
    for r_test in [300, 360, 420, 460, 500, 540]:
        ring = (r >= r_test - 10) & (r <= r_test + 10) & (alpha > 100)
        if np.any(ring):
            mean_c = rgb[ring].mean(axis=0).astype(int)
            print(f"  r={r_test}: count={np.sum(ring)}, mean RGB={mean_c}")

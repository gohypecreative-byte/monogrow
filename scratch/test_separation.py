import numpy as np
from PIL import Image

def analyze_separation():
    for name in ['rice', 'coffee', 'dryfruit', 'sugar']:
        img = Image.open(f'public/assets/hero-center-{name}.png')
        arr = np.array(img)
        alpha = arr[:, :, 3]
        rgb = arr[:, :, :3]
        h, w = alpha.shape
        
        ys, xs = np.where(alpha > 30)
        cx = (xs.min() + xs.max()) / 2.0
        cy = (ys.min() + ys.max()) / 2.0
        
        y_grid, x_grid = np.indices((h, w))
        dx = x_grid - cx
        dy = y_grid - cy
        
        # Elliptical distance metric for the inner rim:
        # Top rim is slightly foreshortened: dy < 0 has scale 1.15
        # Bottom side has dy > 0
        scale_y = np.where(dy < 0, 1.18, 0.95)
        r_inner = np.sqrt(dx**2 + (dy * scale_y)**2)
        
        # Check pixels in the transition zone r_inner between 380 and 480
        zone = (r_inner >= 380) & (r_inner <= 480) & (alpha > 50)
        lum = 0.299 * rgb[:, :, 0] + 0.587 * rgb[:, :, 1] + 0.114 * rgb[:, :, 2]
        
        print(f"=== {name} ===")
        print(f"  Zone pixels: {np.sum(zone)}, Mean Lum: {lum[zone].mean():.1f}, Min: {lum[zone].min():.1f}, Max: {lum[zone].max():.1f}")

analyze_separation()

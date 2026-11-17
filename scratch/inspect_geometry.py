import numpy as np
from PIL import Image

for name in ['rice', 'coffee', 'dryfruit', 'sugar']:
    img = Image.open(f'public/assets/hero-center-{name}.png')
    arr = np.array(img)
    alpha = arr[:, :, 3]
    h, w = alpha.shape
    
    ys, xs = np.where(alpha > 30)
    cx = (xs.min() + xs.max()) / 2.0
    cy = (ys.min() + ys.max()) / 2.0
    
    y_grid, x_grid = np.indices((h, w))
    dy = y_grid - cy
    dx = x_grid - cx
    
    # Calculate elliptical distance
    # The bowl top opening is an ellipse with ry/rx ~ 0.88 - 0.95
    # The center is heaped so ingredients spill slightly over the rim
    print(f"{name}: center=({cx:.1f}, {cy:.1f}), total non-transparent={np.sum(alpha > 30)}")

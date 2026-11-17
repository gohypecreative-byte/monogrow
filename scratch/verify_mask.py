import numpy as np
from PIL import Image

mask = np.array(Image.open('scratch/rice_wood_mask.png')) > 0
img = Image.open('public/assets/hero-center-rice.png')
arr = np.array(img)
alpha = arr[:, :, 3]

ys, xs = np.where(alpha > 30)
cx = (xs.min() + xs.max()) / 2.0
cy = (ys.min() + ys.max()) / 2.0
h, w = mask.shape

y_grid, x_grid = np.indices((h, w))
dist = np.sqrt((x_grid - cx)**2 + (y_grid - cy)**2)

print(f"Mask total pixels: {np.sum(mask)}")
print(f"Mask pixels with dist < 300: {np.sum(mask & (dist < 300))}")
print(f"Mask pixels with dist >= 350: {np.sum(mask & (dist >= 350))}")

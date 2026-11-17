import numpy as np
from PIL import Image

orig = np.array(Image.open('public/assets/hero-center-coffee.png'))
porc = np.array(Image.open('scratch/test_coffee_porcelain.png'))

diff = np.abs(orig.astype(float) - porc.astype(float))
print(f"Max diff: {diff.max()}")
print(f"Pixels changed: {np.sum(diff[:, :, :3] > 10)}")

# Check center pixels (inside r < 350)
ys, xs = np.where(orig[:, :, 3] > 30)
cx = (xs.min() + xs.max()) / 2.0
cy = (ys.min() + ys.max()) / 2.0
h, w = orig.shape[:2]
y_grid, x_grid = np.indices((h, w))
r = np.sqrt((x_grid - cx)**2 + (y_grid - cy)**2)

center_changed = np.sum((diff[:, :, :3] > 10) & (r[:, :, None] < 350))
print(f"Center beans changed (r < 350): {center_changed} (should be 0)")

import numpy as np
from PIL import Image, ImageFilter

img = Image.open('public/assets/hero-center-sugar.png')
arr = np.array(img).astype(np.float32)
alpha = arr[:, :, 3]
rgb = arr[:, :, :3]
h, w = alpha.shape

ys, xs = np.where(alpha > 30)
cx = (xs.min() + xs.max()) / 2.0
cy = (ys.min() + ys.max()) / 2.0

y_grid, x_grid = np.indices((h, w), dtype=np.float32)
dx = x_grid - cx
dy = y_grid - cy
scale_y = np.where(dy < 0, 1.15, 1.0)
r = np.sqrt(dx**2 + (dy * scale_y)**2)

# Wood has: R > G > B, with R > 40, G in [20, 100], B in [5, 60], and NOT green (sugarcane)
is_wood_color = (rgb[:, :, 0] > rgb[:, :, 1] + 10) & (rgb[:, :, 0] > rgb[:, :, 2] + 20) & (rgb[:, :, 1] > rgb[:, :, 2])
is_sugarcane = (rgb[:, :, 1] > rgb[:, :, 0] - 15) & (rgb[:, :, 1] > rgb[:, :, 2] + 10)
is_sugar_white = (rgb[:, :, 0] > 175) & (rgb[:, :, 1] > 170) & (rgb[:, :, 2] > 160)

# The bowl is in the outer zone
mask_bowl = (r > 420) & (alpha > 30) & is_wood_color & (~is_sugarcane) & (~is_sugar_white)

print(f"Bowl pixels strictly wood: {np.sum(mask_bowl)}")
print(f"Sugarcane pixels safely protected: {np.sum(is_sugarcane)}")
print(f"Overlap between mask and sugarcane: {np.sum(mask_bowl & is_sugarcane)}")

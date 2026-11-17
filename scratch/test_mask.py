import numpy as np
from PIL import Image

# Let's inspect the rice image and detect the bowl pixels
img = Image.open('public/assets/hero-center-rice.png')
arr = np.array(img)
alpha = arr[:, :, 3]
rgb = arr[:, :, :3]
h, w = alpha.shape

ys, xs = np.where(alpha > 30)
cx = (xs.min() + xs.max()) / 2.0
cy = (ys.min() + ys.max()) / 2.0

# Radial metric
dy = (np.arange(h)[:, None] - cy)
dx = (np.arange(w)[None, :] - cx)

# In rice, rice is very light (Luminance > 140 or R+G+B > 450), whereas the wooden bowl is dark brown (R+G+B < 350 and R > G > B)
lum = 0.299 * rgb[:, :, 0] + 0.587 * rgb[:, :, 1] + 0.114 * rgb[:, :, 2]
is_wood = (alpha > 50) & (lum < 155) & (rgb[:, :, 0] > rgb[:, :, 2] + 15) & (rgb[:, :, 0] > rgb[:, :, 1])

# Save a mask preview
mask_img = Image.fromarray((is_wood * 255).astype(np.uint8))
mask_img.save('scratch/rice_wood_mask.png')
print("Saved scratch/rice_wood_mask.png")

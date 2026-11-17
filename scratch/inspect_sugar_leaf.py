import numpy as np
from PIL import Image

img = Image.open('public/assets/hero-center-sugar.png')
arr = np.array(img)
rgb = arr[:, :, :3]
alpha = arr[:, :, 3]

# Where is green? G > R + 15 and G > B + 15
is_green = (rgb[:, :, 1] > rgb[:, :, 0] + 15) & (rgb[:, :, 1] > rgb[:, :, 2] + 15) & (alpha > 50)
ys, xs = np.where(is_green)
if len(xs) > 0:
    print(f"Sugarcane green pixels: {len(xs)}, X: [{xs.min()}, {xs.max()}], Y: [{ys.min()}, {ys.max()}]")
else:
    print("No green detected")

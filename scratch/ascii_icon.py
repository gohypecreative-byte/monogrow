import numpy as np
from PIL import Image

img = Image.open('scratch/left_icon_crop.png')
arr = np.array(img.convert('L'))
h, w = arr.shape

# Threshold dark pixels
dark = arr < 220
ys, xs = np.where(dark)
print(f"Icon bbox: X [{xs.min()}, {xs.max()}], Y [{ys.min()}, {ys.max()}]")
print(f"Icon width: {xs.max() - xs.min()}, height: {ys.max() - ys.min()}")

# Print ascii art of the icon
sub = dark[ys.min():ys.max()+1, xs.min():xs.max()+1]
# downsample to 20 lines
sh, sw = sub.shape
step_y = max(1, sh // 22)
step_x = max(1, sw // 44)
for r in range(0, sh, step_y):
    row_str = "".join(["#" if np.any(sub[r:r+step_y, c:c+step_x]) else " " for c in range(0, sw, step_x)])
    print(row_str)

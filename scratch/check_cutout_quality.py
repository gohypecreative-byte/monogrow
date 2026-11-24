from PIL import Image
import numpy as np

for name in ["premium", "rozana"]:
    im = Image.open(f"scratch/test_cutout_{name}.png")
    arr = np.array(im)
    w, h = im.size
    print(f"=== {name} ({w}x{h}) ===")
    # Look at bottom 40 rows
    bot_alpha = arr[-40:, :, 3]
    # Check pixels where alpha is between 1 and 200
    semi = (bot_alpha > 0) & (bot_alpha < 240)
    print(f"  semi-transparent pixels at bottom: {semi.sum()}")
    # Check what the RGB values are for bottom pixels
    y_idx, x_idx = np.where(arr[:, :, 3] > 0)
    print(f"  Lowest y where alpha > 0: {y_idx.max()} (total h={h})")

from PIL import Image
import numpy as np

arr = np.array(Image.open('scratch/user_left_wheat.png').convert('L'))
h, w = arr.shape

# Threshold dark strokes
dark = arr < 220
ys, xs = np.where(dark)
if len(xs) > 0:
    print(f"Wheat crop: X [{xs.min()}, {xs.max()}], Y [{ys.min()}, {ys.max()}]")
    sub = dark[ys.min():ys.max()+1, xs.min():xs.max()+1]
    sh, sw = sub.shape
    for r in range(sh):
        row = "".join(["#" if sub[r, c] else " " for c in range(sw)])
        print(f"{r:2d}: {row}")

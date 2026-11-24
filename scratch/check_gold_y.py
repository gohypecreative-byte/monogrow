from PIL import Image
import numpy as np

im = Image.open(r"C:/Users/suris/.gemini/antigravity/brain/41af2181-0931-4c98-b994-adebc7d96505/.user_uploaded/media_1795498974455_e31bdf8c.jpg")
arr = np.array(im)

for y in range(710, 740):
    # In center x=512
    r, g, b = arr[y, 512]
    # Gold is distinctly rich: r in [180, 245], g in [140, 215], b in [40, 120]
    is_gold = (r > 160) and (g > 120) and (b < 120) and (r - b > 50)
    print(f"y={y}: RGB=({r},{g},{b}) gold={is_gold}")

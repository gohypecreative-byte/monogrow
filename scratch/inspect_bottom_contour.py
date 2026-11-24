from PIL import Image
import numpy as np

images = {
    "cashews": r"C:/Users/suris/.gemini/antigravity/brain/41af2181-0931-4c98-b994-adebc7d96505/.user_uploaded/media_1795498974455_e31bdf8c.jpg",
    "almonds": r"C:/Users/suris/.gemini/antigravity/brain/41af2181-0931-4c98-b994-adebc7d96505/.user_uploaded/media_1795498974512_283f823e.jpg",
    "pistachios": r"C:/Users/suris/.gemini/antigravity/brain/41af2181-0931-4c98-b994-adebc7d96505/.user_uploaded/media_1795498999220_33469646.jpg",
    "raisins": r"C:/Users/suris/.gemini/antigravity/brain/41af2181-0931-4c98-b994-adebc7d96505/.user_uploaded/media_1795499012127_3b2af30a.jpg",
    "walnuts": r"C:/Users/suris/.gemini/antigravity/brain/41af2181-0931-4c98-b994-adebc7d96505/.user_uploaded/media_1795499021736_eaed7657.jpg",
}

for name, path in images.items():
    im = Image.open(path)
    arr = np.array(im)
    # Let's inspect the bottom profile across x from 300 to 724
    bottom_y = []
    for x in range(300, 725, 20):
        col = arr[680:750, x]
        # find last pixel where color is non-white (pouch rim)
        # Gold rim: r > 160, g > 110, b < 90
        # Or maroon base: r > 80, g < 40, b < 40
        y_hit = None
        for y_idx in range(len(col)-1, -1, -1):
            r, g, b = col[y_idx]
            # Shadow is greyish: r,g,b all between 200 and 245 with difference < 15
            # Pouch rim is colored!
            is_shadow = (min(r, g, b) > 175) and (max(r, g, b) - min(r, g, b) < 22)
            is_white = min(r, g, b) > 248
            if not is_shadow and not is_white:
                y_hit = 680 + y_idx
                break
        bottom_y.append(y_hit)
    print(f"{name}: bottom Y across width: min={min(bottom_y)}, max={max(bottom_y)}")

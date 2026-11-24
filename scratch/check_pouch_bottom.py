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
    # Check column 512 (center) at y from 680 to 760
    center_col = arr[680:760, 512]
    # Gold rim is gold (R > 180, G > 140, B < 80), floor shadow has R ~ G ~ B
    for y_rel, (r, g, b) in enumerate(center_col):
        y = 680 + y_rel
        if (r > 160 and g > 120 and b < 100) or (r > 100 and g < 50 and b < 50):
            last_pouch_y = y
    print(f"{name}: estimated pouch bottom along center y={last_pouch_y}")

from PIL import Image
import numpy as np

images = {
    "cashews": r"C:/Users/suris/.gemini/antigravity/brain/41af2181-0931-4c98-b994-adebc7d96505/.user_uploaded/media_1795498974455_e31bdf8c.jpg",
    "almonds": r"C:/Users/suris/.gemini/antigravity/brain/41af2181-0931-4c98-b994-adebc7d96505/.user_uploaded/media_1795498974512_283f823e.jpg",
    "pistachios": r"C:/Users/suris/.gemini/antigravity/brain/41af2181-0931-4c98-b994-adebc7d96505/.user_uploaded/media_179549999220_33469646.jpg" if False else r"C:/Users/suris/.gemini/antigravity/brain/41af2181-0931-4c98-b994-adebc7d96505/.user_uploaded/media_1795498999220_33469646.jpg",
    "raisins": r"C:/Users/suris/.gemini/antigravity/brain/41af2181-0931-4c98-b994-adebc7d96505/.user_uploaded/media_1795499012127_3b2af30a.jpg",
    "walnuts": r"C:/Users/suris/.gemini/antigravity/brain/41af2181-0931-4c98-b994-adebc7d96505/.user_uploaded/media_1795499021736_eaed7657.jpg",
}

for name, path in images.items():
    im = Image.open(path)
    arr = np.array(im)
    # non-white pixels: where min(r, g, b) < 240
    non_white = (arr[:, :, 0] < 240) | (arr[:, :, 1] < 240) | (arr[:, :, 2] < 240)
    y_indices, x_indices = np.where(non_white)
    print(f"{name}: y=[{y_indices.min()}, {y_indices.max()}], x=[{x_indices.min()}, {x_indices.max()}], w={x_indices.max()-x_indices.min()}, h={y_indices.max()-y_indices.min()}")

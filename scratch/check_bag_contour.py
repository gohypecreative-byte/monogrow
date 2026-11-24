from PIL import Image
import numpy as np

for name, path in [
    ("rozana", r"C:/Users/suris/.gemini/antigravity/brain/41af2181-0931-4c98-b994-adebc7d96505/.user_uploaded/media_1795500400167_08adacb0.jpg"),
    ("premium", r"C:/Users/suris/.gemini/antigravity/brain/41af2181-0931-4c98-b994-adebc7d96505/.user_uploaded/media_1795500400165_76f6d904.jpg")
]:
    im = Image.open(path)
    arr = np.array(im)
    # Non-white pixels: min(r,g,b) < 240
    mask = (arr[:, :, 0] < 240) | (arr[:, :, 1] < 240) | (arr[:, :, 2] < 240)
    y_idx, x_idx = np.where(mask)
    print(f"=== {name} ===")
    print(f"  Overall non-white bbox: x=[{x_idx.min()}, {x_idx.max()}], y=[{y_idx.min()}, {y_idx.max()}]")
    
    # Check bottom profile: the bag bottom gold rim vs the floor shadow/grains
    # Let's inspect rows around y=800 to 950
    # Gold rim on bag: y around 840-860
    # Floor grains: y > 860, x around 550 to 750
    # Let's check non-white pixels at y > 840
    for y in range(830, 950, 10):
        xs = np.where(mask[y, :])[0]
        if len(xs) > 0:
            print(f"  y={y}: x_range=[{xs.min()}, {xs.max()}], count={len(xs)}")

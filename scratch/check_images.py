import os
from PIL import Image

srcs = {
    "cashews": r"C:/Users/suris/.gemini/antigravity/brain/41af2181-0931-4c98-b994-adebc7d96505/.user_uploaded/media_1795498974455_e31bdf8c.jpg",
    "almonds": r"C:/Users/suris/.gemini/antigravity/brain/41af2181-0931-4c98-b994-adebc7d96505/.user_uploaded/media_1795498974512_283f823e.jpg",
    "pistachios": r"C:/Users/suris/.gemini/antigravity/brain/41af2181-0931-4c98-b994-adebc7d96505/.user_uploaded/media_1795498999220_33469646.jpg",
    "raisins": r"C:/Users/suris/.gemini/antigravity/brain/41af2181-0931-4c98-b994-adebc7d96505/.user_uploaded/media_1795499012127_3b2af30a.jpg",
    "walnuts": r"C:/Users/suris/.gemini/antigravity/brain/41af2181-0931-4c98-b994-adebc7d96505/.user_uploaded/media_1795499021736_eaed7657.jpg",
}

for name, path in srcs.items():
    print(f"SRC {name}: exists={os.path.exists(path)}")
    target_new = f"public/assets/monagrow-{name}-pouch-new.png"
    target_cutout = f"public/assets/monagrow-{name}-bag-cutout.png"
    print(f"  {target_new}: exists={os.path.exists(target_new)}, size={os.path.getsize(target_new) if os.path.exists(target_new) else 0}")
    print(f"  {target_cutout}: exists={os.path.exists(target_cutout)}, size={os.path.getsize(target_cutout) if os.path.exists(target_cutout) else 0}")

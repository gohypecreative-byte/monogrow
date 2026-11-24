import os
from PIL import Image

uploads = [
    ("cashews", r"C:/Users/suris/.gemini/antigravity/brain/41af2181-0931-4c98-b994-adebc7d96505/.user_uploaded/media_1795498974455_e31bdf8c.jpg"),
    ("almonds", r"C:/Users/suris/.gemini/antigravity/brain/41af2181-0931-4c98-b994-adebc7d96505/.user_uploaded/media_1795498974512_283f823e.jpg"),
    ("pistachios", r"C:/Users/suris/.gemini/antigravity/brain/41af2181-0931-4c98-b994-adebc7d96505/.user_uploaded/media_1795498999220_33469646.jpg"),
    ("raisins", r"C:/Users/suris/.gemini/antigravity/brain/41af2181-0931-4c98-b994-adebc7d96505/.user_uploaded/media_1795499012127_3b2af30a.jpg"),
    ("walnuts", r"C:/Users/suris/.gemini/antigravity/brain/41af2181-0931-4c98-b994-adebc7d96505/.user_uploaded/media_1795499021736_eaed7657.jpg"),
]

for name, src in uploads:
    im = Image.open(src)
    print(f"{name} src: {im.size}, mode={im.mode}")
    
    # Check what is currently in public/assets/monagrow-{name}-pouch-new.png
    pouch_new = f"public/assets/monagrow-{name}-pouch-new.png"
    if os.path.exists(pouch_new):
        im_new = Image.open(pouch_new)
        print(f"  pouch-new: {im_new.size}, mode={im_new.mode}, bbox={im_new.getbbox()}")
    
    # Check what is currently in public/assets/monagrow-{name}-bag-cutout.png
    cutout = f"public/assets/monagrow-{name}-bag-cutout.png"
    if os.path.exists(cutout):
        im_cut = Image.open(cutout)
        print(f"  bag-cutout: {im_cut.size}, mode={im_cut.mode}, bbox={im_cut.getbbox()}")

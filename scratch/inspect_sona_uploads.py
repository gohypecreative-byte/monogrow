from PIL import Image
import numpy as np

uploads = {
    "rozana": r"C:/Users/suris/.gemini/antigravity/brain/41af2181-0931-4c98-b994-adebc7d96505/.user_uploaded/media_1795500400167_08adacb0.jpg",
    "premium": r"C:/Users/suris/.gemini/antigravity/brain/41af2181-0931-4c98-b994-adebc7d96505/.user_uploaded/media_1795500400165_76f6d904.jpg",
}

for k, path in uploads.items():
    im = Image.open(path)
    arr = np.array(im)
    print(f"Upload {k}: size={im.size}, mode={im.mode}")
    print(f"  corners: TL={arr[0,0]}, TR={arr[0,-1]}, BL={arr[-1,0]}, BR={arr[-1,-1]}")

existing_rice = [
    "public/assets/monagrow-rice-bag-cutout.png",
    "public/assets/monagrow-katarni-bag-cutout.png",
    "public/assets/monagrow-golden-sella-bag-cutout.png",
    "public/assets/monagrow-brown-rice-bag-cutout.png",
]

for p in existing_rice:
    im = Image.open(p)
    bbox = im.getbbox()
    print(f"Existing {p}: size={im.size}, bbox={bbox}")

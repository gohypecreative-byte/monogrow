from PIL import Image

for name in [
    "public/assets/monagrow-rice-bag-cutout.png",
    "public/assets/monagrow-katarni-bag-cutout.png",
    "public/assets/monagrow-golden-sella-bag-cutout.png",
    "public/assets/monagrow-brown-rice-bag-cutout.png"
]:
    im = Image.open(name)
    print(name, im.size)
    # Check bottom 50 rows
    w, h = im.size
    crop_b = im.crop((0, h-50, w, h))
    crop_b.save(f"scratch/check_base_{name.split('/')[-1]}")
    print(f"Saved scratch/check_base_{name.split('/')[-1]}")

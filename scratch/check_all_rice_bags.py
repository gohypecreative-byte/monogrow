from PIL import Image

bags = [
    'public/assets/monagrow-rice-bag-cutout.png',
    'public/assets/monagrow-golden-sella-bag-cutout.png',
    'public/assets/monagrow-katarni-bag-cutout.png',
    'public/assets/monagrow-jeera-masino-bag-cutout.png',
    'public/assets/monagrow-traditional-basmati-bag-cutout.png',
    'public/assets/monagrow-brown-rice-bag-cutout.png'
]

for b in bags:
    im = Image.open(b)
    print(f"{b}: size={im.size}, bbox={im.getbbox()}")

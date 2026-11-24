from PIL import Image

im = Image.open('public/assets/monagrow-rice-bag-cutout.png')
print('monagrow-rice-bag-cutout.png bbox:', im.getbbox())
w, h = im.size
print('size:', w, h)

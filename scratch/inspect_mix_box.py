from PIL import Image
import numpy as np

im = Image.open('public/assets/monagrow-mix-dryfruits-packaging.png')
print('Dimensions:', im.size)
bbox = im.getbbox()
print('Bounding box of non-zero alpha:', bbox)
crop = im.crop(bbox)
print('Cropped pouch size:', crop.size)

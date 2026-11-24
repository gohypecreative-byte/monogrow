from PIL import Image
import numpy as np

im = Image.open('public/assets/monagrow-rice-bag-cutout.png')
arr = np.array(im)
w, h = im.size
print('Alpha > 0 at bottom row h-1:', (arr[h-1, :, 3] > 0).sum())
print('Alpha > 0 at row h-20:', (arr[h-20, :, 3] > 0).sum())
print('Alpha > 0 at row h-50:', (arr[h-50, :, 3] > 0).sum())
# Is there a shadow or spilled rice in monagrow-rice-bag-cutout.png?
# Let's see the bounding box of non-transparent pixels
print('Bounding box:', im.getbbox())

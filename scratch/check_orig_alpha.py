from PIL import Image
import numpy as np

im = Image.open('public/assets/monagrow-rice-bag-cutout.png')
arr = np.array(im)
alpha = arr[:, :, 3]
rgb = arr[:, :, :3]
print('monagrow-rice-bag-cutout.png size:', im.size)
# What is the alpha around top-left corner?
print('TL corner alpha (10x10):', alpha[:10, :10].max())
print('TR corner alpha (10x10):', alpha[:10, -10:].max())
print('BL corner alpha (10x10):', alpha[-10:, :10].max())
print('BR corner alpha (10x10):', alpha[-10:, -10:].max())

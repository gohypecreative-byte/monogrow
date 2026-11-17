import numpy as np
from PIL import Image

for name in ['rice', 'coffee', 'dryfruit', 'sugar']:
    img = Image.open(f'public/assets/hero-center-{name}.png')
    arr = np.array(img)
    print(f"{name}: shape={arr.shape}, dtype={arr.dtype}")
    # Let's save a visual representation of the pixels that are brown/wood
    # Wood color in RGB:
    # R is typically 40-160, G is 20-100, B is 10-60, R > G + 10, G > B

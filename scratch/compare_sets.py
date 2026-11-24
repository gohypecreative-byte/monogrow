from PIL import Image
import numpy as np

for name in ['cashews', 'almonds', 'walnuts', 'pistachios', 'raisins']:
    p1 = f'public/assets/monagrow-{name}-bag-cutout.png'
    p2 = f'public/assets/monagrow-{name}-pouch-new.png'
    
    im1 = np.array(Image.open(p1))
    im2 = np.array(Image.open(p2))
    
    diff = np.abs(im1.astype(float) - im2.astype(float)).mean()
    print(f"{name}: diff between bag-cutout and pouch-new = {diff:.2f}")

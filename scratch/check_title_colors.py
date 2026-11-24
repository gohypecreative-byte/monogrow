from PIL import Image
import numpy as np

for name in ['cashews', 'almonds', 'walnuts', 'pistachios', 'raisins']:
    im = Image.open(f"scratch/verify_title_{name}.png")
    arr = np.array(im)
    print(f"{name}: size={im.size}, mean RGB={arr[:,:,:3].mean(axis=(0,1)).astype(int)}")

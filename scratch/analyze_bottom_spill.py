from PIL import Image
import numpy as np

im1 = Image.open('scratch/preview_bot_p1.png')
im2 = Image.open('scratch/preview_bot_p2.png')

arr1 = np.array(im1)
arr2 = np.array(im2)

print('p1 (uploaded): non-transparent pixels in bottom 50 rows:', (arr1[-50:, :, 3] > 10).sum())
print('p2 (existing): non-transparent pixels in bottom 50 rows:', (arr2[-50:, :, 3] > 10).sum())

# In p2 (existing), what are the coordinates and colors in bottom 50 rows?
y_idx2, x_idx2 = np.where(arr2[-50:, :, 3] > 10)
print('p2 bottom non-transparent x range:', x_idx2.min(), x_idx2.max())
print('p2 bottom pixel sample colors:', arr2[-20, x_idx2.mean().astype(int)])

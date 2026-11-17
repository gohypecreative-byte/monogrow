# Let's inspect the exact crop of the left icon from the user's screenshot
from PIL import Image
import numpy as np

img = Image.open('C:/Users/suris/.gemini/antigravity/brain/41af2181-0931-4c98-b994-adebc7d96505/.user_uploaded/media_1794899603079_57732003.png')
# The text starts around x = 85
left_wheat = img.crop((10, 10, 75, 45))
left_wheat.save('scratch/user_left_wheat.png')
print("Saved user_left_wheat.png")

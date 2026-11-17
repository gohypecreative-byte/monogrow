from PIL import Image
import numpy as np

img = Image.open('C:/Users/suris/.gemini/antigravity/brain/41af2181-0931-4c98-b994-adebc7d96505/.user_uploaded/media_1794901861903_74110dd1.png')
print("Screenshot 1 size:", img.size)
arr = np.array(img)

# Print image bounds and find colors
# Text colors:
# In "Rooted in origin,": R, G, B are dark (near black / dark brown #30241e)
# In "delivered": R is high (~116), G is low (~7), B is low (~7) -> Maroon #740707! It is italic!
# In "with care": R, G, B are dark (near black #30241e / #000000)!
# And look at the position:
# "Rooted in origin," starts at x ~ 8, y ~ 10
# "delivered with care" starts at x ~ 230, y ~ 75!
# It is stepped/offset to the right!
print("Done inspecting")

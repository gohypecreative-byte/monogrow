from PIL import Image
import numpy as np

im = Image.open(r"C:/Users/suris/.gemini/antigravity/brain/41af2181-0931-4c98-b994-adebc7d96505/.user_uploaded/media_1795500400167_08adacb0.jpg")
arr = np.array(im)

# Let's inspect along vertical columns x=250, x=350, x=500, x=700, x=770
for x in [250, 350, 500, 650, 750]:
    # Look at y from 820 to 890
    print(f"--- Column x={x} ---")
    for y in range(830, 890, 5):
        r, g, b = arr[y, x]
        print(f"  y={y}: RGB=({r},{g},{b})")

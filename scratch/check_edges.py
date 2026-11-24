from PIL import Image
import numpy as np

im = Image.open('scratch/test_cashews.png')
arr = np.array(im)

# Check top row where alpha > 0
y_top = 64
print('Row y_top alpha profile around center (500:580):', arr[y_top, 500:580, 3].tolist())
# Check bottom row where alpha > 0
y_bot = 1403
print('Row y_bot alpha profile around center (500:580):', arr[y_bot, 500:580, 3].tolist())
# Check left edge at middle height y=700
x_left = 54
print('Col x_left alpha profile around y=700:', arr[690:710, x_left, 3].tolist())
# Check right edge at middle height y=700
x_right = 1029
print('Col x_right alpha profile around y=700:', arr[690:710, x_right, 3].tolist())

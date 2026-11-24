from PIL import Image
import numpy as np
from collections import deque
from scipy.ndimage import gaussian_filter

images = [
    {
        "name": "cashews",
        "src": r"C:/Users/suris/.gemini/antigravity/brain/41af2181-0931-4c98-b994-adebc7d96505/.user_uploaded/media_1795498974455_e31bdf8c.jpg",
        "out": "public/assets/monagrow-cashews-pouch-new.png",
    },
    {
        "name": "almonds",
        "src": r"C:/Users/suris/.gemini/antigravity/brain/41af2181-0931-4c98-b994-adebc7d96505/.user_uploaded/media_1795498974512_283f823e.jpg",
        "out": "public/assets/monagrow-almonds-pouch-new.png",
    },
    {
        "name": "pistachios",
        "src": r"C:/Users/suris/.gemini/antigravity/brain/41af2181-0931-4c98-b994-adebc7d96505/.user_uploaded/media_1795498999220_33469646.jpg",
        "out": "public/assets/monagrow-pistachios-pouch-new.png",
    },
    {
        "name": "raisins",
        "src": r"C:/Users/suris/.gemini/antigravity/brain/41af2181-0931-4c98-b994-adebc7d96505/.user_uploaded/media_1795499012127_3b2af30a.jpg",
        "out": "public/assets/monagrow-raisins-pouch-new.png",
    },
    {
        "name": "walnuts",
        "src": r"C:/Users/suris/.gemini/antigravity/brain/41af2181-0931-4c98-b994-adebc7d96505/.user_uploaded/media_1795499021736_eaed7657.jpg",
        "out": "public/assets/monagrow-walnuts-pouch-new.png",
    },
]

for item in images:
    img = Image.open(item["src"]).convert('RGB')
    arr = np.array(img, dtype=np.float32)
    h, w, _ = arr.shape

    is_bg = np.zeros((h, w), dtype=bool)
    visited = np.zeros((h, w), dtype=bool)

    queue = deque()
    for x in range(w):
        queue.append((0, x))
        queue.append((h - 1, x))
        visited[0, x] = True
        visited[h - 1, x] = True
    for y in range(h):
        queue.append((y, 0))
        queue.append((y, w - 1))
        visited[y, 0] = True
        visited[y, w - 1] = True

    def is_bg_pixel(y, x):
        r, g, b = arr[y, x]
        if x < 230 or x > 810:
            return True
        if y < 8:
            return True
        if y > 726:
            return True
        if min(r, g, b) > 230 and (max(r, g, b) - min(r, g, b)) < 25:
            return True
        return False

    while queue:
        y, x = queue.popleft()
        if is_bg_pixel(y, x):
            is_bg[y, x] = True
            for dy, dx in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                ny, nx = y + dy, x + dx
                if 0 <= ny < h and 0 <= nx < w and not visited[ny, nx]:
                    visited[ny, nx] = True
                    queue.append((ny, nx))

    pouch_mask = (~is_bg).astype(np.float32)
    smooth_mask = gaussian_filter(pouch_mask, sigma=0.8)
    alpha = np.clip((smooth_mask - 0.05) / 0.90 * 255.0, 0, 255).astype(np.uint8)

    rgba_arr = np.zeros((h, w, 4), dtype=np.uint8)
    rgba_arr[:, :, :3] = np.array(img, dtype=np.uint8)
    rgba_arr[:, :, 3] = alpha

    cutout = Image.fromarray(rgba_arr, mode='RGBA')
    raw_bbox = cutout.getbbox()
    cropped = cutout.crop(raw_bbox)

    target_h = 1342
    scale = target_h / float(cropped.height)
    target_w = int(round(cropped.width * scale))
    resized = cropped.resize((target_w, target_h), Image.Resampling.LANCZOS)

    canvas = Image.new('RGBA', (1084, 1451), (0, 0, 0, 0))
    paste_x = (1084 - target_w) // 2
    paste_y = 62
    canvas.paste(resized, (paste_x, paste_y), resized)

    canvas.save(item["out"], format='PNG', optimize=True)
    print(f"Processed {item['name']}:")
    print(f"  raw bbox: {raw_bbox}")
    print(f"  canvas bbox: {canvas.getbbox()}")
    print(f"  saved to: {item['out']}")

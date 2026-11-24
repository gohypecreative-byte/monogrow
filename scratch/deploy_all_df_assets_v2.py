import os
import shutil
from PIL import Image
import numpy as np
from collections import deque
from scipy.ndimage import gaussian_filter, binary_erosion

uploads = [
    {
        "name": "cashews",
        "src": r"C:/Users/suris/.gemini/antigravity/brain/41af2181-0931-4c98-b994-adebc7d96505/.user_uploaded/media_1795498974455_e31bdf8c.jpg",
        "targets": [
            "public/assets/monagrow-cashews-pouch-v2.png",
            "public/assets/monagrow-cashews-pouch-new.png",
            "public/assets/monagrow-cashews-bag-cutout.png",
        ]
    },
    {
        "name": "almonds",
        "src": r"C:/Users/suris/.gemini/antigravity/brain/41af2181-0931-4c98-b994-adebc7d96505/.user_uploaded/media_1795498974512_283f823e.jpg",
        "targets": [
            "public/assets/monagrow-almonds-pouch-v2.png",
            "public/assets/monagrow-almonds-pouch-new.png",
            "public/assets/monagrow-almonds-bag-cutout.png",
        ]
    },
    {
        "name": "pistachios",
        "src": r"C:/Users/suris/.gemini/antigravity/brain/41af2181-0931-4c98-b994-adebc7d96505/.user_uploaded/media_1795498999220_33469646.jpg",
        "targets": [
            "public/assets/monagrow-pistachios-pouch-v2.png",
            "public/assets/monagrow-pistachios-pouch-new.png",
            "public/assets/monagrow-pistachios-bag-cutout.png",
        ]
    },
    {
        "name": "raisins",
        "src": r"C:/Users/suris/.gemini/antigravity/brain/41af2181-0931-4c98-b994-adebc7d96505/.user_uploaded/media_1795499012127_3b2af30a.jpg",
        "targets": [
            "public/assets/monagrow-raisins-pouch-v2.png",
            "public/assets/monagrow-raisins-pouch-new.png",
            "public/assets/monagrow-raisins-bag-cutout.png",
        ]
    },
    {
        "name": "walnuts",
        "src": r"C:/Users/suris/.gemini/antigravity/brain/41af2181-0931-4c98-b994-adebc7d96505/.user_uploaded/media_1795499021736_eaed7657.jpg",
        "targets": [
            "public/assets/monagrow-walnuts-pouch-v2.png",
            "public/assets/monagrow-walnuts-pouch-new.png",
            "public/assets/monagrow-walnuts-bag-cutout.png",
        ]
    },
]

# Copy mix dry fruits to v2
shutil.copy2("public/assets/monagrow-mix-dryfruits-packaging.png", "public/assets/monagrow-mix-dryfruits-packaging-v2.png")
print("Copied mix dry fruits to public/assets/monagrow-mix-dryfruits-packaging-v2.png")

for item in uploads:
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
        if x < 210 or x > 830:
            return True
        if y < 8:
            return True
        if y > 730:
            return True
        # White background threshold
        if min(r, g, b) > 228 and (max(r, g, b) - min(r, g, b)) < 25:
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

    raw_mask = ~is_bg
    # Erode raw mask by 1 pixel to remove white edge fringe
    eroded = binary_erosion(raw_mask, iterations=1)

    # Smooth the mask for clean anti-aliasing
    smooth_mask = gaussian_filter(eroded.astype(np.float32), sigma=0.6)
    alpha = np.clip(smooth_mask, 0.0, 1.0)

    # Color decontamination for semi-transparent edge pixels
    rgb = arr[:, :, :3].copy()
    semi = (alpha > 0.05) & (alpha < 0.98)
    a_exp = alpha[semi, None]
    c_decontam = (rgb[semi] - (1.0 - a_exp) * 254.0) / np.maximum(a_exp, 0.2)
    rgb[semi] = np.clip(c_decontam, 0.0, 255.0)

    rgba = np.zeros((h, w, 4), dtype=np.uint8)
    rgba[:, :, :3] = np.clip(rgb, 0, 255).astype(np.uint8)
    rgba[:, :, 3] = (alpha * 255.0).astype(np.uint8)

    cutout = Image.fromarray(rgba, mode='RGBA')
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

    for target_path in item["targets"]:
        canvas.save(target_path, format='PNG', optimize=True)
        print(f"Saved {item['name']} -> {target_path} (size={canvas.size}, bbox={canvas.getbbox()})")

print("All dry fruit pouch files deployed successfully!")

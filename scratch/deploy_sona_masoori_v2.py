import os
import json
import datetime
from PIL import Image
import numpy as np
from collections import deque
from scipy.ndimage import gaussian_filter, binary_erosion

def process_rice_bag(src_path, targets, name):
    im = Image.open(src_path).convert('RGB')
    arr = np.array(im, dtype=np.float32)
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
        if x < 180 or x > 840:
            return True
        if y < 40:
            return True
        # White background criteria:
        if min(r, g, b) > 232 and (max(r, g, b) - min(r, g, b)) < 22:
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
    # Erode raw mask by 1 pixel to remove the white fringe pixels
    eroded = binary_erosion(raw_mask, iterations=1)
    
    # Smooth the eroded mask
    smooth_mask = gaussian_filter(eroded.astype(np.float32), sigma=0.65)
    alpha = np.clip(smooth_mask, 0.0, 1.0)
    
    # Color decontamination: for pixels where 0.05 < alpha < 0.98, recover true foreground
    rgb = arr[:, :, :3].copy()
    semi = (alpha > 0.05) & (alpha < 0.98)
    a_exp = alpha[semi, None]
    c_decontam = (rgb[semi] - (1.0 - a_exp) * 254.0) / np.maximum(a_exp, 0.25)
    rgb[semi] = np.clip(c_decontam, 0.0, 255.0)
    
    rgba = np.zeros((h, w, 4), dtype=np.uint8)
    rgba[:, :, :3] = np.clip(rgb, 0, 255).astype(np.uint8)
    rgba[:, :, 3] = (alpha * 255.0).astype(np.uint8)
    
    cutout = Image.fromarray(rgba, mode='RGBA')
    raw_bbox = cutout.getbbox()
    cropped = cutout.crop(raw_bbox)
    
    # Frame onto standard 637x986 canvas
    canvas_w, canvas_h = 637, 986
    max_w, max_h = 618, 960
    scale = min(max_w / float(cropped.width), max_h / float(cropped.height))
    
    target_w = int(round(cropped.width * scale))
    target_h = int(round(cropped.height * scale))
    resized = cropped.resize((target_w, target_h), Image.Resampling.LANCZOS)
    
    canvas = Image.new('RGBA', (canvas_w, canvas_h), (0, 0, 0, 0))
    paste_x = (canvas_w - target_w) // 2
    paste_y = (canvas_h - target_h) // 2
    canvas.paste(resized, (paste_x, paste_y), resized)
    
    for target in targets:
        canvas.save(target, format='PNG', optimize=True)
        print(f"Saved {name} -> {target} (size={canvas.size}, bbox={canvas.getbbox()})")

# 1. Process and deploy files
process_rice_bag(
    r"C:/Users/suris/.gemini/antigravity/brain/41af2181-0931-4c98-b994-adebc7d96505/.user_uploaded/media_1795500400165_76f6d904.jpg",
    [
        "public/assets/monagrow-premium-sona-masoori-bag-v2.png",
        "public/assets/monagrow-premium-sona-masoori-bag-cutout.png",
    ],
    "Premium Sona Masoori Rice"
)

process_rice_bag(
    r"C:/Users/suris/.gemini/antigravity/brain/41af2181-0931-4c98-b994-adebc7d96505/.user_uploaded/media_1795500400167_08adacb0.jpg",
    [
        "public/assets/monagrow-rozana-sona-masoori-bag-v2.png",
        "public/assets/monagrow-rozana-sona-masoori-bag-cutout.png",
    ],
    "Rozana Sona Masoori Rice"
)

# 2. Update data/admin-store.json
with open('data/admin-store.json', 'r', encoding='utf-8') as f:
    admin_data = json.load(f)

for p in admin_data.get('products', []):
    if p.get('id') == 'premium-sona-masoori-rice':
        p['packImg'] = '/assets/monagrow-premium-sona-masoori-bag-v2.png'
        print("Updated admin-store premium-sona-masoori-rice packImg")
    elif p.get('id') == 'rozana-sona-masoori-rice':
        p['packImg'] = '/assets/monagrow-rozana-sona-masoori-bag-v2.png'
        print("Updated admin-store rozana-sona-masoori-rice packImg")

admin_data['updatedAt'] = datetime.datetime.now(datetime.timezone.utc).isoformat()

with open('data/admin-store.json', 'w', encoding='utf-8') as f:
    json.dump(admin_data, f, indent=2, ensure_ascii=False)

print("Saved data/admin-store.json")

# 3. Update data/commodityData.ts
with open('data/commodityData.ts', 'r', encoding='utf-8') as f:
    code = f.read()

code = code.replace(
    '/assets/monagrow-premium-sona-masoori-bag-cutout.png',
    '/assets/monagrow-premium-sona-masoori-bag-v2.png'
)
code = code.replace(
    '/assets/monagrow-rozana-sona-masoori-bag-cutout.png',
    '/assets/monagrow-rozana-sona-masoori-bag-v2.png'
)

with open('data/commodityData.ts', 'w', encoding='utf-8') as f:
    f.write(code)

print("Saved data/commodityData.ts")

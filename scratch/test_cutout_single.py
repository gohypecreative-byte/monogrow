from PIL import Image
import numpy as np
from collections import deque
from scipy.ndimage import gaussian_filter

def cutout_pouch(src_path, debug_name):
    img = Image.open(src_path).convert('RGB')
    arr = np.array(img, dtype=np.float32)
    h, w, _ = arr.shape

    is_bg = np.zeros((h, w), dtype=bool)
    visited = np.zeros((h, w), dtype=bool)

    queue = deque()
    # Add border pixels to queue
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

    # Pouch is roughly x in [240, 785], y in [8, 725]
    def is_bg_pixel(y, x):
        r, g, b = arr[y, x]
        # Any pixel definitely outside pouch lateral bounds
        if x < 235 or x > 790:
            return True
        # Top margin
        if y < 8:
            return True
        # Bottom floor shadow margin
        if y > 725:
            return True
        # White or near white background:
        # Check if high brightness and low saturation
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
    alpha = np.clip(smooth_mask * 255.0, 0, 255).astype(np.uint8)

    rgba_arr = np.zeros((h, w, 4), dtype=np.uint8)
    rgba_arr[:, :, :3] = np.array(img, dtype=np.uint8)
    rgba_arr[:, :, 3] = alpha

    cutout = Image.fromarray(rgba_arr, mode='RGBA')
    bbox = cutout.getbbox()
    print(f"{debug_name} raw cutout bbox:", bbox)
    
    # Crop to pouch bbox
    cropped = cutout.crop(bbox)
    
    # Now place onto a standard (1084, 1451) canvas to match monagrow-mix-dryfruits-packaging.png
    # Target height ~ 1342, width scaled proportionally
    target_h = 1342
    scale = target_h / float(cropped.height)
    target_w = int(round(cropped.width * scale))
    resized = cropped.resize((target_w, target_h), Image.Resampling.LANCZOS)
    
    canvas = Image.new('RGBA', (1084, 1451), (0, 0, 0, 0))
    paste_x = (1084 - target_w) // 2
    paste_y = 62 # matching mix dryfruits packaging top offset
    canvas.paste(resized, (paste_x, paste_y), resized)
    
    out_path = f"scratch/test_{debug_name}.png"
    canvas.save(out_path, format='PNG')
    print(f"Saved {out_path}, canvas bbox: {canvas.getbbox()}")
    return canvas

cutout_pouch(r"C:/Users/suris/.gemini/antigravity/brain/41af2181-0931-4c98-b994-adebc7d96505/.user_uploaded/media_1795498974455_e31bdf8c.jpg", "cashews")

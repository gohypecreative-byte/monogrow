from PIL import Image
import numpy as np
from collections import deque
from scipy.ndimage import gaussian_filter

def test_rice_cutout(src_path, name):
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
        # Clearly outside bag lateral margins
        if x < 180 or x > 840:
            return True
        if y < 40:
            return True
        # White background criteria:
        if min(r, g, b) > 238 and (max(r, g, b) - min(r, g, b)) < 18:
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
                    
    mask = (~is_bg).astype(np.float32)
    print(f"{name}: initial mask non-zero pixels: {mask.sum()}")
    
    # Let's inspect where mask is non-zero
    y_idx, x_idx = np.where(mask > 0)
    print(f"{name}: mask bounds x=[{x_idx.min()}, {x_idx.max()}], y=[{y_idx.min()}, {y_idx.max()}]")
    
    # Save preview of cutout with black background to check edge quality
    smooth_mask = gaussian_filter(mask, sigma=0.7)
    alpha = np.clip((smooth_mask - 0.05) / 0.90 * 255.0, 0, 255).astype(np.uint8)
    
    rgba = np.zeros((h, w, 4), dtype=np.uint8)
    rgba[:, :, :3] = np.array(im, dtype=np.uint8)
    rgba[:, :, 3] = alpha
    
    res = Image.fromarray(rgba, mode='RGBA')
    raw_bbox = res.getbbox()
    print(f"{name} raw bbox: {raw_bbox}")
    
    # Save test cutout
    res.crop(raw_bbox).save(f"scratch/test_cutout_{name}.png")
    print(f"Saved scratch/test_cutout_{name}.png")

test_rice_cutout(r"C:/Users/suris/.gemini/antigravity/brain/41af2181-0931-4c98-b994-adebc7d96505/.user_uploaded/media_1795500400165_76f6d904.jpg", "premium")
test_rice_cutout(r"C:/Users/suris/.gemini/antigravity/brain/41af2181-0931-4c98-b994-adebc7d96505/.user_uploaded/media_1795500400167_08adacb0.jpg", "rozana")

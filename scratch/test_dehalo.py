from PIL import Image
import numpy as np
from collections import deque
from scipy.ndimage import gaussian_filter, binary_erosion

def cutout_clean(src_path, name):
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
    smooth_mask = gaussian_filter(eroded.astype(np.float32), sigma=0.6)
    alpha = np.clip(smooth_mask, 0.0, 1.0)
    
    # Color decontamination: for pixels where 0 < alpha < 1, recover true foreground
    # C_fg = (C_obs - (1 - alpha)*255) / alpha
    rgb = arr[:, :, :3].copy()
    
    # For semi-transparent pixels, remove white bleed:
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
    
    # Now check halo pixels on edge
    arr_c = np.array(cropped)
    edge = (arr_c[:, :, 3] > 0) & (arr_c[:, :, 3] < 250)
    edge_rgb = arr_c[edge, :3]
    bright_edges = (edge_rgb[:, 0] > 230) & (edge_rgb[:, 1] > 230) & (edge_rgb[:, 2] > 230)
    print(f"{name} after de-halo: total edge pixels={len(edge_rgb)}, bright halo={bright_edges.sum()} ({bright_edges.mean():.2%})")
    
    # Save test cutout
    cropped.save(f"scratch/dehalo_{name}.png")

cutout_clean(r"C:/Users/suris/.gemini/antigravity/brain/41af2181-0931-4c98-b994-adebc7d96505/.user_uploaded/media_1795500400165_76f6d904.jpg", "premium")
cutout_clean(r"C:/Users/suris/.gemini/antigravity/brain/41af2181-0931-4c98-b994-adebc7d96505/.user_uploaded/media_1795500400167_08adacb0.jpg", "rozana")

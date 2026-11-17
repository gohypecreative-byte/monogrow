import numpy as np
from PIL import Image, ImageFilter

def create_sugar_emerald():
    print("Processing Sugar -> Emerald Glazed Ceramic Bowl...")
    img = Image.open('public/assets/hero-center-sugar.png')
    arr = np.array(img).astype(np.float32)
    alpha = arr[:, :, 3]
    rgb = arr[:, :, :3]
    h, w = alpha.shape
    
    ys, xs = np.where(alpha > 30)
    cx = (xs.min() + xs.max()) / 2.0
    cy = (ys.min() + ys.max()) / 2.0
    
    y_grid, x_grid = np.indices((h, w), dtype=np.float32)
    dx = x_grid - cx
    dy = y_grid - cy
    
    scale_y = np.where(dy < 0, 1.15, 1.0)
    r = np.sqrt(dx**2 + (dy * scale_y)**2)
    angle = np.arctan2(dy, dx)
    
    lum = (0.299 * rgb[:, :, 0] + 0.587 * rgb[:, :, 1] + 0.114 * rgb[:, :, 2])
    mask_outer = ((r > 470) | ((dy > 330) & (r > 380))) & (alpha > 30)
    mask_trans = (r > 430) & (r <= 470) & (alpha > 30) & (lum < 140)
    bowl_mask = (mask_outer | mask_trans).astype(np.float32)
    
    mask_pil = Image.fromarray((bowl_mask * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(radius=2.5))
    bowl_weight = np.array(mask_pil).astype(np.float32) / 255.0
    bowl_weight = np.clip(bowl_weight * (alpha / 255.0), 0.0, 1.0)[:, :, None]
    
    bowl_lum = lum[bowl_mask > 0.5]
    p_low = np.percentile(bowl_lum, 5)
    p_high = np.percentile(bowl_lum, 95)
    norm_lum = np.clip((lum - p_low) / (p_high - p_low + 1e-5), 0.0, 1.0)
    
    # Deep Emerald / Sage Glazed Ceramic:
    # Shadow: [25, 45, 30]
    # Diffuse: [45, 88, 55]
    # Highlight: [110, 175, 125]
    emerald_shadow = np.array([28.0, 48.0, 32.0])
    emerald_diffuse = np.array([55.0, 95.0, 65.0])
    emerald_highlight = np.array([125.0, 185.0, 140.0])
    
    emerald_color = np.zeros_like(rgb)
    for c in range(3):
        t = norm_lum
        emerald_color[:, :, c] = np.where(
            t < 0.55,
            emerald_shadow[c] + (emerald_diffuse[c] - emerald_shadow[c]) * (t / 0.55),
            emerald_diffuse[c] + (emerald_highlight[c] - emerald_diffuse[c]) * ((t - 0.55) / 0.45)
        )
    
    # Glossy rim specular highlight
    spec_angle = np.exp(-((angle + 2.3)**2) / 0.5)
    spec_rad = np.exp(-((r - 510)**2) / (28.0**2))
    emerald_color += (spec_angle * spec_rad)[:, :, None] * np.array([55.0, 68.0, 58.0])
    
    # Polished ceramic rim bevel
    rim_line = np.exp(-((r - 475)**2) / (5.0**2))[:, :, None] * np.array([45.0, 55.0, 48.0])
    emerald_color += rim_line
    
    emerald_color = np.clip(emerald_color, 0.0, 255.0)
    
    result_rgb = rgb * (1.0 - bowl_weight) + emerald_color * bowl_weight
    result_arr = np.dstack([result_rgb, alpha]).astype(np.uint8)
    
    res_img = Image.fromarray(result_arr, 'RGBA')
    res_img.save('scratch/sugar_emerald.png')
    print("Saved scratch/sugar_emerald.png")

create_sugar_emerald()

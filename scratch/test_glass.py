import numpy as np
from PIL import Image, ImageFilter

def test_translucent_glass_rice():
    print("Testing true translucent crystal glass for Rice...")
    img = Image.open('public/assets/hero-center-rice.png')
    arr = np.array(img).astype(np.float32)
    alpha = arr[:, :, 3].copy()
    rgb = arr[:, :, :3].copy()
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
    
    # Mask of the bowl (outside the rice grains)
    mask_outer = ((r > 460) | ((dy > 340) & (r > 380))) & (alpha > 30)
    mask_trans = (r > 420) & (r <= 460) & (alpha > 30) & (lum < 135)
    bowl_mask = (mask_outer | mask_trans).astype(np.float32)
    
    mask_pil = Image.fromarray((bowl_mask * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(radius=2.5))
    bowl_weight = np.array(mask_pil).astype(np.float32) / 255.0
    
    # In a glass bowl:
    # 1. Specular highlights and rim bevels: high opacity (alpha ~ 240-255), white/cyan
    # 2. Body of the glass wall: translucent (alpha ~ 130-180), subtle glass caustics
    # 3. Outer rim Fresnel: higher opacity at edge
    
    fresnel = np.clip((r - 460) / 80.0, 0.0, 1.0) ** 2.0
    
    # Key light highlight (top-left, angle ~ -2.3 rad)
    spec1 = np.exp(-((angle + 2.3)**2) / 0.35) * np.exp(-((r - 495)**2) / (25.0**2))
    # Secondary rim glint (top-right, angle ~ -0.8 rad)
    spec2 = np.exp(-((angle + 0.8)**2) / 0.25) * np.exp(-((r - 510)**2) / (18.0**2))
    # Crisp outer rim line
    rim_line = np.exp(-((r - 505)**2) / (6.0**2))
    # Inner rim bevel
    inner_rim = np.exp(-((r - 455)**2) / (5.0**2))
    
    spec_total = np.clip(spec1 * 1.0 + spec2 * 0.7 + rim_line * 0.6 + inner_rim * 0.5, 0.0, 1.0)
    
    # Target glass RGB: crystal with subtle ice-blue tint
    glass_rgb = np.zeros_like(rgb)
    glass_rgb[:, :, 0] = 215.0 * spec_total + 185.0 * (1.0 - spec_total)
    glass_rgb[:, :, 1] = 235.0 * spec_total + 215.0 * (1.0 - spec_total)
    glass_rgb[:, :, 2] = 255.0 * spec_total + 240.0 * (1.0 - spec_total)
    
    # Target glass Alpha:
    # Where specular is strong -> alpha is near 250
    # Where body -> alpha is around 130-175 + fresnel * 60
    glass_alpha = 135.0 + fresnel * 65.0 + spec_total * 55.0
    glass_alpha = np.clip(glass_alpha, 0.0, 255.0)
    
    # Blend with original where bowl_weight applies
    bw3 = bowl_weight[:, :, None]
    result_rgb = rgb * (1.0 - bw3) + glass_rgb * bw3
    result_alpha = alpha * (1.0 - bowl_weight) + glass_alpha * bowl_weight
    
    result_arr = np.dstack([result_rgb, result_alpha]).astype(np.uint8)
    res_img = Image.fromarray(result_arr, 'RGBA')
    res_img.save('scratch/rice_crystal_glass.png')
    print("Saved scratch/rice_crystal_glass.png")

test_translucent_glass_rice()

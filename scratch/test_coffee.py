import numpy as np
from PIL import Image, ImageFilter

def transform_coffee():
    img = Image.open('public/assets/hero-center-coffee.png')
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
    
    # In coffee, the coffee beans are inside an ellipse:
    # rx ~ 430, ry ~ 400 for dy < 0; for dy > 0, beans end around dy ~ 340
    # Let's compute normalized distance from center for the bowl rim:
    scale_y = np.where(dy < 0, 1.12, 1.05)
    r = np.sqrt(dx**2 + (dy * scale_y)**2)
    
    # Bowl region:
    # Outer rim is at r > 430.
    # Bottom bowl side is dy > 340 and r > 380.
    # In the transition zone (r between 410 and 460), we distinguish beans by color:
    # Beans have very low green/blue (R is 30-80, G is 15-40, B is 10-25)
    # Wood has smooth texture and higher G and B relative to R (G > 45, B > 25, or R > 90)
    
    # Base wood mask:
    # 1. Definite outer bowl: r > 450 (or dy > 350 and r > 390) where alpha > 30
    mask_outer = ((r > 450) | ((dy > 340) & (r > 380))) & (alpha > 30)
    
    # 2. Transition zone:
    mask_trans = (r > 410) & (r <= 450) & (alpha > 30) & (rgb[:, :, 0] > 70) & (rgb[:, :, 1] > 40)
    
    bowl_mask = (mask_outer | mask_trans).astype(np.float32)
    
    # Smooth the mask boundary to avoid any harsh edges
    mask_pil = Image.fromarray((bowl_mask * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(radius=2.5))
    bowl_weight = np.array(mask_pil).astype(np.float32) / 255.0
    bowl_weight = np.clip(bowl_weight * (alpha / 255.0), 0.0, 1.0)[:, :, None]
    
    # Now for porcelain ceramic material:
    # Extract lighting luminance from the original wood bowl
    # The original wood bowl has key light from upper-left, ambient light, and shadow
    lum = (0.299 * rgb[:, :, 0] + 0.587 * rgb[:, :, 1] + 0.114 * rgb[:, :, 2])
    # Normalize lum across the bowl mask
    bowl_lum = lum[bowl_mask > 0.5]
    p_low = np.percentile(bowl_lum, 5)
    p_high = np.percentile(bowl_lum, 95)
    norm_lum = np.clip((lum - p_low) / (p_high - p_low + 1e-5), 0.0, 1.0)
    
    # Porcelain ceramic base: ivory/white with subtle warm undertone
    # Shaded from [190, 185, 178] in soft shadow to [250, 248, 244] in full light
    ceramic_shadow = np.array([175.0, 170.0, 165.0])
    ceramic_diffuse = np.array([235.0, 232.0, 226.0])
    ceramic_highlight = np.array([255.0, 255.0, 252.0])
    
    # Smooth curvature shading
    ceramic_color = np.zeros_like(rgb)
    for c in range(3):
        # Blend from shadow to diffuse to highlight
        t = norm_lum
        ceramic_color[:, :, c] = np.where(
            t < 0.5,
            ceramic_shadow[c] + (ceramic_diffuse[c] - ceramic_shadow[c]) * (t * 2.0),
            ceramic_diffuse[c] + (ceramic_highlight[c] - ceramic_diffuse[c]) * ((t - 0.5) * 2.0)
        )
    
    # Add glossy specular highlight on the upper-left rim
    angle = np.arctan2(dy, dx) # -pi to pi
    # Upper left is angle ~ -2.3 rad (-135 deg)
    spec_angle = np.exp(-((angle + 2.3)**2) / 0.5)
    spec_rad = np.exp(-((r - 490)**2) / (35.0**2))
    specular = spec_angle * spec_rad * 45.0
    ceramic_color += specular[:, :, None]
    
    # Subtle porcelain rim bevel line
    bevel_rad = np.exp(-((r - 455)**2) / (6.0**2)) * 25.0
    ceramic_color += bevel_rad[:, :, None]
    
    ceramic_color = np.clip(ceramic_color, 0.0, 255.0)
    
    # Composite:
    result_rgb = rgb * (1.0 - bowl_weight) + ceramic_color * bowl_weight
    result_arr = np.dstack([result_rgb, alpha]).astype(np.uint8)
    
    res_img = Image.fromarray(result_arr, 'RGBA')
    res_img.save('scratch/test_coffee_porcelain.png')
    print("Saved scratch/test_coffee_porcelain.png")

transform_coffee()

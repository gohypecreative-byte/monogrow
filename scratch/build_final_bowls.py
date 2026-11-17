import numpy as np
from PIL import Image, ImageFilter

def build_rice_glass():
    print("Building Basmati Rice -> Crystal Glass Bowl...")
    img = Image.open('public/assets/hero-center-rice-wood.png')
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
    mask_outer = ((r > 460) | ((dy > 340) & (r > 380))) & (alpha > 30)
    mask_trans = (r > 420) & (r <= 460) & (alpha > 30) & (lum < 135)
    bowl_mask = (mask_outer | mask_trans).astype(np.float32)
    
    mask_pil = Image.fromarray((bowl_mask * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(radius=2.5))
    bowl_weight = np.array(mask_pil).astype(np.float32) / 255.0
    bw3 = bowl_weight[:, :, None]
    
    # Realistic Crystal Glass:
    fresnel = np.clip((r - 460) / 80.0, 0.0, 1.0) ** 2.0
    spec1 = np.exp(-((angle + 2.3)**2) / 0.35) * np.exp(-((r - 495)**2) / (25.0**2))
    spec2 = np.exp(-((angle + 0.8)**2) / 0.25) * np.exp(-((r - 510)**2) / (18.0**2))
    rim_line = np.exp(-((r - 505)**2) / (6.0**2))
    inner_rim = np.exp(-((r - 455)**2) / (5.0**2))
    spec_total = np.clip(spec1 * 1.0 + spec2 * 0.7 + rim_line * 0.6 + inner_rim * 0.5, 0.0, 1.0)
    
    glass_rgb = np.zeros_like(rgb)
    glass_rgb[:, :, 0] = 215.0 * spec_total + 185.0 * (1.0 - spec_total)
    glass_rgb[:, :, 1] = 235.0 * spec_total + 215.0 * (1.0 - spec_total)
    glass_rgb[:, :, 2] = 255.0 * spec_total + 240.0 * (1.0 - spec_total)
    
    glass_alpha = 140.0 + fresnel * 60.0 + spec_total * 55.0
    glass_alpha = np.clip(glass_alpha, 0.0, 255.0)
    
    result_rgb = rgb * (1.0 - bw3) + glass_rgb * bw3
    result_alpha = alpha * (1.0 - bowl_weight) + glass_alpha * bowl_weight
    
    result_arr = np.dstack([result_rgb, result_alpha]).astype(np.uint8)
    Image.fromarray(result_arr, 'RGBA').save('public/assets/hero-center-rice.png')
    print("  -> Saved public/assets/hero-center-rice.png")


def build_coffee_porcelain():
    print("Building Estate Coffee -> Glazed Porcelain Ceramic Bowl...")
    img = Image.open('public/assets/hero-center-coffee-wood.png')
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
    scale_y = np.where(dy < 0, 1.12, 1.05)
    r = np.sqrt(dx**2 + (dy * scale_y)**2)
    angle = np.arctan2(dy, dx)
    
    mask_outer = ((r > 450) | ((dy > 340) & (r > 380))) & (alpha > 30)
    mask_trans = (r > 410) & (r <= 450) & (alpha > 30) & (rgb[:, :, 0] > 70) & (rgb[:, :, 1] > 40)
    bowl_mask = (mask_outer | mask_trans).astype(np.float32)
    
    mask_pil = Image.fromarray((bowl_mask * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(radius=2.5))
    bowl_weight = np.array(mask_pil).astype(np.float32) / 255.0
    bw3 = bowl_weight[:, :, None]
    
    lum = (0.299 * rgb[:, :, 0] + 0.587 * rgb[:, :, 1] + 0.114 * rgb[:, :, 2])
    bowl_lum = lum[bowl_mask > 0.5]
    p_low = np.percentile(bowl_lum, 5)
    p_high = np.percentile(bowl_lum, 95)
    norm_lum = np.clip((lum - p_low) / (p_high - p_low + 1e-5), 0.0, 1.0)
    
    ceramic_shadow = np.array([178.0, 172.0, 166.0])
    ceramic_diffuse = np.array([238.0, 235.0, 228.0])
    ceramic_highlight = np.array([255.0, 255.0, 252.0])
    
    ceramic_color = np.zeros_like(rgb)
    for c in range(3):
        t = norm_lum
        ceramic_color[:, :, c] = np.where(
            t < 0.5,
            ceramic_shadow[c] + (ceramic_diffuse[c] - ceramic_shadow[c]) * (t * 2.0),
            ceramic_diffuse[c] + (ceramic_highlight[c] - ceramic_diffuse[c]) * ((t - 0.5) * 2.0)
        )
    
    spec_angle = np.exp(-((angle + 2.3)**2) / 0.5)
    spec_rad = np.exp(-((r - 490)**2) / (32.0**2))
    specular = spec_angle * spec_rad * 48.0
    ceramic_color += specular[:, :, None]
    
    rim_line = np.exp(-((r - 460)**2) / (6.0**2)) * 28.0
    ceramic_color += rim_line[:, :, None]
    ceramic_color = np.clip(ceramic_color, 0.0, 255.0)
    
    result_rgb = rgb * (1.0 - bw3) + ceramic_color * bw3
    result_arr = np.dstack([result_rgb, alpha]).astype(np.uint8)
    Image.fromarray(result_arr, 'RGBA').save('public/assets/hero-center-coffee.png')
    print("  -> Saved public/assets/hero-center-coffee.png")


def build_dryfruit_copper():
    print("Building Royal Dry Fruits -> Burnished Copper Metallic Bowl...")
    img = Image.open('public/assets/hero-center-dryfruit-wood.png')
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
    mask_outer = ((r > 470) | ((dy > 380) & (r > 400))) & (alpha > 30)
    mask_trans = (r > 430) & (r <= 470) & (alpha > 30) & (lum < 125)
    bowl_mask = (mask_outer | mask_trans).astype(np.float32)
    
    mask_pil = Image.fromarray((bowl_mask * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(radius=2.5))
    bowl_weight = np.array(mask_pil).astype(np.float32) / 255.0
    bw3 = bowl_weight[:, :, None]
    
    bowl_lum = lum[bowl_mask > 0.5]
    p_low = np.percentile(bowl_lum, 5)
    p_high = np.percentile(bowl_lum, 95)
    norm_lum = np.clip((lum - p_low) / (p_high - p_low + 1e-5), 0.0, 1.0)
    
    copper_shadow = np.array([105.0, 45.0, 22.0])
    copper_diffuse = np.array([205.0, 118.0, 58.0])
    copper_highlight = np.array([255.0, 224.0, 155.0])
    
    copper_color = np.zeros_like(rgb)
    for c in range(3):
        t = norm_lum
        copper_color[:, :, c] = np.where(
            t < 0.55,
            copper_shadow[c] + (copper_diffuse[c] - copper_shadow[c]) * (t / 0.55),
            copper_diffuse[c] + (copper_highlight[c] - copper_diffuse[c]) * ((t - 0.55) / 0.45)
        )
    
    spec_angle = np.exp(-((angle + 2.3)**2) / 0.6)
    spec_rad = np.exp(-((r - 510)**2) / (30.0**2))
    spec_color = np.array([65.0, 45.0, 15.0])
    copper_color += (spec_angle * spec_rad)[:, :, None] * spec_color
    
    rim_line = np.exp(-((r - 480)**2) / (6.0**2))[:, :, None] * np.array([45.0, 30.0, 10.0])
    copper_color += rim_line
    copper_color = np.clip(copper_color, 0.0, 255.0)
    
    result_rgb = rgb * (1.0 - bw3) + copper_color * bw3
    result_arr = np.dstack([result_rgb, alpha]).astype(np.uint8)
    Image.fromarray(result_arr, 'RGBA').save('public/assets/hero-center-dryfruit.png')
    print("  -> Saved public/assets/hero-center-dryfruit.png")


def build_sugar_obsidian():
    print("Building Refined Sugar -> Deep Obsidian Slate Ceramic Bowl...")
    img = Image.open('public/assets/hero-center-sugar-wood.png')
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
    
    # Sugar-specific protection: protect white sugar and green sugarcane stalk/leaf
    is_wood_color = (rgb[:, :, 0] > rgb[:, :, 1] + 10) & (rgb[:, :, 0] > rgb[:, :, 2] + 20) & (rgb[:, :, 1] > rgb[:, :, 2])
    is_sugarcane = (rgb[:, :, 1] > rgb[:, :, 0] - 15) & (rgb[:, :, 1] > rgb[:, :, 2] + 10)
    is_sugar_white = (rgb[:, :, 0] > 175) & (rgb[:, :, 1] > 170) & (rgb[:, :, 2] > 160)
    
    bowl_mask = (r > 420) & (alpha > 30) & is_wood_color & (~is_sugarcane) & (~is_sugar_white)
    bowl_mask = bowl_mask.astype(np.float32)
    
    mask_pil = Image.fromarray((bowl_mask * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(radius=2.5))
    bowl_weight = np.array(mask_pil).astype(np.float32) / 255.0
    bw3 = bowl_weight[:, :, None]
    
    bowl_lum = lum[bowl_mask > 0.5]
    p_low = np.percentile(bowl_lum, 5)
    p_high = np.percentile(bowl_lum, 95)
    norm_lum = np.clip((lum - p_low) / (p_high - p_low + 1e-5), 0.0, 1.0)
    
    obsidian_shadow = np.array([22.0, 24.0, 28.0])
    obsidian_diffuse = np.array([48.0, 52.0, 58.0])
    obsidian_highlight = np.array([115.0, 122.0, 132.0])
    
    obsidian_color = np.zeros_like(rgb)
    for c in range(3):
        t = norm_lum
        obsidian_color[:, :, c] = np.where(
            t < 0.6,
            obsidian_shadow[c] + (obsidian_diffuse[c] - obsidian_shadow[c]) * (t / 0.6),
            obsidian_diffuse[c] + (obsidian_highlight[c] - obsidian_diffuse[c]) * ((t - 0.6) / 0.4)
        )
    
    spec_angle = np.exp(-((angle + 2.3)**2) / 0.5)
    spec_rad = np.exp(-((r - 510)**2) / (28.0**2))
    obsidian_color += (spec_angle * spec_rad)[:, :, None] * np.array([45.0, 48.0, 55.0])
    
    rim_line = np.exp(-((r - 475)**2) / (5.0**2))[:, :, None] * np.array([35.0, 38.0, 42.0])
    obsidian_color += rim_line
    obsidian_color = np.clip(obsidian_color, 0.0, 255.0)
    
    result_rgb = rgb * (1.0 - bw3) + obsidian_color * bw3
    result_arr = np.dstack([result_rgb, alpha]).astype(np.uint8)
    Image.fromarray(result_arr, 'RGBA').save('public/assets/hero-center-sugar.png')
    print("  -> Saved public/assets/hero-center-sugar.png")


build_rice_glass()
build_coffee_porcelain()
build_dryfruit_copper()
build_sugar_obsidian()
print("\nAll 4 unique commodity bowls have been created and saved to public/assets/!")

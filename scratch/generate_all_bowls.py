import numpy as np
from PIL import Image, ImageFilter

def create_glass_rice():
    print("Processing Rice -> Crystal Glass Bowl...")
    img = Image.open('public/assets/hero-center-rice.png')
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
    
    # In rice, the wooden bowl rim starts at r > 440 (top/sides) and dy > 340 (bottom)
    # The rice is light (lum > 140), the wood is dark (lum < 130)
    lum = (0.299 * rgb[:, :, 0] + 0.587 * rgb[:, :, 1] + 0.114 * rgb[:, :, 2])
    
    mask_outer = ((r > 460) | ((dy > 340) & (r > 380))) & (alpha > 30)
    mask_trans = (r > 420) & (r <= 460) & (alpha > 30) & (lum < 135)
    bowl_mask = (mask_outer | mask_trans).astype(np.float32)
    
    # Feather mask
    mask_pil = Image.fromarray((bowl_mask * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(radius=2.5))
    bowl_weight = np.array(mask_pil).astype(np.float32) / 255.0
    bowl_weight = np.clip(bowl_weight * (alpha / 255.0), 0.0, 1.0)[:, :, None]
    
    # Glass bowl material:
    # Glass has translucency, bright specular reflections on the rim, and subtle refractive caustics
    # Base glass tone: clear crystal with subtle cool tint (matches the luxury basmati navy background)
    glass_base = np.zeros_like(rgb)
    
    # Extract underlying shading gradient
    bowl_lum = lum[bowl_mask > 0.5]
    p_low = np.percentile(bowl_lum, 10)
    p_high = np.percentile(bowl_lum, 90)
    norm_lum = np.clip((lum - p_low) / (p_high - p_low + 1e-5), 0.0, 1.0)
    
    # Frosted glass transmission:
    # Body has a translucent luminous glow: [180, 200, 220] in light, [90, 115, 140] in shadow
    glass_base[:, :, 0] = 110 + norm_lum * 90
    glass_base[:, :, 1] = 135 + norm_lum * 95
    glass_base[:, :, 2] = 165 + norm_lum * 90
    
    # Fresnel edge reflection: strongest at the outer boundary of the bowl (r ~ 510 to 555)
    fresnel = np.clip((r - 470) / 75.0, 0.0, 1.0) ** 2.0
    fresnel_color = np.array([230.0, 245.0, 255.0])
    glass_base = glass_base * (1.0 - fresnel[:, :, None] * 0.7) + fresnel_color * (fresnel[:, :, None] * 0.7)
    
    # Specular highlights (crystal refractions on upper rim):
    # Key light highlight (top-left, angle ~ -2.4 rad):
    spec1 = np.exp(-((angle + 2.3)**2) / 0.35) * np.exp(-((r - 495)**2) / (25.0**2)) * 120.0
    # Secondary rim glint (top-right, angle ~ -0.8 rad):
    spec2 = np.exp(-((angle + 0.8)**2) / 0.25) * np.exp(-((r - 510)**2) / (18.0**2)) * 95.0
    # Sharp rim line (continuous crisp glass edge):
    rim_line = np.exp(-((r - 505)**2) / (5.0**2)) * 60.0
    # Inner rim bevel line:
    inner_rim = np.exp(-((r - 455)**2) / (4.0**2)) * 45.0
    
    glass_base += (spec1 + spec2 + rim_line + inner_rim)[:, :, None]
    glass_base = np.clip(glass_base, 0.0, 255.0)
    
    # Composite
    result_rgb = rgb * (1.0 - bowl_weight) + glass_base * bowl_weight
    result_arr = np.dstack([result_rgb, alpha]).astype(np.uint8)
    
    res_img = Image.fromarray(result_arr, 'RGBA')
    res_img.save('scratch/rice_glass.png')
    print("Saved scratch/rice_glass.png")


def create_porcelain_coffee():
    print("Processing Coffee -> Glazed Porcelain Ceramic Bowl...")
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
    
    scale_y = np.where(dy < 0, 1.12, 1.05)
    r = np.sqrt(dx**2 + (dy * scale_y)**2)
    angle = np.arctan2(dy, dx)
    
    mask_outer = ((r > 450) | ((dy > 340) & (r > 380))) & (alpha > 30)
    mask_trans = (r > 410) & (r <= 450) & (alpha > 30) & (rgb[:, :, 0] > 70) & (rgb[:, :, 1] > 40)
    bowl_mask = (mask_outer | mask_trans).astype(np.float32)
    
    mask_pil = Image.fromarray((bowl_mask * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(radius=2.5))
    bowl_weight = np.array(mask_pil).astype(np.float32) / 255.0
    bowl_weight = np.clip(bowl_weight * (alpha / 255.0), 0.0, 1.0)[:, :, None]
    
    lum = (0.299 * rgb[:, :, 0] + 0.587 * rgb[:, :, 1] + 0.114 * rgb[:, :, 2])
    bowl_lum = lum[bowl_mask > 0.5]
    p_low = np.percentile(bowl_lum, 5)
    p_high = np.percentile(bowl_lum, 95)
    norm_lum = np.clip((lum - p_low) / (p_high - p_low + 1e-5), 0.0, 1.0)
    
    # Warm ivory glazed porcelain
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
    
    # Specular gloss arc on rim
    spec_angle = np.exp(-((angle + 2.3)**2) / 0.5)
    spec_rad = np.exp(-((r - 490)**2) / (32.0**2))
    specular = spec_angle * spec_rad * 48.0
    ceramic_color += specular[:, :, None]
    
    # Smooth porcelain rim highlight line
    rim_line = np.exp(-((r - 460)**2) / (6.0**2)) * 28.0
    ceramic_color += rim_line[:, :, None]
    
    ceramic_color = np.clip(ceramic_color, 0.0, 255.0)
    
    result_rgb = rgb * (1.0 - bowl_weight) + ceramic_color * bowl_weight
    result_arr = np.dstack([result_rgb, alpha]).astype(np.uint8)
    
    res_img = Image.fromarray(result_arr, 'RGBA')
    res_img.save('scratch/coffee_porcelain.png')
    print("Saved scratch/coffee_porcelain.png")


def create_copper_dryfruit():
    print("Processing Dry Fruits -> Burnished Copper / Bronze Bowl...")
    img = Image.open('public/assets/hero-center-dryfruit.png')
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
    # In dryfruits, nuts are golden/bright (lum > 140), bowl is dark walnut (lum < 130)
    mask_outer = ((r > 470) | ((dy > 380) & (r > 400))) & (alpha > 30)
    mask_trans = (r > 430) & (r <= 470) & (alpha > 30) & (lum < 125)
    bowl_mask = (mask_outer | mask_trans).astype(np.float32)
    
    mask_pil = Image.fromarray((bowl_mask * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(radius=2.5))
    bowl_weight = np.array(mask_pil).astype(np.float32) / 255.0
    bowl_weight = np.clip(bowl_weight * (alpha / 255.0), 0.0, 1.0)[:, :, None]
    
    bowl_lum = lum[bowl_mask > 0.5]
    p_low = np.percentile(bowl_lum, 5)
    p_high = np.percentile(bowl_lum, 95)
    norm_lum = np.clip((lum - p_low) / (p_high - p_low + 1e-5), 0.0, 1.0)
    
    # Burnished Copper palette:
    # Deep shadow: [100, 42, 20]
    # Warm diffuse: [198, 112, 54]
    # Golden highlight: [255, 218, 150]
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
    
    # Anisotropic metallic specular sheen along the rim
    spec_angle = np.exp(-((angle + 2.3)**2) / 0.6)
    spec_rad = np.exp(-((r - 510)**2) / (30.0**2))
    spec_color = np.array([65.0, 45.0, 15.0]) # warm golden metallic boost
    copper_color += (spec_angle * spec_rad)[:, :, None] * spec_color
    
    # Crisp polished copper rim lip
    rim_line = np.exp(-((r - 480)**2) / (6.0**2))[:, :, None] * np.array([45.0, 30.0, 10.0])
    copper_color += rim_line
    
    copper_color = np.clip(copper_color, 0.0, 255.0)
    
    result_rgb = rgb * (1.0 - bowl_weight) + copper_color * bowl_weight
    result_arr = np.dstack([result_rgb, alpha]).astype(np.uint8)
    
    res_img = Image.fromarray(result_arr, 'RGBA')
    res_img.save('scratch/dryfruit_copper.png')
    print("Saved scratch/dryfruit_copper.png")


def create_sugar_obsidian():
    print("Processing Sugar -> Deep Obsidian Slate Bowl...")
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
    
    # Deep Obsidian Slate / Charcoal Satin Ceramic:
    # Shadow: [22, 24, 28]
    # Diffuse: [48, 52, 58]
    # Highlight: [110, 118, 128]
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
    
    # Crisp satin rim highlight
    spec_angle = np.exp(-((angle + 2.3)**2) / 0.5)
    spec_rad = np.exp(-((r - 510)**2) / (28.0**2))
    obsidian_color += (spec_angle * spec_rad)[:, :, None] * np.array([45.0, 48.0, 55.0])
    
    rim_line = np.exp(-((r - 475)**2) / (5.0**2))[:, :, None] * np.array([35.0, 38.0, 42.0])
    obsidian_color += rim_line
    
    obsidian_color = np.clip(obsidian_color, 0.0, 255.0)
    
    result_rgb = rgb * (1.0 - bowl_weight) + obsidian_color * bowl_weight
    result_arr = np.dstack([result_rgb, alpha]).astype(np.uint8)
    
    res_img = Image.fromarray(result_arr, 'RGBA')
    res_img.save('scratch/sugar_obsidian.png')
    print("Saved scratch/sugar_obsidian.png")


def create_sugar_glass():
    print("Processing Sugar -> Crystal Glass Bowl...")
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
    p_low = np.percentile(bowl_lum, 10)
    p_high = np.percentile(bowl_lum, 90)
    norm_lum = np.clip((lum - p_low) / (p_high - p_low + 1e-5), 0.0, 1.0)
    
    # Sparkling crystal glass with subtle green/aquamarine reflection (sugar brand color)
    glass_base = np.zeros_like(rgb)
    glass_base[:, :, 0] = 125 + norm_lum * 95
    glass_base[:, :, 1] = 155 + norm_lum * 90
    glass_base[:, :, 2] = 145 + norm_lum * 95
    
    fresnel = np.clip((r - 470) / 75.0, 0.0, 1.0) ** 2.0
    fresnel_color = np.array([245.0, 255.0, 250.0])
    glass_base = glass_base * (1.0 - fresnel[:, :, None] * 0.75) + fresnel_color * (fresnel[:, :, None] * 0.75)
    
    spec1 = np.exp(-((angle + 2.3)**2) / 0.35) * np.exp(-((r - 510)**2) / (25.0**2)) * 125.0
    spec2 = np.exp(-((angle + 0.8)**2) / 0.25) * np.exp(-((r - 520)**2) / (18.0**2)) * 95.0
    rim_line = np.exp(-((r - 510)**2) / (5.0**2)) * 65.0
    inner_rim = np.exp(-((r - 465)**2) / (4.0**2)) * 50.0
    
    glass_base += (spec1 + spec2 + rim_line + inner_rim)[:, :, None]
    glass_base = np.clip(glass_base, 0.0, 255.0)
    
    result_rgb = rgb * (1.0 - bowl_weight) + glass_base * bowl_weight
    result_arr = np.dstack([result_rgb, alpha]).astype(np.uint8)
    
    res_img = Image.fromarray(result_arr, 'RGBA')
    res_img.save('scratch/sugar_glass.png')
    print("Saved scratch/sugar_glass.png")


create_glass_rice()
create_porcelain_coffee()
create_copper_dryfruit()
create_sugar_obsidian()
create_sugar_glass()
print("All materials generated successfully!")

import os
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

base = Image.open('public/assets/monagrow-rice-bag-cutout.png').convert('RGBA')
w, h = base.size
arr = np.array(base, dtype=np.float32)

alpha = arr[:, :, 3] / 255.0
rgb = arr[:, :, :3]
lum = (0.299 * rgb[:, :, 0] + 0.587 * rgb[:, :, 1] + 0.114 * rgb[:, :, 2]) / 255.0

# Extract original Monagrow logo: y in [85, 215], x in [150, 510]
logo_crop = base.crop((150, 85, 510, 215))

# Extract rice bowl at bottom: y in [630, 950]
bowl_crop = base.crop((120, 630, 540, 950))

# Fonts
try:
    font_tier = ImageFont.truetype("C:/Windows/Fonts/georgiab.ttf", 20)
    font_title1 = ImageFont.truetype("C:/Windows/Fonts/georgiab.ttf", 34)
    font_title2 = ImageFont.truetype("C:/Windows/Fonts/georgiab.ttf", 38)
    font_sub1 = ImageFont.truetype("C:/Windows/Fonts/georgiab.ttf", 14)
    font_sub2 = ImageFont.truetype("C:/Windows/Fonts/georgia.ttf", 13)
except:
    font_tier = ImageFont.truetype("C:/Windows/Fonts/timesbd.ttf", 20)
    font_title1 = ImageFont.truetype("C:/Windows/Fonts/timesbd.ttf", 34)
    font_title2 = ImageFont.truetype("C:/Windows/Fonts/timesbd.ttf", 38)
    font_sub1 = ImageFont.truetype("C:/Windows/Fonts/timesbd.ttf", 14)
    font_sub2 = ImageFont.truetype("C:/Windows/Fonts/times.ttf", 13)

gold_col = (235, 195, 110, 255)
white_col = (255, 255, 255, 255)
cream_col = (245, 240, 225, 240)

def build_sona_bag(target_color_rgb, tier_name, sub1_text, sub2_text, out_path):
    # Recolor bag fabric based on luminance
    # target_color_rgb is the base hue, e.g. [15, 65, 55] for emerald teal
    target_c = np.array(target_color_rgb, dtype=np.float32)
    
    # Compute recolored RGB: multiply luminance variation by target hue
    recolored = np.zeros_like(rgb)
    for c in range(3):
        # Tone curve: highlight boost and deep shadows
        recolored[:, :, c] = np.clip(target_c[c] * (lum * 2.2 + 0.15) * 255.0 / max(target_c), 0, 255)
    
    # Detect fabric vs non-fabric
    # Protect logo region y in [85, 215]
    # Protect bowl region y > 630 with high lum
    is_bowl = (np.arange(h)[:, None] > 630) & (lum > 0.42)
    is_paddy = (np.arange(h)[:, None] > 540) & (rgb[:, :, 0] > rgb[:, :, 2] * 1.35) & (lum > 0.3)
    is_handle = (np.arange(h)[:, None] < 80) & (lum > 0.6)
    
    # Fabric weight: smooth blend
    fab_weight = np.ones((h, w), dtype=np.float32)
    # Fade out near logo, bowl, paddy
    for y in range(h):
        for x in range(w):
            if alpha[y, x] < 0.1:
                fab_weight[y, x] = 0.0
            elif is_bowl[y, x] or is_paddy[y, x] or is_handle[y, x]:
                fab_weight[y, x] = 0.0
            elif 85 <= y <= 215 and 150 <= x <= 510:
                # Inside logo box
                fab_weight[y, x] = 0.0
            elif y > 640 and lum[y, x] > 0.35:
                fab_weight[y, x] = 0.0
                
    fab_weight_img = Image.fromarray((fab_weight * 255).astype(np.uint8), mode='L').filter(ImageFilter.GaussianBlur(2))
    fw = np.array(fab_weight_img, dtype=np.float32) / 255.0
    
    final_rgb = rgb * (1.0 - fw[:, :, None]) + recolored * fw[:, :, None]
    
    out_arr = np.dstack([final_rgb, arr[:, :, 3]]).astype(np.uint8)
    bag_img = Image.fromarray(out_arr, mode='RGBA')
    
    # Seamlessly clear title region: y in [220, 420], x in [150, 500]
    # Fill title area with the rich new bag fabric color and subtle gradient
    title_w = 500 - 150
    title_h = 420 - 220
    t_grad = np.zeros((title_h, title_w, 4), dtype=np.uint8)
    for y in range(title_h):
        factor = 1.0 + 0.15 * np.cos(y / float(title_h) * np.pi)
        col = np.clip(target_c * factor, 0, 255).astype(np.uint8)
        t_grad[y, :] = [col[0], col[1], col[2], 255]
        
    t_grad_img = Image.fromarray(t_grad, mode='RGBA')
    
    # Feather mask for title patch
    t_mask = Image.new('L', (title_w, title_h), 255)
    t_f = np.ones((title_h, title_w), dtype=np.float32) * 255.0
    for i in range(12):
        f = (i + 1) / 12.0
        t_f[i, :] = np.minimum(t_f[i, :], f * 255.0)
        t_f[title_h - 1 - i, :] = np.minimum(t_f[title_h - 1 - i, :], f * 255.0)
        t_f[:, i] = np.minimum(t_f[:, i], f * 255.0)
        t_f[:, title_w - 1 - i] = np.minimum(t_f[:, title_w - 1 - i], f * 255.0)
    t_mask = Image.fromarray(t_f.astype(np.uint8), mode='L').filter(ImageFilter.GaussianBlur(3))
    
    bag_img.paste(t_grad_img, (150, 220), t_mask)
    
    # Paste original Monagrow logo perfectly at (150, 85)
    bag_img.paste(logo_crop, (150, 85), logo_crop)
    
    # Draw new authentic typography
    draw = ImageDraw.Draw(bag_img)
    center_x = (150 + 500) // 2
    
    # Line 1: Tier (e.g. "— PREMIUM —" or "— ROZANA —")
    b_tier = font_tier.getbbox(f'— {tier_name} —')
    draw.text((center_x - (b_tier[2] - b_tier[0]) // 2, 230), f'— {tier_name} —', fill=gold_col, font=font_tier)
    
    # Line 2: "SONA MASOORI"
    b_t1 = font_title1.getbbox('SONA MASOORI')
    # Soft drop shadow for 3D realism
    draw.text((center_x - (b_t1[2] - b_t1[0]) // 2 + 1, 266 + 1), 'SONA MASOORI', fill=(10, 20, 15, 180), font=font_title1)
    draw.text((center_x - (b_t1[2] - b_t1[0]) // 2, 266), 'SONA MASOORI', fill=white_col, font=font_title1)
    
    # Line 3: "RICE"
    b_t2 = font_title2.getbbox('RICE')
    draw.text((center_x - (b_t2[2] - b_t2[0]) // 2 + 1, 308 + 1), 'RICE', fill=(10, 20, 15, 180), font=font_title2)
    draw.text((center_x - (b_t2[2] - b_t2[0]) // 2, 308), 'RICE', fill=white_col, font=font_title2)
    
    # Line 4: sub1
    b_s1 = font_sub1.getbbox(sub1_text)
    draw.text((center_x - (b_s1[2] - b_s1[0]) // 2, 360), sub1_text, fill=gold_col, font=font_sub1)
    
    # Line 5: sub2
    b_s2 = font_sub2.getbbox(sub2_text)
    draw.text((center_x - (b_s2[2] - b_s2[0]) // 2, 384), sub2_text, fill=cream_col, font=font_sub2)
    
    # Save image
    bag_img.save(out_path, format='PNG', optimize=True)
    print(f"Generated {out_path} ({bag_img.size})")

# 1. Premium Sona Masoori Rice: Imperial Emerald Teal (#0c453c)
build_sona_bag(
    target_color_rgb=[16, 75, 65],
    tier_name='PREMIUM',
    sub1_text='LIGHTWEIGHT & AROMATIC',
    sub2_text='Delicate Medium Grain • 100% Sortex',
    out_path='public/assets/monagrow-premium-sona-masoori-bag-cutout.png'
)

# 2. Rozana Sona Masoori Rice: Warm Spiced Amber Terracotta (#a65219)
build_sona_bag(
    target_color_rgb=[175, 88, 28],
    tier_name='ROZANA',
    sub1_text='DAILY ESSENTIAL GRAINS',
    sub2_text='Low Starch • Wholesome & Fluffy',
    out_path='public/assets/monagrow-rozana-sona-masoori-bag-cutout.png'
)

print('BOTH SONA MASOORI RICE BAGS GENERATED!')

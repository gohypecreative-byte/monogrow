from PIL import Image

bags = [
    ("Premium Steam", "public/assets/monagrow-rice-bag-cutout.png"),
    ("Classic Steam", "public/assets/monagrow-katarni-bag-cutout.png"),
    ("Premium Sella", "public/assets/monagrow-golden-sella-bag-cutout.png"),
    ("Classic Sella", "public/assets/monagrow-jeera-masino-bag-cutout.png"),
    ("Rozana Steam", "public/assets/monagrow-brown-rice-bag-cutout.png"),
    ("Rozana Sella", "public/assets/monagrow-traditional-basmati-bag-cutout.png"),
    ("Premium Sona", "public/assets/monagrow-premium-sona-masoori-bag-cutout.png"),
    ("Rozana Sona", "public/assets/monagrow-rozana-sona-masoori-bag-cutout.png"),
]

# Create an 8-bag composite preview
card_w, card_h = 160, 240
comp = Image.new('RGB', (card_w * 8 + 90, card_h + 40), (252, 251, 247)) # #fcfbf7

for i, (title, path) in enumerate(bags):
    b = Image.open(path).convert('RGBA')
    # Fit inside card_w x card_h
    scale = min(card_w / float(b.width), card_h / float(b.height))
    nw = int(round(b.width * scale))
    nh = int(round(b.height * scale))
    resized = b.resize((nw, nh), Image.Resampling.LANCZOS)
    
    px = 10 + i * (card_w + 10) + (card_w - nw) // 2
    py = 20 + (card_h - nh) // 2
    comp.paste(resized, (px, py), resized)

comp.save('scratch/all_8_rice_bags_preview.jpg', quality=95)
print('Saved all_8_rice_bags_preview.jpg:', comp.size)

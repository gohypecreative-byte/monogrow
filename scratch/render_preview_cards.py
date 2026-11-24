from PIL import Image

for name in ["premium", "rozana"]:
    cutout = Image.open(f"scratch/test_cutout_{name}.png")
    # Place on card background (300, 380) with #ffffff
    card = Image.new('RGB', (320, 420), (255, 255, 255))
    # Resize cutout to fit max height 320
    ratio = 320.0 / cutout.height
    new_w = int(round(cutout.width * ratio))
    resized = cutout.resize((new_w, 320), Image.Resampling.LANCZOS)
    
    paste_x = (320 - new_w) // 2
    paste_y = (420 - 320) // 2
    card.paste(resized, (paste_x, paste_y), resized)
    card.save(f"scratch/preview_card_{name}.jpg", quality=95)
    print(f"Saved scratch/preview_card_{name}.jpg")

from PIL import Image

for name in ['cashews', 'almonds', 'walnuts', 'pistachios', 'raisins']:
    path = f"public/assets/monagrow-{name}-pouch-new.png"
    im = Image.open(path)
    # Crop the title area: y in [450, 700], x in [250, 834]
    crop = im.crop((250, 450, 834, 700))
    crop.save(f"scratch/verify_title_{name}.png")
    print(f"Verified {name} title area crop saved")

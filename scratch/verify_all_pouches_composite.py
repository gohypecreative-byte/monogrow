from PIL import Image

files = [
    ("Mix Dry Fruits", "public/assets/monagrow-mix-dryfruits-packaging.png"),
    ("Cashews", "public/assets/monagrow-cashews-pouch-new.png"),
    ("Almonds", "public/assets/monagrow-almonds-pouch-new.png"),
    ("Walnuts", "public/assets/monagrow-walnuts-pouch-new.png"),
    ("Pistachios", "public/assets/monagrow-pistachios-pouch-new.png"),
    ("Raisins", "public/assets/monagrow-raisins-pouch-new.png"),
]

# Create a composite row image
# Each thumb 200x268
thumb_w = 200
thumb_h = int(200 * 1451 / 1084)
comp = Image.new('RGB', (thumb_w * 6 + 70, thumb_h + 40), (252, 251, 247)) # #fcfbf7 page background

for i, (title, path) in enumerate(files):
    pouch = Image.open(path).convert('RGBA')
    resized = pouch.resize((thumb_w, thumb_h), Image.Resampling.LANCZOS)
    x = 10 + i * (thumb_w + 10)
    y = 20
    comp.paste(resized, (x, y), resized)

comp.save('scratch/all_6_dryfruit_pouches_preview.jpg', quality=95)
print('Saved all_6_dryfruit_pouches_preview.jpg with size:', comp.size)

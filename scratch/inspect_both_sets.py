from PIL import Image

for name in [
    'monagrow-cashews-bag-cutout.png',
    'monagrow-almonds-bag-cutout.png',
    'monagrow-walnuts-bag-cutout.png',
    'monagrow-pistachios-bag-cutout.png',
    'monagrow-raisins-bag-cutout.png',
    'monagrow-cashews-pouch-new.png',
    'monagrow-almonds-pouch-new.png',
    'monagrow-walnuts-pouch-new.png',
    'monagrow-pistachios-pouch-new.png',
    'monagrow-raisins-pouch-new.png',
]:
    path = 'public/assets/' + name
    im = Image.open(path)
    print(name, im.size)

from PIL import Image

p1 = Image.open('scratch/test_cutout_premium.png')
p2 = Image.open('public/assets/monagrow-rice-bag-cutout.png')

print('Test cutout premium size:', p1.size)
print('Existing rice bag cutout size:', p2.size)

# Let's crop the bottom 150px of both to inspect
w1, h1 = p1.size
w2, h2 = p2.size

p1.crop((0, h1 - 150, w1, h1)).save('scratch/preview_bot_p1.png')
p2.crop((0, h2 - 150, w2, h2)).save('scratch/preview_bot_p2.png')
print('Saved bottom previews')

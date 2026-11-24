from PIL import Image

im = Image.open('public/assets/monagrow-rice-bag-cutout.png')
# Save the whole cutout resized to preview
thumb = im.resize((318, 493), Image.Resampling.LANCZOS)
thumb.save('scratch/preview_orig_rice_bag.png')
print('Saved preview_orig_rice_bag.png')

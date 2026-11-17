from PIL import Image

img = Image.open('C:/Users/suris/.gemini/antigravity/brain/41af2181-0931-4c98-b994-adebc7d96505/.user_uploaded/media_1794899603079_57732003.png')
print("Image size:", img.size)

# Crop the left icon
# Let's inspect where the icon is
w, h = img.size
left_icon = img.crop((0, 0, int(w * 0.15), h))
left_icon.save('scratch/left_icon_crop.png')

right_icon = img.crop((int(w * 0.85), 0, w, h))
right_icon.save('scratch/right_icon_crop.png')

print("Cropped icons saved to scratch/")

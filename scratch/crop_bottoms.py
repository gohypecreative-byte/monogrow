from PIL import Image

for name, path in [
    ("rozana", r"C:/Users/suris/.gemini/antigravity/brain/41af2181-0931-4c98-b994-adebc7d96505/.user_uploaded/media_1795500400167_08adacb0.jpg"),
    ("premium", r"C:/Users/suris/.gemini/antigravity/brain/41af2181-0931-4c98-b994-adebc7d96505/.user_uploaded/media_1795500400165_76f6d904.jpg")
]:
    im = Image.open(path)
    # Crop the bottom area y in [750, 991], x in [200, 850]
    crop_bot = im.crop((200, 750, 850, 991))
    crop_bot.save(f"scratch/inspect_bottom_{name}.png")
    print(f"Saved scratch/inspect_bottom_{name}.png")

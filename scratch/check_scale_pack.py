from PIL import Image
import numpy as np

# Let's inspect the original mix dryfruits cutout if it was saved, or how it relates to media_1795413128867_ec11df90.jpg
mix_pack = Image.open('public/assets/monagrow-mix-dryfruits-packaging.png')
w_pack, h_pack = mix_pack.size

orig_mix = Image.open(r'C:/Users/suris/.gemini/antigravity/brain/41af2181-0931-4c98-b994-adebc7d96505/.user_uploaded/media_1795413128867_ec11df90.jpg')
w_orig, h_orig = orig_mix.size

print('Pack size:', w_pack, h_pack)
print('Orig size:', w_orig, h_orig)

# In pack (1084, 1451), bbox is (51, 62, 1031, 1404) -> width = 980, height = 1342
# In orig (1024, 764), pouch is x=[256, 778], y=[10, 725] -> width = 522, height = 715
# Notice: 715 * 1.876 ~ 1342! 522 * 1.876 ~ 980!
# 1342 / 715 = 1.8769!
print('Scale factor:', 1342 / 715.0)

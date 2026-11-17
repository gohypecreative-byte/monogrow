import numpy as np
from PIL import Image

def test_composite():
    glass_img = Image.open('scratch/rice_crystal_glass.png')
    
    # 1. Hero Navy background
    hero_bg = Image.new('RGB', (1254, 1254), (20, 46, 97))
    hero_bg.paste(glass_img, (0, 0), glass_img)
    hero_bg.resize((600, 600)).save('scratch/rice_on_hero_bg.png')
    
    # 2. Category Card Maroon background
    card_bg = Image.new('RGB', (1254, 1254), (132, 32, 59))
    card_bg.paste(glass_img, (0, 0), glass_img)
    card_bg.resize((600, 600)).save('scratch/rice_on_card_bg.png')
    
    print("Saved scratch/rice_on_hero_bg.png and scratch/rice_on_card_bg.png")

test_composite()

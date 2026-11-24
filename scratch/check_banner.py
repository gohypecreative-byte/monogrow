with open('components/ShopProductsBanner.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

print('Length of ShopProductsBanner:', len(text))
for line in text.split('\n')[:60]:
    print(line)
